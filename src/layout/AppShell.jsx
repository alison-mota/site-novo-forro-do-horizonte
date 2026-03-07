import { useOutlet } from "react-router-dom";
import SiteNav from "../components/SiteNav.jsx";
import SunLayer from "../components/SunLayer.jsx";
import WindOverlay from "../components/WindOverlay.jsx";
import { useRouteState } from "../lib/useRouteState.js";
import RouteTransitionManager from "./RouteTransitionManager.jsx";

export default function AppShell() {
  const outlet = useOutlet();
  const { pathname, routeId, direction } = useRouteState();

  return (
    <>
      <div className="bg-grain"></div>
      <div className="bg-vignette"></div>

      <main className="page-main">
        <div className={`poster-frame page-shell page-shell--${routeId}`} data-page={routeId}>
          <SiteNav />
          <SunLayer routeId={routeId} />

          <RouteTransitionManager scene={outlet} pathname={pathname} routeId={routeId} direction={direction} />
          <div className="decorative-bottom-bar"></div>
        </div>
      </main>

      <WindOverlay transitionKey={pathname} direction={direction} />
    </>
  );
}
