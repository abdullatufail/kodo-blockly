'use client';

import { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';

export default function BlocklyEditor({ onCodeGenerated, availableBlocks, maxBlocks }) {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    if (!blocklyDiv.current) return;

    // Define custom blocks
    defineCustomBlocks();

    // Define custom code generator
    const javascriptGenerator = new Blockly.Generator('JavaScript');
    setupCustomGenerator(javascriptGenerator);

    // Initialize workspace
    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: getToolbox(availableBlocks),
      trashcan: true,
      scrollbars: true,
      maxBlocks: maxBlocks || Infinity,
      zoom: {
        controls: true,
        wheel: false,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true,
      },
    });

    workspaceRef.current = workspace;

    // Store generator on window for access
    window.customGenerator = javascriptGenerator;

    // Force resize after a short delay to ensure toolbox renders properly
    setTimeout(() => {
      Blockly.svgResize(workspace);
    }, 100);

    // Also resize on window resize
    const handleResize = () => {
      Blockly.svgResize(workspace);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      workspace.dispose();
    };
  }, [availableBlocks, maxBlocks]);

  const generateCode = () => {
    if (!workspaceRef.current) return;

    const generator = window.customGenerator;
    const code = generator.workspaceToCode(workspaceRef.current);

    // Execute the generated code to get commands
    const commands = [];
    try {
      // Create a sandboxed execution context
      const func = new Function('commands', code);
      func(commands);
      onCodeGenerated?.(commands);
    } catch (error) {
      console.error('Error executing generated code:', error);
      alert('Error in block code! Please check your blocks.');
    }
  };

  const resetWorkspace = () => {
    if (workspaceRef.current) {
      workspaceRef.current.clear();
    }
  };

  return (
    <div className="h-full w-full" style={{ minHeight: '500px' }}>
      <div className="flex gap-2 p-2 bg-gray-100 border-b-3 border-black">
        <button
          onClick={generateCode}
          className="px-4 py-2 border-3 border-black bg-green-500 text-black rounded hover:bg-green-600 font-semibold"
        >
          ▶ Run Code
        </button>
        <button
          onClick={resetWorkspace}
          className="px-4 py-2 border-3 border-black bg-red-500 text-black rounded hover:bg-red-600 font-semibold"
        >
          X Clear
        </button>
      </div>
      <div 
        ref={blocklyDiv} 
        style={{ 
          height: 'calc(100% - 52px)', 
          width: '100%',
          position: 'relative'
        }} 
      />
    </div>
  );
}

// Define custom blocks
function defineCustomBlocks() {
  // Move Forward Block
  Blockly.Blocks['move_forward'] = {
    init: function () {
      this.appendDummyInput().appendField('Move Forward');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip('Move the character forward one step');
      this.setHelpUrl('');
    },
  };

  // Turn Right Block
  Blockly.Blocks['turn_right'] = {
    init: function () {
      this.appendDummyInput().appendField('Turn Right ↻');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip('Turn the character 90 degrees to the right');
      this.setHelpUrl('');
    },
  };

  // Turn Left Block
  Blockly.Blocks['turn_left'] = {
    init: function () {
      this.appendDummyInput().appendField('Turn Left ↺');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip('Turn the character 90 degrees to the left');
      this.setHelpUrl('');
    },
  };

  // Repeat Loop Block
  Blockly.Blocks['repeat_times'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Repeat')
        .appendField(new Blockly.FieldNumber(3, 1, 10), 'TIMES')
        .appendField('times');
      this.appendStatementInput('DO').setCheck(null).appendField('do');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip('Repeat the contained blocks a specified number of times');
      this.setHelpUrl('');
    },
  };

  // If Path Ahead Block
  Blockly.Blocks['if_path_ahead'] = {
    init: function () {
      this.appendDummyInput().appendField('If path ahead');
      this.appendStatementInput('DO').setCheck(null).appendField('do');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
      this.setTooltip('Execute blocks if there is a path ahead');
      this.setHelpUrl('');
    },
  };

  // If-Else Path Block
  Blockly.Blocks['if_else_path'] = {
    init: function () {
      this.appendDummyInput().appendField('If path ahead');
      this.appendStatementInput('DO').setCheck(null).appendField('do');
      this.appendDummyInput().appendField('else');
      this.appendStatementInput('ELSE').setCheck(null).appendField('do');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
      this.setTooltip('Execute different blocks based on whether path is ahead');
      this.setHelpUrl('');
    },
  };

  // While Path Ahead Block
  Blockly.Blocks['while_path'] = {
    init: function () {
      this.appendDummyInput().appendField('While path ahead');
      this.appendStatementInput('DO').setCheck(null).appendField('do');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip('Repeat while there is a path ahead');
      this.setHelpUrl('');
    },
  };

  // Repeat Until Goal Block
  Blockly.Blocks['repeat_until_goal'] = {
    init: function () {
      this.appendDummyInput().appendField('Repeat until goal');
      this.appendStatementInput('DO').setCheck(null).appendField('do');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(65);
      this.setTooltip('Repeat until the character reaches the goal');
      this.setHelpUrl('');
    },
  };
}

// Setup custom code generator
function setupCustomGenerator(generator) {
  generator.forBlock['move_forward'] = function (block, generator) {
    return "commands.push('MOVE');\n";
  };

  generator.forBlock['turn_right'] = function (block, generator) {
    return "commands.push('RIGHT');\n";
  };

  generator.forBlock['turn_left'] = function (block, generator) {
    return "commands.push('LEFT');\n";
  };

  generator.forBlock['repeat_times'] = function (block, generator) {
    const times = block.getFieldValue('TIMES');
    const branch = generator.statementToCode(block, 'DO');
    let code = `for (let i = 0; i < ${times}; i++) {\n${branch}}\n`;
    return code;
  };

  generator.forBlock['if_path_ahead'] = function (block, generator) {
    const branch = generator.statementToCode(block, 'DO');
    return `commands.push('CHECK_PATH_AHEAD');\nif (commands[commands.length-1] !== 'BLOCKED') {\ncommands.pop();\n${branch}}\n`;
  };

  generator.forBlock['if_else_path'] = function (block, generator) {
    const doCode = generator.statementToCode(block, 'DO');
    const elseCode = generator.statementToCode(block, 'ELSE');
    return `commands.push('IF_ELSE_START');\n${doCode}commands.push('IF_ELSE_ELSE');\n${elseCode}commands.push('IF_ELSE_END');\n`;
  };

  generator.forBlock['while_path'] = function (block, generator) {
    const branch = generator.statementToCode(block, 'DO');
    return `commands.push('WHILE_PATH_START');\n${branch}commands.push('WHILE_PATH_END');\n`;
  };

  generator.forBlock['repeat_until_goal'] = function (block, generator) {
    const branch = generator.statementToCode(block, 'DO');
    return `commands.push('REPEAT_UNTIL_GOAL_START');\n${branch}commands.push('REPEAT_UNTIL_GOAL_END');\n`;
  };

  // Handle sequences
  generator.scrub_ = function (block, code, thisOnly) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    if (nextBlock && !thisOnly) {
      return code + generator.blockToCode(nextBlock);
    }
    return code;
  };
}

// Define toolbox based on available blocks
function getToolbox(availableBlocks) {
  // Default to all blocks if not specified
  const blocks = availableBlocks || [
    'move_forward', 'turn_right', 'turn_left', 'repeat_times',
    'if_path_ahead', 'if_else_path', 'while_path', 'repeat_until_goal'
  ];

  const categories = [];

  // Movement category
  const movementBlocks = [];
  if (blocks.includes('move_forward')) {
    movementBlocks.push({ kind: 'block', type: 'move_forward' });
  }
  if (movementBlocks.length > 0) {
    categories.push({
      kind: 'category',
      name: 'Movement',
      colour: 160,
      contents: movementBlocks,
    });
  }

  // Rotation category
  const rotationBlocks = [];
  if (blocks.includes('turn_right')) {
    rotationBlocks.push({ kind: 'block', type: 'turn_right' });
  }
  if (blocks.includes('turn_left')) {
    rotationBlocks.push({ kind: 'block', type: 'turn_left' });
  }
  if (rotationBlocks.length > 0) {
    categories.push({
      kind: 'category',
      name: 'Rotation',
      colour: 230,
      contents: rotationBlocks,
    });
  }

  // Loops category
  const loopBlocks = [];
  if (blocks.includes('repeat_times')) {
    loopBlocks.push({ kind: 'block', type: 'repeat_times' });
  }
  if (blocks.includes('while_path')) {
    loopBlocks.push({ kind: 'block', type: 'while_path' });
  }
  if (blocks.includes('repeat_until_goal')) {
    loopBlocks.push({ kind: 'block', type: 'repeat_until_goal' });
  }
  if (loopBlocks.length > 0) {
    categories.push({
      kind: 'category',
      name: 'Loops',
      colour: 120,
      contents: loopBlocks,
    });
  }

  // Conditionals category
  const conditionalBlocks = [];
  if (blocks.includes('if_path_ahead')) {
    conditionalBlocks.push({ kind: 'block', type: 'if_path_ahead' });
  }
  if (blocks.includes('if_else_path')) {
    conditionalBlocks.push({ kind: 'block', type: 'if_else_path' });
  }
  if (conditionalBlocks.length > 0) {
    categories.push({
      kind: 'category',
      name: 'Conditions',
      colour: 210,
      contents: conditionalBlocks,
    });
  }

  return {
    kind: 'categoryToolbox',
    contents: categories,
  };
}
