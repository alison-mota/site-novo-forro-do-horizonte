const GOOGLE_DRIVE_API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY || "";

export function hasGoogleDriveApiKey() {
  return Boolean(GOOGLE_DRIVE_API_KEY);
}

function isDriveFile(value) {
  return value && typeof value === "object" && typeof value.id === "string" && typeof value.name === "string";
}

export function getGoogleDriveImageUrl(fileId, size = "full") {
  if (size === "thumbnail") {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000-h1000`;
  }

  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

export function extractFolderIdFromLink(link) {
  const patterns = [/\/folders\/([a-zA-Z0-9_-]+)/, /id=([a-zA-Z0-9_-]+)/];

  for (const pattern of patterns) {
    const match = String(link || "").match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return undefined;
}

export async function fetchDriveFolderFiles(folderId) {
  if (!GOOGLE_DRIVE_API_KEY) {
    console.warn("Google Drive API Key não configurada. Configure VITE_GOOGLE_DRIVE_API_KEY.");
    return [];
  }

  const files = [];
  let pageToken;

  try {
    do {
      const query = `'${folderId}' in parents and trashed=false and mimeType contains 'image/'`;
      const fields = "nextPageToken,files(id,name,mimeType,webContentLink,thumbnailLink)";
      const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&pageSize=1000${pageToken ? `&pageToken=${pageToken}` : ""}&key=${GOOGLE_DRIVE_API_KEY}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro ao buscar arquivos do Google Drive: ${response.status}`);
      }

      const data = await response.json();
      const incomingFiles = Array.isArray(data.files) ? data.files.filter(isDriveFile) : [];

      const imageFiles = incomingFiles
        .filter((file) => file.name.trim() && String(file.mimeType || "").startsWith("image/"))
        .filter((file, index, list) => index === list.findIndex((candidate) => candidate.id === file.id))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));

      files.push(...imageFiles);
      pageToken = data.nextPageToken;
    } while (pageToken);

    return files
      .filter((file, index, list) => index === list.findIndex((candidate) => candidate.id === file.id))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
  } catch (error) {
    console.error("Erro ao buscar arquivos do Google Drive:", error);
    return [];
  }
}

function buildDriveUrl(file) {
  if (file.webContentLink) {
    let url = file.webContentLink.replace("&export=download", "").replace("export=download", "export=view");

    if (!url.includes("export=")) {
      url += `${url.includes("?") ? "&" : "?"}export=view`;
    }

    return url;
  }

  if (file.thumbnailLink) {
    return file.thumbnailLink.replace(/=s\d+/, "=s2000");
  }

  return getGoogleDriveImageUrl(file.id, "full");
}

export async function processEventWithDriveFolder(event) {
  const folderId = event.driveFolderId || extractFolderIdFromLink(event.driveFolderLink);
  if (!folderId) {
    return event;
  }

  const files = await fetchDriveFolderFiles(folderId);
  if (!files.length) {
    return {
      ...event,
      driveFolderId: folderId,
      driveImageIds: [],
      images: [],
    };
  }

  const uniqueUrls = [];
  const seenUrls = new Set();

  for (const file of files) {
    const url = buildDriveUrl(file);
    if (url && !seenUrls.has(url)) {
      seenUrls.add(url);
      uniqueUrls.push(url);
    }
  }

  const fileIds = [];
  const seenIds = new Set();

  for (const file of files) {
    const url = buildDriveUrl(file);
    if (url && seenUrls.has(url) && !seenIds.has(file.id)) {
      seenIds.add(file.id);
      fileIds.push(file.id);
    }
  }

  const previewImage = event.previewImage || uniqueUrls[0] || "";

  return {
    ...event,
    driveFolderId: folderId,
    driveImageIds: fileIds,
    previewImage,
    images: uniqueUrls,
  };
}
