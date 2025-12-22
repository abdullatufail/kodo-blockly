'use client';

import { useState, useEffect } from 'react';
import GameBoard from '@/components/GameBoard';
import BlocklyEditor from '@/components/BlocklyEditor';
import LevelCompleteModal from '@/components/LevelCompleteModal';
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
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionData, setCompletionData] = useState({ stars: 0, isNewBest: false });
  // Initialize tutorial state based on localStorage (only for level 1)
  const [showTutorial, setShowTutorial] = useState(() => {
    if (typeof window !== 'undefined' && level.id === 1) {
      const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
      return !hasSeenTutorial;
    }
    return false;
  });

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      
      // Show the completion modal
      const newBest = !levelProgress?.best_moves || moveCount < levelProgress.best_moves;
      setCompletionData({ stars: starCount, isNewBest: newBest });
      setTimeout(() => {
        setShowCompleteModal(true);
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
      <div className="fixed bottom-4 right-4 md:right-20 z-50 flex gap-2">
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
      <header className="bg-white/90 backdrop-blur-sm p-3 md:p-4 pt-16 sm:pt-4 border-b-3 border-black">
        <div className="container mx-auto flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto">
            <Link
              href="/levels"
              className="px-3 md:px-4 py-2 border-3 border-black bg-[#E8E4F0] text-gray-700 rounded-full hover:bg-gray-200 font-medium flex items-center gap-2 text-sm md:text-base"
            >
              ← Levels
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span 
                  className="px-2 md:px-3 py-1 text-xs font-bold rounded-full text-gray-900"
                  style={{ backgroundColor: stageColor }}
                >
                  {stage?.name}
                </span>
                <h1 className="text-base md:text-xl font-bold text-gray-900 truncate">
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
              <p className="text-xs md:text-sm text-gray-600 line-clamp-2 md:line-clamp-none">{level.description}</p>
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap w-full sm:w-auto justify-start sm:justify-end">
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
              className={`text-xs md:text-sm font-medium px-2 md:px-3 py-1 rounded-full ${
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
            <span className="text-xs md:text-sm font-medium px-2 md:px-3 py-1 bg-[#A78BFA]/20 rounded-full text-[#5B21B6]">
              Moves: {moveCount}/{level.maxMoves}
            </span>
            <button
              onClick={() => window.location.reload()}
              className="px-3 md:px-4 py-2 bg-[#A78BFA] text-white rounded-full hover:bg-[#8B5CF6] font-medium text-sm md:text-base"
            >
              Reset
            </button>
            {nextLevel && (
              <Link
                href={`/level/${nextLevel.id}`}
                className="px-3 md:px-4 py-2 bg-[#4ADE80] text-gray-900 rounded-full hover:bg-[#22C55E] font-medium text-sm md:text-base"
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
      <div className="flex-1 flex flex-col md:flex-row overflow-auto md:overflow-hidden">
        {/* Left Panel - Game Board */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 bg-white ">
          <div className="mb-4 text-center">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Game Board</h2>
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
            <span className="flex items-center gap-1"><img src="/goal.png" alt="Start" className="w-6 h-6 rounded border border-gray-300" /> Start</span>
            <span className="flex items-center gap-1"><img src="/path.png" alt="Goal" className="w-6 h-6 rounded border border-gray-300" /> Goal</span>
            <span className="flex items-center gap-1"><img src="/obstacle.png" alt="Obstacle" className="w-6 h-6 rounded border border-gray-300" /> Obstacle</span>
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

        {/* Right Panel - Blockly Editor - Fixed height for proper rendering */}
        <div className="w-full md:w-1/2 flex flex-col bg-[#E8E4F0] border-t-3 md:border-t-0 md:border-l-3 border-black" style={{ minHeight: '500px' }}>
          <div className="p-3 md:p-4 bg-[#A78BFA]/20 border-b-3 border-black shrink-0">
            <h2 className="text-xl md:text-3xl font-bold text-black mb-1">Block Editor!</h2>
            <p className="text-sm text-gray-600">
              Drag blocks from the left menu to create your solution
            </p>
            {level.maxBlocks && (
              <p className="text-xs font-bold text-[#F472B6] mt-1 ">
                ⚠️ Block limit: {level.maxBlocks} blocks maximum
              </p>
            )}
          </div>
          {/* Blockly container with fixed height for proper rendering */}
          <div style={{ height: '450px', width: '100%' }}>
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

      {/* Level Complete Modal */}
      <LevelCompleteModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        stars={completionData.stars}
        moveCount={moveCount}
        optimalMoves={level.maxMoves}
        isNewBest={completionData.isNewBest}
        isLoggedIn={!!user}
        nextLevelId={nextLevel?.id}
        currentLevelId={level.id}
      />

      {/* Tutorial Video Modal for Level 1 */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/70 z-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-3xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-linear-to-r from-[#A78BFA] to-[#F472B6] p-4 border-b-4 border-black">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎬</span>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">Welcome to Kodo!</h2>
                    <p className="text-white/90 text-sm">Watch this quick tutorial to get started</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowTutorial(false);
                    localStorage.setItem('hasSeenTutorial', 'true');
                  }}
                  className="w-10 h-10 bg-white rounded-full border-3 border-black flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Close tutorial"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="p-4 md:p-6">
              <div className="relative bg-black rounded-2xl overflow-hidden border-3 border-black aspect-video">
                <video
                  src="/tutorial.mp4"
                  controls
                  autoPlay
                  className="w-full h-full"
                  playsInline
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Tutorial Tips */}
              <div className="mt-4 bg-[#FACC15]/20 rounded-xl p-4 border-2 border-[#FACC15]">
                <h3 className="font-bold text-[#854D0E] mb-2 flex items-center gap-2">
                  <span>💡</span> Quick Tips
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Drag blocks from the left menu to the workspace</li>
                  <li>• Connect blocks together to create a sequence</li>
                  <li>• Click &quot;Run Code&quot; to see your character move</li>
                  <li>• Try to reach the goal in as few moves as possible!</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowTutorial(false);
                    localStorage.setItem('hasSeenTutorial', 'true');
                  }}
                  className="px-6 py-3 bg-[#4ADE80] text-black font-bold rounded-full border-3 border-black hover:bg-[#22C55E] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5"
                >
                  🎮 Start Playing!
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('hasSeenTutorial');
                    setShowTutorial(false);
                  }}
                  className="px-6 py-3 bg-white text-gray-700 font-medium rounded-full border-3 border-black hover:bg-gray-100 transition-colors"
                >
                  Show tutorial next time
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Button for Level 1 (if user closed the modal and wants to rewatch) */}
      {level.id === 1 && !showTutorial && (
        <button
          onClick={() => setShowTutorial(true)}
          className="fixed bottom-4 left-4 z-50 px-4 py-2 bg-[#A78BFA] text-white font-bold rounded-full border-3 border-black hover:bg-[#8B5CF6] transition-colors shadow-lg flex items-center gap-2"
          title="Watch tutorial video"
        >
          <span>🎬</span>
          <span className="hidden sm:inline">Tutorial</span>
        </button>
      )}
    </div>
  );
}
