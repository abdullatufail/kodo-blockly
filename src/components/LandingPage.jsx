'use client';

import Link from "next/link";
import UserMenu from "./UserMenu";
import { useAuth } from "@/context/AuthContext";
import { useAccessibility } from "@/context/AccessibilityContext";
import { useProgress } from "@/hooks/useProgress";
import { levels, stages } from "@/data/levels";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function LandingPage() {
  const { user } = useAuth();
  const { totalStars, progress, loading: progressLoading } = useProgress();
  const { highContrast, toggleHighContrast, ttsEnabled, toggleTts } = useAccessibility();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const completedLevels = Object.keys(progress).filter(
    (key) => progress[key]?.completed
  ).length;

  // Refs for GSAP animations
  const shape1Ref = useRef(null);
  const shape2Ref = useRef(null);
  const shape3Ref = useRef(null);
  const shape4Ref = useRef(null);
  const containerRef = useRef(null);

  // GSAP floating and morphing animations
  

  return (
    <div className="min-h-screen bg-white px-4 md:px-10 lg:px-20">
      {/* Accessibility Controls - Fixed Position */}
      <div className="fixed bottom-4 right-4 z-100 flex gap-2">
        {/* High Contrast Toggle */}
        <button
          onClick={toggleHighContrast}
          className={`accessibility-toggle px-3 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg ${
            highContrast 
              ? 'bg-yellow-400 text-black border-2 border-black' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Toggle High Contrast Mode (for color blindness)"
          aria-label="Toggle high contrast mode"
        >
          <span className="text-lg">👁️</span>
          <span className="hidden sm:inline">{highContrast ? 'Normal' : 'High Contrast'}</span>
        </button>

        {/* Text-to-Speech Toggle */}
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
      <nav className='flex w-full justify-between items-center mt-4 px-4 md:px-10 py-2 bg-white/90 border-3 border-black rounded-full relative z-90'>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900">
            Kodo
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center gap-x-1'>
          <Link href="/levels" className="px-4 py-2 bg-gray-100 rounded-full font-medium text-gray-700 hover:bg-gray-200 transition-colors border-3 border-black text-sm">
            Academy
          </Link>
          <Link href="/about" className="px-4 py-2 rounded-full font-medium text-gray-600 hover:bg-gray-100 transition-colors border-3 border-black text-sm">
            About Us
          </Link>
          <Link href="/program" className="px-4 py-2 rounded-full font-medium text-gray-600 hover:bg-gray-100 transition-colors border-3 border-black text-sm">
            Program
          </Link>
          <UserMenu />
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-black hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="white"
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
        <div className="md:hidden fixed top-20 left-4 right-4 bg-white border-3 border-black rounded-3xl p-4 z-80 shadow-xl">
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
              className="px-4 py-3 rounded-full font-medium text-gray-600 hover:bg-gray-100 transition-colors border-2 border-black text-sm"
            >
              Program
            </Link>
            <div className="mt-2">
              <UserMenu />
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row items-center gap-10 mb-4 relative z-60">
              <Image src="/kodo-svg.svg"
              alt="kodo-logo"
              height={600}
              width={600}/>
              <div>
                <span className="text-4xl text-gray-800">✳</span>
              <h1 className="text-7xl font-bold text-gray-900">
                Creative
              </h1>
            <h2 className="text-5xl font-accent text-gray-900 mb-8">
              Code Academy
            </h2>
              </div>
              
            </div>
            
            
            <p className="text-lg text-gray-600 max-w-md mb-8 leading-relaxed">
              Kodo provides a nurturing environment where young minds can flourish and explore their coding talents
            </p>
<div className="flex items-center gap-10">
            {/* User Progress Summary */}
            {user && !progressLoading && (
              <div className="flex items-center gap-4 ">
                <div className="flex items-center gap-2 bg-white rounded-full px-5 py-3 border-3 border-black">
                  <span className="text-xl">⭐</span>
                  <div>
                    <p className="font-bold text-gray-800">{totalStars}</p>
                    <p className="text-xs text-gray-500">Stars</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-full px-5 py-3 border-3 border-black">
                  <span className="text-xl font-bold">✓</span>
                  <div>
                    <p className="font-bold text-gray-800">{completedLevels}/{levels.length}</p>
                    <p className="text-xs text-gray-500">Complete</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <Link 
                href="/levels"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#4ADE80] border-3 border-black text-black font-bold rounded-full hover:bg-[#22C55E] hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <span className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">▶</span>
                Start Learning
              </Link>
            </div>
          </div>
          </div>

          {/* Right Content - Decorative */}
          <div className="flex-1 relative" ref={containerRef}>
            <div className="relative w-full h-96 hidden sm:block">
              
              
              
              {/* Fun shapes with GSAP animations */}
              <div 
               
                className="absolute bottom-90 right-15 w-22 h-22 bg-[#ef3f9d] blob-shape border-3 border-black "
              ></div>
              <div 
                
                className="absolute bottom-60 right-32 w-42 h-42 bg-[#FACC15] rounded-full border-3 border-black "
              ></div>
              <div 
                
                className="absolute bottom-40 right-20 w-26 h-26 bg-[#A78BFA] blob-shape border-3 border-black "
              ></div>
              <div 
                
                className="absolute bottom-27 right-0 w-12 h-12 bg-[#4ADE80] blob-shape border-3 border-black shadow-lg"
              ></div>
            </div>
          </div>
        </div>

        {/* Stages Preview Cards */}
        <div id="stages" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {stages.map((stage, index) => {
            const colors = [
              'bg-[#4ADE80]',
              'bg-[#A78BFA]', 
              'bg-[#F472B6]',
              'bg-[#FACC15]'
            ];
            const bgColor = colors[index % colors.length];
            
            return (
              <Link 
                href="/levels"
                key={stage.id}
                className={`${bgColor} rounded-3xl p-6 relative overflow-hidden group hover:scale-105 border-3 border-black transition-all duration-300 cursor-pointer min-h-[200px]`}
              >
                {/* Age Badge */}
                <span className="inline-block px-3 py-1 bg-black rounded-full text-xs font-medium text-white mb-4">
                  Stage {index + 1}
                </span>
                
                {/* Arrow button */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 border-3 border-black rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                  <span className="text-black">↗</span>
                </div>
                
                <h3 className="font-bold text-xl text-gray-900 mt-4">Creative</h3>
                <p className="font-accent text-2xl text-gray-800">{stage.name.replace('Stage ', '')}</p>
                
                {/* Decorative shape */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/20 blob-shape"></div>
              </Link>
            );
          })}
        </div>

        
      </div>
    </div>
  );
}
