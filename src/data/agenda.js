import { eventCatalog, sortEventsByDate, toAgendaEvent } from "./events.js";

export const agendaData = sortEventsByDate(eventCatalog).map(toAgendaEvent);
