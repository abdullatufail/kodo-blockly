'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAccessibility } from "@/context/AccessibilityContext";
import { stages, getLevelsByStage } from "@/data/levels";

export default function ProgramPage() {
  const { highContrast, toggleHighContrast, ttsEnabled, toggleTts, speak } = useAccessibility();
  const [activeTab, setActiveTab] = useState('curriculum');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Refs for animations
  const heroRef = useRef(null);
  const tabsRef = useRef([]);
  const contentRef = useRef(null);

  useEffect(() => {
    // Hero animation
    gsap.fromTo(heroRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    // Tabs animation
    gsap.fromTo(tabsRef.current,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        stagger: 0.1, 
        ease: "back.out(1.7)",
        delay: 0.3 
      }
    );
  }, []);

  // Animate content change
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [activeTab]);

  const tabs = [
    { 
      id: 'curriculum', 
      label: 'Curriculum', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      )
    },
    { 
      id: 'setup', 
      label: 'Self-Host Guide', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
        </svg>
      )
    },
    { 
      id: 'tech', 
      label: 'Tech Stack', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
    },
    { 
      id: 'contribute', 
      label: 'Contribute', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      )
    },
  ];

  const stageColors = {
    simple: 'bg-[#4ADE80]',
    loops: 'bg-[#A78BFA]',
    conditions: 'bg-[#F472B6]',
    combined: 'bg-[#FACC15]',
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Accessibility Controls */}
      <div className="fixed bottom-4 right-4 z-100 flex gap-2">
        <button
          onClick={toggleHighContrast}
          className={`accessibility-toggle px-3 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg ${
            highContrast 
              ? 'bg-yellow-400 text-black border-2 border-black' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Toggle High Contrast Mode"
          aria-label="Toggle high contrast mode"
        >
          <span className="text-lg">👁️</span>
          <span className="hidden sm:inline">{highContrast ? 'Normal' : 'High Contrast'}</span>
        </button>

        <button
          onClick={toggleTts}
          className={`accessibility-toggle px-3 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg ${
            ttsEnabled 
              ? 'bg-green-400 text-black border-2 border-black' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Toggle Text-to-Speech"
          aria-label="Toggle text to speech"
        >
          <span className="text-lg">🔊</span>
          <span className="hidden sm:inline">{ttsEnabled ? 'TTS On' : 'TTS Off'}</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className='flex w-full justify-between items-center mt-4 px-4 md:px-10 py-2 mx-auto max-w-7xl bg-white/90 border-3 border-black rounded-full relative z-90'>
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900">Kodo</h1>
        </Link>
        
        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center gap-x-1'>
          <Link href="/levels" className="px-4 py-2 bg-gray-100 rounded-full font-medium text-gray-700 hover:bg-gray-200 transition-colors border-3 border-black text-sm">
            Academy
          </Link>
          <Link href="/about" className="px-4 py-2 rounded-full font-medium text-gray-600 hover:bg-gray-100 transition-colors border-3 border-black text-sm">
            About Us
          </Link>
          <Link href="/program" className="px-4 py-2 bg-[#4ADE80] rounded-full font-medium text-gray-700 transition-colors border-3 border-black text-sm">
            Program
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg border-3 border-black bg-white hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 bg-white border-3 border-black rounded-3xl p-4 z-80 shadow-xl mx-auto max-w-md">
          <div className="flex flex-col gap-2">
            <Link
              href="/levels"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-gray-100 rounded-full font-medium text-gray-700 hover:bg-gray-200 transition-colors border-2 border-black text-sm"
            >
              Academy
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-full font-medium text-gray-600 hover:bg-gray-100 transition-colors border-2 border-black text-sm"
            >
              About Us
            </Link>
            <Link
              href="/program"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-[#4ADE80] rounded-full font-medium text-gray-700 transition-colors border-2 border-black text-sm"
            >
              Program
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div ref={heroRef} className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-[#FACC15]/20 rounded-full text-sm font-medium text-[#854D0E] mb-4 border-2 border-[#FACC15]">
            Program Overview
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn, Build, <span className="font-accent text-[#A78BFA]">Contribute</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive curriculum, self-host Kodo for your own program, 
            or contribute to making coding education accessible for everyone.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={el => tabsRef.current[index] = el}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full font-medium text-sm flex items-center gap-2 border-3 border-black transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-[#4ADE80] scale-105' 
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              <span className="text-gray-900">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div ref={contentRef} className="min-h-[600px]">
          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <div className="space-y-8">
              <div className="bg-[#E8E4F0] rounded-3xl p-8 border-3 border-black">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Structured Learning Path
                </h2>
                <p className="text-gray-600 mb-8 max-w-3xl">
                  Our curriculum is designed to progressively build programming concepts, 
                  from simple movements to complex algorithmic thinking. Each stage 
                  introduces new concepts while reinforcing previous learning.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {stages.map((stage, index) => {
                    const stageLevels = getLevelsByStage(stage.id);
                    const bgColor = stageColors[stage.id];
                    
                    return (
                      <div 
                        key={stage.id}
                        className={`${bgColor} rounded-2xl p-6 border-3 border-black`}
                        onClick={() => ttsEnabled && speak(`Stage ${index + 1}: ${stage.name}. ${stage.description}. Contains ${stageLevels.length} levels.`)}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl border-2 border-black">
                            {stage.icon}
                          </span>
                          <div>
                            <span className="text-xs font-medium text-gray-700">Stage {index + 1}</span>
                            <h3 className="font-bold text-xl text-gray-900">{stage.name}</h3>
                          </div>
                        </div>
                        <p className="text-gray-800 mb-4">{stage.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {stageLevels.length} Levels
                          </span>
                          <div className="flex gap-1">
                            {stageLevels.slice(0, 5).map((_, i) => (
                              <div key={i} className="w-2 h-2 bg-white/60 rounded-full"></div>
                            ))}
                            {stageLevels.length > 5 && (
                              <span className="text-xs text-gray-700">+{stageLevels.length - 5}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Learning Concepts */}
                <div className="mt-8 grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-5 border-2 border-black">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Sequential Logic
                    </h4>
                    <p className="text-sm text-gray-600">Learn to break down problems into step-by-step instructions.</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 border-2 border-black">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                      </svg>
                      Loops & Iteration
                    </h4>
                    <p className="text-sm text-gray-600">Master repeating patterns efficiently with loops.</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 border-2 border-black">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                      </svg>
                      Conditional Logic
                    </h4>
                    <p className="text-sm text-gray-600">Make decisions based on conditions and paths.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Setup Tab */}
          {activeTab === 'setup' && (
            <div className="space-y-8">
              <div className="bg-linear-to-br from-[#A78BFA] to-[#8B5CF6] rounded-3xl p-8 border-3 border-black text-white">
                <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                  </svg>
                  Self-Host Kodo for Your Organization
                </h2>
                <p className="text-white/90 mb-6 max-w-3xl">
                  Kodo is open source and free to use! Deploy your own instance for your 
                  school, coding club, or educational program. Follow these steps to get started.
                </p>
              </div>

              {/* Prerequisites */}
              <div className="bg-white rounded-2xl p-6 border-3 border-black">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#FACC15] rounded-full flex items-center justify-center text-sm">1</span>
                  Prerequisites
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                    <h4 className="font-bold text-gray-900">Node.js</h4>
                    <p className="text-sm text-gray-600">Version 18.x or higher</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                    <h4 className="font-bold text-gray-900">Git</h4>
                    <p className="text-sm text-gray-600">For cloning the repository</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                    <h4 className="font-bold text-gray-900">Supabase (Optional)</h4>
                    <p className="text-sm text-gray-600">For user auth & progress saving</p>
                  </div>
                </div>
              </div>

              {/* Installation Steps */}
              <div className="bg-white rounded-2xl p-6 border-3 border-black">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#4ADE80] rounded-full flex items-center justify-center text-sm">2</span>
                  Installation
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
                    <p className="text-gray-500"># Clone the repository</p>
                    <p>git clone https://github.com/abdullatufail/kodo-blockly.git</p>
                    <p className="mt-2 text-gray-500"># Navigate to the project</p>
                    <p>cd kodo-blockly</p>
                    <p className="mt-2 text-gray-500"># Install dependencies</p>
                    <p>npm install</p>
                  </div>
                  {/* GitHub Link */}
                  <a 
                    href="https://github.com/abdullatufail/kodo-blockly" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors border-2 border-black"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View on GitHub
                  </a>
                </div>
              </div>

              {/* Environment Setup */}
              <div className="bg-white rounded-2xl p-6 border-3 border-black">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#F472B6] rounded-full flex items-center justify-center text-sm">3</span>
                  Environment Configuration
                </h3>
                <p className="text-gray-600 mb-4">
                  Create a <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file in the root directory:
                </p>
                <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
                  <p className="text-gray-500"># Supabase Configuration (optional)</p>
                  <p>NEXT_PUBLIC_SUPABASE_URL=your_supabase_url</p>
                  <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key</p>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Note: The app works without Supabase, but user authentication and progress saving will be disabled.
                </p>
              </div>

              {/* Run the App */}
              <div className="bg-white rounded-2xl p-6 border-3 border-black">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#A78BFA] rounded-full flex items-center justify-center text-sm">4</span>
                  Run the Application
                </h3>
                <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
                  <p className="text-gray-500"># Start development server</p>
                  <p>npm run dev</p>
                  <p className="mt-2 text-gray-500"># Or build for production</p>
                  <p>npm run build && npm start</p>
                </div>
                <p className="text-gray-600 mt-4">
                  Open <a href="http://localhost:3000" className="text-[#A78BFA] font-medium hover:underline">http://localhost:3000</a> in your browser.
                </p>
              </div>

              {/* Deployment Options */}
              <div className="bg-[#E8E4F0] rounded-2xl p-6 border-3 border-black">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                  </svg>
                  Deployment Options
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-5 border-2 border-black hover:scale-105 transition-transform">
                    <h4 className="font-bold text-gray-900 mb-2">Vercel</h4>
                    <p className="text-sm text-gray-600">One-click deploy with automatic CI/CD. Recommended for Next.js apps.</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 border-2 border-black hover:scale-105 transition-transform">
                    <h4 className="font-bold text-gray-900 mb-2">Netlify</h4>
                    <p className="text-sm text-gray-600">Easy deployment with form handling and serverless functions.</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 border-2 border-black hover:scale-105 transition-transform">
                    <h4 className="font-bold text-gray-900 mb-2">Self-Hosted</h4>
                    <p className="text-sm text-gray-600">Deploy on your own server with Docker or PM2.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tech Stack Tab */}
          {activeTab === 'tech' && (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 border-3 border-black">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Built with Modern Technologies
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { 
                      name: 'Next.js 16', 
                      desc: 'React framework with App Router for fast, SEO-friendly pages', 
                      color: 'bg-black text-white', 
                      icon: (
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.049-.106.005-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"/>
                        </svg>
                      )
                    },
                    { 
                      name: 'React 19', 
                      desc: 'Latest React with concurrent features and improved performance', 
                      color: 'bg-[#61DAFB]', 
                      icon: (
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="2"/>
                          <path d="M12 21.5c-.55 0-1-.45-1-1v-1.79c-2.39-.3-4.52-1.14-6.14-2.42L3.5 18.66c-.39.39-1.02.39-1.41 0-.39-.39-.39-1.02 0-1.41l1.36-1.36c-.88-1.26-1.41-2.79-1.41-4.43 0-.55.45-1 1-1s1 .45 1 1c0 3.17 2.12 5.84 5 6.71V7.83C6.12 8.7 4 11.37 4 14.54c0 .55-.45 1-1 1s-1-.45-1-1c0-4.72 3.12-8.72 7.42-10.05.17-.08.36-.08.53 0C14.88 5.82 18 9.82 18 14.54c0 .55-.45 1-1 1s-1-.45-1-1c0-3.17-2.12-5.84-5-6.71v9.34c2.88-.87 5-3.54 5-6.71 0-.55.45-1 1-1s1 .45 1 1c0 1.64-.53 3.17-1.41 4.43l1.36 1.36c.39.39.39 1.02 0 1.41-.39.39-1.02.39-1.41 0l-1.36-1.36c-1.62 1.28-3.75 2.12-6.14 2.42V20.5c0 .55-.45 1-1 1z"/>
                        </svg>
                      )
                    },
                    { 
                      name: 'Tailwind CSS 4', 
                      desc: 'Utility-first CSS framework for rapid UI development', 
                      color: 'bg-[#38BDF8]', 
                      icon: (
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.61 7.15 14.5 6 12 6m-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.39 16.85 9.5 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C10.61 13.15 9.5 12 7 12z"/>
                        </svg>
                      )
                    },
                    { 
                      name: 'Blockly', 
                      desc: "Google's visual programming library for block-based coding", 
                      color: 'bg-[#4ADE80]', 
                      icon: (
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                        </svg>
                      )
                    },
                    { 
                      name: 'GSAP', 
                      desc: 'Professional-grade animation library for smooth interactions', 
                      color: 'bg-[#88CE02]', 
                      icon: (
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      )
                    },
                    { 
                      name: 'Supabase', 
                      desc: 'Open source Firebase alternative for auth and database', 
                      color: 'bg-[#3ECF8E]', 
                      icon: (
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                        </svg>
                      )
                    },
                  ].map((tech) => (
                    <div 
                      key={tech.name} 
                      className={`${tech.color} rounded-2xl p-6 border-3 border-black hover:scale-105 transition-transform`}
                      onClick={() => ttsEnabled && speak(`${tech.name}. ${tech.desc}`)}
                    >
                      <div className="mb-3">{tech.icon}</div>
                      <h3 className="font-bold text-xl mb-2">{tech.name}</h3>
                      <p className="text-sm opacity-90">{tech.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Accessibility Tech */}
                <div className="mt-8 bg-[#E8E4F0] rounded-2xl p-6 border-2 border-black">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
                    </svg>
                    Accessibility Technologies
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                      <h4 className="font-bold text-gray-900">Web Speech API</h4>
                      <p className="text-sm text-gray-600">Native browser text-to-speech with natural voices for content narration.</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                      <h4 className="font-bold text-gray-900">ARIA Labels</h4>
                      <p className="text-sm text-gray-600">Comprehensive accessibility attributes for screen reader compatibility.</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                      <h4 className="font-bold text-gray-900">CSS Custom Properties</h4>
                      <p className="text-sm text-gray-600">Dynamic theming for high contrast mode with a single toggle.</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                      <h4 className="font-bold text-gray-900">Focus Management</h4>
                      <p className="text-sm text-gray-600">Keyboard navigation with visible focus indicators throughout.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contribute Tab */}
          {activeTab === 'contribute' && (
            <div className="space-y-8">
              <div className="bg-linear-to-br from-[#F472B6] to-[#EC4899] rounded-3xl p-8 border-3 border-black text-white">
                <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                  Join Our Community
                </h2>
                <p className="text-white/90 mb-6 max-w-3xl">
                  Kodo is an open source project, and we welcome contributions from developers, 
                  educators, and designers who share our vision of accessible coding education.
                </p>
              </div>

              {/* Ways to Contribute */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border-3 border-black">
                  <svg className="w-12 h-12 mb-4 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Code Contributions</h3>
                  <p className="text-gray-600 mb-4">Help us improve the codebase, fix bugs, or add new features.</p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center gap-2"><span className="text-[#4ADE80]">✓</span> New puzzle levels</li>
                    <li className="flex items-center gap-2"><span className="text-[#4ADE80]">✓</span> Accessibility improvements</li>
                    <li className="flex items-center gap-2"><span className="text-[#4ADE80]">✓</span> Bug fixes and optimizations</li>
                    <li className="flex items-center gap-2"><span className="text-[#4ADE80]">✓</span> New block types</li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 border-3 border-black">
                  <svg className="w-12 h-12 mb-4 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Content & Education</h3>
                  <p className="text-gray-600 mb-4">Help us create better learning materials and documentation.</p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center gap-2"><span className="text-[#A78BFA]">✓</span> Write tutorials</li>
                    <li className="flex items-center gap-2"><span className="text-[#A78BFA]">✓</span> Create video guides</li>
                    <li className="flex items-center gap-2"><span className="text-[#A78BFA]">✓</span> Improve documentation</li>
                    <li className="flex items-center gap-2"><span className="text-[#A78BFA]">✓</span> Translate content</li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 border-3 border-black">
                  <svg className="w-12 h-12 mb-4 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Design & UX</h3>
                  <p className="text-gray-600 mb-4">Help us make Kodo more beautiful and user-friendly.</p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center gap-2"><span className="text-[#F472B6]">✓</span> UI/UX improvements</li>
                    <li className="flex items-center gap-2"><span className="text-[#F472B6]">✓</span> New themes</li>
                    <li className="flex items-center gap-2"><span className="text-[#F472B6]">✓</span> Illustrations & graphics</li>
                    <li className="flex items-center gap-2"><span className="text-[#F472B6]">✓</span> Accessibility audits</li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 border-3 border-black">
                  <svg className="w-12 h-12 mb-4 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 2v11h3v9l7-12h-4l3-8z"/>
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Testing & Feedback</h3>
                  <p className="text-gray-600 mb-4">Help us improve by testing and providing feedback.</p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center gap-2"><span className="text-[#FACC15]">✓</span> Report bugs</li>
                    <li className="flex items-center gap-2"><span className="text-[#FACC15]">✓</span> Suggest features</li>
                    <li className="flex items-center gap-2"><span className="text-[#FACC15]">✓</span> User testing</li>
                    <li className="flex items-center gap-2"><span className="text-[#FACC15]">✓</span> Accessibility testing</li>
                  </ul>
                </div>
              </div>

              {/* GitHub CTA */}
              <div className="bg-gray-900 rounded-2xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Contribute?</h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Check out our GitHub repository to get started. Read our contribution guidelines, 
                  pick an issue, and submit your first pull request!
                </p>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" /></svg>
                  View on GitHub
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Kodo - Creative Code Academy. Open source and free forever.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            <Link href="/levels" className="text-gray-400 hover:text-white transition-colors">Academy</Link>
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
