'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CELL_SIZE = 80; // Size in pixels for each grid cell

export default function GameBoard({
  grid,
  characterPos,
  direction,
  animationCommands = [],
  onAnimationComplete,
}) {
  const characterRef = useRef(null);
  const timelineRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // Helper functions - defined before useEffect
  const getRotation = (dir) => {
    switch (dir) {
      case 'NORTH':
        return 0;
      case 'EAST':
        return 90;
      case 'SOUTH':
        return 180;
      case 'WEST':
        return 270;
    }
  };

  const getNextPosition = (pos, dir) => {
    switch (dir) {
      case 'NORTH':
        return { x: pos.x, y: pos.y - 1 };
      case 'SOUTH':
        return { x: pos.x, y: pos.y + 1 };
      case 'EAST':
        return { x: pos.x + 1, y: pos.y };
      case 'WEST':
        return { x: pos.x - 1, y: pos.y };
    }
  };

  const isValidPosition = (pos) => {
    if (pos.x < 0 || pos.x >= grid[0].length || pos.y < 0 || pos.y >= grid.length) {
      return false;
    }
    return grid[pos.y][pos.x] !== 'OBSTACLE';
  };

  const turnRight = (dir) => {
    const directions = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
    const currentIndex = directions.indexOf(dir);
    return directions[(currentIndex + 1) % 4];
  };

  const turnLeft = (dir) => {
    const directions = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
    const currentIndex = directions.indexOf(dir);
    return directions[(currentIndex + 3) % 4];
  };

  const findGoalPosition = () => {
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === 'GOAL') {
          return { x, y };
        }
      }
    }
    return { x: 0, y: 0 };
  };

  // Pre-process commands to expand conditional and loop commands
  const preprocessCommands = (commands, startPos, startDir) => {
    const expandedCommands = [];
    let pos = { ...startPos };
    let dir = startDir;
    
    let i = 0;
    const maxIterations = 1000; // Safety limit
    let iterations = 0;
    
    while (i < commands.length && iterations < maxIterations) {
      iterations++;
      const command = commands[i];
      
      if (command === 'MOVE') {
        expandedCommands.push('MOVE');
        const nextPos = getNextPosition(pos, dir);
        if (isValidPosition(nextPos)) {
          pos = nextPos;
        }
        i++;
      } else if (command === 'RIGHT') {
        expandedCommands.push('RIGHT');
        dir = turnRight(dir);
        i++;
      } else if (command === 'LEFT') {
        expandedCommands.push('LEFT');
        dir = turnLeft(dir);
        i++;
      } else if (command === 'WHILE_PATH_START') {
        // Find the matching END
        const endIndex = findMatchingEnd(commands, i, 'WHILE_PATH_START', 'WHILE_PATH_END');
        const innerCommands = commands.slice(i + 1, endIndex);
        
        // Execute while path ahead
        let whileIterations = 0;
        while (hasPathAhead(pos, dir) && whileIterations < 100) {
          whileIterations++;
          const result = preprocessCommands(innerCommands, pos, dir);
          expandedCommands.push(...result.commands);
          pos = result.finalPos;
          dir = result.finalDir;
        }
        i = endIndex + 1;
      } else if (command === 'REPEAT_UNTIL_GOAL_START') {
        const endIndex = findMatchingEnd(commands, i, 'REPEAT_UNTIL_GOAL_START', 'REPEAT_UNTIL_GOAL_END');
        const innerCommands = commands.slice(i + 1, endIndex);
        const goalPos = findGoalPosition();
        
        let repeatIterations = 0;
        while ((pos.x !== goalPos.x || pos.y !== goalPos.y) && repeatIterations < 100) {
          repeatIterations++;
          const result = preprocessCommands(innerCommands, pos, dir);
          expandedCommands.push(...result.commands);
          pos = result.finalPos;
          dir = result.finalDir;
        }
        i = endIndex + 1;
      } else if (command === 'IF_ELSE_START') {
        const elseIndex = findNextCommand(commands, i, 'IF_ELSE_ELSE');
        const endIndex = findNextCommand(commands, i, 'IF_ELSE_END');
        
        const ifCommands = commands.slice(i + 1, elseIndex);
        const elseCommands = commands.slice(elseIndex + 1, endIndex);
        
        if (hasPathAhead(pos, dir)) {
          const result = preprocessCommands(ifCommands, pos, dir);
          expandedCommands.push(...result.commands);
          pos = result.finalPos;
          dir = result.finalDir;
        } else {
          const result = preprocessCommands(elseCommands, pos, dir);
          expandedCommands.push(...result.commands);
          pos = result.finalPos;
          dir = result.finalDir;
        }
        i = endIndex + 1;
      } else if (command === 'CHECK_PATH_AHEAD') {
        // Skip this marker
        i++;
      } else {
        i++;
      }
    }
    
    return { commands: expandedCommands, finalPos: pos, finalDir: dir };
  };

  const findMatchingEnd = (commands, startIndex, startMarker, endMarker) => {
    let depth = 0;
    for (let i = startIndex; i < commands.length; i++) {
      if (commands[i] === startMarker) depth++;
      if (commands[i] === endMarker) {
        depth--;
        if (depth === 0) return i;
      }
    }
    return commands.length;
  };

  const findNextCommand = (commands, startIndex, marker) => {
    for (let i = startIndex; i < commands.length; i++) {
      if (commands[i] === marker) return i;
    }
    return commands.length;
  };

  const hasPathAhead = (pos, dir) => {
    const nextPos = getNextPosition(pos, dir);
    return isValidPosition(nextPos);
  };

  // Execute animation commands
  useEffect(() => {
    if (animationCommands.length === 0 || isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    
    // Preprocess commands to handle conditionals and while loops
    const { commands: processedCommands } = preprocessCommands(
      animationCommands,
      characterPos,
      direction
    );
    
    const timeline = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
        const goalTile = findGoalPosition();
        const success = currentPos.x === goalTile.x && currentPos.y === goalTile.y;
        onAnimationComplete?.(success, currentPos);
      },
    });

    timelineRef.current = timeline;

    let currentPos = { ...characterPos };
    let currentDir = direction;

    processedCommands.forEach((command) => {
      if (command === 'MOVE') {
        const nextPos = getNextPosition(currentPos, currentDir);
        
        // Check if move is valid
        if (isValidPosition(nextPos)) {
          currentPos = nextPos;
          timeline.to(characterRef.current, {
            x: currentPos.x * CELL_SIZE,
            y: currentPos.y * CELL_SIZE,
            duration: 0.5,
            ease: 'power2.inOut',
          });
        } else {
          // Shake animation for invalid move
          timeline.to(characterRef.current, {
            x: '+=10',
            duration: 0.1,
            yoyo: true,
            repeat: 3,
            ease: 'power2.inOut',
          });
        }
      } else if (command === 'RIGHT') {
        currentDir = turnRight(currentDir);
        timeline.to(characterRef.current, {
          rotation: getRotation(currentDir),
          duration: 0.3,
          ease: 'power2.inOut',
        });
      } else if (command === 'LEFT') {
        currentDir = turnLeft(currentDir);
        timeline.to(characterRef.current, {
          rotation: getRotation(currentDir),
          duration: 0.3,
          ease: 'power2.inOut',
        });
      }
    });

    return () => {
      timeline.kill();
    };
  }, [animationCommands, characterPos, direction, onAnimationComplete]);

  const getTileColor = (tile) => {
    switch (tile) {
      case 'PATH':
        return 'bg-gray-200';
      case 'OBSTACLE':
        return 'bg-red-500';
      case 'GOAL':
        return 'bg-green-400';
      case 'START':
        return 'bg-gray-200';
    }
  };

  const getTileEmoji = (tile) => {
    switch (tile) {
      case 'GOAL':
        return <img src="/path.png" alt="Goal" className="w-full h-full object-cover" />;
      case 'OBSTACLE':
        return <img src="/obstacle.png" alt="Obstacle" className="w-full h-full object-cover" />;
      case 'PATH':
        return <img src="/goal.png" alt="Path" className="w-full h-full object-cover" />;
      case 'START':
        return <img src="/goal.png" alt="Start" className="w-full h-full object-cover" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <div
        className="inline-grid gap-1 p-4 bg-gray-100 rounded-lg relative border-3 border-black"
        style={{
          gridTemplateColumns: `repeat(${grid[0].length}, ${CELL_SIZE}px)`,
        }}
      >
        {/* Render grid tiles */}
        {grid.map((row, y) =>
          row.map((tile, x) => (
            <div
              key={`${x}-${y}`}
              className={`${getTileColor(tile)} border border-gray-400 rounded flex items-center justify-center text-3xl font-bold`}
              style={{
                width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`,
              }}
            >
              {getTileEmoji(tile)}
            </div>
          ))
        )}

        {/* Character */}
        <div
          ref={characterRef}
          className="absolute pointer-events-none"
          style={{
            width: `${CELL_SIZE - 10}px`,
            height: `${CELL_SIZE - 10}px`,
            left: `${CELL_SIZE * characterPos.x + 5}px`,
            top: `${CELL_SIZE * characterPos.y + 5}px`,
            transform: `rotate(${getRotation(direction)}deg)`,
          }}
        >
            <img 
            src="/character-svg.svg" 
            alt="Character" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
