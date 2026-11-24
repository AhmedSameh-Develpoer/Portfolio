import type { PortfolioItem, WorkCategory } from "./portfolio-data";

const categories: WorkCategory[] = [
  "Shorts",
  "AI Videos",
  "Commercials",
  "Real Estate",
  "Gaming",
  "Vlogs",
];

type DriveSyncItem = {
  id: string;
  createdTime?: string;
  title?: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  role?: string;
  category?: string;
  categories?: string[];
};

// Every video in the Drive folder, whether Gemini has described it or not.
type DriveFile = {
  id: string;
  name?: string;
  folder?: string;
  createdTime?: string;
};

type DriveSyncResponse = {
  updatedAt: string | null;
  refresh: { processed?: number; error?: string; skipped?: string } | null;
  items: DriveSyncItem[];
  files?: DriveFile[];
  failed: { name: string; attempts: number; error: string }[];
};

export type DriveSyncResult = {
  items: PortfolioItem[];
  files: DriveFile[];
  updatedAt: string | null;
  processed: number;
  failed: DriveSyncResponse["failed"];
  error?: string;
};

// Category for videos Gemini has not described yet, from their Drive folder name.
const folderCategories: [RegExp, WorkCategory][] = [
  [/chatgpt|\bai\b/i, "AI Videos"],
  [/real\s*e?state|عقار/i, "Real Estate"],
  [/hero|beef|gam|league/i, "Gaming"],
  [/ali|vlog|فلوج/i, "Vlogs"],
  [/ad|commercial|اعلان|إعلان/i, "Commercials"],
];

function isCategory(value: unknown): value is WorkCategory {
  return categories.includes(value as WorkCategory);
}

function driveUrl(id: string) {
  return `https://drive.google.com/file/d/${id}/view`;
}

function toPortfolioItem(item: DriveSyncItem): PortfolioItem | null {
  if (!item.id || !item.title || !isCategory(item.category)) {
    return null;
  }

  const itemCategories = (item.categories ?? []).filter(isCategory);

  return {
    title: item.title,
    titleAr: item.titleAr || item.title,
    category: item.category,
    categories: itemCategories.length ? itemCategories : [item.category],
    youtubeUrl: driveUrl(item.id),
    description: item.description ?? "",
    descriptionAr: item.descriptionAr || item.description || "",
    role: item.role ?? "",
    uploadedAt: item.createdTime,
  };
}

/** A card for a video Gemini has not described yet: title from the file name, category from the folder. */
function toPendingItem(file: DriveFile): PortfolioItem {
  const title =
    (file.name ?? "")
      .replace(/\.[a-z0-9]{2,4}$/i, "")
      .replace(/[_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim() || "Untitled video";
  const category =
    folderCategories.find(([pattern]) => pattern.test(file.folder ?? ""))?.[1] ?? "Shorts";

  return {
    title,
    titleAr: title,
    category,
    categories: category === "Shorts" ? ["Shorts"] : ["Shorts", category],
    youtubeUrl: driveUrl(file.id),
    // Empty fields are filled with the category's generic copy by the app.
    description: "",
    descriptionAr: "",
    role: "",
    uploadedAt: file.createdTime,
  };
}

/** Loads the videos the Apps Script has described; `refresh` processes new uploads first. */
export async function fetchDriveWork(
  endpoint: string,
  options: { refresh?: boolean; token?: string } = {},
): Promise<DriveSyncResult> {
  const url = new URL(endpoint);
  if (options.refresh) {
    url.searchParams.set("refresh", "1");
    if (options.token) {
      url.searchParams.set("token", options.token);
    }
  }

  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`Drive sync failed (${response.status})`);
  }

  const data = (await response.json()) as DriveSyncResponse;

  return {
    items: (data.items ?? []).map(toPortfolioItem).filter((item): item is PortfolioItem => !!item),
    files: data.files ?? [],
    updatedAt: data.updatedAt,
    processed: data.refresh?.processed ?? 0,
    failed: data.failed ?? [],
    error: data.refresh?.error,
  };
}

function uploadTime(item: PortfolioItem) {
  const time = item.uploadedAt ? Date.parse(item.uploadedAt) : NaN;
  return Number.isNaN(time) ? -Infinity : time;
}

/**
 * Builds the work list from the hand-listed videos plus every other video in
 * the Drive folder (Gemini's card when it has one, a pending card otherwise),
 * sorted by upload date, newest first. Videos with no date keep their order at
 * the end.
 */
export function mergeDriveWork<T extends PortfolioItem>(
  listed: T[],
  sync: Pick<DriveSyncResult, "items" | "files"> | null,
  getDriveFileId: (url: string) => string,
): (T | PortfolioItem)[] {
  const files = sync?.files ?? [];
  const fileDates = new Map(files.map((file) => [file.id, file.createdTime]));

  const dated = listed.map((item) => {
    const driveDate = fileDates.get(getDriveFileId(item.youtubeUrl));
    return !item.uploadedAt && driveDate ? { ...item, uploadedAt: driveDate } : item;
  });

  const shown = new Set(listed.map((item) => getDriveFileId(item.youtubeUrl)).filter(Boolean));
  const described = (sync?.items ?? []).filter((item) => {
    const id = getDriveFileId(item.youtubeUrl);
    if (shown.has(id)) {
      return false;
    }
    shown.add(id);
    return true;
  });
  const pending = files.filter((file) => !shown.has(file.id)).map(toPendingItem);

  // Array.prototype.sort is stable, so undated videos keep their listed order.
  return [...described, ...pending, ...dated].sort((a, b) => uploadTime(b) - uploadTime(a));
}
