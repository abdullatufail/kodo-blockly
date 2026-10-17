// Kodo's puzzles. Each level is a small map Kodo has to cross to get home.
//
// Map legend:
//   S  start (Kodo stands here)     H  home (the goal)
//   .  path                         *  path with a berry on it
//   #  something in the way (bush, rock, tree... depends on the land)
//   ~  water (also in the way, drawn as a pond)
//
// Levels 21+ are the Grown-up Trail: tougher puzzles for teens and adults,
// with tricks (functions), a berry sensor and a counter (a variable). Each one
// lists `refresher` levels from earlier lands that build up the same idea.
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
  DEFINE_TRICK: 'define_trick',
  CALL_TRICK: 'call_trick',
  IF_BERRY: 'if_berry',
  SET_COUNT: 'set_count',
  CHANGE_COUNT: 'change_count',
  REPEAT_COUNT: 'repeat_count',
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
  {
    id: 'functions',
    track: 'advanced',
    name: 'Starlit Ridge',
    concept: 'Functions & recursion',
    description: 'Teach Kodo tricks: name a chunk of code once, then reuse it. Even inside itself.',
    shape: 'sparkle',
    color: 'var(--color-peach)',
    deep: 'var(--color-peach-deep)',
    scenery: 'ridge',
  },
  {
    id: 'variables',
    track: 'advanced',
    name: 'Clockwork Caves',
    concept: 'Variables & mastery',
    description: 'A counter that changes as Kodo goes, for paths that grow and shrink. Then the final test.',
    shape: 'flower',
    color: 'var(--color-sun)',
    deep: 'var(--color-sun-deep)',
    scenery: 'caves',
  },
];

export const kidStages = stages.filter((s) => s.track !== 'advanced');
export const advancedStages = stages.filter((s) => s.track === 'advanced');

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

  // ── Starlit Ridge: functions & recursion (Grown-up Trail) ──────────────
  {
    id: 21,
    stageId: 'functions',
    title: 'Copy Cat',
    story: 'No repeat block up here. Teach Kodo a trick once, then just say "do trick A" whenever you need it.',
    map: ['####.H', '###.*#', '##..##', '#.*###', 'S.####'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_LEFT, B.TURN_RIGHT, B.DEFINE_TRICK, B.CALL_TRICK],
    newBlocks: [B.DEFINE_TRICK, B.CALL_TRICK],
    maxBlocks: 12,
    parBlocks: 10,
    refresher: [8, 9],
    hints: [
      'Find the shape that keeps coming back: one stair is move, turn left, move, turn right.',
      'Put that stair inside "to do trick A" (it can sit anywhere on the canvas), then snap "do trick A" under the Go block.',
      'Four stairs, then one last step home.',
    ],
  },
  {
    id: 22,
    stageId: 'functions',
    title: 'Pocket Picking',
    story: 'Berries hide in little pockets below the ridge, but the gaps between them are not all the same.',
    map: ['S........H', '#*##*#*#*#'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_LEFT, B.TURN_RIGHT, B.REPEAT, B.DEFINE_TRICK, B.CALL_TRICK],
    maxBlocks: 16,
    parBlocks: 14,
    refresher: [16, 10],
    hints: [
      'Dipping into a pocket and coming back is always the same: a perfect trick.',
      'To turn all the way around, turn right twice.',
      'Make the trick "step forward, then dip". After the first pocket, the other three are evenly spaced, so a repeat can use it.',
    ],
  },
  {
    id: 23,
    stageId: 'functions',
    title: 'Berry Sniffer',
    story: 'Pockets above, pockets below, all over the place. Kodo can now sniff for a berry before deciding.',
    map: ['##*##*#*###', 'S.........H', '###*#*###*#'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_LEFT, B.TURN_RIGHT, B.REPEAT_UNTIL_GOAL, B.IF_BERRY, B.DEFINE_TRICK, B.CALL_TRICK],
    newBlocks: [B.IF_BERRY],
    maxBlocks: 18,
    parBlocks: 15,
    refresher: [13, 14],
    hints: [
      'Walk one step at a time until home, sniffing left and right after every step.',
      'Grabbing a berry is: step in, turn around, step back. That part is the same on both sides.',
      'After grabbing one on the left you face the wrong way. One more left turn fixes it (and right for the right side).',
    ],
  },
  {
    id: 24,
    stageId: 'functions',
    title: 'Trick Inside a Trick',
    story: 'A long spiral and no loops at all! Can a trick end by doing... itself?',
    map: ['...*....', '.######.', '.#H*.##.', '.###.##*', '..*..##.', '#######.', 'S..*....'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_LEFT, B.TURN_RIGHT, B.IF_PATH_AHEAD, B.DEFINE_TRICK, B.CALL_TRICK],
    maxBlocks: 8,
    parBlocks: 6,
    refresher: [13, 11],
    hints: [
      'This spiral always turns left. Think about what Kodo does for one single step.',
      'One step: move forward, and if there is a path to the left, turn left.',
      'Put "do trick A" as the last block inside trick A. That is recursion, and Kodo stops the moment it gets home.',
    ],
  },
  {
    id: 25,
    stageId: 'functions',
    title: 'Fern Comb',
    story: 'Branches of every length sprout up and down the trail, each with a berry at the tip.',
    map: ['##*########', '##.#####*##', '##.###*#.##', 'S..*......H', '####.##.###', '####*##.###', '#######*###'],
    startDirection: 'EAST',
    availableBlocks: [
      B.MOVE_FORWARD, B.TURN_LEFT, B.TURN_RIGHT, B.IF_PATH_AHEAD, B.WHILE_PATH, B.REPEAT_UNTIL_GOAL, B.DEFINE_TRICK, B.CALL_TRICK,
    ],
    maxBlocks: 19,
    parBlocks: 17,
    refresher: [12, 19],
    hints: [
      'Exploring a branch is: walk while there is a path, turn around, walk while there is a path.',
      'That is the same for branches going up and going down, so make it a trick.',
      'Repeat until home: move, if path left (turn left, trick, turn left), if path right (turn right, trick, turn right).',
    ],
  },

  // ── Clockwork Caves: variables & mastery (Grown-up Trail) ──────────────
  {
    id: 26,
    stageId: 'variables',
    title: 'Growing Spiral',
    story: 'Every two sides, the spiral gets longer. A counter can keep track of how far to go.',
    map: ['...*...', '.#####.', '.#S..#.', '.###*#.', '.*...#*', '######.', '######H'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_RIGHT, B.REPEAT, B.SET_COUNT, B.CHANGE_COUNT, B.REPEAT_COUNT],
    newBlocks: [B.SET_COUNT, B.CHANGE_COUNT, B.REPEAT_COUNT],
    maxBlocks: 9,
    parBlocks: 7,
    refresher: [10, 7],
    hints: [
      'Side lengths are 2, 2, 4, 4, 6, 6. Each pair is 2 longer than the one before.',
      'Set count to 2 first. "Repeat count times" walks that many squares.',
      'Repeat 3 times: (repeat 2 times: repeat count times move, turn right), then change count by 2.',
    ],
  },
  {
    id: 27,
    stageId: 'variables',
    title: 'Pyramid',
    story: 'Steps that grow on the way up and shrink on the way down. Count up, then count down.',
    map: ['######....###', '######*##.###', '######.##.###', '###....##...#', '###.#######*#', '#.*.#######..', 'S.##########H'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_LEFT, B.TURN_RIGHT, B.REPEAT, B.SET_COUNT, B.CHANGE_COUNT, B.REPEAT_COUNT],
    maxBlocks: 20,
    parBlocks: 18,
    refresher: [17, 26],
    hints: [
      'Going up, each step is "count squares across, count squares up", with count going 1, 2, 3.',
      'Going down is the mirror image, with count going 3, 2, 1.',
      'After three steps up the counter says 4. Change it by -1 before heading down.',
    ],
  },
  {
    id: 28,
    stageId: 'variables',
    title: 'Shrinking Lawn',
    story: 'Mow back and forth, but every row is one shorter than the last.',
    map: ['S..*..', '#####.', '#.....', '#*####', '#....#', '####*#', '##...#', '##.###', '##*H##'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_LEFT, B.TURN_RIGHT, B.REPEAT, B.SET_COUNT, B.CHANGE_COUNT, B.REPEAT_COUNT],
    maxBlocks: 18,
    parBlocks: 16,
    refresher: [18, 27],
    hints: [
      'Rows are 5, 4, 3, 2 and 1 squares long. Start the counter at 5.',
      'There and back is: a row, turn right, two steps down, turn right, a row, turn left, two steps down, turn left.',
      'Change the count by -1 after every row, not just after every pair.',
    ],
  },
  {
    id: 29,
    stageId: 'variables',
    title: 'Echo Maze',
    story: 'A maze with no loop blocks. Keep a paw on the right-hand hedge, with a trick that keeps calling itself.',
    map: ['S.#......', '#.#.###.#', '#*..#.*.#', '###.#.###', '#*..#...#', '#.#####.#', '#.#..*..H'],
    startDirection: 'EAST',
    availableBlocks: [B.MOVE_FORWARD, B.TURN_LEFT, B.TURN_RIGHT, B.IF_ELSE_PATH, B.DEFINE_TRICK, B.CALL_TRICK],
    maxBlocks: 11,
    parBlocks: 9,
    refresher: [20, 24],
    hints: [
      'Right-hand rule: if there is a path to the right, turn right and move. Else if there is a path ahead, move. Else turn left.',
      'Put the whole rule inside trick A, and end trick A with "do trick A".',
      'Under the Go block you only need one thing: "do trick A".',
    ],
  },
  {
    id: 30,
    stageId: 'variables',
    title: 'The Grand Tour',
    story: 'One last winding trail with berry pockets on both sides. Everything you know, in one small program.',
    map: ['######*##', '####....#', '####.##.#', '###*.#*.*', '####.*#.#', '##*#.##.H', 'S....####', '###*#####'],
    startDirection: 'EAST',
    availableBlocks: [
      B.MOVE_FORWARD, B.TURN_LEFT, B.TURN_RIGHT, B.IF_ELSE_PATH, B.IF_BERRY, B.REPEAT_UNTIL_GOAL, B.DEFINE_TRICK, B.CALL_TRICK,
    ],
    maxBlocks: 22,
    parBlocks: 19,
    refresher: [23, 15],
    hints: [
      'Two jobs every step: grab any berry beside Kodo, then follow the trail.',
      'Reuse the grab trick from Berry Sniffer: step in, turn around, step back.',
      'Follow the trail like Woodland Wiggle: if path ahead, move, else if path left, turn left, else turn right.',
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

// The first level of the Grown-up Trail is open from the start, so older players can skip ahead.
export const TRAIL_START = levels.find((l) => stages.find((s) => s.id === l.stageId)?.track === 'advanced')?.id;

// A level is unlocked when it starts a trail or the one before it is finished.
export function isLevelUnlocked(levelId, progress) {
  const index = levels.findIndex((l) => l.id === levelId);
  if (index <= 0 || levelId === TRAIL_START) return true;
  return !!progress[levels[index - 1].id]?.completed;
}
