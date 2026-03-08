import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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

export default function SiteNav({ isScrolled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <nav className={`site-nav ${isScrolled ? "site-nav--scrolled" : ""} ${isOpen ? "site-nav--open" : ""}`.trim()}>
        <div className="site-nav__desktop-only">
          {renderLink(navData.home, "site-nav__link--left")}
        </div>

        <div className="site-nav__group site-nav__group--desktop">
          {navData.center.map((item) => renderLink(item, "site-nav__link--center"))}
        </div>

        <div className="site-nav__desktop-only">
          {renderLink(navData.contact, "site-nav__link--right")}
        </div>

        <button
          className="site-nav__toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
        >
          <span className={`site-nav__toggle-bar ${isOpen ? "is-open" : ""}`}></span>
          <span className={`site-nav__toggle-bar ${isOpen ? "is-open" : ""}`}></span>
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="site-nav-mobile"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          >
            <div className="site-nav-mobile__content">
              {renderLink(navData.home, "site-nav__link--mobile")}
              {navData.center.map((item) => renderLink(item, "site-nav__link--mobile"))}
              {renderLink(navData.contact, "site-nav__link--mobile")}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
