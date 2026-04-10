import { useEffect, useRef, type RefObject } from "react";

const SNAP_DELTA_THRESHOLD = 80;
const SNAP_DEBOUNCE_MS = 700;

export function useMerchScroll(sectionRefs: Array<RefObject<HTMLElement | null>>) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
    if (isMobileViewport) {
      return;
    }

    const wrapper = wrapperRef.current;
    const sections = sectionRefs
      .map((sectionRef) => sectionRef.current)
      .filter((section): section is HTMLElement => section !== null);
    const lastSection = sections.at(-1);

    if (!wrapper || sections.length === 0 || !lastSection) {
      return;
    }

    let snapEnabled = true;
    let listenersAttached = false;
    let accumulatedDelta = 0;
    let touchStartY: number | null = null;
    let lockUntil = 0;
    let previousScrollTop = wrapper.scrollTop;
    let isScrollingUp = false;
    let unlockTimeoutId: number | undefined;

    const clearUnlockTimeout = () => {
      if (unlockTimeoutId !== undefined) {
        window.clearTimeout(unlockTimeoutId);
        unlockTimeoutId = undefined;
      }
    };

    const resetDelta = () => {
      accumulatedDelta = 0;
    };

    const lockSnapInput = () => {
      lockUntil = Date.now() + SNAP_DEBOUNCE_MS;
      clearUnlockTimeout();
      unlockTimeoutId = window.setTimeout(() => {
        lockUntil = 0;
        resetDelta();
      }, SNAP_DEBOUNCE_MS);
    };

    const getCurrentSectionIndex = () => {
      const currentTop = wrapper.scrollTop;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      sections.forEach((section, index) => {
        const distance = Math.abs(section.offsetTop - currentTop);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      return nearestIndex;
    };

    const snapToDirection = (direction: -1 | 1) => {
      const currentIndex = getCurrentSectionIndex();
      const targetIndex = Math.max(
        0,
        Math.min(sections.length - 1, currentIndex + direction),
      );

      if (targetIndex === currentIndex) {
        resetDelta();
        return;
      }

      const targetTop = sections[targetIndex].offsetTop;
      wrapper.scrollTo({ top: targetTop, behavior: "smooth" });
      lockSnapInput();
      resetDelta();
    };

    const maybeSnap = () => {
      if (Math.abs(accumulatedDelta) < SNAP_DELTA_THRESHOLD) {
        return;
      }

      const direction = accumulatedDelta > 0 ? 1 : -1;
      snapToDirection(direction);
    };

    const handleWheel = (event: WheelEvent) => {
      if (!snapEnabled || Date.now() < lockUntil) {
        return;
      }

      event.preventDefault();
      accumulatedDelta += event.deltaY;
      maybeSnap();
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (!snapEnabled || Date.now() < lockUntil) {
        return;
      }

      touchStartY = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!snapEnabled || Date.now() < lockUntil || touchStartY === null) {
        return;
      }

      const currentY = event.touches[0]?.clientY;
      if (currentY === undefined) {
        return;
      }

      event.preventDefault();
      const deltaY = touchStartY - currentY;
      touchStartY = currentY;
      accumulatedDelta += deltaY;
      maybeSnap();
    };

    const handleTouchEnd = () => {
      touchStartY = null;
      resetDelta();
    };

    const handleScroll = () => {
      const currentScrollTop = wrapper.scrollTop;
      isScrollingUp = currentScrollTop < previousScrollTop;
      previousScrollTop = currentScrollTop;
    };

    const addGestureListeners = () => {
      if (listenersAttached) {
        return;
      }

      wrapper.addEventListener("wheel", handleWheel, { passive: false });
      wrapper.addEventListener("touchstart", handleTouchStart, { passive: true });
      wrapper.addEventListener("touchmove", handleTouchMove, { passive: false });
      wrapper.addEventListener("touchend", handleTouchEnd, { passive: true });
      listenersAttached = true;
    };

    const removeGestureListeners = () => {
      if (!listenersAttached) {
        return;
      }

      wrapper.removeEventListener("wheel", handleWheel);
      wrapper.removeEventListener("touchstart", handleTouchStart);
      wrapper.removeEventListener("touchmove", handleTouchMove);
      wrapper.removeEventListener("touchend", handleTouchEnd);
      listenersAttached = false;
      touchStartY = null;
      resetDelta();
    };

    const disableSnap = () => {
      if (!snapEnabled) {
        return;
      }

      snapEnabled = false;
      removeGestureListeners();
    };

    const enableSnap = () => {
      if (snapEnabled) {
        return;
      }

      snapEnabled = true;
      addGestureListeners();
    };

    wrapper.addEventListener("scroll", handleScroll, { passive: true });
    addGestureListeners();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        if (entry.intersectionRatio >= 0.8) {
          disableSnap();
          return;
        }

        if (isScrollingUp) {
          enableSnap();
        }
      },
      { root: wrapper, threshold: 0.8 },
    );

    observer.observe(lastSection);

    return () => {
      clearUnlockTimeout();
      observer.disconnect();
      removeGestureListeners();
      wrapper.removeEventListener("scroll", handleScroll);
    };
  }, [sectionRefs]);

  return wrapperRef;
}
