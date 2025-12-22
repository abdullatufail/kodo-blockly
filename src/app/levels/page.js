'use client';

import Link from 'next/link';
import React from 'react';
import { levels, stages, getLevelsByStage } from '@/data/levels';
import UserMenu from '@/components/UserMenu';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/context/AuthContext';
import { useAccessibility } from '@/context/AccessibilityContext';
import Image from 'next/image';

const LevelsPage = () => {
  const { user } = useAuth();
  const { progress, totalStars, isLevelCompleted, getLevelProgress } = useProgress();
  const { highContrast, toggleHighContrast, ttsEnabled, toggleTts } = useAccessibility();

  const stageColors = ['#4ADE80', '#A78BFA', '#F472B6', '#FACC15'];

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-[#4ADE80]/20 text-[#166534] border-[#4ADE80]';
      case 'Medium':
        return 'bg-[#FACC15]/20 text-[#854D0E] border-[#FACC15]';
      case 'Hard':
        return 'bg-[#F472B6]/20 text-[#9D174D] border-[#F472B6]';
      case 'Expert':
        return 'bg-[#A78BFA]/20 text-[#5B21B6] border-[#A78BFA]';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const renderStars = (stars) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3].map((i) => (
          <span key={i} className={i <= stars ? 'text-[#FACC15]' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen mx-4 md:mx-10 lg:mx-20 bg-white">
      {/* Accessibility Controls - Fixed Position */}
      <div className="fixed bottom-4 right-4 z-100 flex gap-2">
        {/* High Contrast Toggle */}
        <button
          onClick={toggleHighContrast}
          className={`accessibility-toggle px-3 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg ${
            highContrast 
              ? 'bg-yellow-400 text-black border-2 border-black' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Toggle High Contrast Mode (for color blindness)"
          aria-label="Toggle high contrast mode"
        >
          <span className="text-lg">👁️</span>
          <span className="hidden sm:inline">{highContrast ? 'Normal' : 'High Contrast'}</span>
        </button>

        {/* Text-to-Speech Toggle */}
        <button
          onClick={toggleTts}
          className={`accessibility-toggle px-3 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg ${
            ttsEnabled 
              ? 'bg-green-400 text-black border-2 border-black' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Toggle Text-to-Speech"
          aria-label="Toggle text to speech"
        >
          <span className="text-lg">🔊</span>
          <span className="hidden sm:inline">{ttsEnabled ? 'TTS On' : 'TTS Off'}</span>
        </button>
      </div>

      {/* Header */}
      <header className="bg-white backdrop-blur-sm py-4 sticky top-4 border-3 border-black rounded-full z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium">
              <span className="text-2xl">←</span>
              <Image src="/kodo-svg.svg"
                            alt="kodo-logo"
                            height={100}
                            width={100}/>
            </Link>
            <h1 className="hidden sm:block text-xl font-bold text-gray-800">Choose Your <span className="font-accent">Challenge</span></h1>
            {/* <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2 bg-[#FACC15]/20 px-4 py-2 rounded-full">
                  <span className="text-[#FACC15]">★</span>
                  <span className="font-bold text-gray-700">{totalStars}</span>
                </div>
              )}
              <UserMenu />
            </div> */}
          </div>
        </div>
      </header>

      {/* Stages */}
      <div className="container mx-auto px-4 py-8">
        {stages.map((stage, stageIndex) => {
          const stageLevels = getLevelsByStage(stage.id);
          const completedCount = stageLevels.filter((l) => isLevelCompleted(l.id)).length;
          const stageStars = stageLevels.reduce((sum, l) => sum + (getLevelProgress(l.id)?.stars || 0), 0);
          const bgColor = stageColors[stageIndex % stageColors.length];

          return (
            <div key={stage.id} className="mb-12">
              {/* Stage Header */}
              <div 
                className="rounded-3xl p-6 mb-6  border-3 border-black relative overflow-hidden"
                style={{ backgroundColor: bgColor }}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center text-3xl">
                      {stage.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Creative</h2>
                      <p className="font-accent text-xl text-gray-800">{stage.name.replace('Stage ', '')}</p>
                    </div>
                  </div>
                  {user && (
                    <div className="text-right">
                      <div className="bg-white/90 rounded-full px-4 py-2">
                        <p className="font-bold text-gray-800">
                          {completedCount}/{stageLevels.length} Complete
                        </p>
                        <p className="text-gray-600 text-sm">★ {stageStars} stars</p>
                      </div>
                    </div>
                  )}
                </div>
                {user && (
                  <div className="mt-4 bg-white/30 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-white h-full transition-all duration-500 rounded-full"
                      style={{ width: `${(completedCount / stageLevels.length) * 100}%` }}
                    />
                  </div>
                )}
                {/* Decorative shape */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 blob-shape"></div>
              </div>

              {/* Stage Levels */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {stageLevels.map((level, index) => {
                  const levelProgress = getLevelProgress(level.id);
                  const completed = levelProgress?.completed;

                  return (
                    <Link href={`/level/${level.id}`} key={level.id} className="group">
                      <div
                        className={`bg-white rounded-3xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer h-full ${
                          completed ? 'ring-2 ring-[#4ADE80]' : ''
                        }`}
                      >
                        {/* Level Number Badge */}
                        <div 
                          className="p-4 text-gray-900 relative"
                          style={{ backgroundColor: `${bgColor}40` }}
                        >
                          {completed && (
                            <div className="absolute top-2 right-2 bg-[#4ADE80] rounded-full p-1">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-xs opacity-75 font-medium">Level</span>
                              <h3 className="text-xl font-bold">{index + 1}</h3>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getDifficultyStyle(
                                level.difficulty
                              )}`}
                            >
                              {level.difficulty}
                            </span>
                          </div>
                          <p className="font-medium text-sm mt-1 truncate">{level.title}</p>
                        </div>

                        {/* Level Body */}
                        <div className="p-4">
                          {/* Stars Display */}
                          {levelProgress && (
                            <div className="mb-2 flex justify-center">
                              {renderStars(levelProgress.stars)}
                            </div>
                          )}

                          {/* Mini Grid Preview */}
                          <div className="mb-3 bg-[#E8E4F0] rounded-2xl p-2 flex justify-center">
                            <div
                              className="inline-grid gap-0.5"
                              style={{
                                gridTemplateColumns: `repeat(${Math.min(level.grid[0].length, 8)}, 1fr)`,
                              }}
                            >
                              {level.grid.slice(0, 6).map((row, y) =>
                                row.slice(0, 8).map((tile, x) => {
                                  let color = 'bg-gray-300';
                                  if (tile === 'START') color = 'bg-[#A78BFA]';
                                  if (tile === 'GOAL') color = 'bg-[#4ADE80]';
                                  if (tile === 'OBSTACLE') color = 'bg-[#F472B6]';
                                  if (tile === 'PATH') color = 'bg-white';
                                  return (
                                    <div
                                      key={`${x}-${y}`}
                                      className={`${color} rounded-sm`}
                                      style={{ width: '10px', height: '10px' }}
                                    />
                                  );
                                })
                              )}
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex justify-between text-xs text-gray-500 mb-3">
                            <span className="bg-[#E8E4F0] px-2 py-1 rounded-full">{level.maxMoves} moves</span>
                            {level.maxBlocks && <span className="bg-[#E8E4F0] px-2 py-1 rounded-full">{level.maxBlocks} blocks</span>}
                          </div>

                          {/* Best Score */}
                          {levelProgress?.best_moves && (
                            <p className="text-xs text-center text-[#4ADE80] mb-2 font-medium">
                              Best: {levelProgress.best_moves} moves
                            </p>
                          )}

                          {/* Play Button */}
                          <button
                            className="w-full text-gray-900 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                            style={{ backgroundColor: bgColor }}
                          >
                            {completed ? 'Play Again' : 'Play'}
                            <span className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-xs">↗</span>
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      
    </div>
  );
};

export default LevelsPage;