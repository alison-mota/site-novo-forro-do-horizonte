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

    expect(shellFrame).toBeInTheDocument();
    expect(siteNav).toBeInTheDocument();
    expect(document.querySelector(".sun-layer-stack")).toBeInTheDocument();
    expect(document.querySelectorAll(".sun-wrap")).toHaveLength(1);
    expect(document.querySelectorAll(".sun-layer-scene")).toHaveLength(1);
    expect(document.querySelector(".page-shell--home")).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: /agenda shows/i }));

    expect(await screen.findByRole("heading", { name: /próximos shows/i })).toBeInTheDocument();
    expect(document.querySelector(".poster-frame")).toBe(shellFrame);
    expect(screen.getByRole("navigation")).toBe(siteNav);
    expect(document.querySelectorAll(".sun-wrap")).toHaveLength(1);
    expect(document.querySelectorAll(".sun-layer-scene")).toHaveLength(1);
    expect(document.querySelector(".page-shell--agenda")).toBeInTheDocument();
  });
});
