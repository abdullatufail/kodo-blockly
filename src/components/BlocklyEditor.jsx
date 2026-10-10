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
};

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

    const report = () => {
      const start = workspace.getBlocksByType('when_run', false)[0];
      const used = start ? start.getDescendants(false).filter((b) => b.isEnabled()).length - 1 : 0;
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
      return start ? stackToProgram(start.getNextBlock()) : [];
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
