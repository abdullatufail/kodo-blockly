'use client';

import { useParams, notFound } from 'next/navigation';
import { getLevelById } from '@/data/levels';
import GamePlay from '@/components/GamePlay';

export default function LevelPage() {
  const params = useParams();
  const level = getLevelById(parseInt(params.id, 10));

  if (!level) {
    notFound();
  }

  // Keyed by level so moving to the next level starts with a fresh board and editor.
  return <GamePlay key={level.id} level={level} />;
}
