'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

// Progress always lives on this device, so kids can play without an account.
// When someone is signed in it is also saved to Supabase, and anything earned
// as a guest is carried over the first time they sign in.
const LOCAL_KEY = 'kodo:progress';

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || {};
  } catch {
    return {};
  }
}

function writeLocal(map) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(map));
  } catch {}
}

function better(a, b) {
  if (!a) return b;
  if (!b) return a;
  return {
    completed: a.completed || b.completed,
    stars: Math.max(a.stars || 0, b.stars || 0),
    best_moves: a.best_moves && b.best_moves ? Math.min(a.best_moves, b.best_moves) : a.best_moves || b.best_moves,
    attempts: Math.max(a.attempts || 0, b.attempts || 0),
  };
}

function mergeMaps(a, b) {
  const out = { ...a };
  for (const [id, entry] of Object.entries(b)) out[id] = better(out[id], entry);
  return out;
}

function sumStars(map) {
  return Object.values(map).reduce((sum, p) => sum + (p?.stars || 0), 0);
}

export function useProgress() {
  const { user, supabase, isConfigured, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const upsertRemote = useCallback(
    async (levelId, entry) => {
      const { error: upsertError } = await supabase.from('level_progress').upsert(
        {
          user_id: user.id,
          level_id: Number(levelId),
          completed: entry.completed,
          stars: entry.stars,
          best_moves: entry.best_moves,
          attempts: entry.attempts,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,level_id' }
      );
      if (upsertError) console.error('Error saving progress:', upsertError.message);
      return !upsertError;
    },
    [supabase, user]
  );

  const fetchProgress = useCallback(async () => {
    const local = readLocal();
    if (!user || !supabase || !isConfigured) {
      setProgress(local);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('level_progress')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) {
        if (fetchError.code === '42P01' || fetchError.message?.includes('does not exist')) {
          setError('Database not set up. Please run schema.sql in Supabase SQL Editor.');
        } else {
          setError(fetchError.message || 'Failed to fetch progress');
        }
        setProgress(local);
        return;
      }

      const remote = {};
      data?.forEach((item) => {
        remote[item.level_id] = {
          completed: item.completed,
          stars: item.stars,
          best_moves: item.best_moves,
          attempts: item.attempts,
        };
      });

      // Carry guest progress over to the account.
      for (const [id, entry] of Object.entries(local)) {
        const merged = better(remote[id], entry);
        if (!remote[id] || merged.stars > (remote[id].stars || 0) || (merged.completed && !remote[id].completed)) {
          upsertRemote(id, merged);
        }
      }

      setProgress(mergeMaps(remote, local));
    } catch (err) {
      setError(err?.message || 'Failed to fetch progress');
      setProgress(local);
    } finally {
      setLoading(false);
    }
  }, [user, supabase, isConfigured, upsertRemote]);

  useEffect(() => {
    if (authLoading) return;
    // Defer so we never set state synchronously inside the effect body.
    queueMicrotask(fetchProgress);
  }, [fetchProgress, authLoading]);

  const saveProgress = async (levelId, stars, moves) => {
    const local = readLocal();
    const previous = better(local[levelId], progress[levelId]);
    const entry = better(previous, { completed: true, stars, best_moves: moves, attempts: 0 });
    entry.attempts = (previous?.attempts || 0) + 1;

    writeLocal({ ...local, [levelId]: entry });
    setProgress((prev) => ({ ...prev, [levelId]: entry }));

    if (user && supabase && isConfigured) {
      return upsertRemote(levelId, entry);
    }
    return true;
  };

  const getLevelProgress = (levelId) => progress[levelId] || null;

  const isLevelCompleted = (levelId) => progress[levelId]?.completed || false;

  const getStageCompletion = (levelIds) => {
    const completed = levelIds.filter((id) => isLevelCompleted(id)).length;
    return Math.round((completed / levelIds.length) * 100);
  };

  return {
    progress,
    loading,
    totalStars: sumStars(progress),
    error,
    saveProgress,
    getLevelProgress,
    isLevelCompleted,
    getStageCompletion,
    refreshProgress: fetchProgress,
  };
}
