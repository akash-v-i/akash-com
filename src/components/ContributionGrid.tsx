/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { CellState, ContributionGridProps } from '../types';

// Standard 7x5 pixel representation of characters.
// GitHub grids have exactly 7 rows (Sunday to Saturday), which is perfect.
const CHAR_MAP: Record<string, number[][]> = {
  'A': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1]
  ],
  'K': [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1]
  ],
  'S': [
    [0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0]
  ],
  'H': [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1]
  ],
  'V': [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0]
  ],
  'I': [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1]
  ],
  ' ': [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0]
  ]
};

// Standard contribution level color shades (Tailwind styles)
// We use classes or pure inline styles. For pixel perfect design,
// inline styles or standard Tailwind classes work brilliantly.
// Level 0: Inactive
// Level 1: Faint Green
// Level 2: Medium-Dark Green
// Level 3: Active Brand Green
// Level 4: Bright Accent Emerald
const GREEN_LEVELS = [
  'bg-theme-cell-0 border-theme-cell-0-border hover:bg-theme-cell-0-hover', // Level 0
  'bg-theme-cell-1 border-theme-cell-0-border',                             // Level 1
  'bg-theme-cell-2 border-theme-cell-0-border',                             // Level 2
  'bg-theme-cell-3 border-theme-cell-0-border shadow-[0_0_8px_rgba(16,185,129,0.2)]', // Level 3
  'bg-theme-cell-4 border-theme-cell-0-border shadow-[0_0_12px_rgba(52,211,153,0.4)]' // Level 4
];

const ROWS = 7;
const COLS = 53; // One full year of week columns

// Smooth ease-in-out cubic interpolation function
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export default function ContributionGrid({
  name = 'AKASH VI',
  cellSizeClass = 'w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3',
  gapClass = 'gap-[3px]',
  animationDuration = 3.5,
  reducedMotion = false,
}: ContributionGridProps) {
  const [cells, setCells] = useState<CellState[][]>([]);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const shimmerPhaseRef = useRef(0);
  const lastFrameTimeRef = useRef<number>(0);
  const cellsRef = useRef<CellState[][]>([]);

  // Hook to detect prefers-reduced-motion system setting
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setSystemReducedMotion(mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => {
        setSystemReducedMotion(e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const shouldReduceMotion = reducedMotion || systemReducedMotion;

  // Build the 7x53 name mask grid once
  const nameMask = useRef<boolean[][]>([]);
  
  useEffect(() => {
    // Initialize the empty name grid
    const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    const chars = name.toUpperCase().split('');
    
    // Calculate widths of each letter
    const charWidths = chars.map(char => (CHAR_MAP[char] || CHAR_MAP[' '])[0].length);
    let totalWidth = charWidths.reduce((sum, w) => sum + w, 0) + (chars.length - 1); // chars width + 1 column spacing

    // Calculate left offset to center the name in 53 columns
    const leftOffset = Math.max(0, Math.floor((COLS - totalWidth) / 2));

    let currentCol = leftOffset;
    chars.forEach((char) => {
      const matrix = CHAR_MAP[char] || CHAR_MAP[' '];
      const width = matrix[0].length;
      
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < width; c++) {
          if (currentCol + c < COLS) {
            grid[r][currentCol + c] = matrix[r][c] === 1;
          }
        }
      }
      currentCol += width + 1; // Letter width + 1 col spacing
    });

    nameMask.current = grid;

    // Reset and initialize starting cells state
    const initialCells: CellState[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const rowCells: CellState[] = [];
      for (let c = 0; c < COLS; c++) {
        const isNameCell = grid[r][c];
        
        // Setup realistic baseline levels for non-name cells
        // Mostly level 0, with a tiny handful of level 1/2 scattered randomly
        let baseLevel = 0;
        if (!isNameCell) {
          const rand = Math.random();
          if (rand > 0.98) baseLevel = 2;
          else if (rand > 0.95) baseLevel = 1;
        } else {
          // Name cells will stabilize to Level 3 or 4
          baseLevel = Math.random() > 0.35 ? 3 : 4;
        }

        rowCells.push({
          row: r,
          col: c,
          isNameCell,
          level: 0,
          baseLevel,
          shimmerOffset: Math.random() * Math.PI * 2,
          hoverIntensity: 0
        });
      }
      initialCells.push(rowCells);
    }
    setCells(initialCells);
    cellsRef.current = initialCells;
    
    // Begin animation sequence
    setIsCompleted(false);
    setProgress(0);
    startTimeRef.current = null;
    lastFrameTimeRef.current = 0;

    if (shouldReduceMotion) {
      // If reduced motion is requested, immediately transition cells to their stable levels
      setCells(prev => 
        prev.map(row => 
          row.map(cell => ({
            ...cell,
            level: cell.baseLevel
          }))
        )
      );
      setIsCompleted(true);
      setProgress(1);
    }
  }, [name, shouldReduceMotion]);

  // Main animation render loop (controlled sweep or static completion)
  useEffect(() => {
    if (shouldReduceMotion) return;

    const animateSweep = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      if (!lastFrameTimeRef.current) lastFrameTimeRef.current = timestamp;
      
      const deltaTime = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;
      
      const elapsed = (timestamp - startTimeRef.current) / 1000; // in seconds
      const rawProgress = Math.min(1, elapsed / animationDuration);
      const currentProgress = easeInOutCubic(rawProgress);
      
      setProgress(rawProgress);

      // Use ref-based updates for better performance
      const updatedCells = cellsRef.current.map((rowCells) => 
        rowCells.map((cell) => {
          const { col, isNameCell, baseLevel } = cell;
          
          // Sweep parameters:
          // The sweep spans from col 0 to col 52 over the first 80% of the timeline.
          // Each column builds up activity over a small duration of the sweep.
          const colRatio = col / COLS;
          const colSweepStart = colRatio * 0.75; // Sweep active starting point
          const colSweepEnd = colSweepStart + 0.15; // Sweep active ending point
          
          let targetLevel = 0;

          if (currentProgress < colSweepStart) {
            // Phase 1: Not reached yet by active sweep wave
            // Provide tiny faint stray contribution pulses (0 or 1)
            if (isNameCell) {
              // Faint scattered anticipation traces
              const seed = Math.sin(col * 0.5 + currentProgress * 8) + Math.cos(rowCells[0].row * 0.7);
              targetLevel = seed > 1.4 ? 1 : 0;
            } else {
              targetLevel = cell.baseLevel > 0 && Math.sin(col * 0.2 + currentProgress * 4) > 1.2 ? cell.baseLevel : 0;
            }
          } else if (currentProgress >= colSweepStart && currentProgress <= colSweepEnd) {
            // Phase 2: Active column Sweep cursor - Choreographed active buildup
            // Standard deviation / stochastic flicker simulating high commit activity
            const colProgress = (currentProgress - colSweepStart) / (colSweepEnd - colSweepStart);
            
            if (isNameCell) {
              // Cell flickers organically up to level 4 and settles toward its baseLevel
              const flickerSeed = Math.random();
              if (colProgress < 0.4) {
                targetLevel = flickerSeed > 0.5 ? 2 : 1;
              } else if (colProgress < 0.8) {
                targetLevel = flickerSeed > 0.4 ? 4 : 3;
              } else {
                targetLevel = baseLevel;
              }
            } else {
              // Non-name cell experiences transient activity burst, then drops back
              const flickerSeed = Math.random();
              if (colProgress < 0.5 && flickerSeed > 0.8) {
                targetLevel = 1;
              } else {
                targetLevel = cell.baseLevel;
              }
            }
          } else {
            // Phase 3: Sweep has passed this column
            // Cell is fully unlocked and stabilizing
            targetLevel = baseLevel;
          }

          return {
            ...cell,
            level: targetLevel
          };
        })
      );
      
      cellsRef.current = updatedCells;
      setCells(updatedCells);

      if (rawProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateSweep);
      } else {
        setIsCompleted(true);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateSweep);
    
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [animationDuration, shouldReduceMotion]);

  // Living Glow / Shimmer loop once complete
  useEffect(() => {
    let shimmerTimer: number;
    let lastShimmerTime = 0;
    
    const runShimmer = (timestamp: number) => {
      if (!lastShimmerTime) lastShimmerTime = timestamp;
      const deltaTime = timestamp - lastShimmerTime;
      
      // Cap delta time to prevent huge jumps
      const cappedDelta = Math.min(deltaTime, 50);
      lastShimmerTime = timestamp;
      
      shimmerPhaseRef.current += 0.04 * (cappedDelta / 16.67);
      
      const updatedCells = cellsRef.current.map((rowCells) => 
        rowCells.map((cell) => {
          const { isNameCell, baseLevel, shimmerOffset } = cell;
          
          // Only name cells shimmer and glow organically
          if (isNameCell) {
            // Calculate a wave oscillation value
            const oscillation = Math.sin(shimmerPhaseRef.current + shimmerOffset + (cell.col * 0.15));
            
            let currentLevel = baseLevel;
            // Subtle micro-variation: nudge between Level 3 and Level 4
            if (oscillation > 0.75) {
              currentLevel = 4;
            } else if (oscillation < -0.75 && baseLevel === 4) {
              currentLevel = 3;
            }
            
            return { ...cell, level: currentLevel };
          }
          
          // Non-name cells have a tiny occasional random flicker
          if (cell.baseLevel === 0 && Math.random() > 0.9995) {
            return { ...cell, level: 1 };
          } else if (cell.level === 1 && cell.baseLevel === 0 && Math.random() > 0.9) {
            return { ...cell, level: 0 };
          }
          
          return cell;
        })
      );
      
      cellsRef.current = updatedCells;
      setCells(updatedCells);
      
      shimmerTimer = requestAnimationFrame(runShimmer);
    };

    if (isCompleted) {
      shimmerTimer = requestAnimationFrame(runShimmer);
    }

    return () => {
      cancelAnimationFrame(shimmerTimer);
    };
  }, [isCompleted]);

  // Handle cell rendering helper - determine cell style based on its animation state and hover intensity
  const getCellStyles = (cell: CellState) => {
    const { level, isNameCell, row, col } = cell;
    
    let baseClass = GREEN_LEVELS[level] || GREEN_LEVELS[0];
    let customStyle: React.CSSProperties = {};

    // Interactive mouse hover influence
    if (hoveredCell) {
      const distance = Math.sqrt(Math.pow(row - hoveredCell.r, 2) + Math.pow(col - hoveredCell.c, 2));
      
      if (distance < 2.5) {
        const influence = Math.max(0, 1 - distance / 2.5);
        
        if (isNameCell) {
          // Boost name cell to bright green glow
          baseClass = GREEN_LEVELS[4];
          customStyle = {
            filter: `brightness(${1 + influence * 0.4})`,
            boxShadow: `0 0 ${12 + influence * 8}px rgba(52,211,153, ${0.4 + influence * 0.4})`
          };
        } else {
          // Non-name cell glows softly
          const hoverColorLevel = influence > 0.7 ? 1 : 0;
          baseClass = GREEN_LEVELS[hoverColorLevel];
          if (hoverColorLevel > 0) {
            customStyle = {
              backgroundColor: `rgba(16, 185, 129, ${influence * 0.25})`,
              borderColor: `rgba(52, 211, 153, ${influence * 0.25})`,
              boxShadow: `0 0 ${8 * influence}px rgba(16, 185, 129, ${influence * 0.2})`
            };
          }
        }
      }
    }

    return { className: baseClass, style: customStyle };
  };

  const restartAnimation = () => {
    if (shouldReduceMotion) return;
    setIsCompleted(false);
    setProgress(0);
    startTimeRef.current = null;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full" id="contribution-grid-container">
      {/* Grid Canvas Wrapper with custom responsive scrolling container */}
      <div 
        className="relative w-full overflow-x-auto pb-2 pt-1 px-4 md:px-6 no-scrollbar flex justify-center"
        onMouseLeave={() => setHoveredCell(null)}
      >
        <div 
          className="flex flex-col select-none cursor-crosshair min-w-max p-5 md:p-6 bg-theme-bg-sec/60 backdrop-blur-md rounded-2xl border border-theme-border shadow-2xl relative overflow-hidden group/grid"
          id="contribution-grid"
        >
          {/* Subtle grid border glow */}
          <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 via-transparent to-transparent pointer-events-none opacity-0 group-hover/grid:opacity-100 transition-opacity duration-1000" />

          {/* Contribution Heatmap Months Layout Header */}
          <div className="flex justify-between text-[9px] font-mono text-theme-text-sec/60 mb-2.5 px-6 select-none uppercase tracking-widest">
            <span>Jan</span>
            <span>Mar</span>
            <span>May</span>
            <span>Jul</span>
            <span>Sep</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>

          <div className="flex flex-row items-start">
            {/* Days of week sidebar */}
            <div className="flex flex-col justify-between text-[8px] font-mono text-theme-text-sec/60 h-[85px] md:h-[110px] mr-3 py-1 uppercase select-none font-semibold">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Grid Core cells */}
            <div className="flex flex-col gap-[3px]">
              {Array.from({ length: ROWS }).map((_, r) => (
                <div key={r} className="flex flex-row gap-[3px]">
                  {Array.from({ length: COLS }).map((_, c) => {
                    const cell = cells[r]?.[c];
                    if (!cell) return null;
                    const { className, style } = getCellStyles(cell);
                    
                    return (
                      <div
                        key={`${r}-${c}`}
                        id={`cell-${r}-${c}`}
                        className={`
                          ${cellSizeClass} 
                          rounded-[1.5px] 
                          border 
                          transition-all 
                          duration-300 
                          ease-out
                          ${className}
                        `}
                        style={style}
                        onMouseEnter={() => setHoveredCell({ r, c })}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend under-bar */}
          <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-theme-text-sec px-4 md:px-6">
            <span className="text-[9px] opacity-60">
              {isCompleted ? (
                <span className="text-emerald-500/90 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Grid synchronized
                </span>
              ) : (
                <span className="animate-pulse">Synthesizing data... {Math.round(progress * 100)}%</span>
              )}
            </span>
            <div className="flex items-center gap-2">
              <span>Less</span>
              <div className="w-2 h-2 rounded-[1px] bg-theme-cell-0 border border-theme-cell-0-border" />
              <div className="w-2 h-2 rounded-[1px] bg-theme-cell-1 border border-theme-cell-0-border" />
              <div className="w-2 h-2 rounded-[1px] bg-theme-cell-2 border border-theme-cell-0-border" />
              <div className="w-2 h-2 rounded-[1px] bg-theme-cell-3 border border-theme-cell-0-border" />
              <div className="w-2 h-2 rounded-[1px] bg-theme-cell-4 border border-theme-cell-0-border" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded controls/actions below the grid to allow seamless replay */}
      {!shouldReduceMotion && isCompleted && (
        <button
          onClick={restartAnimation}
          id="btn-replay-grid"
          className="mt-3 text-xs font-mono text-theme-text-sec hover:text-emerald-400 border border-theme-border hover:border-emerald-500/30 bg-theme-bg-sec/40 hover:bg-emerald-950/10 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer select-none flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
          </svg>
          Replay Commit Sweep
        </button>
      )}
    </div>
  );
}
