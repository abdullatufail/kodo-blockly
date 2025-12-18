# Kodo - Learn Programming with Visual Blocks

An interactive block-based programming game built with Next.js, Blockly, and GSAP. Learn programming concepts through fun puzzles!

##  Features

- **4 Stages of Learning**: Simple → Loops → Conditions → Combined
- **20 Levels**: Progressive difficulty from basic movement to complex algorithms
- **Visual Block Programming**: Drag and drop blocks using Blockly
- **Animated Execution**: Watch your code come to life with GSAP animations
- **Progress Tracking**: Sign in with Supabase to save your progress and earn stars

##  Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account (for authentication and progress tracking)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd hciproject
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the schema from `supabase/schema.sql`
   - Get your project URL and anon key from Settings > API

4. Create `.env.local` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Game Stages

###  Stage 1: Getting Started
Learn basic movement commands - move forward, turn left/right.

###  Stage 2: Loop Master  
Use repeat loops to efficiently solve puzzles with patterns.

###  Stage 3: Smart Decisions
Learn conditionals - if path ahead, while loops, and repeat until goal.

###  Stage 4: Master Challenge
Combine all skills to solve complex programming challenges.

##  Available Blocks

| Block | Description | Stage Introduced |
|-------|-------------|------------------|
| Move Forward | Move one step forward | Stage 1 |
| Turn Right | Turn 90° clockwise | Stage 1 |
| Turn Left | Turn 90° counter-clockwise | Stage 1 |
| Repeat X times | Repeat blocks a set number of times | Stage 2 |
| If path ahead | Execute if path exists ahead | Stage 3 |
| If-else path | Execute different blocks based on path | Stage 3 |
| While path ahead | Repeat while path exists | Stage 3 |
| Repeat until goal | Repeat until reaching the goal | Stage 3 |

## 🛠️ Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS 4
- **Block Editor**: Blockly
- **Animations**: GSAP
- **Auth & Database**: Supabase
- **Language**: JavaScript/React

##  Project Structure

```
src/
├── app/
│   ├── page.js           # Landing page
│   ├── layout.js         # Root layout with AuthProvider
│   ├── levels/           # Levels selection page
│   └── level/[id]/       # Individual level page
├── components/
│   ├── BlocklyEditor.jsx # Blockly workspace
│   ├── GameBoard.jsx     # Game grid with animations
│   ├── GamePlay.jsx      # Main game component
│   ├── AuthModal.jsx     # Login/signup modal
│   ├── UserMenu.jsx      # User dropdown menu
│   └── LandingPage.jsx   # Home page component
├── context/
│   └── AuthContext.jsx   # Authentication context
├── data/
│   └── levels.js         # Level configurations
├── hooks/
│   └── useProgress.js    # Progress tracking hook
└── lib/
    └── supabase/         # Supabase client setup
```

##  Level Configuration

Each level includes:
- `id`: Unique identifier
- `stageId`: Which stage it belongs to
- `grid`: 2D array defining the maze
- `startPosition`: Starting coordinates
- `startDirection`: Initial facing direction
- `maxMoves`: Optimal move count for 3 stars
- `maxBlocks`: Block limit (optional)
- `availableBlocks`: Which blocks can be used
- `hints`: Help text for players

##  License

MIT

##  Contributing

Contributions welcome! Feel free to submit issues and pull requests.
