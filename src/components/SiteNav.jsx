import { NavLink } from "react-router-dom";
import { navData } from "../lib/routes.js";

function renderLink(item, alignmentClass = "") {
  return (
    <NavLink
      key={item.id}
      to={item.path}
      className={({ isActive }) =>
        ["micro-text", "site-nav__link", alignmentClass, isActive ? "is-active" : ""].filter(Boolean).join(" ")
      }
      end={item.path === "/"}
    >
      <div>{item.label}</div>
      <div className="site-nav__sublabel">{item.sublabel}</div>
    </NavLink>
  );
}

export default function SiteNav() {
  return (
    <nav className="site-nav">
      {renderLink(navData.home, "site-nav__link--left")}
      <div className="site-nav__group">
        {navData.center.map((item) => renderLink(item, "site-nav__link--center"))}
      </div>
      {renderLink(navData.contact, "site-nav__link--right")}
    </nav>
  );
}
