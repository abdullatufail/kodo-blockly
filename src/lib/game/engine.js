// Kodo's puzzle engine.
//
// A program is a tree of plain objects (built from Blockly blocks, or written
// by hand in tests). Running it against a level produces a list of frames the
// board animates one by one, plus the final outcome. Nothing here touches the
// DOM, so it works the same in the browser and in Node.

export const DIRECTIONS = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

const STEP = {
  NORTH: { x: 0, y: -1 },
  EAST: { x: 1, y: 0 },
  SOUTH: { x: 0, y: 1 },
  WEST: { x: -1, y: 0 },
};

// Safety limits so a loop like "while path ahead { turn left }" can't freeze the tab.
const MAX_ACTIONS = 400;
const MAX_CHECKS = 2000;

export function turn(dir, side) {
  const i = DIRECTIONS.indexOf(dir);
  return DIRECTIONS[(i + (side === 'right' ? 1 : 3)) % 4];
}

function relativeDir(dir, cond) {
  if (cond === 'LEFT') return turn(dir, 'left');
  if (cond === 'RIGHT') return turn(dir, 'right');
  return dir;
}

export function isOpen(level, x, y) {
  const row = level.grid[y];
  if (!row || x < 0 || x >= row.length) return false;
  return row[x] !== 'OBSTACLE';
}

export function countBlocks(program) {
  return program.reduce(
    (sum, node) => sum + 1 + countBlocks(node.body || []) + countBlocks(node.elseBody || []),
    0
  );
}

class Halt {
  constructor(reason) {
    this.reason = reason;
  }
}

export function runProgram(level, program) {
  const state = {
    x: level.startPosition.x,
    y: level.startPosition.y,
    dir: level.startDirection,
    berries: new Set(level.berries.map((b) => `${b.x},${b.y}`)),
    collected: 0,
    steps: 0,
    actions: 0,
    checks: 0,
  };
  const frames = [];
  const goal = level.goalPosition;
  const atHome = () => state.x === goal.x && state.y === goal.y;

  const act = () => {
    state.actions += 1;
    if (state.actions > MAX_ACTIONS) throw new Halt('tooLong');
  };

  const pathTo = (cond) => {
    state.checks += 1;
    if (state.checks > MAX_CHECKS) throw new Halt('tooLong');
    const d = STEP[relativeDir(state.dir, cond)];
    return isOpen(level, state.x + d.x, state.y + d.y);
  };

  const exec = (nodes) => {
    for (const node of nodes) {
      switch (node.type) {
        case 'move': {
          act();
          const d = STEP[state.dir];
          const nx = state.x + d.x;
          const ny = state.y + d.y;
          if (!isOpen(level, nx, ny)) {
            frames.push({ kind: 'bump', id: node.id, x: state.x, y: state.y, dir: state.dir, tx: nx, ty: ny });
            throw new Halt('bump');
          }
          state.x = nx;
          state.y = ny;
          state.steps += 1;
          const key = `${nx},${ny}`;
          const berry = state.berries.has(key);
          if (berry) {
            state.berries.delete(key);
            state.collected += 1;
          }
          frames.push({ kind: 'move', id: node.id, x: nx, y: ny, dir: state.dir, berry });
          if (atHome()) throw new Halt('home');
          break;
        }
        case 'turn': {
          act();
          state.dir = turn(state.dir, node.dir);
          frames.push({ kind: 'turn', id: node.id, x: state.x, y: state.y, dir: state.dir, side: node.dir });
          break;
        }
        case 'repeat': {
          for (let i = 0; i < node.times; i++) {
            frames.push({ kind: 'check', id: node.id });
            exec(node.body);
          }
          break;
        }
        case 'if': {
          frames.push({ kind: 'check', id: node.id });
          exec(pathTo(node.cond) ? node.body : node.elseBody || []);
          break;
        }
        case 'while': {
          while (pathTo(node.cond)) {
            frames.push({ kind: 'check', id: node.id });
            exec(node.body);
          }
          break;
        }
        case 'untilHome': {
          // Home is always checked after each move, so we only loop here.
          for (;;) {
            frames.push({ kind: 'check', id: node.id });
            const before = state.actions;
            exec(node.body);
            // A body that never moves or turns would spin forever.
            if (state.actions === before) throw new Halt('tooLong');
          }
        }
        default:
          break;
      }
    }
  };

  let outcome = 'lost';
  try {
    exec(program);
  } catch (err) {
    if (!(err instanceof Halt)) throw err;
    outcome = err.reason === 'home' ? 'win' : err.reason;
  }

  return {
    outcome, // 'win' | 'bump' | 'lost' | 'tooLong'
    frames,
    steps: state.steps,
    berriesCollected: state.collected,
    finalPosition: { x: state.x, y: state.y },
  };
}

// Missions: 1 star for getting home, 1 for every berry, 1 for staying under par.
export function scoreRun(level, result, blocksUsed) {
  const missions = {
    home: result.outcome === 'win',
    berries: result.outcome === 'win' && result.berriesCollected === level.berries.length,
    blocks: result.outcome === 'win' && blocksUsed <= level.parBlocks,
  };
  const stars = Object.values(missions).filter(Boolean).length;
  return { missions, stars };
}
