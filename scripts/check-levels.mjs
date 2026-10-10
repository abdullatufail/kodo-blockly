// Checks every level is well-formed and solvable for 3 stars.
// Run with: npm run check:levels
import { levels } from '../src/data/levels.js';
import { runProgram, countBlocks, scoreRun } from '../src/lib/game/engine.js';

const m = { type: 'move' };
const L = { type: 'turn', dir: 'left' };
const R = { type: 'turn', dir: 'right' };
const rep = (times, ...body) => ({ type: 'repeat', times, body });
const whilePath = (cond, ...body) => ({ type: 'while', cond, body });
const ifPath = (cond, body, elseBody = []) => ({ type: 'if', cond, body, elseBody });
const ifElse = (cond, body, elseBody) => ({ type: 'if', cond, body, elseBody, isElse: true });
const untilHome = (...body) => ({ type: 'untilHome', body });

// One 3-star solution per level.
const solutions = {
  1: [m, m, m, m],
  2: [m, m, R, m, m],
  3: [m, m, m, L, m, m],
  4: [m, R, m, L, m, m, R, m, m, R, m, m],
  5: [m, m, m, R, m, m, m, R, m, m, m],
  6: [rep(7, m)],
  7: [rep(5, m), R, rep(4, m)],
  8: [rep(4, m, R, m, L)],
  9: [rep(3, m, m, L, m, R)],
  10: [rep(3, rep(4, m), R)],
  11: [whilePath('AHEAD', m)],
  12: [rep(3, whilePath('AHEAD', m), R)],
  13: [untilHome(m, ifPath('RIGHT', [R]))],
  14: [untilHome(ifPath('LEFT', [L]), ifPath('RIGHT', [R]), m)],
  15: [untilHome(ifElse('AHEAD', [m], [ifElse('LEFT', [L], [R])]))],
  16: [rep(3, rep(2, m), R, m, R, R, m, R), m],
  17: [rep(3, m, L, m, R), rep(4, m, R, m, L)],
  18: [rep(3, rep(4, m), R, m, R, rep(4, m), L, m, L)],
  19: [untilHome(whilePath('AHEAD', m), ifElse('LEFT', [L], [R]))],
  20: [untilHome(ifElse('RIGHT', [R, m], [ifElse('AHEAD', [m], [L])]))],
};

// The blocks each solution needs, so a level never asks for a block it doesn't offer.
const BLOCK_FOR = {
  move: () => 'move_forward',
  turn: (n) => (n.dir === 'left' ? 'turn_left' : 'turn_right'),
  repeat: () => 'repeat_times',
  while: () => 'while_path',
  if: (n) => (n.isElse ? 'if_else_path' : 'if_path_ahead'),
  untilHome: () => 'repeat_until_goal',
};
const usedBlocks = (prog, out = new Set()) => {
  for (const n of prog) {
    out.add(BLOCK_FOR[n.type](n));
    usedBlocks(n.body || [], out);
    usedBlocks(n.elseBody || [], out);
  }
  return out;
};

let failures = 0;
const fail = (level, msg) => {
  failures += 1;
  console.error(`✗ Level ${level.id} (${level.title}): ${msg}`);
};

for (const level of levels) {
  const width = level.map[0].length;
  if (level.map.some((row) => row.length !== width)) fail(level, 'rows have different widths');
  if (!level.startPosition) fail(level, 'no start (S)');
  if (!level.goalPosition) fail(level, 'no home (H)');
  if (level.berries.length === 0) fail(level, 'no berries');
  if (level.map.join('').split('S').length !== 2) fail(level, 'needs exactly one S');
  if (level.map.join('').split('H').length !== 2) fail(level, 'needs exactly one H');

  const program = solutions[level.id];
  if (!program) {
    fail(level, 'missing reference solution');
    continue;
  }
  const blocks = countBlocks(program);
  const result = runProgram(level, program);
  const { stars } = scoreRun(level, result, blocks);

  if (result.outcome !== 'win') fail(level, `solution ended with "${result.outcome}" at ${JSON.stringify(result.finalPosition)}`);
  if (result.berriesCollected !== level.berries.length) fail(level, `collected ${result.berriesCollected}/${level.berries.length} berries`);
  if (blocks !== level.parBlocks) fail(level, `solution uses ${blocks} blocks but parBlocks is ${level.parBlocks}`);
  if (level.maxBlocks && blocks > level.maxBlocks) fail(level, `solution needs ${blocks} blocks, over maxBlocks ${level.maxBlocks}`);
  for (const type of usedBlocks(program)) {
    if (!level.availableBlocks.includes(type)) fail(level, `solution uses "${type}" which the level doesn't offer`);
  }
  if (stars === 3 && result.outcome === 'win') {
    console.log(`✓ Level ${String(level.id).padStart(2)} ${level.title.padEnd(18)} ${blocks} blocks, ${result.steps} steps`);
  }
}

if (failures) {
  console.error(`\n${failures} problem(s) found.`);
  process.exit(1);
}
console.log(`\nAll ${levels.length} levels are solvable for 3 stars.`);
