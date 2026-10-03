/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from 'react';

export interface UseResponsiveSidebarOptions {
  /**
   * State setter for the existing isSidebarCollapsed state
   */
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  /**
   * Mobile breakpoint in pixels (default: 768 for Tailwind's `md`)
   */
  breakpoint?: number;
  /**
   * Whether to automatically collapse the sidebar when crossing into mobile widths
   * @default true
   */
  autoCollapseOnMobile?: boolean;
  /**
   * Whether to automatically expand the sidebar when crossing into desktop widths
   * @default true
   */
  autoExpandOnDesktop?: boolean;
  /**
   * Optional callback when mobile/desktop breakpoint status changes
   */
  onBreakpointChange?: (isMobile: boolean) => void;
}

export interface ResponsiveSidebarState {
  isMobile: boolean;
  viewportWidth: number;
}

/**
 * Custom hook to monitor viewport width and automatically switch the sidebar
 * between expanded and collapsed states based on mobile/desktop breakpoints.
 * 
 * Satisfies the requirement:
 * "Enhance the sidebar to automatically switch between expanded and collapsed states based on viewport width,
 * using a custom hook to trigger the existing `isSidebarCollapsed` state at mobile breakpoints for a cleaner mobile interface."
 */
export function useResponsiveSidebar(
  optionsOrSetter: React.Dispatch<React.SetStateAction<boolean>> | UseResponsiveSidebarOptions,
  optionalBreakpoint = 768
): ResponsiveSidebarState {
  const options: UseResponsiveSidebarOptions = typeof optionsOrSetter === 'function'
    ? { setIsSidebarCollapsed: optionsOrSetter, breakpoint: optionalBreakpoint }
    : optionsOrSetter;

  const {
    setIsSidebarCollapsed,
    breakpoint = 768,
    autoCollapseOnMobile = true,
    autoExpandOnDesktop = true,
    onBreakpointChange
  } = options;

  const [viewportWidth, setViewportWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1024;
  });

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < breakpoint;
    }
    return false;
  });

  // Track previous mobile breakpoint state to detect transition crossings
  const prevIsMobileRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Use media query listener matching Tailwind's md breakpoint (< 768px)
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const handleViewportChange = (e?: MediaQueryListEvent | { matches: boolean }) => {
      const matches = e !== undefined ? e.matches : mediaQuery.matches;
      const currentWidth = window.innerWidth;

      setViewportWidth(currentWidth);
      setIsMobile(matches);

      // Trigger isSidebarCollapsed state transition when crossing the breakpoint threshold or upon initial mount
      if (prevIsMobileRef.current !== matches) {
        prevIsMobileRef.current = matches;

        if (matches) {
          // Viewport is now at mobile breakpoint (< 768px): collapse sidebar for a cleaner mobile UI
          if (autoCollapseOnMobile) {
            setIsSidebarCollapsed(true);
          }
        } else {
          // Viewport is now at desktop breakpoint (>= 768px): expand sidebar to full operational layout
          if (autoExpandOnDesktop) {
            setIsSidebarCollapsed(false);
          }
        }

        if (onBreakpointChange) {
          onBreakpointChange(matches);
        }
      }
    };

    // Run initial evaluation on mount
    handleViewportChange();

    // Listen to media query events
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleViewportChange);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(handleViewportChange);
    }

    // Passive resize listener as secondary safety for dynamic browser views/emulators
    const handleWindowResize = () => {
      handleViewportChange();
    };
    window.addEventListener('resize', handleWindowResize, { passive: true });

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleViewportChange);
      } else if ((mediaQuery as any).removeListener) {
        (mediaQuery as any).removeListener(handleViewportChange);
      }
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [breakpoint, autoCollapseOnMobile, autoExpandOnDesktop, setIsSidebarCollapsed, onBreakpointChange]);

  return { isMobile, viewportWidth };
}
