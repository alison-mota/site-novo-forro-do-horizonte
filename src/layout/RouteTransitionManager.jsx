import { AnimatePresence } from "framer-motion";
import PageScene from "./PageScene.jsx";

export default function RouteTransitionManager({ scene, pathname, routeId, direction }) {
  return (
    <div className="page-scene-host">
      <AnimatePresence initial={false} mode="sync">
        <PageScene key={pathname} routeId={routeId} direction={direction}>
          {scene}
        </PageScene>
      </AnimatePresence>
    </div>
  );
}
