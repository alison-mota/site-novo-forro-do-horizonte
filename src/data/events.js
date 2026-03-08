export const eventCatalog = [
  {
    id: "1",
    title: "Aniversário de 1 ano Forró do Horizonte",
    description: "Festa de comemoração de 1 ano de banda",
    date: "17 de Maio, 2025",
    location: "Faiska, Uberlândia - MG",
    driveFolderLink: "https://drive.google.com/drive/folders/1ABn_HMg9B3OzunBGxlNu19W96L_jAbe0",
    previewImage: `${import.meta.env.BASE_URL}images/events/cover/aniversario-1-ano.png`,
    images: [],
  },
  {
    id: "2",
    title: "Último forró do ano no Dboche",
    description: "Último show da banda e último forró do ano do Dboche",
    date: "30 de Dezembro, 2025",
    location: "Dboche Pub Show",
    driveFolderLink: "https://drive.google.com/drive/folders/1tm5L5Bs5-f25vk_0J-4dQITIiQZYOFQD",
    previewImage: `${import.meta.env.BASE_URL}images/events/cover/ultimo-forro-do-ano-no-dboche.jpeg`,
    images: [],
  },
  {
    id: "3",
    title: "Forró com Pimenta",
    description: "Forró do Horizonte em mais um forró com pimenta",
    date: "30 de Janeiro, 2026",
    location: "Pimenta Bar e Eventos",
    driveFolderLink: "https://drive.google.com/drive/folders/1g3QvjEn_E6-Gt7AT2T5TLRZvj91ap98v",
    previewImage: `${import.meta.env.BASE_URL}images/events/cover/forró-com-pimenta-janeiro-2026.jpg`,
    images: [],
  },
];

const monthMap = {
  janeiro: 0,
  fevereiro: 1,
  março: 2,
  marco: 2,
  abril: 3,
  maio: 4,
  junho: 5,
  julho: 6,
  agosto: 7,
  setembro: 8,
  outubro: 9,
  novembro: 10,
  dezembro: 11,
};

export function generateEventSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseEventDate(dateStr) {
  const cleaned = String(dateStr || "").toLowerCase().trim();

  const longFormat = cleaned.match(/^(\d{1,2})\s+de\s+([a-zçãõáéíóú]+)\s*,?\s*(?:de\s*)?(\d{4})$/i);
  if (longFormat) {
    const day = Number.parseInt(longFormat[1], 10);
    const month = monthMap[longFormat[2].trim()];
    const year = Number.parseInt(longFormat[3], 10);

    if (!Number.isNaN(day) && month !== undefined && !Number.isNaN(year)) {
      return new Date(year, month, day);
    }
  }

  const shortFormat = cleaned.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (shortFormat) {
    const day = Number.parseInt(shortFormat[1], 10);
    const month = Number.parseInt(shortFormat[2], 10) - 1;
    const year = Number.parseInt(shortFormat[3], 10);

    if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
      return new Date(year, month, day);
    }
  }

  return new Date(0);
}

export function sortEventsByDate(events) {
  return [...events].sort((a, b) => parseEventDate(b.date).getTime() - parseEventDate(a.date).getTime());
}

export function getEventDateParts(dateStr) {
  const date = parseEventDate(dateStr);

  if (Number.isNaN(date.getTime()) || date.getTime() === 0) {
    return { month: "DATA", day: "--", year: "----" };
  }

  return {
    month: date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase(),
    day: String(date.getDate()).padStart(2, "0"),
    year: date.getFullYear(),
  };
}

export function toAgendaEvent(event) {
  const date = getEventDateParts(event.date);

  return {
    month: date.month,
    day: date.day,
    title: event.title,
    location: event.location.toUpperCase(),
    ctaLabel: "Fotos",
    ctaTo: `/galeria/${generateEventSlug(event.title)}`,
  };
}
