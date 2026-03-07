export const sunRouteConfig = {
  home: {
    y: "0%",
    opacity: 0.92,
  },
  agenda: {
    y: "-30%",
    opacity: 0.4,
  },
  biografia: {
    y: "-20%",
    opacity: 0.3,
  },
  galeria: {
    y: "-10%",
    opacity: 0.2,
  },
  contato: {
    y: "20%",
    opacity: 0.2,
  },
};

export function getSunRouteConfig(routeId) {
  return sunRouteConfig[routeId] ?? sunRouteConfig.home;
}
