'use client';

import { useEffect, useImperativeHandle, useRef } from 'react';
import * as Blockly from 'blockly';
import { sfx } from '@/lib/sfx';
import { store } from '@/lib/storage';

const INK = '#0f3d26';

const icon = (inner) =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`
  );

const ICON = {
  play: icon(`<path d="M7 4.5v15l12-7.5z" fill="${INK}"/>`),
  move: icon('<path d="M12 20V5"/><path d="m6 11 6-6 6 6"/>'),
  left: icon('<path d="M9 14 4 9l5-5"/><path d="M4 9h9a6 6 0 0 1 0 12h-1"/>'),
  right: icon('<path d="m15 14 5-5-5-5"/><path d="M20 9h-9a6 6 0 0 0 0 12h1"/>'),
  repeat: icon('<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>'),
  home: icon('<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>'),
  peek: icon('<path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"/><circle cx="12" cy="12" r="2.6" fill="' + INK + '"/>'),
  trick: icon('<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z"/>'),
  berry: icon('<circle cx="12" cy="14" r="6.5"/><path d="M12 7.5c0-2.5 1.5-4 4-4.5"/>'),
  count: icon('<path d="M9 4 7 20"/><path d="M17 4l-2 16"/><path d="M4 9h16"/><path d="M3 15h16"/>'),
};

const TRICKS = [
  ['trick A', 'A'],
  ['trick B', 'B'],
];

const DIRECTIONS = [
  ['ahead', 'AHEAD'],
  ['to the left', 'LEFT'],
  ['to the right', 'RIGHT'],
];

// Block colours come from the brand palette. The "tertiary" (outline) colour matches the fill, so blocks are flat.
const STYLES = {
  start_blocks: { colourPrimary: '#f39bbd', colourSecondary: '#fde2ec', colourTertiary: '#f39bbd', hat: 'cap' },
  move_blocks: { colourPrimary: '#6ccb82', colourSecondary: '#dcf2df', colourTertiary: '#6ccb82' },
  turn_blocks: { colourPrimary: '#7db8f2', colourSecondary: '#dceafb', colourTertiary: '#7db8f2' },
  loop_blocks: { colourPrimary: '#ffd43b', colourSecondary: '#fff1b8', colourTertiary: '#ffd43b' },
  while_blocks: { colourPrimary: '#f58b4c', colourSecondary: '#fdd9c3', colourTertiary: '#f58b4c' },
  logic_blocks: { colourPrimary: '#c8b8f2', colourSecondary: '#eee8fd', colourTertiary: '#c8b8f2' },
  trick_blocks: { colourPrimary: '#b3d860', colourSecondary: '#e2f5b0', colourTertiary: '#b3d860', hat: 'cap' },
  count_blocks: { colourPrimary: '#dcc38a', colourSecondary: '#f6e8c4', colourTertiary: '#dcc38a' },
};

const img = (src, size = 22) => new Blockly.FieldImage(src, size, size, '');

function defineBlocks() {
  if (Blockly.Blocks.when_run) return;

  const statement = (style, tooltip, build) => ({
    init() {
      build(this);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle(style);
      this.setTooltip(tooltip);
    },
  });

  Blockly.Blocks.when_run = {
    init() {
      this.appendDummyInput().appendField(img(ICON.play, 24)).appendField('when Go is pressed');
      this.setNextStatement(true, null);
      this.setStyle('start_blocks');
      this.setTooltip('Kodo follows the blocks snapped under this one, from top to bottom.');
      this.setDeletable(false);
    },
  };
  Blockly.Blocks.move_forward = statement('move_blocks', 'Kodo hops one square forward.', (b) =>
    b.appendDummyInput().appendField(img(ICON.move)).appendField('move forward')
  );
  Blockly.Blocks.turn_left = statement('turn_blocks', 'Kodo turns to face its left. It stays on the same square.', (b) =>
    b.appendDummyInput().appendField(img(ICON.left)).appendField('turn left')
  );
  Blockly.Blocks.turn_right = statement('turn_blocks', 'Kodo turns to face its right. It stays on the same square.', (b) =>
    b.appendDummyInput().appendField(img(ICON.right)).appendField('turn right')
  );
  Blockly.Blocks.repeat_times = statement('loop_blocks', 'Do the blocks inside this many times.', (b) => {
    b.appendDummyInput()
      .appendField(img(ICON.repeat))
      .appendField('repeat')
      .appendField(new Blockly.FieldNumber(3, 1, 10, 1), 'TIMES')
      .appendField('times');
    b.appendStatementInput('DO');
  });
  Blockly.Blocks.while_path = statement('while_blocks', 'Keep doing the blocks inside as long as there is a path.', (b) => {
    b.appendDummyInput().appendField(img(ICON.repeat)).appendField('while path').appendField(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    b.appendStatementInput('DO');
  });
  Blockly.Blocks.repeat_until_goal = statement('while_blocks', 'Keep doing the blocks inside until Kodo gets home.', (b) => {
    b.appendDummyInput().appendField(img(ICON.repeat)).appendField('repeat until').appendField(img(ICON.home)).appendField('home');
    b.appendStatementInput('DO');
  });
  Blockly.Blocks.if_path_ahead = statement('logic_blocks', 'Only do the blocks inside if there is a path that way.', (b) => {
    b.appendDummyInput().appendField(img(ICON.peek)).appendField('if path').appendField(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    b.appendStatementInput('DO');
  });
  Blockly.Blocks.if_else_path = statement('logic_blocks', 'If there is a path, do the first part. Otherwise do the "else" part.', (b) => {
    b.appendDummyInput().appendField(img(ICON.peek)).appendField('if path').appendField(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    b.appendStatementInput('DO');
    b.appendDummyInput().appendField('else');
    b.appendStatementInput('ELSE');
  });

  // Tricks are Kodo's functions: a named stack that floats on its own, and a block that runs it.
  Blockly.Blocks.define_trick = {
    init() {
      this.appendDummyInput().appendField(img(ICON.trick)).appendField('to do').appendField(new Blockly.FieldDropdown(TRICKS), 'NAME');
      this.appendStatementInput('DO');
      this.setStyle('trick_blocks');
      this.setTooltip('Teach Kodo a trick. The blocks inside only run when a "do trick" block asks for them.');
    },
  };
  Blockly.Blocks.call_trick = statement('trick_blocks', 'Kodo does every block inside the matching "to do trick" block.', (b) =>
    b.appendDummyInput().appendField(img(ICON.trick)).appendField('do').appendField(new Blockly.FieldDropdown(TRICKS), 'NAME')
  );
  Blockly.Blocks.if_berry = statement('logic_blocks', 'Only do the blocks inside if there is a berry on the square that way.', (b) => {
    b.appendDummyInput().appendField(img(ICON.berry)).appendField('if berry').appendField(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    b.appendStatementInput('DO');
  });

  // One counter (a variable) that Kodo can set, change and use as a repeat number.
  Blockly.Blocks.set_count = statement('count_blocks', 'Put a number in the counter.', (b) =>
    b.appendDummyInput().appendField(img(ICON.count)).appendField('set count to').appendField(new Blockly.FieldNumber(1, 0, 20, 1), 'VALUE')
  );
  Blockly.Blocks.change_count = statement('count_blocks', 'Add to the counter. Use a minus number to take away.', (b) =>
    b.appendDummyInput().appendField(img(ICON.count)).appendField('change count by').appendField(new Blockly.FieldNumber(1, -10, 10, 1), 'VALUE')
  );
  Blockly.Blocks.repeat_count = statement('count_blocks', 'Do the blocks inside as many times as the counter says right now.', (b) => {
    b.appendDummyInput().appendField(img(ICON.repeat)).appendField('repeat count times');
    b.appendStatementInput('DO');
  });
}

let theme = null;
function getTheme() {
  if (theme) return theme;
  const family = getComputedStyle(document.body).getPropertyValue('--font-figtree').trim() || 'system-ui, sans-serif';
  theme = Blockly.Theme.defineTheme('kodo', {
    base: Blockly.Themes.Classic,
    blockStyles: STYLES,
    componentStyles: {
      workspaceBackgroundColour: '#ffffff',
      flyoutBackgroundColour: '#fff1b8',
      flyoutOpacity: 1,
      scrollbarColour: '#46695a',
      scrollbarOpacity: 0.35,
      insertionMarkerColour: INK,
      insertionMarkerOpacity: 0.25,
      cursorColour: INK,
      selectedGlowColour: '#ffd43b',
    },
    fontStyle: { family, weight: '700', size: 15 },
    startHats: false,
  });
  return theme;
}

// Turn the blocks under "when Go is pressed" into the plain program the engine runs.
function stackToProgram(block) {
  const out = [];
  for (let b = block; b; b = b.getNextBlock()) {
    if (!b.isEnabled()) continue;
    const body = (name) => stackToProgram(b.getInputTargetBlock(name));
    switch (b.type) {
      case 'move_forward':
        out.push({ type: 'move', id: b.id });
        break;
      case 'turn_left':
        out.push({ type: 'turn', dir: 'left', id: b.id });
        break;
      case 'turn_right':
        out.push({ type: 'turn', dir: 'right', id: b.id });
        break;
      case 'repeat_times':
        out.push({ type: 'repeat', times: Number(b.getFieldValue('TIMES')) || 0, body: body('DO'), id: b.id });
        break;
      case 'while_path':
        out.push({ type: 'while', cond: b.getFieldValue('DIR'), body: body('DO'), id: b.id });
        break;
      case 'repeat_until_goal':
        out.push({ type: 'untilHome', body: body('DO'), id: b.id });
        break;
      case 'if_path_ahead':
        out.push({ type: 'if', cond: b.getFieldValue('DIR'), body: body('DO'), elseBody: [], id: b.id });
        break;
      case 'if_else_path':
        out.push({ type: 'if', cond: b.getFieldValue('DIR'), body: body('DO'), elseBody: body('ELSE'), id: b.id });
        break;
      case 'if_berry':
        out.push({ type: 'ifBerry', cond: b.getFieldValue('DIR'), body: body('DO'), elseBody: [], id: b.id });
        break;
      case 'call_trick':
        out.push({ type: 'call', name: b.getFieldValue('NAME'), id: b.id });
        break;
      case 'set_count':
        out.push({ type: 'setCount', value: Number(b.getFieldValue('VALUE')) || 0, id: b.id });
        break;
      case 'change_count':
        out.push({ type: 'changeCount', value: Number(b.getFieldValue('VALUE')) || 0, id: b.id });
        break;
      case 'repeat_count':
        out.push({ type: 'repeatCount', body: body('DO'), id: b.id });
        break;
      default:
        break;
    }
  }
  return out;
}

const storageKey = (levelId) => `kodo:code:${levelId}`;

function ensureStartBlock(workspace) {
  let start = workspace.getBlocksByType('when_run', false)[0];
  if (!start) {
    start = workspace.newBlock('when_run');
    start.initSvg();
    start.render();
    start.moveBy(28, 28);
  }
  return start;
}

export default function BlocklyEditor({ levelId, availableBlocks, maxBlocks, onChange, ref }) {
  const hostRef = useRef(null);
  const workspaceRef = useRef(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    if (!hostRef.current) return;
    defineBlocks();

    const small = window.innerWidth < 640;
    const workspace = Blockly.inject(hostRef.current, {
      toolbox: {
        kind: 'flyoutToolbox',
        contents: availableBlocks.map((type) => ({ kind: 'block', type })),
      },
      renderer: 'zelos',
      theme: getTheme(),
      media: '/blockly-media/',
      sounds: false,
      trashcan: true,
      // The start block counts towards Blockly's limit, so allow one extra.
      maxBlocks: maxBlocks ? maxBlocks + 1 : Infinity,
      move: { scrollbars: true, drag: true, wheel: true },
      zoom: { controls: true, wheel: false, startScale: small ? 0.72 : 0.85, maxScale: 1.6, minScale: 0.5, scaleSpeed: 1.15 },
      grid: { spacing: 28, length: 3, colour: '#e2ddcc', snap: false },
    });
    workspaceRef.current = workspace;

    // Restore this level's code, or start fresh with just the Go block.
    try {
      const saved = store.get(storageKey(levelId));
      if (saved) Blockly.serialization.workspaces.load(JSON.parse(saved), workspace);
    } catch {
      workspace.clear();
    }
    ensureStartBlock(workspace);

    // Blocks not attached to the Go block are greyed out and ignored.
    workspace.addChangeListener(Blockly.Events.disableOrphans);

    // Every enabled block counts, trick definitions included (loose blocks are disabled).
    const report = () => {
      const used = workspace.getAllBlocks(false).filter((b) => b.type !== 'when_run' && b.isEnabled()).length;
      onChangeRef.current?.(used);
    };
    report();

    workspace.addChangeListener((e) => {
      if (e.isUiEvent) return;
      if (e.type === Blockly.Events.BLOCK_MOVE && e.reason?.includes('connect')) sfx.snap();
      try {
        store.set(storageKey(levelId), JSON.stringify(Blockly.serialization.workspaces.save(workspace)));
      } catch {}
      report();
    });

    const observer = new ResizeObserver(() => Blockly.svgResize(workspace));
    observer.observe(hostRef.current);

    return () => {
      observer.disconnect();
      workspace.dispose();
      workspaceRef.current = null;
    };
    // The editor is rebuilt only when the level changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);

  useImperativeHandle(ref, () => ({
    getProgram() {
      const workspace = workspaceRef.current;
      if (!workspace) return [];
      const start = workspace.getBlocksByType('when_run', false)[0];
      const tricks = workspace
        .getBlocksByType('define_trick', false)
        .filter((b) => b.isEnabled())
        .map((b) => ({ type: 'define', name: b.getFieldValue('NAME'), body: stackToProgram(b.getInputTargetBlock('DO')), id: b.id }));
      return [...tricks, ...(start ? stackToProgram(start.getNextBlock()) : [])];
    },
    highlight(id) {
      workspaceRef.current?.highlightBlock(id || null);
    },
    clear() {
      const workspace = workspaceRef.current;
      if (!workspace) return;
      Blockly.Events.setGroup(true);
      workspace.getTopBlocks(false).forEach((b) => {
        if (b.type === 'when_run') b.getNextBlock()?.dispose(false);
        else b.dispose(false);
      });
      Blockly.Events.setGroup(false);
    },
  }));

  return <div ref={hostRef} className="absolute inset-0" />;
}
