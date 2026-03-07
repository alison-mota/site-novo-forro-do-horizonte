export const routeOrder = ["home", "agenda", "biografia", "galeria", "contato"];

export const routeMeta = {
  home: { id: "home", navId: "index", path: "/", label: "HOME", sublabel: "FORRÓ DO HORIZONTE" },
  agenda: { id: "agenda", navId: "agenda", path: "/agenda", label: "AGENDA", sublabel: "SHOWS" },
  biografia: { id: "biografia", navId: "biografia", path: "/biografia", label: "BIO", sublabel: "HISTÓRIA" },
  galeria: { id: "galeria", navId: "galeria", path: "/galeria", label: "GALERIA", sublabel: "FOTOS" },
  contato: { id: "contato", navId: "contato", path: "/contato", label: "CONTATO", sublabel: "FALE CONOSCO" },
};

export const navData = {
  home: routeMeta.home,
  center: [routeMeta.agenda, routeMeta.biografia, routeMeta.galeria],
  contact: routeMeta.contato,
};

export function getRouteId(pathname) {
  if (!pathname || pathname === "/") {
    return "home";
  }

  const cleanPath = pathname.replace(/\/+$/, "");

  switch (cleanPath) {
    case "/agenda":
      return "agenda";
    case "/biografia":
      return "biografia";
    case "/galeria":
      return "galeria";
    case "/contato":
      return "contato";
    default:
      return "home";
  }
}

export function getRouteDirection(fromPathname, toPathname) {
  const fromIndex = routeOrder.indexOf(getRouteId(fromPathname));
  const toIndex = routeOrder.indexOf(getRouteId(toPathname));

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return 1;
  }

  return toIndex > fromIndex ? 1 : -1;
}
