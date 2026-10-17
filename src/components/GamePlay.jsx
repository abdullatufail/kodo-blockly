'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import GameBoard from '@/components/GameBoard';
import BlocklyEditor from '@/components/BlocklyEditor';
import LevelCompleteModal from '@/components/LevelCompleteModal';
import HowToPlay from '@/components/game/HowToPlay';
import NewBlockIntro from '@/components/game/NewBlockIntro';
import { Buddy, CREW } from '@/components/brand/Crew';
import { Star } from '@/components/brand/Stickers';
import { AccessibilityToggles } from '@/components/AccessibilityDock';
import {
  ArrowLeftIcon, BulbIcon, CheckIcon, PlayIcon, RabbitIcon, ResetIcon, SlidersIcon, SnailIcon, StopIcon, TrashIcon,
} from '@/components/ui/Icons';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/context/AuthContext';
import { useAccessibility } from '@/context/AccessibilityContext';
import { getLevelById, getNextLevelInStage, getStageById, getLevelsByStage } from '@/data/levels';
import { countBlocks, runProgram, scoreRun } from '@/lib/game/engine';
import { sfx } from '@/lib/sfx';
import { store } from '@/lib/storage';

const SPEEDS = [
  { id: 'slow', label: 'Slow', value: 0.6, Icon: SnailIcon },
  { id: 'normal', label: 'Normal', value: 1, Icon: PlayIcon },
  { id: 'fast', label: 'Fast', value: 2.2, Icon: RabbitIcon },
];

const BLOCK_NAMES = {
  move_forward: 'move forward',
  turn_right: 'turn right',
  turn_left: 'turn left',
  repeat_times: 'repeat',
  if_path_ahead: 'if path',
  if_else_path: 'if path… else',
  while_path: 'while path',
  repeat_until_goal: 'repeat until home',
  define_trick: 'to do trick',
  call_trick: 'do trick',
  if_berry: 'if berry',
  set_count: 'set count',
  change_count: 'change count',
  repeat_count: 'repeat count times',
};

// Who says what: Kodo tells the story, Zip helps when something goes wrong,
// Bloo spots patterns and Sunny cheers.
const FEEDBACK = {
  empty: { who: 'zip', mood: 'wow', text: 'Psst! Snap some blocks under the pink "when Go is pressed" block, then press Go!' },
  running: { who: 'kodo', mood: 'happy', text: 'Here I go! Watch the glowing block to see which step I\'m on.' },
  bump: { who: 'zip', mood: 'wink', text: 'Bonk! Kodo bumped into something. The glowing block is where it happened. Maybe a turn before it?' },
  lost: { who: 'zip', mood: 'wink', text: 'Kodo ran out of blocks before getting home. What should it do next?' },
  tooLong: { who: 'zip', mood: 'wow', text: 'Whoa, Kodo got dizzy! That loop kept going and going. Does it ever stop?' },
};

const LOOP_BLOCKS = ['repeat_times', 'while_path', 'repeat_until_goal', 'repeat_count'];
const sameStep = (a, b) => a && b && (a.type === 'move' || a.type === 'turn') && a.type === b.type && a.dir === b.dir;

// Bloo's eye for patterns: three of the same step in a row, or a little run of
// steps done twice back to back (move, turn, move, turn).
function spotsRepeat(list) {
  for (let i = 0; i < list.length; i++) {
    if (sameStep(list[i], list[i + 1]) && sameStep(list[i], list[i + 2])) return true;
    for (let k = 2; k <= 4; k++) {
      let same = i + 2 * k <= list.length;
      for (let j = 0; same && j < k; j++) same = sameStep(list[i + j], list[i + j + k]);
      if (same) return true;
    }
  }
  return list.some((b) => (b.body && spotsRepeat(b.body)) || (b.elseBody && spotsRepeat(b.elseBody)));
}

export default function GamePlay({ level }) {
  const boardRef = useRef(null);
  const editorRef = useRef(null);
  const runIdRef = useRef(0);

  const [status, setStatus] = useState('idle'); // idle | running | done
  const [coach, setCoach] = useState({ who: 'kodo', mood: 'happy', text: level.story });
  const [showIntro, setShowIntro] = useState(false);
  const blooSpokeRef = useRef(false);
  const [blocksUsed, setBlocksUsed] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(1);
  const [hintIndex, setHintIndex] = useState(-1);
  const [lastMissions, setLastMissions] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [count, setCount] = useState(null);

  const { user } = useAuth();
  const { saveProgress, getLevelProgress } = useProgress();
  const { speak, ttsEnabled, stopSpeaking } = useAccessibility();

  const stage = getStageById(level.stageId);
  const stageLevels = getLevelsByStage(level.stageId);
  const levelNumberInStage = stageLevels.findIndex((l) => l.id === level.id) + 1;
  const nextLevel = getNextLevelInStage(level.id);
  const saved = getLevelProgress(level.id);
  const speed = SPEEDS[speedIndex];
  const atLimit = level.maxBlocks && blocksUsed >= level.maxBlocks;
  const usesCount = level.availableBlocks.includes('set_count');
  const refreshers = (level.refresher || []).map(getLevelById).filter(Boolean);

  const say = useCallback(
    (message) => {
      setCoach(message);
      if (ttsEnabled) speak(message.text);
    },
    [speak, ttsEnabled]
  );

  // First visit to level 1: explain how to play. Read storage after mount to avoid hydration mismatches.
  useEffect(() => {
    if (level.id !== 1) return;
    try {
      if (!store.get('kodo:seen-howto')) queueMicrotask(() => setShowHowTo(true));
    } catch {}
  }, [level.id]);

  // A level with new blocks opens with Sunny showing them off (after the how-to on level 1).
  useEffect(() => {
    if (!level.newBlocks || showHowTo) return;
    try {
      if (level.id === 1 && !store.get('kodo:seen-howto')) return;
      if (!store.get(`kodo:seen-intro:${level.id}`)) queueMicrotask(() => setShowIntro(true));
    } catch {}
  }, [level.id, level.newBlocks, showHowTo]);

  const closeIntro = useCallback(() => {
    setShowIntro(false);
    try {
      store.set(`kodo:seen-intro:${level.id}`, 'true');
    } catch {}
  }, [level.id]);

  useEffect(() => () => stopSpeaking(), [level.id, stopSpeaking]);

  const stop = () => {
    runIdRef.current += 1;
    boardRef.current?.reset();
    editorRef.current?.highlight(null);
    setCount(null);
    setStatus('idle');
  };

  const reset = () => {
    stop();
    setLastMissions(null);
    say({ who: 'kodo', mood: 'happy', text: level.story });
  };

  const run = async () => {
    if (status === 'running') {
      stop();
      say({ who: 'kodo', mood: 'happy', text: 'Stopped! Change your blocks and press Go again.' });
      return;
    }

    const program = editorRef.current?.getProgram() || [];
    // Tricks on their own do nothing: something under the Go block has to use them.
    if (!program.some((node) => node.type !== 'define')) {
      sfx.sad();
      say(FEEDBACK.empty);
      return;
    }

    const runId = ++runIdRef.current;
    const result = runProgram(level, program);
    const used = countBlocks(program);

    setStatus('running');
    setLastMissions(null);
    setCount(usesCount ? 0 : null);
    say(FEEDBACK.running);

    await boardRef.current.play(result.frames, {
      speed: speed.value,
      onFrame: (frame) => {
        editorRef.current?.highlight(frame.id);
        if (frame.count !== undefined) setCount(frame.count);
      },
    });
    if (runId !== runIdRef.current) return; // stopped or reset while running

    setStatus('done');
    const score = scoreRun(level, result, used);
    setLastMissions(score.missions);

    if (result.outcome === 'win') {
      editorRef.current?.highlight(null);
      boardRef.current.celebrate();
      sfx.win();
      const missing = [];
      if (!score.missions.berries) missing.push(`grab every berry`);
      if (!score.missions.blocks) missing.push(`use ${level.parBlocks} blocks or fewer`);
      const loopy = !score.missions.blocks && level.availableBlocks.some((b) => LOOP_BLOCKS.includes(b)) && spotsRepeat(program);
      say(
        loopy
          ? { who: 'bloo', mood: 'wink', text: 'Home! I spotted some steps that repeat. A loop could squish them into fewer blocks for more stars.' }
          : {
              who: 'sunny',
              mood: 'cheer',
              text: missing.length ? `Kodo is home, woohoo! For more stars, try to ${missing.join(' and ')}.` : 'Home sweet home! A perfect solution!',
            }
      );
      const isNewBest = !saved || score.stars > (saved.stars || 0);
      saveProgress(level.id, score.stars, result.steps);
      setTimeout(() => {
        if (runId === runIdRef.current) setCompletion({ ...score, isNewBest, blocks: used, steps: result.steps });
      }, 1100);
    } else {
      // Leave the block that caused a bump glowing so kids can see where it went wrong.
      if (result.outcome !== 'bump') editorRef.current?.highlight(null);
      if (result.outcome !== 'bump') sfx.sad();
      say(FEEDBACK[result.outcome]);
    }
  };

  const showHint = () => {
    const next = (hintIndex + 1) % level.hints.length;
    setHintIndex(next);
    const last = next === level.hints.length - 1 && refreshers.length > 0;
    say({
      who: 'zip',
      mood: 'wink',
      text: `Hint ${next + 1} of ${level.hints.length}: ${level.hints[next]}${last ? ' Still stuck? The levels below build up this exact idea.' : ''}`,
    });
  };

  // Bloo pipes up (once a level) when the code has steps a loop could replace.
  const onBlocksChange = (count) => {
    setBlocksUsed(count);
    if (blooSpokeRef.current || status === 'running' || !level.availableBlocks.some((b) => LOOP_BLOCKS.includes(b))) return;
    const program = editorRef.current?.getProgram() || [];
    if (!spotsRepeat(program)) return;
    blooSpokeRef.current = true;
    say({ who: 'bloo', mood: 'happy', text: 'Ooh, I see the same steps over and over! A loop block could do them all at once.' });
  };

  const changeSpeed = () => {
    const next = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(next);
    boardRef.current?.setSpeed(SPEEDS[next].value);
  };

  const closeHowTo = useCallback(() => {
    setShowHowTo(false);
    try {
      store.set('kodo:seen-howto', 'true');
    } catch {}
  }, []);

  const missions = [
    { id: 'home', label: 'Get Kodo home' },
    { id: 'berries', label: `Grab ${level.berries.length === 1 ? 'the berry' : `all ${level.berries.length} berries`}` },
    { id: 'blocks', label: `Use ${level.parBlocks} blocks or fewer` },
  ];

  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh">
      {/* ── HUD ─────────────────────────────────────────── */}
      <header className="flex items-center gap-2 px-3 pt-3 sm:gap-3 sm:px-5">
        <Link
          href="/levels"
          className="btn-chunky flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-paper px-3 font-display font-semibold sm:px-4"
          aria-label="Back to the map"
        >
          <ArrowLeftIcon />
          <span className="hidden sm:inline">Map</span>
        </Link>

        <div className="card-sticker flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-3 py-1.5">
          <span
            className="hidden shrink-0 rounded-xl px-2.5 py-1 font-display text-sm font-semibold text-onfill sm:inline-block"
            style={{ backgroundColor: stage.color }}
          >
            {stage.name} · {levelNumberInStage}/{stageLevels.length}
          </span>
          <h1 className="min-w-0 truncate text-lg font-bold sm:text-xl">
            <span className="text-ink-soft">Level {level.id}:</span> {level.title}
          </h1>
          <div className="ml-auto hidden shrink-0 items-center gap-0.5 md:flex" aria-label={`Best: ${saved?.stars || 0} of 3 stars`}>
            {[1, 2, 3].map((i) => (
              <Star key={i} className="h-7 w-7" fill={i <= (saved?.stars || 0) ? 'var(--color-ink)' : 'var(--color-line)'} />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowHowTo(true)}
          className="btn-chunky flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-paper font-display text-xl font-bold"
          aria-label="How to play"
          title="How to play"
        >
          ?
        </button>
        <div className="hidden items-center gap-2 lg:flex">
          <AccessibilityToggles compact />
        </div>
        <div className="relative lg:hidden">
          <button
            type="button"
            onClick={() => setShowSettings((v) => !v)}
            aria-expanded={showSettings}
            aria-label="Settings"
            className="btn-chunky flex h-12 w-12 items-center justify-center rounded-2xl bg-grape text-onfill"
          >
            <SlidersIcon />
          </button>
          {showSettings && (
            <div className="card-sticker absolute right-0 top-14 z-50 flex flex-col gap-2 rounded-3xl p-3">
              <AccessibilityToggles />
            </div>
          )}
        </div>
      </header>

      <main className="grid min-h-0 flex-1 gap-4 p-3 sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* ── Board side ────────────────────────────────── */}
        <section className="card-sticker flex min-h-0 flex-col gap-3 rounded-[28px] p-3 sm:p-4" aria-label="Puzzle board">
          <div className="flex items-start gap-3" aria-live="polite">
            <span key={coach.who} className="buddy-pop shrink-0">
              <Buddy who={coach.who} className="h-16 w-16 animate-bob" mood={coach.mood} look={coach.who === 'kodo' ? 'EAST' : 'center'} title="" aria-hidden="true" />
            </span>
            <p className="relative flex-1 rounded-2xl bg-cream px-4 py-2.5 font-semibold leading-snug before:absolute before:-left-[7px] before:top-6 before:h-4 before:w-4 before:rotate-45 before:rounded-[3px] before:bg-cream">
              <span className="block font-display text-sm leading-tight" style={{ color: `color-mix(in oklab, ${CREW[coach.who].color} 45%, var(--color-ink))` }}>
                {CREW[coach.who].name}
              </span>
              {coach.text}
            </p>
          </div>

          {refreshers.length > 0 && hintIndex >= 0 && (
            <div className="buddy-pop flex flex-wrap items-center gap-2 rounded-2xl bg-grape-soft px-3 py-2 text-sm font-bold">
              <span className="text-ink-soft">Stuck? Practise it first:</span>
              {refreshers.map((l) => (
                <Link key={l.id} href={`/level/${l.id}`} className="btn-chunky rounded-full bg-paper px-3 py-1 font-display font-semibold">
                  {l.id}. {l.title}
                </Link>
              ))}
            </div>
          )}

          <ul className="flex flex-wrap gap-2" aria-label="Missions">
            {missions.map(({ id, label }, i) => {
              const done = lastMissions?.[id];
              const failed = lastMissions && !done;
              return (
                <li
                  key={id}
                  className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-3.5 text-sm font-bold transition-colors ${
                    done ? 'bg-leaf-soft' : failed ? 'bg-berry-soft text-ink-soft' : 'bg-cream'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-display text-xs transition-colors ${
                      done ? 'bg-leaf-deep text-paper' : 'bg-ink/10'
                    }`}
                  >
                    {done ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  {label}
                </li>
              );
            })}
          </ul>

          <div className="relative min-h-[260px] flex-1 sm:min-h-[320px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <GameBoard ref={boardRef} level={level} scenery={stage.scenery} />
            </div>
            {usesCount && (
              <span
                className="absolute left-2 top-2 flex items-center gap-1.5 rounded-xl bg-sand px-2.5 py-1 font-display text-lg"
                aria-live="polite"
                title="What the counter says right now"
              >
                count <span className="min-w-[1.5ch] rounded-lg bg-paper px-1.5 text-center">{count ?? '–'}</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={run}
              data-no-burst
              className={`btn-chunky flex flex-1 items-center justify-center gap-2 rounded-[20px] py-3.5 font-display text-2xl font-bold text-onfill ${
                status === 'running' ? 'bg-berry' : 'bg-leaf'
              }`}
            >
              {status === 'running' ? <StopIcon className="h-7 w-7" /> : <PlayIcon className="h-7 w-7" />}
              {status === 'running' ? 'Stop' : 'Go!'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="btn-chunky flex h-[60px] items-center gap-2 rounded-[20px] bg-paper px-4 font-display font-semibold"
              aria-label="Put Kodo back at the start"
            >
              <ResetIcon className="h-6 w-6" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              type="button"
              onClick={changeSpeed}
              className="btn-chunky flex h-[60px] items-center gap-2 rounded-[20px] bg-sky px-4 font-display font-semibold text-onfill"
              aria-label={`Speed: ${speed.label}. Click to change.`}
            >
              <speed.Icon className="h-6 w-6" />
              <span className="hidden sm:inline">{speed.label}</span>
            </button>
          </div>
        </section>

        {/* ── Code side ─────────────────────────────────── */}
        <section className="card-sticker flex min-h-[480px] flex-col overflow-hidden rounded-[28px] lg:min-h-0" aria-label="Code editor">
          <div className="flex items-center gap-2 bg-sun-soft px-3 py-2.5 sm:px-4">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <h2 className="shrink-0 text-xl font-bold">Your code</h2>
              {level.newBlocks && (
                <button
                  type="button"
                  onClick={() => setShowIntro(true)}
                  className="btn-chunky flex min-w-0 items-center gap-1 rounded-lg bg-berry py-0.5 pl-1 pr-2 font-display text-xs font-semibold text-onfill"
                  title={`See what the new block${level.newBlocks.length > 1 ? 's do' : ' does'}`}
                >
                  <Buddy who="sunny" mood="cheer" shadow={false} title="" className="h-5 w-5 shrink-0" />
                  <span className="truncate">New: {level.newBlocks.map((b) => BLOCK_NAMES[b]).join(' & ')}</span>
                </button>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={`rounded-xl px-2.5 py-1 font-display text-sm font-semibold ${atLimit ? 'bg-berry text-onfill' : 'bg-paper'}`}
                title={level.maxBlocks ? `This level allows ${level.maxBlocks} blocks` : undefined}
              >
                {blocksUsed}
                {level.maxBlocks ? `/${level.maxBlocks}` : ''} <span className="hidden sm:inline">{blocksUsed === 1 ? 'block' : 'blocks'}</span>
              </span>
              <button
                type="button"
                onClick={showHint}
                className="btn-chunky flex h-10 items-center gap-1.5 rounded-xl bg-sun px-3 font-display text-sm font-semibold text-onfill"
              >
                <BulbIcon />
                <span className="hidden sm:inline">Hint</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  stop();
                  editorRef.current?.clear();
                }}
                className="btn-chunky flex h-10 w-10 items-center justify-center rounded-xl bg-cream"
                aria-label="Remove all blocks"
                title="Remove all blocks"
              >
                <TrashIcon />
              </button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1">
            <BlocklyEditor
              ref={editorRef}
              levelId={level.id}
              availableBlocks={level.availableBlocks}
              maxBlocks={level.maxBlocks}
              onChange={onBlocksChange}
            />
            {status === 'running' && (
              <div className="absolute inset-0 z-10 cursor-not-allowed" title="Press Stop to change your code">
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-xl bg-paper px-3 py-1 font-display text-sm font-semibold">
                  Kodo is walking… press Stop to edit
                </span>
              </div>
            )}
          </div>
        </section>
      </main>

      <LevelCompleteModal
        isOpen={!!completion}
        onClose={() => setCompletion(null)}
        level={level}
        result={completion}
        isLoggedIn={!!user}
        nextLevelId={nextLevel?.id}
        onReplay={() => {
          setCompletion(null);
          reset();
        }}
      />

      {showHowTo && <HowToPlay onClose={closeHowTo} />}
      {showIntro && !showHowTo && <NewBlockIntro blocks={level.newBlocks} onClose={closeIntro} />}

    </div>
  );
}
