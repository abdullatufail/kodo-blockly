'use client';

import { useParams, notFound } from 'next/navigation';
import { getLevelById } from '@/data/levels';
import GamePlay from '@/components/GamePlay';

export default function LevelPage() {
  const params = useParams();
  const levelId = parseInt(params.id);
  
  const level = getLevelById(levelId);

  if (!level) {
    notFound();
  }

  return <GamePlay level={level} />;
}
