/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Mail, ArrowRight, Github, Linkedin, ExternalLink, Code2, Layers, 
  Briefcase, Terminal, X, Check, Coffee, Database, Leaf, Shield, 
  Activity, Binary, Radar, Download, Trophy, Award, Sun, Moon
} from 'lucide-react';
import ContributionGrid from './ContributionGrid';

// Technical skill badges for infinite horizontal marquee
const SKILL_BADGES = [
  { name: 'JAVA', icon: Coffee, category: 'Language' },
  { name: 'SPRING BOOT', icon: Leaf, category: 'Framework' },
  { name: 'MYSQL', icon: Database, category: 'Database' },
  { name: 'BOOTSTRAP', icon: Layers, category: 'UI Library' },
  { name: 'KALI LINUX', icon: Terminal, category: 'OS' },
  { name: 'BURP SUITE', icon: Shield, category: 'CyberSec' },
  { name: 'WIRESHARK', icon: Activity, category: 'CyberSec' },
  { name: 'GHIDRA', icon: Binary, category: 'CyberSec' },
  { name: 'NMAP', icon: Radar, category: 'CyberSec' },
];

// Custom Achievements and Winnings
const ACHIEVEMENTS = [
  {
    title: '🏆 National Hackathon 1st Runner-Up',
    subtitle: "CODECRAFT'25 – Innovatia 4.0",
    description: "Secured the 🥈 1st Runner-Up position at the National Level 24-Hour Hackathon CODECRAFT'25 – Innovatia 4.0 held at Sri Sairam Engineering College as Team C1CC4D0 (Community of H4CK_077). Developed Campus Connect, a unified campus management platform featuring venue booking, inter-campus coordination, and an AI-powered chatbot assistant to streamline academic operations.",
    tags: ['React', 'TypeScript', 'Supabase', 'OpenAI', 'Tailwind CSS'],
    date: 'October 2025',
    reward: 'National Level 1st Runner-Up Trophy & Certificate',
    rewardLabel: '★ Achievement'
  },
  {
    title: '🛡️ Nokia Hall of Fame Recognition',
    subtitle: 'Responsible Disclosure',
    description: 'Recognized by Nokia for responsibly reporting a security vulnerability. The reported issue was acknowledged for remediation, and my contribution was accepted for inclusion in the Nokia Hall of Fame under their responsible disclosure program.',
    tags: ['Vulnerability Research', 'Web Security', 'Responsible Disclosure', 'Bug Hunting'],
    date: 'Active',
    reward: 'Official Nokia Hall of Fame Acknowledgment',
    rewardLabel: '★ Recognition'
  },
  {
    title: '🌟 500 LeetCode Problems & 365-Day Badge',
    subtitle: 'Continuous Competitive Programming',
    description: 'Completed 500+ LeetCode problems and earned the 365-Day Badge through consistent daily practice. Strengthened problem-solving skills across algorithms and data structures while overcoming TLEs, runtime errors, and debugging challenges, building a strong foundation in competitive programming.',
    tags: ['Algorithms', 'Data Structures', 'Java', 'Dynamic Programming', 'Problem Solving'],
    date: 'Active',
    reward: '500+ Problems Solved & 365-Day LeetCode Badge',
    rewardLabel: '★ Achievement'
  },
  {
    title: "🥈 National Coding Competition Runner-Up",
    subtitle: "The Grand Prix of Code – Protocol 26'E",
    description: "Secured 2nd Place as Team C1CC4D0 in The Grand Prix of Code at the National Level Technical Symposium Protocol 26'E, organized by the Department of Information Technology at Sri Venkateswara College of Engineering (SVCE), Sriperumbudur. Competed against participants from multiple institutions in advanced programming and algorithmic problem-solving challenges.",
    tags: ['Competitive Programming', 'Algorithms', 'Java', 'Problem Solving'],
    date: 'February 2026',
    reward: '2nd Place Trophy & Certificate',
    rewardLabel: '★ Achievement'
  },
  {
    title: '🏆 Escape Room CTF Champion',
    subtitle: 'Jerusalem College of Engineering',
    description: 'Secured 1st Place as Team C1CC4D0 in the Escape Room Capture The Flag (CTF) competition hosted by Jerusalem College of Engineering and powered by Flaggers United. Solved multi-stage challenges involving hidden clues, key extraction, and flag capture through strategic thinking, cybersecurity techniques, and collaborative problem-solving.',
    tags: ['Capture The Flag (CTF)', 'Cryptography', 'OSINT', 'Problem Solving', 'Cybersecurity'],
    date: 'October 2025',
    reward: '1st Place Cash & Certificate',
    rewardLabel: '★ Achievement'
  }
];

// Custom professional certifications
const CERTIFICATIONS = [
  {
    title: 'ISC2 Certified in Cybersecurity (CC)',
    issuer: 'ISC2 - Certified in Cybersecurity',
    description: 'Entry-level cybersecurity certification validating foundational knowledge in cyber risk management, network and cloud security, identity and access management, incident response, governance, compliance, and ethical security practices. Demonstrates commitment to the ISC2 Code of Ethics and secure system design.',
    idLabel: 'ID',
    id: 'Active / Verified',
    date: 'Jun 2025',
    status: 'Certified'
  },
  {
    title: 'Programming in Java',
    issuer: 'NPTEL - IIT Kharagpur',
    description: 'Successfully completed the NPTEL course on Programming in Java with a score of 71%, demonstrating proficiency in object-oriented programming, exception handling, collections, multithreading, and Java application development.',
    idLabel: 'Score',
    id: '71%',
    date: 'Oct 2024',
    status: 'Elite / Certified'
  },
  {
    title: 'Data Structures and Algorithms using Java (Top 2%)',
    issuer: 'NPTEL',
    description: 'Completed the NPTEL course on Data Structures and Algorithms using Java with a score of 75%, securing a position in the Top 2% of all certified candidates. Demonstrated strong understanding of algorithm design, complexity analysis, trees, graphs, sorting, searching, and optimization techniques.',
    idLabel: 'Score',
    id: '75% (Top 2%)',
    date: 'Oct 2024',
    status: 'Elite / Certified'
  },
  {
    title: 'Introduction to Internet of Things (Top 2%)',
    issuer: 'NPTEL',
    description: 'Successfully completed the NPTEL course on Introduction to Internet of Things with a score of 88%, achieving Top 2% among certified learners. Covered IoT architecture, communication protocols, embedded systems, cloud integration, and smart device applications.',
    idLabel: 'Score',
    id: '88% (Top 2%)',
    date: 'Oct 2025',
    status: 'Elite / Certified'
  },
  {
    title: 'AWS Cloud Practitioner Essentials',
    issuer: 'AWS Training & Certification',
    description: 'Completed the AWS Cloud Practitioner Essentials training, gaining foundational knowledge of AWS Cloud concepts, core services, security, pricing models, architecture, and best practices for deploying scalable cloud solutions.',
    idLabel: 'Completion Date',
    id: 'March 08, 2026',
    date: 'Mar 2026',
    status: 'Completed / Certified'
  }
];

// Simulated high-end projects data
const FEATURED_PROJECTS = [
  {
    title: '🔒 PiiVault Guard',
    description: 'Secure vault for storing and managing Personally Identifiable Information — built with React 18, TypeScript, Tailwind CSS, shadcn/ui and a FastAPI backend. Features AES-GCM encryption, JWT auth, tiered RBAC, and automated audit logging.',
    tags: ['React', 'TypeScript', 'FastAPI', 'AES-GCM', 'JWT', 'RBAC'],
    github: 'https://github.com',
    demo: 'https://github.com',
    stats: 'AES-GCM • HIPAA Compliant • Tiered RBAC'
  },
  {
    title: 'Campus Connect',
    description: 'Digitizes campus services — library management, canteen pre-ordering — with an AI-powered assistant (OpenAI) for 24/7 support, Clerk-based role auth, and a mobile-first dual-theme UI.',
    tags: ['React', 'TypeScript', 'Supabase', 'OpenAI', 'Tailwind', 'shadcn/ui'],
    github: 'https://github.com',
    demo: 'https://github.com',
    stats: 'Multi-Role ERP • OpenAI Assistant • Clerk Auth'
  },
  {
    title: 'Cube Solver',
    description: "Detects Rubik's Cube colors using computer vision and instantly generates an optimal solution through a full-stack web application featuring a React-based interactive 3D cube visualization and a Python-powered solving API.",
    tags: ['React', 'TypeScript', 'Python', 'FastAPI', 'OpenCV', 'YOLOv8', 'Three.js', 'Tailwind CSS'],
    github: 'https://github.com',
    demo: 'https://github.com',
    stats: 'Computer Vision • YOLOv8 • Three.js 3D'
  }
];

export default function HeroSection() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  }, [theme]);

  const [activeDrawer, setActiveDrawer] = useState<'projects' | 'contact' | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  // Credentials & Competitive Play interactive toggles & pagination limits
  const [credentialTab, setCredentialTab] = useState<'achievements' | 'certifications'>('achievements');
  const [achievementsLimit, setAchievementsLimit] = useState<number>(2);
  const [certificationsLimit, setCertificationsLimit] = useState<number>(2);
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setContactForm({ name: '', email: '', message: '' });
        setActiveDrawer(null);
      }, 2500);
    }, 1500);
  };

  const handleDownloadResume = () => {
    const directDownloadUrl = 'https://drive.google.com/uc?export=download&id=1zNE7h3ccXagb88J8WR4rxI2ws392ZUg8';
    window.open(directDownloadUrl, '_blank');
  };

  return (
    <section 
      id="hero-section" 
      className="relative min-h-screen w-full bg-theme-bg flex flex-col items-center py-8 px-4 md:px-8 overflow-hidden transition-colors duration-300"
    >
      {/* Dynamic Grid Background - extremely subtle theme matrix styling */}
      <div 
        className="absolute inset-0 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-30 transition-all duration-300"
        style={{ backgroundImage: 'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)' }}
      />
      
      {/* Glowing atmospheric dots - restrained, elegant green accent glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Navigation Line */}
      <div className="w-full max-w-7xl flex items-center justify-between z-10 mb-6" id="hero-header">
        <div className="flex items-center gap-2 select-none" id="hero-logo-container">
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span className="font-mono text-xs text-theme-text-sec tracking-wider">PORTFOLIO // V3</span>
        </div>
        
        <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-xs font-mono text-theme-text-sec" id="hero-socials">
          <a href="https://github.com/akash-v-i" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">github</span>
          </a>
          <span className="opacity-20">•</span>
          <a href="https://www.linkedin.com/in/akash-v-i/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <Linkedin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">linkedin</span>
          </a>
          <span className="opacity-20">•</span>
          <a href="https://leetcode.com/u/akash-v-i/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">leetcode</span>
          </a>
          <span className="opacity-20">•</span>
          <a href="https://tryhackme.com/p/M1K3Y" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">tryhackme</span>
          </a>
          <span className="opacity-20">•</span>
          <a href="https://www.linkedin.com/in/akash-v-i/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">contact</span>
          </a>
          <span className="opacity-20">•</span>
          <button
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-md hover:text-emerald-400 hover:bg-theme-bg-sec/50 transition-colors cursor-pointer flex items-center justify-center border border-theme-border bg-theme-bg-sec/30"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-emerald-600" />
            )}
          </button>
        </div>
      </div>

      {/* Centerpiece Hero Layout Container */}
      <div className="w-full max-w-7xl flex flex-col items-center z-10 relative gap-8 md:gap-10" id="hero-main-content">
        
        {/* Availability Badge */}
        <div 
          id="availability-badge"
          className="px-4 py-1.5 rounded-full border border-theme-border-sec bg-theme-card/80 backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] flex items-center gap-2 select-none"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-mono text-theme-text-sec tracking-widest uppercase">Open for contract engineering</span>
        </div>

        {/* The Contribution-Style Lettering Grid */}
        <div className="w-full flex items-center justify-center" id="hero-grid-wrapper">
          <ContributionGrid 
            name="AKASH VI"
            animationDuration={4.0}
            reducedMotion={false}
          />
        </div>

        {/* Typography Role & Subtitle Section */}
        <div className="text-center max-w-2xl px-4 md:px-6" id="hero-text-block">
          <h1 className="font-display text-2xl md:text-3xl font-light tracking-tight text-theme-text mb-4 uppercase">
            JAVA DEVELOPER
          </h1>
          <p className="text-sm md:text-base text-theme-text-sec leading-relaxed font-sans font-light">
            Architecting high-performance enterprise Java systems, secure Spring Boot backend microservices, and defensive cybersecurity operations. Specialist in network analysis, threat detection, and reverse engineering tools.
          </p>
        </div>

        {/* Hero CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4" id="hero-cta-buttons">
          <button
            onClick={() => setActiveDrawer('projects')}
            id="btn-view-projects"
            className="group px-6 py-2.5 rounded-md bg-theme-text text-theme-bg font-medium text-xs tracking-wider uppercase flex items-center gap-2 border border-theme-text hover:bg-theme-bg hover:text-theme-text hover:border-theme-border transition-all duration-300 cursor-pointer shadow-lg hover:shadow-emerald-500/5"
          >
            <span>View Projects</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="https://www.linkedin.com/in/akash-v-i/"
            target="_blank"
            rel="noopener noreferrer"
            id="btn-get-in-touch"
            className="px-6 py-2.5 rounded-md border border-theme-border-sec bg-theme-bg-sec/60 hover:border-theme-border hover:bg-theme-bg-sec text-theme-text-sec font-medium text-xs tracking-wider uppercase flex items-center gap-2 transition-all duration-300 cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </a>

          <button
            onClick={handleDownloadResume}
            id="btn-download-resume"
            className="px-6 py-2.5 rounded-md border border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-500 font-medium text-xs tracking-wider uppercase flex items-center gap-2 transition-all duration-300 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.05)]"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Download Resume</span>
          </button>
        </div>

        {/* Technical Skill Marquee (Seamless Horizontal Loop) */}
        <div className="w-full relative" id="skills-marquee-wrapper">
          {/* Subtle linear-gradient edge fades for high-end feel */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-theme-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-theme-bg to-transparent z-10 pointer-events-none" />
          
          <div className="overflow-hidden py-3.5 border-t border-b border-theme-border/40 bg-theme-bg-sec/20 backdrop-blur-sm">
            <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
              {/* Multiply skill elements to guarantee flawless, gap-free loop */}
              {[...SKILL_BADGES, ...SKILL_BADGES, ...SKILL_BADGES].map((skill, index) => {
                const IconComponent = skill.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-center gap-3 px-5 py-2 rounded-full bg-theme-card border border-theme-border hover:border-emerald-500/30 hover:bg-emerald-950/5 transition-all duration-300 select-none group"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
                    <span className="font-mono text-xs text-theme-text-sec group-hover:text-theme-text transition-colors uppercase tracking-wider">
                      {skill.name}
                    </span>
                    <span className="text-[9px] font-mono text-theme-text-muted uppercase px-2 py-0.5 rounded bg-theme-bg-sec/60 border border-theme-border-sec">
                      {skill.category}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Credentials & Competitive Play Section (Achievements & Certifications) */}
        <div className="w-full text-left" id="credentials-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-theme-border">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-emerald-400 animate-pulse" />
              <h2 className="font-display text-lg font-light uppercase tracking-wider text-theme-text">
                Credentials & Competitive Play
              </h2>
            </div>
            
            {/* Segmented Tab Controls */}
            <div className="flex bg-theme-bg-sec p-1 rounded-lg border border-theme-border-sec self-start sm:self-auto" id="credentials-tabs">
              <button
                onClick={() => setCredentialTab('achievements')}
                className={`px-4 py-1.5 font-mono text-xs uppercase tracking-wider rounded-md transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  credentialTab === 'achievements'
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 font-medium'
                    : 'text-theme-text-muted hover:text-theme-text-sec border border-transparent'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Achievements</span>
              </button>
              <button
                onClick={() => setCredentialTab('certifications')}
                className={`px-4 py-1.5 font-mono text-xs uppercase tracking-wider rounded-md transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  credentialTab === 'certifications'
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 font-medium'
                    : 'text-theme-text-muted hover:text-theme-text-sec border border-transparent'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Certifications</span>
              </button>
            </div>
          </div>

          {/* Active Tab Content Grid */}
          {credentialTab === 'achievements' ? (
            <div className="space-y-6" id="achievements-tab-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {ACHIEVEMENTS.slice(0, achievementsLimit).map((ach, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 rounded-lg bg-theme-card/40 border border-theme-border hover:border-emerald-500/30 hover:bg-emerald-950/5 transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h4 className="font-display text-sm font-medium text-theme-text group-hover:text-emerald-400 transition-colors">
                          {ach.title}
                        </h4>
                        <span className="text-[9px] font-mono text-theme-text-sec bg-theme-bg-sec px-2 py-0.5 rounded border border-theme-border whitespace-nowrap">
                          {ach.date}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400/80 mb-2.5 flex items-center gap-1.5 uppercase tracking-wider">
                        <Award className="w-3.5 h-3.5" />
                        <span>{ach.subtitle}</span>
                      </div>
                      <p className="text-xs text-theme-text-sec leading-relaxed mb-4">
                        {ach.description}
                      </p>
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {ach.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="text-[9px] font-mono px-2 py-0.5 rounded bg-theme-bg-sec border border-theme-border text-theme-text-sec">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-theme-text-sec pt-2.5 border-t border-theme-border/40">
                        <span className="text-emerald-500/80 uppercase">{ach.rewardLabel || '★ Reward'}:</span>
                        <span className="text-theme-text">{ach.reward}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* LinkedIn Verification Callout */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-lg bg-theme-bg-sec/20 border border-theme-border/40 text-[11px] font-mono text-theme-text-sec">
                <span className="text-theme-text-muted text-center sm:text-left">
                  Need official confirmation? You are welcome to view and verify all awards and certifications directly.
                </span>
                <a 
                  href="https://www.linkedin.com/in/akash-v-i/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 hover:underline transition-all duration-300 whitespace-nowrap"
                >
                  <Linkedin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verify on LinkedIn &rarr;</span>
                </a>
              </div>

              {/* Load More controls for achievements */}
              <div className="flex justify-center pt-2">
                {achievementsLimit < ACHIEVEMENTS.length ? (
                  <button
                    onClick={() => setAchievementsLimit(prev => Math.min(prev + 2, ACHIEVEMENTS.length))}
                    className="px-5 py-2 rounded border border-theme-border hover:border-emerald-500/30 bg-theme-bg-sec text-theme-text-sec hover:text-theme-text font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
                  >
                    Load More Achievements ({ACHIEVEMENTS.length - achievementsLimit} remaining)
                  </button>
                ) : ACHIEVEMENTS.length > 2 ? (
                  <button
                    onClick={() => setAchievementsLimit(2)}
                    className="px-5 py-2 rounded border border-theme-border hover:border-emerald-500/30 bg-theme-bg-sec text-theme-text-sec hover:text-theme-text font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
                  >
                    Show Less
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="space-y-6" id="certifications-tab-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {CERTIFICATIONS.slice(0, certificationsLimit).map((cert, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 rounded-lg bg-theme-card/40 border border-theme-border hover:border-emerald-500/30 hover:bg-emerald-950/5 transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h4 className="font-display text-sm font-medium text-theme-text group-hover:text-emerald-400 transition-colors">
                          {cert.title}
                        </h4>
                        <span className="text-[9px] font-mono text-theme-text-sec bg-theme-bg-sec px-2 py-0.5 rounded border border-theme-border whitespace-nowrap">
                          {cert.date}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400/80 mb-2.5 uppercase tracking-wider">
                        <span>{cert.issuer}</span>
                      </div>
                      <p className="text-xs text-theme-text-sec leading-relaxed mb-4">
                        {cert.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-theme-text-sec pt-2.5 border-t border-theme-border/40">
                      <div>
                        <span className="text-theme-text-muted uppercase">{cert.idLabel || 'ID'}: </span>
                        <span className="text-theme-text-sec">{cert.id}</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-500/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="uppercase">{cert.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* LinkedIn Verification Callout */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-lg bg-theme-bg-sec/20 border border-theme-border/40 text-[11px] font-mono text-theme-text-sec">
                <span className="text-theme-text-muted text-center sm:text-left">
                  Need official confirmation? You are welcome to view and verify all awards and certifications directly.
                </span>
                <a 
                  href="https://www.linkedin.com/in/akash-v-i/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 hover:underline transition-all duration-300 whitespace-nowrap"
                >
                  <Linkedin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verify on LinkedIn &rarr;</span>
                </a>
              </div>

              {/* Load More controls for certifications */}
              <div className="flex justify-center pt-2">
                {certificationsLimit < CERTIFICATIONS.length ? (
                  <button
                    onClick={() => setCertificationsLimit(prev => Math.min(prev + 2, CERTIFICATIONS.length))}
                    className="px-5 py-2 rounded border border-theme-border hover:border-emerald-500/30 bg-theme-bg-sec text-theme-text-sec hover:text-theme-text font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
                  >
                    Load More Certifications ({CERTIFICATIONS.length - certificationsLimit} remaining)
                  </button>
                ) : CERTIFICATIONS.length > 2 ? (
                  <button
                    onClick={() => setCertificationsLimit(2)}
                    className="px-5 py-2 rounded border border-theme-border hover:border-emerald-500/30 bg-theme-bg-sec text-theme-text-sec hover:text-theme-text font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
                  >
                    Show Less
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Understated Tech-Inspired Stats Section */}
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-3 gap-px bg-theme-bg-sec/40 border-t border-b border-theme-border/60 py-6 mt-10 z-10" id="hero-stats">
        <div className="flex flex-col items-center justify-center text-center p-5 sm:p-6">
          <span className="font-mono text-xs text-theme-text-muted uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-emerald-500/70" />
            Annual Commits
          </span>
          <span className="font-mono text-lg font-bold text-theme-text">1,420</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center p-5 sm:p-6 border-t sm:border-t-0 sm:border-l sm:border-r border-theme-border/60">
          <span className="font-mono text-xs text-theme-text-muted uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-500/70" />
            Longest Streak
          </span>
          <span className="font-mono text-lg font-bold text-theme-text">112 Days LC</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center p-5 sm:p-6 border-t sm:border-t-0">
          <span className="font-mono text-xs text-theme-text-muted uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Coffee className="w-3.5 h-3.5 text-emerald-500/70" />
            Coffee Ranking
          </span>
          <span className="font-mono text-lg font-bold text-theme-text">Top 1.5% Dev</span>
        </div>
      </div>

      {/* Minimalist Footnote Footer */}
      <div className="w-full max-w-7xl flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-theme-text-sec mt-8 mb-6 z-10" id="hero-footer">
        <span>© {new Date().getFullYear()} AKASH VI. ALL RIGHTS RESERVED.</span>
        <span className="mt-2 sm:mt-0 opacity-60 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
          Built with coffee and Code by Akash.
        </span>
      </div>

      {/* --- SLIDING DRAWER: PROJECTS --- */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-end transition-opacity duration-300 ${activeDrawer === 'projects' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        id="drawer-projects"
      >
        {/* Overlay dismissal */}
        <div className="absolute inset-0 cursor-pointer" onClick={() => setActiveDrawer(null)} />
        
        <div className={`relative w-full max-w-lg bg-theme-bg-sec border-l border-theme-border h-full p-6 md:p-8 overflow-y-auto flex flex-col shadow-2xl z-10 transition-transform duration-300 ease-out ${activeDrawer === 'projects' ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between border-b border-theme-border pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-500" />
              <h2 className="font-display text-sm uppercase tracking-wider text-theme-text">Featured Open Source</h2>
            </div>
            <button 
              onClick={() => setActiveDrawer(null)}
              className="p-1 rounded-md hover:bg-theme-bg text-theme-text-sec hover:text-theme-text transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6 flex-1">
            {FEATURED_PROJECTS.map((proj, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-theme-card/60 border border-theme-border hover:border-emerald-950/60 hover:bg-emerald-950/5 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="font-display text-base font-medium text-theme-text group-hover:text-emerald-400 transition-colors">
                    {proj.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-theme-text-sec">
                    <a href={proj.github} target="_blank" rel="noopener noreferrer" className="hover:text-theme-text transition-colors">
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
                <p className="text-xs text-theme-text-sec leading-relaxed mb-4">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {proj.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[9px] font-mono px-2 py-0.5 rounded bg-theme-bg border border-theme-border text-theme-text-sec">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-theme-text-sec pt-2 border-t border-theme-border/60">
                  <span>{proj.stats}</span>
                  <a href={proj.demo} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-[9px] uppercase tracking-wider">
                    Repository <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-theme-border mt-6 text-center">
            <span className="text-[10px] font-mono text-theme-text-muted uppercase tracking-widest">
              More commits published daily on GitHub
            </span>
          </div>
        </div>
      </div>

      {/* --- SLIDING DRAWER: CONTACT FORM --- */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-end transition-opacity duration-300 ${activeDrawer === 'contact' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        id="drawer-contact"
      >
        {/* Overlay dismissal */}
        <div className="absolute inset-0 cursor-pointer" onClick={() => setActiveDrawer(null)} />
        
        <div className={`relative w-full max-w-lg bg-theme-bg-sec border-l border-theme-border h-full p-6 md:p-8 overflow-y-auto flex flex-col shadow-2xl z-10 transition-transform duration-300 ease-out ${activeDrawer === 'contact' ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between border-b border-theme-border pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-500" />
              <h2 className="font-display text-sm uppercase tracking-wider text-theme-text">Initiate Connection</h2>
            </div>
            <button 
              onClick={() => setActiveDrawer(null)}
              className="p-1 rounded-md hover:bg-theme-bg text-theme-text-sec hover:text-theme-text transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isSent ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6" id="contact-success-screen">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-display text-base text-theme-text mb-2 uppercase tracking-wider">Transmission Complete</h3>
              <p className="text-xs text-theme-text-sec max-w-xs leading-relaxed">
                Your message has been serialized and securely transmitted. Akash will respond to your workspace coordinates shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="flex-1 flex flex-col justify-between" id="contact-form">
              <div className="space-y-4">
                <p className="text-xs text-theme-text-sec leading-relaxed mb-4">
                  Fill out the form below to establish a socket connection. All transmissions are delivered directly to Akash's developer terminal.
                </p>
                
                <div>
                  <label className="block text-[9px] font-mono text-theme-text-muted uppercase tracking-widest mb-1">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Satoshi Nakamoto"
                    className="w-full bg-theme-card border border-theme-border-sec focus:border-emerald-500/50 rounded p-2.5 text-xs text-theme-text placeholder:text-theme-text-muted outline-none transition-colors animate-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-theme-text-muted uppercase tracking-widest mb-1">Return Coordinates (Email)</label>
                  <input 
                    type="email" 
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="e.g. satoshi@bitcoin.org"
                    className="w-full bg-theme-card border border-theme-border-sec focus:border-emerald-500/50 rounded p-2.5 text-xs text-theme-text placeholder:text-theme-text-muted outline-none transition-colors animate-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-theme-text-muted uppercase tracking-widest mb-1">Message Payload</label>
                  <textarea 
                    required
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Compile your inquiry or system proposal..."
                    className="w-full bg-theme-card border border-theme-border-sec focus:border-emerald-500/50 rounded p-2.5 text-xs text-theme-text placeholder:text-theme-text-muted outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-theme-border mt-6">
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                      Transmitting...
                    </span>
                  ) : (
                    'Send Transmission'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
