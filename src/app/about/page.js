'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAccessibility } from "@/context/AccessibilityContext";

export default function AboutPage() {
  const { highContrast, toggleHighContrast, ttsEnabled, toggleTts, speak } = useAccessibility();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Refs for animations
  const heroRef = useRef(null);
  const cardsRef = useRef([]);
  const featuresRef = useRef([]);

  useEffect(() => {
    // Hero animation
    gsap.fromTo(heroRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    // Cards stagger animation
    gsap.fromTo(cardsRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.6, 
        stagger: 0.15, 
        ease: "back.out(1.7)",
        delay: 0.3 
      }
    );

    // Features animation
    gsap.fromTo(featuresRef.current,
      { opacity: 0, x: -30 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.5, 
        stagger: 0.1, 
        ease: "power2.out",
        delay: 0.6 
      }
    );
  }, []);

  const teamMembers = [
    {
      name: "Creative Learning",
      role: "Our Philosophy",
      description: "We believe coding should be fun, engaging, and accessible to everyone. Our visual block-based approach removes barriers and makes programming intuitive.",
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>
        </svg>
      ),
      color: "bg-[#4ADE80]"
    },
    {
      name: "Inclusive Design",
      role: "Our Commitment",
      description: "Every feature is designed with accessibility in mind. From high-contrast modes to text-to-speech, we ensure no one is left behind.",
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
        </svg>
      ),
      color: "bg-[#A78BFA]"
    },
    {
      name: "Progressive Learning",
      role: "Our Method",
      description: "Start simple, grow complex. Our staged curriculum builds confidence and skills gradually, from basic moves to advanced algorithms.",
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
        </svg>
      ),
      color: "bg-[#F472B6]"
    },
    {
      name: "Open Source",
      role: "Our Values",
      description: "Kodo is open source and free forever. We believe education should be accessible to all, and we welcome contributions from the community.",
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
        </svg>
      ),
      color: "bg-[#FACC15]"
    }
  ];

  const accessibilityFeatures = [
    {
      title: "High Contrast Mode",
      description: "Enhanced visual clarity for users with color blindness or low vision. Strong borders, distinct colors, and clear visual hierarchy.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
      )
    },
    {
      title: "Text-to-Speech",
      description: "Natural human-like voice reads instructions and feedback aloud. Configurable speed and pitch for personalized experience.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
      )
    },
    {
      title: "Keyboard Navigation",
      description: "Full keyboard support for users who cannot use a mouse. Tab through elements and use enter to interact.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/>
        </svg>
      )
    },
    {
      title: "Screen Reader Compatible",
      description: "ARIA labels and semantic HTML ensure compatibility with popular screen readers like NVDA, JAWS, and VoiceOver.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
        </svg>
      )
    },
    {
      title: "Visual Block Coding",
      description: "Drag-and-drop blocks eliminate typing barriers. Color-coded blocks with distinct shapes aid recognition.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
      )
    },
    {
      title: "Multiple Difficulty Levels",
      description: "Progress at your own pace with Easy, Medium, Hard, and Expert challenges. No pressure, just learning.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      )
    }
  ];

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
          <Link href="/about" className="px-4 py-2 bg-[#4ADE80] rounded-full font-medium text-gray-700 transition-colors border-3 border-black text-sm">
            About Us
          </Link>
          <Link href="/program" className="px-4 py-2 rounded-full font-medium text-gray-600 hover:bg-gray-100 transition-colors border-3 border-black text-sm">
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
              className="px-4 py-3 bg-[#4ADE80] rounded-full font-medium text-gray-700 transition-colors border-2 border-black text-sm"
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
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div ref={heroRef} className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-[#A78BFA]/20 rounded-full text-sm font-medium text-[#5B21B6] mb-4 border-2 border-[#A78BFA]">
            About Kodo
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Making Coding <span className="font-accent text-[#4ADE80]">Accessible</span> for Everyone
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Kodo is a visual programming platform designed to teach coding concepts through 
            interactive puzzles. Our mission is to make programming education fun, engaging, 
            and accessible to learners of all abilities.
          </p>
        </div>

        {/* Value Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              ref={el => cardsRef.current[index] = el}
              className={`${member.color} rounded-3xl p-6 border-3 border-black hover:scale-105 transition-transform duration-300 cursor-default`}
              onClick={() => ttsEnabled && speak(`${member.name}. ${member.role}. ${member.description}`)}
            >
              <div className="mb-4 text-gray-900">{member.icon}</div>
              <h3 className="font-bold text-xl text-gray-900">{member.name}</h3>
              <p className="text-sm font-medium text-gray-700 mb-2">{member.role}</p>
              <p className="text-gray-800 text-sm leading-relaxed">{member.description}</p>
            </div>
          ))}
        </div>

        {/* Founders Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border-3 border-black mb-20">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-2 bg-[#F472B6]/20 rounded-full text-sm font-medium text-[#9D174D] mb-4 border-2 border-[#F472B6]">
              Meet the Team
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The <span className="font-accent">Founders</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The passionate team behind Kodo, dedicated to making coding education accessible and fun.
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="relative rounded-2xl overflow-hidden border-4 border-black shadow-2xl max-w-3xl w-full">
              <Image
                src="/founders.jpg"
                alt="Kodo Founders - The team behind the project"
                width={800}
                height={500}
                className="w-full h-auto object-cover"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6">
                <p className="text-white text-lg font-medium text-center">
                  Building the future of coding education, one block at a time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility Section */}
        <div className="bg-[#E8E4F0] rounded-3xl p-8 md:p-12 border-3 border-black mb-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 mb-4 border-2 border-black">
              Accessibility First
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for <span className="font-accent">Everyone</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;ve thoughtfully designed every aspect of Kodo to ensure it&apos;s usable by 
              learners with diverse abilities and needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accessibilityFeatures.map((feature, index) => (
              <div
                key={feature.title}
                ref={el => featuresRef.current[index] = el}
                className="bg-white rounded-2xl p-6 border-3 border-black hover:shadow-lg transition-shadow"
                onClick={() => ttsEnabled && speak(`${feature.title}. ${feature.description}`)}
              >
                <div className="mb-3 text-gray-900">{feature.icon}</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center bg-linear-to-br from-[#4ADE80] to-[#22C55E] rounded-3xl p-12 border-3 border-black mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed mb-8">
            &ldquo;To democratize programming education by creating an inclusive, engaging, 
            and accessible learning environment where every child can discover the joy 
            of coding, regardless of their abilities or background.&rdquo;
          </p>
          <Link
            href="/levels"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white border-3 border-black text-black font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <span className="w-8 h-8 bg-[#4ADE80] rounded-full flex items-center justify-center">▶</span>
            Start Your Journey
          </Link>
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
            <Link href="/program" className="text-gray-400 hover:text-white transition-colors">Program</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
