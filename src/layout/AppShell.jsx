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
        <div className="shell-global-backdrop" data-shell-slot="global-backdrop" aria-hidden="true"></div>

        <div className="page-main__layout">
          <div className="shell-side shell-side--left" data-shell-slot="side-left" aria-hidden="true"></div>

          <div className="page-main__center">
            <div ref={shellRef} className={`poster-frame page-shell page-shell--${routeId}`} data-page={routeId}>
              <div className="shell-poster-slot shell-poster-slot--top" data-shell-slot="poster-top" aria-hidden="true"></div>
              <SiteNav isScrolled={isNavScrolled} />
              <SunLayer routeId={routeId} />

              <RouteTransitionManager scene={outlet} pathname={pathname} routeId={routeId} direction={direction} />
              <div
                className="shell-poster-slot shell-poster-slot--bottom"
                data-shell-slot="poster-bottom"
                aria-hidden="true"
              ></div>
              <div className="decorative-bottom-bar"></div>
            </div>
          </div>

          <div className="shell-side shell-side--right" data-shell-slot="side-right" aria-hidden="true"></div>
        </div>

        <div className="shell-global-overlay" data-shell-slot="global-overlay" aria-hidden="true"></div>
      </main>

      <WindOverlay transitionKey={pathname} direction={direction} />
    </>
  );
}
