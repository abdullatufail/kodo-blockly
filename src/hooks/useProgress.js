'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

export function useProgress() {
  const { user, supabase, isConfigured } = useAuth();
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalStars, setTotalStars] = useState(0);
  const [error, setError] = useState(null);

  // Fetch user progress
  const fetchProgress = useCallback(async () => {
    if (!user || !supabase || !isConfigured) {
      setProgress({});
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
        // Check if error is because table doesn't exist
        if (fetchError.code === '42P01' || fetchError.message?.includes('does not exist')) {
          console.warn('level_progress table does not exist. Please run the schema.sql in your Supabase dashboard.');
          setError('Database not set up. Please run schema.sql in Supabase SQL Editor.');
        } else {
          console.error('Error fetching progress:', fetchError.message || fetchError);
          setError(fetchError.message || 'Failed to fetch progress');
        }
        setProgress({});
        setTotalStars(0);
        setLoading(false);
        return;
      }

      const progressMap = {};
      let stars = 0;
      
      data?.forEach((item) => {
        progressMap[item.level_id] = {
          completed: item.completed,
          stars: item.stars,
          best_moves: item.best_moves,
          attempts: item.attempts,
        };
        stars += item.stars || 0;
      });

      setProgress(progressMap);
      setTotalStars(stars);
    } catch (err) {
      console.error('Error fetching progress:', err?.message || err);
      setError(err?.message || 'Failed to fetch progress');
    } finally {
      setLoading(false);
    }
  }, [user, supabase, isConfigured]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Save level completion
  const saveProgress = async (levelId, stars, moves) => {
    if (!user || !supabase || !isConfigured) {
      console.warn('Cannot save progress: user not logged in or Supabase not configured');
      return false;
    }

    try {
      // Check if progress exists
      const { data: existing, error: fetchError } = await supabase
        .from('level_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('level_id', levelId)
        .single();

      // PGRST116 means no rows returned, which is fine for new progress
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking existing progress:', fetchError.message);
      }

      if (existing) {
        // Update only if better
        const newBestMoves = existing.best_moves 
          ? Math.min(existing.best_moves, moves) 
          : moves;
        const newStars = Math.max(existing.stars || 0, stars);

        const { error: updateError } = await supabase
          .from('level_progress')
          .update({
            completed: true,
            stars: newStars,
            best_moves: newBestMoves,
            attempts: (existing.attempts || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)
          .eq('level_id', levelId);

        if (updateError) {
          console.error('Error updating progress:', updateError.message);
          return false;
        }
      } else {
        // Insert new progress
        const { error: insertError } = await supabase.from('level_progress').insert({
          user_id: user.id,
          level_id: levelId,
          completed: true,
          stars,
          best_moves: moves,
          attempts: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (insertError) {
          console.error('Error inserting progress:', insertError.message);
          return false;
        }
      }

      // Refresh progress
      await fetchProgress();
      return true;
    } catch (err) {
      console.error('Error saving progress:', err?.message || err);
      return false;
    }
  };

  // Get progress for a specific level
  const getLevelProgress = (levelId) => {
    return progress[levelId] || null;
  };

  // Check if level is completed
  const isLevelCompleted = (levelId) => {
    return progress[levelId]?.completed || false;
  };

  // Get completion percentage for a stage
  const getStageCompletion = (levelIds) => {
    const completed = levelIds.filter((id) => isLevelCompleted(id)).length;
    return Math.round((completed / levelIds.length) * 100);
  };

  return {
    progress,
    loading,
    totalStars,
    error,
    saveProgress,
    getLevelProgress,
    isLevelCompleted,
    getStageCompletion,
    refreshProgress: fetchProgress,
  };
}
