import { useEffect, useRef, useState } from "react";
import { useOutlet } from "react-router-dom";
import SiteNav from "../components/SiteNav.jsx";
import SunLayer from "../components/SunLayer.jsx";
import WindOverlay from "../components/WindOverlay.jsx";
import { useRouteState } from "../lib/useRouteState.js";
import RouteTransitionManager from "./RouteTransitionManager.jsx";

export default function AppShell() {
  const outlet = useOutlet();
  const { pathname, routeId, direction } = useRouteState();
  const shellRef = useRef(null);
  const [isNavScrolled, setIsNavScrolled] = useState(false);

  useEffect(() => {
    const shellElement = shellRef.current;
    if (!shellElement) {
      return undefined;
    }

    let cleanupScrollListener = () => {};

    const attachScrollListener = () => {
      const scrollContainers = shellElement.querySelectorAll(".content-scroll");
      const activeScrollContainer = scrollContainers[scrollContainers.length - 1];

      if (!activeScrollContainer) {
        setIsNavScrolled(false);
        return () => {};
      }

      const handleScroll = () => {
        setIsNavScrolled(activeScrollContainer.scrollTop > 8);
      };

      handleScroll();
      activeScrollContainer.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        activeScrollContainer.removeEventListener("scroll", handleScroll);
      };
    };

    cleanupScrollListener = attachScrollListener();

    const observer = new MutationObserver(() => {
      cleanupScrollListener();
      cleanupScrollListener = attachScrollListener();
    });

    observer.observe(shellElement, { childList: true, subtree: true });

    return () => {
      cleanupScrollListener();
      observer.disconnect();
    };
  }, [pathname]);

  return (
    <>
      <div className="bg-grain"></div>
      <div className="bg-vignette"></div>

      <main className="page-main">
        <div ref={shellRef} className={`poster-frame page-shell page-shell--${routeId}`} data-page={routeId}>
          <SiteNav isScrolled={isNavScrolled} />
          <SunLayer routeId={routeId} />

          <RouteTransitionManager scene={outlet} pathname={pathname} routeId={routeId} direction={direction} />
          <div className="decorative-bottom-bar"></div>
        </div>
      </main>

      <WindOverlay transitionKey={pathname} direction={direction} />
    </>
  );
}
