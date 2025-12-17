'use client';

import { useState, useEffect } from 'react';
import GameBoard from '@/components/GameBoard';
import BlocklyEditor from '@/components/BlocklyEditor';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/context/AuthContext';
import { useAccessibility } from '@/context/AccessibilityContext';
import { getNextLevelInStage, getStageById } from '@/data/levels';

export default function GamePlay({ level }) {
  const [characterPos, setCharacterPos] = useState(level.startPosition);
  const [direction, setDirection] = useState(level.startDirection);
  const [animationCommands, setAnimationCommands] = useState([]);
  const [gameStatus, setGameStatus] = useState('editing');
  const [message, setMessage] = useState('');
  const [moveCount, setMoveCount] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { user } = useAuth();
  const { saveProgress, getLevelProgress } = useProgress();
  const { highContrast, toggleHighContrast, ttsEnabled, toggleTts, speak, stopSpeaking } = useAccessibility();
  const levelProgress = getLevelProgress(level.id);
  const stage = getStageById(level.stageId);
  const nextLevel = getNextLevelInStage(level.id);

  const stageColors = { 1: '#4ADE80', 2: '#A78BFA', 3: '#F472B6', 4: '#FACC15' };
  const stageColor = stageColors[level.stageId] || '#4ADE80';

  // Text-to-speech for level instructions
  const speakInstructions = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    
    const instructionText = `
      Level ${level.id}: ${level.title}. 
      ${level.description}. 
      Difficulty: ${level.difficulty}. 
      Try to complete this level in ${level.maxMoves} moves or less to earn 3 stars.
      ${level.hints && level.hints.length > 0 ? `Hint: ${level.hints[0]}` : ''}
    `;
    
    speak(instructionText);
    setIsSpeaking(true);
    
    // Reset speaking state when speech ends
    if (typeof window !== 'undefined') {
      window.speechSynthesis.onend = () => setIsSpeaking(false);
    }
  };

  // Stop speaking when component unmounts or level changes
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [level.id]);

  const handleCodeGenerated = (commands) => {
    // Reset to initial state
    setCharacterPos(level.startPosition);
    setDirection(level.startDirection);
    setGameStatus('running');
    setMoveCount(commands.length);
    setMessage('Running...');

    // Start animation sequence
    setTimeout(() => {
      setAnimationCommands([...commands]);
    }, 100);
  };

  const handleAnimationComplete = async (success, finalPos) => {
    setGameStatus('editing');
    if (success) {
      const starCount = moveCount <= level.maxMoves ? 3 : moveCount <= level.maxMoves + 5 ? 2 : 1;
      const starDisplay = '★'.repeat(starCount);
      setMessage(`🎉 Success! You reached the goal! ${starDisplay}`);
      
      // Save progress if user is logged in
      if (user) {
        await saveProgress(level.id, starCount, moveCount);
      }
      
      setTimeout(() => {
        const newBest = !levelProgress?.best_moves || moveCount < levelProgress.best_moves;
        alert(
          `Congratulations! You won!\n\nMoves used: ${moveCount}\nOptimal: ${level.maxMoves}\n${starDisplay}${newBest && user ? '\n\nNew Personal Best!' : ''}${!user ? '\n\nSign in to save your progress!' : ''}`
        );
      }, 500);
    } else {
      setMessage('Try again! The character did not reach the goal.');
    }

    // Clear animation commands
    setAnimationCommands([]);
  };

  const resetGame = () => {
    setCharacterPos(level.startPosition);
    setDirection(level.startDirection);
    setAnimationCommands([]);
    setGameStatus('editing');
    setMessage('');
    setMoveCount(0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#E8E4F0]">
      {/* Accessibility Controls - Fixed Position */}
      <div className="fixed bottom-4 right-20 z-50 flex gap-2">
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

      {/* Header - with extra top padding to account for accessibility controls */}
      <header className="bg-white/90 backdrop-blur-sm p-4 pt-16 sm:pt-4 border-b-3 border-black">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/levels"
              className="px-4 py-2 border-3 border-black bg-[#E8E4F0] text-gray-700 rounded-full hover:bg-gray-200 font-medium flex items-center gap-2"
            >
              ← Levels
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span 
                  className="px-3 py-1 text-xs font-bold rounded-full text-gray-900"
                  style={{ backgroundColor: stageColor }}
                >
                  {stage?.name}
                </span>
                <h1 className="text-xl font-bold text-gray-900">
                  Level {level.id}: <span className="font-accent">{level.title}</span>
                </h1>
                {/* TTS Button for Instructions */}
                {ttsEnabled && (
                  <button
                    onClick={speakInstructions}
                    className={`p-2 rounded-full border-3 border-black ${isSpeaking ? 'bg-green-500 tts-speaking' : 'bg-gray-200 hover:bg-gray-300'}`}
                    title="Listen to level instructions"
                    aria-label="Listen to level instructions"
                  >
                    {isSpeaking ? '⏹️' : '🔈'}
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600">{level.description}</p>
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            {levelProgress && (
              <div className="flex items-center gap-1 px-3 py-1 bg-[#FACC15]/20 rounded-full">
                {[1, 2, 3].map((i) => (
                  <span key={i} className={i <= levelProgress.stars ? 'text-[#FACC15]' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
            )}
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                level.difficulty === 'Easy'
                  ? 'bg-[#4ADE80]/20 text-[#166534]'
                  : level.difficulty === 'Medium'
                  ? 'bg-[#FACC15]/20 text-[#854D0E]'
                  : level.difficulty === 'Expert'
                  ? 'bg-[#A78BFA]/20 text-[#5B21B6]'
                  : 'bg-[#F472B6]/20 text-[#9D174D]'
              }`}
            >
              {level.difficulty}
            </span>
            <span className="text-sm font-medium px-3 py-1 bg-[#A78BFA]/20 rounded-full text-[#5B21B6]">
              Moves: {moveCount}/{level.maxMoves}
            </span>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-[#A78BFA] text-white rounded-full hover:bg-[#8B5CF6] font-medium"
            >
              Reset
            </button>
            {nextLevel && (
              <Link
                href={`/level/${nextLevel.id}`}
                className="px-4 py-2 bg-[#4ADE80] text-gray-900 rounded-full hover:bg-[#22C55E] font-medium"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Status Message */}
      {message && (
        <div
          className={`p-3 text-center font-bold text-lg ${
            message.includes('Success')
              ? 'bg-[#4ADE80]/30 text-[#166534]'
              : message.includes('Running')
              ? 'bg-[#A78BFA]/30 text-[#5B21B6]'
              : 'bg-[#FACC15]/30 text-[#854D0E]'
          }`}
        >
          {message}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Game Board */}
        <div className="w-1/2 flex flex-col items-center justify-center p-8 bg-white ">
          <div className="mb-4 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Game Board</h2>
            <p className="text-sm text-gray-600">
              Use blocks to move the character to the goal!   
            </p>
          </div>
          <GameBoard
            grid={level.grid}
            characterPos={characterPos}
            direction={direction}
            animationCommands={animationCommands}
            onAnimationComplete={handleAnimationComplete}
          />
          <div className="mt-4 text-sm text-gray-500 flex gap-4">
            <span className="flex items-center gap-1"><span className="w-4 h-4 bg-[#A78BFA] rounded"></span> Start</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 bg-[#4ADE80] rounded"></span> Goal</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 bg-[#F472B6] rounded"></span> Obstacle</span>
          </div>

          {/* Hints Section */}
          {level.hints && level.hints.length > 0 && (
            <div className="mt-6 max-w-md">
              <details className="bg-[#FACC15]/20 border-2 border-[#FACC15] rounded-2xl p-4">
                <summary className="cursor-pointer font-bold text-[#854D0E]">
                   Need a hint?
                </summary>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  {level.hints.map((hint, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{hint}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          )}
        </div>

        {/* Right Panel - Blockly Editor - Increased min-height for levels with many blocks */}
        <div className="w-1/2 flex flex-col bg-[#E8E4F0] border-l-3 border-black min-h-[500px]">
          <div className="p-4 bg-[#A78BFA]/20 border-b-3 border-black shrink-0">
            <h2 className="text-3xl font-bold text-black mb-1">Block Editor!</h2>
            <p className="text-sm text-gray-600">
              Drag blocks from the left menu to create your solution
            </p>
            {level.maxBlocks && (
              <p className="text-xs font-bold text-[#F472B6] mt-1 ">
                ⚠️ Block limit: {level.maxBlocks} blocks maximum
              </p>
            )}
          </div>
          {/* Blockly container with guaranteed minimum height and scroll */}
          <div className="flex-1 overflow-auto min-h-[400px]">
            <BlocklyEditor 
              onCodeGenerated={handleCodeGenerated} 
              availableBlocks={level.availableBlocks}
              maxBlocks={level.maxBlocks}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 p-3 text-center text-sm text-gray-600 shrink-0">
        <p>💡 Tip: Try to solve the puzzle in {level.maxMoves} moves or less for 3 stars!</p>
      </footer>
    </div>
  );
}
