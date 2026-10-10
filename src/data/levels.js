// Kodo's puzzles. Each level is a small map Kodo has to cross to get home.
//
// Map legend:
//   S  start (Kodo stands here)     H  home (the goal)
//   .  path                         *  path with a berry on it
//   #  something in the way (bush, rock, tree... depends on the land)
//   ~  water (also in the way, drawn as a pond)
//
// Every level is checked by scripts/check-levels.mjs: each reference solution
// must get Kodo home with every berry using exactly `parBlocks` blocks.

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

const B = blockTypes;

export const stages = [
  {
    id: 'simple',
    name: 'Garden Path',
    concept: 'Sequences',
    description: 'Hop, turn and wiggle through the vegetable garden, one step at a time.',
    shape: 'bloom',
    color: 'var(--color-leaf)',
    deep: 'var(--color-leaf-deep)',
    scenery: 'garden',
  },
  {
    id: 'loops',
    name: 'Loopy Meadow',
    concept: 'Loops',
    description: 'Why say it ten times? Teach Kodo to repeat and zoom across the meadow.',
    shape: 'loop',
    color: 'var(--color-sky)',
    deep: 'var(--color-sky-deep)',
    scenery: 'meadow',
  },
  {
    id: 'conditions',
    name: 'Whispering Woods',
    concept: 'Decisions',
    description: 'Kodo learns to peek ahead and decide which way to go between the trees.',
    shape: 'asterisk',
    color: 'var(--color-grape)',
    deep: 'var(--color-grape-deep)',
    scenery: 'woods',
  },
  {
    id: 'combined',
    name: 'Cozy Hills',
    concept: 'Everything together',
    description: 'The last hills before home. Mix every trick you know.',
    shape: 'splat',
    color: 'var(--color-berry)',
    deep: 'var(--color-berry-deep)',
    scenery: 'hills',
  },
];

const rawLevels = [
  // ── Garden Path: sequences ─────────────────────────────────────────────
  {
    id: 1,
    stageId: 'simple',
    title: 'First Hop',
    story: 'Kodo is almost home! Snap "move forward" blocks under the pink "when Go is pressed" block.',
    map: ['S.*.H'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD],
    newBlocks: [B.MOVE_FORWARD],
    parBlocks: 4,
    hints: [
      'Each "move forward" block moves Kodo one square.',
      'Count the squares between Kodo and the house.',
      'Four "move forward" blocks will do it!',
    ],
  },
  {
    id: 2,
    stageId: 'simple',
    title: 'Round the Bush',
    story: 'A bush is in the way. Kodo needs to turn right to walk around it.',
    map: ['S.*', '##.', '##H'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_RIGHT],
    newBlocks: [B.TURN_RIGHT],
    parBlocks: 5,
    hints: [
      'Turning does not move Kodo, it only changes the way Kodo faces.',
      'Walk two squares, then turn right.',
      'Move, move, turn right, move, move.',
    ],
  },
  {
    id: 3,
    stageId: 'simple',
    title: 'Left Turn Lane',
    story: 'This time the path bends the other way. Try a left turn!',
    map: ['###H', '###.', 'S.*.'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_RIGHT, B.TURN_LEFT],
    newBlocks: [B.TURN_LEFT],
    parBlocks: 6,
    hints: [
      'Walk to the end of the path first.',
      'Left means the same hand you hold your fork with... for most people!',
      'Move three times, turn left, move two times.',
    ],
  },
  {
    id: 4,
    stageId: 'simple',
    title: 'Zig Zag Garden',
    story: 'The garden path wiggles like a worm. Follow it carefully.',
    map: ['S.##', '#.*.', '###.', '#H*.'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_RIGHT, B.TURN_LEFT],
    parBlocks: 12,
    hints: [
      'Pretend you are Kodo. Which way are you facing at each corner?',
      'Build it bit by bit: press Go after each corner to check.',
    ],
  },
  {
    id: 5,
    stageId: 'simple',
    title: 'Pond Lap',
    story: 'Walk all the way around the pond. Notice anything that repeats?',
    map: ['S..*', '~~~.', '~~~.', 'H.*.'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_RIGHT, B.TURN_LEFT],
    parBlocks: 11,
    hints: [
      'Each side of the pond is three steps long.',
      'Three moves, turn right... and again!',
      'That was a lot of blocks. Loops are coming next to help!',
    ],
  },

  // ── Loopy Meadow: loops ────────────────────────────────────────────────
  {
    id: 6,
    stageId: 'loops',
    title: 'Long Hop',
    story: 'Seven steps but only room for three blocks! The repeat block can help.',
    map: ['S..*...H'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.REPEAT],
    newBlocks: [B.REPEAT],
    maxBlocks: 3,
    parBlocks: 2,
    hints: [
      'Put one "move forward" inside the repeat block.',
      'Change the number in the repeat block to how many steps you need.',
    ],
  },
  {
    id: 7,
    stageId: 'loops',
    title: 'Big L',
    story: 'A long way across, a long way down. Two loops make it short.',
    map: ['S..*..', '#####.', '#####*', '#####.', '#####H'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_RIGHT, B.REPEAT],
    maxBlocks: 7,
    parBlocks: 5,
    hints: [
      'Use one repeat for going across and another for going down.',
      'Five steps across, turn right, four steps down.',
    ],
  },
  {
    id: 8,
    stageId: 'loops',
    title: 'Staircase',
    story: 'Step, turn, step, turn... Kodo is going down the stairs.',
    map: ['S.###', '#.*##', '##..#', '###.H'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_RIGHT, B.TURN_LEFT, B.REPEAT],
    maxBlocks: 7,
    parBlocks: 5,
    hints: [
      'Find the pattern for one stair: move, turn right, move, turn left.',
      'Put that whole pattern inside a repeat block.',
      'How many stairs are there?',
    ],
  },
  {
    id: 9,
    stageId: 'loops',
    title: 'Hill Climb',
    story: 'Up the bumpy hill! Each bump is the same shape.',
    map: ['######H', '####.*.', '##...##', 'S*.####'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_RIGHT, B.TURN_LEFT, B.REPEAT],
    maxBlocks: 8,
    parBlocks: 6,
    hints: [
      'One bump is: move, move, turn left, move, turn right.',
      'Kodo stops as soon as it gets home, even in the middle of a loop.',
    ],
  },
  {
    id: 10,
    stageId: 'loops',
    title: 'Flowerbed Lap',
    story: 'Go the long way round to grab both berries. A loop inside a loop works wonders!',
    map: ['S...*', '.###.', '.###.', '.###.', 'H.*..'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_RIGHT, B.REPEAT],
    maxBlocks: 8,
    parBlocks: 4,
    hints: [
      'Walking one side is: repeat 4 times "move forward", then turn right.',
      'You can put a repeat block inside another repeat block!',
    ],
  },

  // ── Whispering Woods: decisions ────────────────────────────────────────
  {
    id: 11,
    stageId: 'conditions',
    title: 'Keep Walking',
    story: 'No counting needed! Kodo can keep walking while there is a path ahead.',
    map: ['S..*...*H'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.WHILE_PATH],
    newBlocks: [B.WHILE_PATH],
    maxBlocks: 3,
    parBlocks: 2,
    hints: [
      'Put "move forward" inside the "while path" block.',
      'Kodo checks for a path before every single step.',
    ],
  },
  {
    id: 12,
    stageId: 'conditions',
    title: 'Corner to Corner',
    story: 'Walk until you bump into the edge, then turn. Do that a few times.',
    map: ['S..*..', '#####.', '#####.', '#####*', '#####.', 'H.....'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_RIGHT, B.REPEAT, B.WHILE_PATH],
    maxBlocks: 6,
    parBlocks: 4,
    hints: [
      'Walk while there is a path, then turn right.',
      'Repeat that whole idea three times.',
    ],
  },
  {
    id: 13,
    stageId: 'conditions',
    title: 'The Snail Shell',
    story: 'This path curls like a snail shell. Kodo can turn whenever there is a path to the right.',
    map: ['S..*...', '######.', '..*..#.', '.###.#.', '.#H..#*', '.#####.', '.*.....'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_RIGHT, B.IF_PATH_AHEAD, B.REPEAT_UNTIL_GOAL],
    newBlocks: [B.IF_PATH_AHEAD, B.REPEAT_UNTIL_GOAL],
    maxBlocks: 6,
    parBlocks: 4,
    hints: [
      'The "if path" block has a menu: you can check ahead, to the left or to the right.',
      'Inside "repeat until home": move forward, then if there is a path to the right, turn right.',
    ],
  },
  {
    id: 14,
    stageId: 'conditions',
    title: 'Twisty Trail',
    story: 'Left, right, left, right! Teach Kodo to look both ways at every step.',
    map: ['####.H', '####*#', '##...#', '##*###', 'S..###'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_RIGHT, B.TURN_LEFT, B.IF_PATH_AHEAD, B.REPEAT_UNTIL_GOAL],
    maxBlocks: 8,
    parBlocks: 6,
    hints: [
      'Before each step, check: is there a path to the left? Is there a path to the right?',
      'Repeat until home: if path left, turn left. If path right, turn right. Move forward.',
    ],
  },
  {
    id: 15,
    stageId: 'conditions',
    title: 'Woodland Wiggle',
    story: 'If the way is clear, walk. If not, pick a side. One "if... else" can decide!',
    map: ['S##..*.', '.##.##.', '..*.##.', '######*', '##H###.', '##..*..'],
    startDirection: 'SOUTH',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_RIGHT, B.TURN_LEFT, B.IF_ELSE_PATH, B.REPEAT_UNTIL_GOAL],
    newBlocks: [B.IF_ELSE_PATH],
    maxBlocks: 10,
    parBlocks: 6,
    hints: [
      'If there is a path ahead, move forward. Otherwise... Kodo needs to turn.',
      'Inside the "else" part you can put another "if path... else" block!',
      'Turn left if there is a path to the left, otherwise turn right.',
    ],
  },

  // ── Cozy Hills: everything together ────────────────────────────────────
  {
    id: 16,
    stageId: 'combined',
    title: 'Berry Comb',
    story: 'Three berry bushes hide below the path. Pop down, grab each one, and pop back up.',
    map: ['S......H', '##*#*#*#'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_RIGHT, B.TURN_LEFT, B.REPEAT],
    maxBlocks: 12,
    parBlocks: 10,
    hints: [
      'Getting one berry and coming back is the same every time.',
      'To turn all the way around, turn right twice.',
    ],
  },
  {
    id: 17,
    stageId: 'combined',
    title: 'Mountain Pass',
    story: 'Up one side of the mountain, down the other. Two staircases, two loops.',
    map: ['###.*###', '##....##', '#.*##*.#', 'S.####.H'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_RIGHT, B.TURN_LEFT, B.REPEAT],
    maxBlocks: 14,
    parBlocks: 10,
    hints: [
      'Going up: move, turn left, move, turn right.',
      'Going down is the mirror image: move, turn right, move, turn left.',
    ],
  },
  {
    id: 18,
    stageId: 'combined',
    title: 'Meadow Sweep',
    story: 'No bushes at all! Sweep back and forth across the meadow to find every berry.',
    map: ['S....', '..*..', '...*.', '.*...', '....H'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_RIGHT, B.TURN_LEFT, B.REPEAT],
    maxBlocks: 16,
    parBlocks: 11,
    hints: [
      'Go across, step down, come back, step down... like mowing a lawn.',
      'One "there and back" is: 4 moves, right, move, right, 4 moves, left, move, left.',
      'Remember: Kodo stops the moment it gets home.',
    ],
  },
  {
    id: 19,
    stageId: 'combined',
    title: 'Switchbacks',
    story: 'Long paths, short paths, left turns, right turns. Can one small program handle it all?',
    map: ['S..*..#', '#####.#', '#..*..#', '#.#####', '#...*..', '######.', '###H.*.'],
    startDirection: 'EAST',
    availableBlocks: [
      B.MOVE_FORWARD, B.TURN_RIGHT, B.TURN_LEFT, B.WHILE_PATH, B.IF_ELSE_PATH, B.REPEAT_UNTIL_GOAL,
    ],
    maxBlocks: 10,
    parBlocks: 6,
    hints: [
      'Walk while there is a path ahead. When you stop, decide which way to turn.',
      'Repeat until home: while path ahead, move. Then if path to the left, turn left, else turn right.',
    ],
  },
  {
    id: 20,
    stageId: 'combined',
    title: 'Home Sweet Home',
    story: 'The last maze before home, with dead ends everywhere! Keep one paw on the right-hand hedge.',
    map: ['S.#....', '#.#.##.', '#*..#..', '###.#.#', '#...#*#', '#.###.#', '#*..#.H'],
    startDirection: 'EAST',
    availableBlocks: [
      B.MOVE_FORWARD, B.TURN_RIGHT, B.TURN_LEFT, B.IF_PATH_AHEAD, B.IF_ELSE_PATH,
      B.WHILE_PATH, B.REPEAT_UNTIL_GOAL,
    ],
    maxBlocks: 12,
    parBlocks: 7,
    hints: [
      'Maze trick: always follow the hedge on your right side.',
      'If there is a path to the right, turn right and move. Otherwise, if there is a path ahead, move.',
      'If there is no path right and no path ahead, turn left.',
    ],
  },
];

const TILE = { S: 'START', H: 'GOAL', '.': 'PATH', '*': 'PATH', '#': 'OBSTACLE', '~': 'OBSTACLE' };

function parseLevel(raw) {
  const berries = [];
  let startPosition = null;
  let goalPosition = null;
  const grid = raw.map.map((row, y) =>
    [...row].map((ch, x) => {
      if (ch === 'S') startPosition = { x, y };
      if (ch === 'H') goalPosition = { x, y };
      if (ch === '*') berries.push({ x, y });
      return TILE[ch] ?? 'OBSTACLE';
    })
  );
  const water = raw.map.map((row) => [...row].map((ch) => ch === '~'));
  return { ...raw, grid, water, berries, startPosition, goalPosition };
}

export const levels = rawLevels.map(parseLevel);

export function getLevelById(id) {
  return levels.find((level) => level.id === id);
}

export function getLevelCount() {
  return levels.length;
}

export function levelExists(id) {
  return levels.some((level) => level.id === id);
}

export function getLevelsByStage(stageId) {
  return levels.filter((level) => level.stageId === stageId);
}

export function getStageById(stageId) {
  return stages.find((stage) => stage.id === stageId);
}

// Levels are ordered by id across all stages, so the next level is simply the next id.
export function getNextLevelInStage(currentLevelId) {
  const index = levels.findIndex((l) => l.id === currentLevelId);
  return index >= 0 ? levels[index + 1] || null : null;
}

// A level is unlocked when it is the first one or the one before it is finished.
export function isLevelUnlocked(levelId, progress) {
  const index = levels.findIndex((l) => l.id === levelId);
  if (index <= 0) return true;
  return !!progress[levels[index - 1].id]?.completed;
}
