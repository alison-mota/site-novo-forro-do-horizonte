import { useLocation } from "react-router-dom";
import { useRef } from "react";
import { getRouteDirection, getRouteId } from "./routes.js";

export function useRouteState() {
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);
  const directionRef = useRef(1);

  if (previousPathRef.current !== location.pathname) {
    directionRef.current = getRouteDirection(previousPathRef.current, location.pathname);
    previousPathRef.current = location.pathname;
  }

  return {
    pathname: location.pathname,
    routeId: getRouteId(location.pathname),
    direction: directionRef.current,
  };
}
