import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../router.jsx";

describe("AppShell", () => {
  it("mantém o shell persistente ao navegar entre rotas", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    const shellFrame = document.querySelector(".poster-frame");
    const siteNav = screen.getByRole("navigation");
    const leftSlot = document.querySelector('[data-shell-slot="side-left"]');
    const rightSlot = document.querySelector('[data-shell-slot="side-right"]');
    const overlaySlot = document.querySelector('[data-shell-slot="global-overlay"]');
    const posterTopSlot = document.querySelector('[data-shell-slot="poster-top"]');

    expect(shellFrame).toBeInTheDocument();
    expect(siteNav).toBeInTheDocument();
    expect(document.querySelector(".sun-layer-stack")).toBeInTheDocument();
    expect(document.querySelectorAll(".sun-wrap")).toHaveLength(1);
    expect(document.querySelectorAll(".sun-layer-scene")).toHaveLength(1);
    expect(leftSlot).toBeInTheDocument();
    expect(rightSlot).toBeInTheDocument();
    expect(overlaySlot).toBeInTheDocument();
    expect(posterTopSlot).toBeInTheDocument();
    expect(document.querySelector(".page-shell--home")).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: /agenda shows/i }));

    expect(document.querySelector(".events-list")).toBeInTheDocument();
    expect(document.querySelector(".poster-frame")).toBe(shellFrame);
    expect(screen.getByRole("navigation")).toBe(siteNav);
    expect(document.querySelector('[data-shell-slot="side-left"]')).toBe(leftSlot);
    expect(document.querySelector('[data-shell-slot="side-right"]')).toBe(rightSlot);
    expect(document.querySelector('[data-shell-slot="global-overlay"]')).toBe(overlaySlot);
    expect(document.querySelector('[data-shell-slot="poster-top"]')).toBe(posterTopSlot);
    expect(document.querySelectorAll(".sun-wrap")).toHaveLength(1);
    expect(document.querySelectorAll(".sun-layer-scene")).toHaveLength(1);
    expect(document.querySelector(".page-shell--agenda")).toBeInTheDocument();
  });
});
