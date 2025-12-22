// Level configurations for the puzzle game
// Each level defines the grid layout, starting position, and metadata
// Levels are organized into stages: Simple, Loops, Conditions, Combined

// Stage definitions
export const stages = [
  {
    id: 'simple',
    name: 'Getting Started',
    description: 'Learn the basics of movement',
    icon: '→',
    color: 'from-green-400 to-green-600',
  },
  {
    id: 'loops',
    name: 'Loop Master',
    description: 'Use loops to repeat actions efficiently',
    icon: '↻',
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'conditions',
    name: 'Smart Decisions',
    description: 'Use conditionals to make smart choices',
    icon: '?',
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 'combined',
    name: 'Master Challenge',
    description: 'Combine all skills to solve complex puzzles',
    icon: '★',
    color: 'from-orange-400 to-red-600',
  },
];

// Block types that can be enabled/disabled per level
export const blockTypes = {
  MOVE_FORWARD: 'move_forward',
  TURN_RIGHT: 'turn_right',
  TURN_LEFT: 'turn_left',
  REPEAT: 'repeat_times',
  IF_PATH_AHEAD: 'if_path_ahead',
  IF_ELSE_PATH: 'if_else_path',
  WHILE_PATH: 'while_path',
  REPEAT_UNTIL_GOAL: 'repeat_until_goal',
};

export const levels = [
  // =====================================================
  // STAGE 1: SIMPLE (Basic Movement)
  // =====================================================
  {
    id: 1,
    stageId: 'simple',
    title: 'First Steps',
    description: 'Move forward to reach the goal. Simple as that!',
    difficulty: 'Easy',
    grid: [
      ['START', 'PATH', 'PATH', 'GOAL'],
    ],
    startPosition: { x: 0, y: 0 },
    startDirection: 'EAST',
    maxMoves: 3,
    availableBlocks: [blockTypes.MOVE_FORWARD],
    hints: [
      'Use the Move Forward block',
      'You need exactly 3 moves to reach the goal',
    ],
  },
  {
    id: 2,
    stageId: 'simple',
    title: 'Turn Around',
    description: 'Learn to turn! Navigate the corner.',
    difficulty: 'Easy',
    grid: [
      ['START', 'PATH', 'OBSTACLE'],
      ['OBSTACLE', 'PATH', 'OBSTACLE'],
      ['OBSTACLE', 'GOAL', 'OBSTACLE'],
    ],
    startPosition: { x: 0, y: 0 },
    startDirection: 'EAST',
    maxMoves: 4,
    availableBlocks: [blockTypes.MOVE_FORWARD, blockTypes.TURN_RIGHT],
    hints: [
      'Move forward, then turn right',
      'After turning, move forward again',
    ],
  },
  {
    id: 3,
    stageId: 'simple',
    title: 'Left or Right?',
    description: 'Master both turning directions!',
    difficulty: 'Easy',
    grid: [
      ['OBSTACLE', 'GOAL', 'OBSTACLE'],
      ['OBSTACLE', 'PATH', 'OBSTACLE'],
      ['START', 'PATH', 'OBSTACLE'],
    ],
    startPosition: { x: 0, y: 2 },
    startDirection: 'EAST',
    maxMoves: 4,
    availableBlocks: [blockTypes.MOVE_FORWARD, blockTypes.TURN_RIGHT, blockTypes.TURN_LEFT],
    hints: [
      'Move forward first',
      'Then turn left to face north',
      'Move forward to the goal!',
    ],
  },
  {
    id: 4,
    stageId: 'simple',
    title: 'The Zigzag',
    description: 'Navigate through a zigzag path!',
    difficulty: 'Easy',
    grid: [
      ['START', 'PATH', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE'],
      ['OBSTACLE', 'PATH', 'PATH', 'PATH', 'OBSTACLE'],
      ['OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH', 'OBSTACLE'],
      ['OBSTACLE', 'GOAL', 'PATH', 'PATH', 'OBSTACLE'],
    ],
    startPosition: { x: 0, y: 0 },
    startDirection: 'EAST',
    maxMoves: 10,
    availableBlocks: [blockTypes.MOVE_FORWARD, blockTypes.TURN_RIGHT, blockTypes.TURN_LEFT],
    hints: [
      'Follow the winding path',
      'Alternate between moving and turning',
    ],
  },
  {
    id: 5,
    stageId: 'simple',
    title: 'The Square',
    description: 'Walk around the obstacle to reach the goal.',
    difficulty: 'Medium',
    grid: [
      ['START', 'PATH', 'PATH', 'PATH'],
      ['OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH'],
      ['OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH'],
      ['GOAL', 'PATH', 'PATH', 'PATH'],
    ],
    startPosition: { x: 0, y: 0 },
    startDirection: 'EAST',
    maxMoves: 12,
    availableBlocks: [blockTypes.MOVE_FORWARD, blockTypes.TURN_RIGHT, blockTypes.TURN_LEFT],
    hints: [
      'Go around the big obstacle',
      'Turn right at each corner',
    ],
  },

  // =====================================================
  // STAGE 2: LOOPS (Repeat Patterns)
  // =====================================================
  {
    id: 6,
    stageId: 'loops',
    title: 'Repeat After Me',
    description: 'Use a loop to move forward multiple times efficiently!',
    difficulty: 'Easy',
    grid: [
      ['START', 'PATH', 'PATH', 'PATH', 'PATH', 'GOAL'],
    ],
    startPosition: { x: 0, y: 0 },
    startDirection: 'EAST',
    maxMoves: 5,
    maxBlocks: 2,
    availableBlocks: [blockTypes.MOVE_FORWARD, blockTypes.REPEAT],
    hints: [
      'Use the Repeat block instead of many Move Forward blocks',
      'Set the repeat count to 5',
    ],
  },
  {
    id: 7,
    stageId: 'loops',
    title: 'The Staircase',
    description: 'Use loops to climb the stairs!',
    difficulty: 'Medium',
    grid: [
      ['START', 'PATH', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE'],
      ['OBSTACLE', 'PATH', 'PATH', 'OBSTACLE', 'OBSTACLE'],
      ['OBSTACLE', 'OBSTACLE', 'PATH', 'PATH', 'OBSTACLE'],
      ['OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH', 'PATH'],
      ['OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'GOAL'],
    ],
    startPosition: { x: 0, y: 0 },
    startDirection: 'EAST',
    maxMoves: 12,
    maxBlocks: 5,
    availableBlocks: [blockTypes.MOVE_FORWARD, blockTypes.TURN_RIGHT, blockTypes.REPEAT],
    hints: [
      'Notice the repeating pattern: forward, right, forward, right',
      'Use a loop to repeat the stair pattern',
    ],
  },
  {
    id: 8,
    stageId: 'loops',
    title: 'Around the Block',
    description: 'Walk around the entire perimeter!',
    difficulty: 'Medium',
    grid: [
      ['START', 'PATH', 'PATH', 'PATH', 'PATH'],
      ['PATH', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH'],
      ['PATH', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH'],
      ['PATH', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH'],
      ['GOAL', 'PATH', 'PATH', 'PATH', 'PATH'],
    ],
    startPosition: { x: 0, y: 0 },
    startDirection: 'EAST',
    maxMoves: 16,
    maxBlocks: 6,
    availableBlocks: [blockTypes.MOVE_FORWARD, blockTypes.TURN_RIGHT, blockTypes.REPEAT],
    hints: [
      'Move 4 times, turn right, repeat this pattern',
      'You need to go around all 4 sides',
    ],
  },
  {
    id: 9,
    stageId: 'loops',
    title: 'The Spiral',
    description: 'Navigate the spiral path efficiently!',
    difficulty: 'Hard',
    grid: [
      ['START', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH'],
      ['OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH'],
      ['GOAL', 'PATH', 'PATH', 'PATH', 'OBSTACLE', 'PATH'],
      ['PATH', 'OBSTACLE', 'OBSTACLE', 'PATH', 'OBSTACLE', 'PATH'],
      ['PATH', 'OBSTACLE', 'PATH', 'PATH', 'OBSTACLE', 'PATH'],
      ['PATH', 'PATH', 'PATH', 'OBSTACLE', 'PATH', 'PATH'],
    ],
    startPosition: { x: 0, y: 0 },
    startDirection: 'EAST',
    maxMoves: 20,
    maxBlocks: 12,
    availableBlocks: [blockTypes.MOVE_FORWARD, blockTypes.TURN_RIGHT, blockTypes.TURN_LEFT, blockTypes.REPEAT],
    hints: [
      'Follow the spiral inward',
      'Look for repeating patterns in the spiral',
    ],
  },
  {
    id: 10,
    stageId: 'loops',
    title: 'Double Loop',
    description: 'Use nested loops to solve this challenge!',
    difficulty: 'Hard',
    grid: [
      ['START', 'PATH', 'PATH', 'PATH'],
      ['PATH', 'OBSTACLE', 'OBSTACLE', 'PATH'],
      ['PATH', 'OBSTACLE', 'OBSTACLE', 'PATH'],
      ['PATH', 'PATH', 'PATH', 'PATH'],
      ['PATH', 'OBSTACLE', 'OBSTACLE', 'PATH'],
      ['PATH', 'OBSTACLE', 'OBSTACLE', 'PATH'],
      ['GOAL', 'PATH', 'PATH', 'PATH'],
    ],
    startPosition: { x: 0, y: 0 },
    startDirection: 'EAST',
    maxMoves: 18,
    maxBlocks: 6,
    availableBlocks: [blockTypes.MOVE_FORWARD, blockTypes.TURN_RIGHT, blockTypes.REPEAT],
    hints: [
      'Notice there are two identical squares to navigate',
      'Use loops inside loops (nested loops)',
    ],
  },

  // =====================================================
  // STAGE 3: CONDITIONS (If/Else Logic)
  // =====================================================
  {
    id: 11,
    stageId: 'conditions',
    title: 'Path Detection',
    description: 'Learn to check if there is a path ahead!',
    difficulty: 'Easy',
    grid: [
      ['START', 'OBSTACLE', 'OBSTACLE'],
      ['PATH', 'PATH', 'OBSTACLE'],
      ['OBSTACLE', 'PATH', 'OBSTACLE'],
      ['OBSTACLE', 'GOAL', 'OBSTACLE'],
    ],
    startPosition: { x: 0, y: 0 },
    startDirection: 'EAST',
    maxMoves: 5,
    availableBlocks: [blockTypes.MOVE_FORWARD, blockTypes.TURN_RIGHT, blockTypes.TURN_LEFT, blockTypes.IF_PATH_AHEAD],
    hints: [
      'Check if path ahead before moving',
      'If blocked, try turning',
    ],
  },
  {
    id: 12,
    stageId: 'conditions',
    title: 'Smart Navigation',
    description: 'Use if-else to choose the right path!',
    difficulty: 'Medium',
    grid: [
      ['OBSTACLE', 'OBSTACLE', 'PATH', 'OBSTACLE', 'OBSTACLE'],
      ['START', 'PATH', 'PATH', 'PATH', 'GOAL'],
      ['OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE'],
    ],
    startPosition: { x: 0, y: 1 },
    startDirection: 'EAST',
    maxMoves: 6,
    availableBlocks: [blockTypes.MOVE_FORWARD, blockTypes.TURN_RIGHT, blockTypes.TURN_LEFT, blockTypes.IF_ELSE_PATH],
    hints: [
      'If path ahead, move forward',
      'Otherwise, turn and try again',
    ],
  },
  {
    id: 13,
    stageId: 'conditions',
    title: 'The Maze Runner',
    description: 'Navigate a random-looking maze with conditionals!',
    difficulty: 'Medium',
    grid: [
      ['START', 'PATH', 'OBSTACLE', 'PATH', 'PATH'],
      ['OBSTACLE', 'PATH', 'OBSTACLE', 'PATH', 'OBSTACLE'],
      ['OBSTACLE', 'PATH', 'PATH', 'PATH', 'OBSTACLE'],
      ['OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH', 'OBSTACLE'],
      ['OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'GOAL', 'OBSTACLE'],
    ],
    startPosition: { x: 0, y: 0 },
    startDirection: 'EAST',
    maxMoves: 10,
    availableBlocks: [blockTypes.MOVE_FORWARD, blockTypes.TURN_RIGHT, blockTypes.TURN_LEFT, blockTypes.IF_PATH_AHEAD, blockTypes.REPEAT],
    hints: [
      'Use conditionals inside a loop',
      'Check path ahead before each move',
    ],
  },
  {
    id: 14,
    stageId: 'conditions',
    title: 'While You Can',
    description: 'Use while loops to move until blocked!',
    difficulty: 'Medium',
    grid: [
      ['START', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH'],
      ['OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH'],
      ['OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH'],
      ['GOAL', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH'],
    ],
    startPosition: { x: 0, y: 0 },
    startDirection: 'EAST',
    maxMoves: 15,
    maxBlocks: 8,
    availableBlocks: [blockTypes.MOVE_FORWARD, blockTypes.TURN_RIGHT, blockTypes.WHILE_PATH],
    hints: [
      'Use "while path ahead" to move forward',
      'Then turn right and repeat',
    ],
  },
  {
    id: 15,
    stageId: 'conditions',
    title: 'Until You Arrive',
    description: 'Repeat until you reach the goal!',
    difficulty: 'Hard',
    grid: [
      ['START', 'PATH', 'PATH', 'PATH'],
      ['OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH'],
      ['GOAL', 'PATH', 'PATH', 'PATH'],
    ],
    startPosition: { x: 0, y: 0 },
    startDirection: 'EAST',
    maxMoves: 8,
    maxBlocks: 5,
    availableBlocks: [blockTypes.MOVE_FORWARD, blockTypes.TURN_RIGHT, blockTypes.IF_PATH_AHEAD, blockTypes.REPEAT_UNTIL_GOAL],
    hints: [
      'Use "repeat until goal" as your main loop',
      'Inside, check if path ahead and move or turn',
    ],
  },

  // =====================================================
  // STAGE 4: COMBINED (Master Challenges)
  // =====================================================
  {
    id: 16,
    stageId: 'combined',
    title: 'The Labyrinth',
    description: 'Use everything you learned to navigate the labyrinth!',
    difficulty: 'Hard',
    grid: [
      ['START', 'PATH', 'OBSTACLE', 'PATH', 'PATH', 'PATH'],
      ['OBSTACLE', 'PATH', 'OBSTACLE', 'PATH', 'OBSTACLE', 'PATH'],
      ['PATH', 'PATH', 'PATH', 'PATH', 'OBSTACLE', 'PATH'],
      ['PATH', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH'],
      ['PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH'],
      ['OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'GOAL'],
    ],
    startPosition: { x: 0, y: 0 },
    startDirection: 'EAST',
    maxMoves: 18,
    availableBlocks: [
      blockTypes.MOVE_FORWARD, blockTypes.TURN_RIGHT, blockTypes.TURN_LEFT,
      blockTypes.REPEAT, blockTypes.IF_PATH_AHEAD, blockTypes.WHILE_PATH
    ],
    hints: [
      'Combine loops and conditionals',
      'Think about patterns in the maze',
    ],
  },
  {
    id: 17,
    stageId: 'combined',
    title: 'Serpentine',
    description: 'A winding path that tests your skills!',
    difficulty: 'Hard',
    grid: [
      ['START', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH'],
      ['OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH'],
      ['PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH'],
      ['PATH', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE'],
      ['PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH'],
      ['OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'GOAL'],
    ],
    startPosition: { x: 0, y: 0 },
    startDirection: 'EAST',
    maxMoves: 25,
    maxBlocks: 10,
    availableBlocks: [
      blockTypes.MOVE_FORWARD, blockTypes.TURN_RIGHT, blockTypes.TURN_LEFT,
      blockTypes.REPEAT, blockTypes.WHILE_PATH
    ],
    hints: [
      'Notice the serpentine pattern',
      'Use while loops to traverse each row',
    ],
  },
  {
    id: 18,
    stageId: 'combined',
    title: 'The Gauntlet',
    description: 'A challenging maze with dead ends!',
    difficulty: 'Hard',
    grid: [
      ['START', 'PATH', 'OBSTACLE', 'PATH', 'PATH', 'PATH', 'OBSTACLE'],
      ['OBSTACLE', 'PATH', 'OBSTACLE', 'PATH', 'OBSTACLE', 'PATH', 'OBSTACLE'],
      ['OBSTACLE', 'PATH', 'PATH', 'PATH', 'OBSTACLE', 'PATH', 'PATH'],
      ['OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH', 'OBSTACLE', 'OBSTACLE', 'PATH'],
      ['OBSTACLE', 'PATH', 'PATH', 'PATH', 'PATH', 'OBSTACLE', 'PATH'],
      ['OBSTACLE', 'PATH', 'OBSTACLE', 'OBSTACLE', 'PATH', 'OBSTACLE', 'PATH'],
      ['OBSTACLE', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'GOAL'],
    ],
    startPosition: { x: 0, y: 0 },
    startDirection: 'SOUTH',
    maxMoves: 22,
    availableBlocks: [
      blockTypes.MOVE_FORWARD, blockTypes.TURN_RIGHT, blockTypes.TURN_LEFT,
      blockTypes.REPEAT, blockTypes.IF_PATH_AHEAD, blockTypes.IF_ELSE_PATH, blockTypes.WHILE_PATH
    ],
    hints: [
      'Plan your route carefully',
      'Use conditionals to avoid dead ends',
    ],
  },
  {
    id: 19,
    stageId: 'combined',
    title: 'Efficiency Master',
    description: 'Solve with minimum blocks possible!',
    difficulty: 'Expert',
    grid: [
      ['START', 'PATH', 'PATH', 'PATH', 'PATH'],
      ['PATH', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH'],
      ['PATH', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH'],
      ['PATH', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH'],
      ['PATH', 'PATH', 'PATH', 'PATH', 'GOAL'],
    ],
    startPosition: { x: 0, y: 0 },
    startDirection: 'EAST',
    maxMoves: 16,
    maxBlocks: 5,
    availableBlocks: [
      blockTypes.MOVE_FORWARD, blockTypes.TURN_RIGHT,
      blockTypes.REPEAT, blockTypes.WHILE_PATH
    ],
    hints: [
      'Use nested loops for maximum efficiency',
      'Can you solve it with just 5 blocks?',
    ],
  },
  {
    id: 20,
    stageId: 'combined',
    title: 'The Ultimate Challenge',
    description: 'The final test of all your programming skills!',
    difficulty: 'Expert',
    grid: [
      ['START', 'PATH', 'PATH', 'PATH', 'OBSTACLE', 'PATH', 'PATH', 'PATH'],
      ['OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH', 'OBSTACLE', 'PATH', 'OBSTACLE', 'PATH'],
      ['PATH', 'PATH', 'PATH', 'PATH', 'OBSTACLE', 'PATH', 'OBSTACLE', 'PATH'],
      ['PATH', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH', 'OBSTACLE', 'PATH'],
      ['PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'OBSTACLE', 'PATH'],
      ['OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'PATH', 'OBSTACLE', 'PATH'],
      ['PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH'],
      ['PATH', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'OBSTACLE', 'GOAL'],
    ],
    startPosition: { x: 0, y: 0 },
    startDirection: 'EAST',
    maxMoves: 35,
    maxBlocks: 15,
    availableBlocks: [
      blockTypes.MOVE_FORWARD, blockTypes.TURN_RIGHT, blockTypes.TURN_LEFT,
      blockTypes.REPEAT, blockTypes.IF_PATH_AHEAD, blockTypes.IF_ELSE_PATH, 
      blockTypes.WHILE_PATH, blockTypes.REPEAT_UNTIL_GOAL
    ],
    hints: [
      'This is the ultimate challenge!',
      'Combine all your knowledge: loops, conditionals, and planning',
      'There are multiple valid solutions',
    ],
  },
];

// Helper function to get a level by ID
export function getLevelById(id) {
  return levels.find((level) => level.id === id);
}

// Helper function to get level count
export function getLevelCount() {
  return levels.length;
}

// Helper function to check if level exists
export function levelExists(id) {
  return levels.some((level) => level.id === id);
}

// Helper function to get levels by stage
export function getLevelsByStage(stageId) {
  return levels.filter((level) => level.stageId === stageId);
}

// Helper function to get stage info
export function getStageById(stageId) {
  return stages.find((stage) => stage.id === stageId);
}

// Helper function to get next level in stage
export function getNextLevelInStage(currentLevelId) {
  const currentLevel = getLevelById(currentLevelId);
  if (!currentLevel) return null;
  
  const stageLevels = getLevelsByStage(currentLevel.stageId);
  const currentIndex = stageLevels.findIndex(l => l.id === currentLevelId);
  
  if (currentIndex < stageLevels.length - 1) {
    return stageLevels[currentIndex + 1];
  }
  
  // Move to next stage
  const currentStageIndex = stages.findIndex(s => s.id === currentLevel.stageId);
  if (currentStageIndex < stages.length - 1) {
    const nextStage = stages[currentStageIndex + 1];
    const nextStageLevels = getLevelsByStage(nextStage.id);
    return nextStageLevels[0] || null;
  }
  
  return null;
}
