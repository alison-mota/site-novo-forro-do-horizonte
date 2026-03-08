import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppShell from "./layout/AppShell.jsx";
import AgendaPage from "./pages/AgendaPage.jsx";
import BiografiaPage from "./pages/BiografiaPage.jsx";
import ContatoPage from "./pages/ContatoPage.jsx";
import GaleriaEventoPage from "./pages/GaleriaEventoPage.jsx";
import GaleriaPage from "./pages/GaleriaPage.jsx";
import HomePage from "./pages/HomePage.jsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/biografia" element={<BiografiaPage />} />
        <Route path="/galeria" element={<GaleriaPage />} />
        <Route path="/galeria/:eventSlug" element={<GaleriaEventoPage />} />
        <Route path="/contato" element={<ContatoPage />} />
      </Route>
    </Routes>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </BrowserRouter>
  );
}
