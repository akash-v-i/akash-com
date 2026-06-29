/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CellState {
  row: number;
  col: number;
  isNameCell: boolean;
  /** GitHub/LeetCode style contribution level: 0 (none) to 4 (maximum) */
  level: number;
  /** The baseline level this cell should stabilize to (3 or 4 for active name pixels, 0 or occasionally 1 for inactive pixels) */
  baseLevel: number;
  /** Randomized frequency phase offset for the living glow shimmer effect */
  shimmerOffset: number;
  /** Transient hover brightness modifier */
  hoverIntensity: number;
}

export interface ContributionGridProps {
  name?: string;
  cellSizeClass?: string;
  gapClass?: string;
  activeColorClass?: string;
  animationDuration?: number; // In seconds
  reducedMotion?: boolean;
}
