/**
 * Portfolio Drive sync (Google Apps Script).
 *
 * Watches a Drive folder, asks Gemini to watch each new video and write its
 * portfolio card (titles, descriptions, role, category), and serves the results
 * as JSON for the site. Setup steps: apps-script/README.md.
 *
 * Script properties:
 *   GEMINI_API_KEY  required. Key from Google AI Studio.
 *   GEMINI_MODEL    optional. Defaults to DEFAULT_MODEL below.
 *   REFRESH_TOKEN   optional. When set, ?refresh=1 also needs &token=<value>.
 */

const CONFIG = {
  folderId: "117JAPkARLRjf54Rlsgmg8LLVzD23j7w_",
  categories: ["Shorts", "AI Videos", "Commercials", "Real Estate", "Gaming", "Vlogs"],
  // Apps Script stops a run after 6 minutes, so each run handles a few videos
  // and starts no new one after runBudgetMs; the rest wait for the next run.
  maxVideosPerRun: 3,
  runBudgetMs: 4 * 60 * 1000,
  // Sending a video holds about twice its size in memory, and Apps Script runs
  // out of memory well before its 50 MB request limit. Bigger videos are
  // described from their Drive thumbnail and file name instead.
  maxUploadBytes: 20 * 1024 * 1024,
  maxAttempts: 3,
  // Set to true to make each new video "anyone with the link can view", which
  // the site needs to show its thumbnail and player.
  shareNewVideos: false,
};

const DEFAULT_MODEL = "gemini-3.8-flash";
const API_ROOT = "https://generativelanguage.googleapis.com";

/* ---------- Entry points ---------- */

/** Time-driven trigger target: describes videos not processed yet. */
function processNewVideos() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) {
    return { skipped: "already running" };
  }

  try {
    const startedAt = Date.now();
    const store = PropertiesService.getScriptProperties();
    const folderNames = {};
    const videos = listVideos_(DriveApp.getFolderById(CONFIG.folderId), [], folderNames);
    saveFileIndex_(store, videos, folderNames);
    let processed = 0;

    for (const file of videos) {
      if (processed >= CONFIG.maxVideosPerRun || Date.now() - startedAt > CONFIG.runBudgetMs) {
        break;
      }

      const key = "video:" + file.getId();
      const previous = parse_(store.getProperty(key));
      if (previous && (previous.status === "done" || previous.attempts >= CONFIG.maxAttempts)) {
        continue;
      }

      processed++;
      const base = {
        id: file.getId(),
        name: file.getName(),
        createdTime: file.getDateCreated().toISOString(),
      };

      try {
        const details = describeVideo_(file);
        if (CONFIG.shareNewVideos) {
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        }
        store.setProperty(key, JSON.stringify(Object.assign({ status: "done" }, base, details)));
      } catch (error) {
        // Busy/rate-limit replies (429, 5xx) are temporary, so they do not use up an attempt.
        const transient = /\((429|5\d\d)\)/.test(String(error));
        const attempts = (previous && previous.attempts ? previous.attempts : 0) + (transient ? 0 : 1);
        store.setProperty(
          key,
          JSON.stringify(
            Object.assign({ status: "error", attempts: attempts, error: String(error).slice(0, 300) }, base),
          ),
        );
      }
    }

    store.setProperty("updatedAt", new Date().toISOString());
    return { processed: processed };
  } finally {
    lock.releaseLock();
  }
}

/** Web app: GET returns the described videos; ?refresh=1 processes new ones first. */
function doGet(e) {
  const params = (e && e.parameter) || {};
  const store = PropertiesService.getScriptProperties();
  let refresh = null;

  if (params.refresh) {
    const token = store.getProperty("REFRESH_TOKEN");
    if (token && params.token !== token) {
      refresh = { error: "invalid token" };
    } else {
      try {
        refresh = processNewVideos();
      } catch (error) {
        refresh = { error: String(error) };
      }
    }
  }

  const all = store.getProperties();
  const files = Object.keys(all)
    .filter((key) => key.indexOf("file:") === 0)
    .map((key) => Object.assign({ id: key.slice(5) }, parse_(all[key])))
    .sort((a, b) => (a.createdTime < b.createdTime ? 1 : -1));
  const inFolder = {};
  files.forEach((file) => {
    inFolder[file.id] = true;
  });
  const hasIndex = files.length > 0;

  const entries = Object.keys(all)
    .filter((key) => key.indexOf("video:") === 0)
    .map((key) => parse_(all[key]))
    .filter(Boolean)
    // Videos deleted from the folder are no longer in the file index.
    .filter((entry) => !hasIndex || inFolder[entry.id]);

  const body = {
    updatedAt: all.updatedAt || null,
    refresh: refresh,
    items: entries
      .filter((entry) => entry.status === "done")
      .sort((a, b) => (a.createdTime < b.createdTime ? 1 : -1)),
    // Every video in the folder (name, folder, upload time), described or not.
    files: files,
    failed: entries
      .filter((entry) => entry.status === "error")
      .map((entry) => ({ name: entry.name, attempts: entry.attempts, error: entry.error })),
  };

  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/** Run once from the editor: checks the folder every 15 minutes. */
function installTrigger() {
  ScriptApp.getProjectTriggers()
    .filter((trigger) => trigger.getHandlerFunction() === "processNewVideos")
    .forEach((trigger) => ScriptApp.deleteTrigger(trigger));
  ScriptApp.newTrigger("processNewVideos").timeBased().everyMinutes(15).create();
}

/** Run from the editor to describe every video again (e.g. after changing the prompt). */
function forgetAllVideos() {
  const store = PropertiesService.getScriptProperties();
  Object.keys(store.getProperties())
    .filter((key) => key.indexOf("video:") === 0)
    .forEach((key) => store.deleteProperty(key));
}

/* ---------- Drive ---------- */

/** Collects every video under `folder`; `folderNames` maps file id to its folder's name. */
function listVideos_(folder, out, folderNames) {
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    if (String(file.getMimeType()).indexOf("video/") === 0) {
      out.push(file);
      folderNames[file.getId()] = folder.getName();
    }
  }
  const folders = folder.getFolders();
  while (folders.hasNext()) {
    listVideos_(folders.next(), out, folderNames);
  }
  // Newest first, so fresh uploads are described before the older backlog.
  return out.sort((a, b) => b.getDateCreated() - a.getDateCreated());
}

/**
 * Stores "file:<fileId>" = {name, folder, createdTime} for every video in the
 * folder, so the site can show and sort all of them (described or not), and
 * drops entries for videos that were deleted.
 */
function saveFileIndex_(store, videos, folderNames) {
  const current = {};
  videos.forEach((file) => {
    current["file:" + file.getId()] = JSON.stringify({
      name: file.getName(),
      folder: folderNames[file.getId()] || "",
      createdTime: file.getDateCreated().toISOString(),
    });
  });
  Object.keys(store.getProperties())
    // "date:" keys came from an earlier version of this script.
    .filter((key) => (key.indexOf("file:") === 0 && !current[key]) || key.indexOf("date:") === 0)
    .forEach((key) => store.deleteProperty(key));
  store.setProperties(current);
}

/* ---------- Gemini ---------- */

function describeVideo_(file) {
  if (file.getSize() <= CONFIG.maxUploadBytes) {
    const uploaded = uploadFile_(file.getBlob(), file.getName());
    try {
      const ready = waitUntilActive_(uploaded);
      return generate_(
        [{ file_data: { mime_type: ready.mimeType, file_uri: ready.uri } }],
        file.getName(),
        "the video",
      );
    } finally {
      deleteFile_(uploaded.name);
    }
  }

  const thumbnail = file.getThumbnail();
  if (!thumbnail) {
    throw new Error("Video is over the upload limit and has no thumbnail");
  }
  const details = generate_(
    [
      {
        inline_data: {
          mime_type: thumbnail.getContentType() || "image/png",
          data: Utilities.base64Encode(thumbnail.getBytes()),
        },
      },
    ],
    file.getName(),
    "a single frame from the video (the full video was too large to send)",
  );
  details.source = "thumbnail";
  return details;
}

function uploadFile_(blob, displayName) {
  const bytes = blob.getBytes();
  const mimeType = blob.getContentType() || "video/mp4";

  const start = UrlFetchApp.fetch(API_ROOT + "/upload/v1beta/files", {
    method: "post",
    contentType: "application/json",
    headers: {
      "x-goog-api-key": apiKey_(),
      "X-Goog-Upload-Protocol": "resumable",
      "X-Goog-Upload-Command": "start",
      "X-Goog-Upload-Header-Content-Length": String(bytes.length),
      "X-Goog-Upload-Header-Content-Type": mimeType,
    },
    payload: JSON.stringify({ file: { display_name: displayName } }),
    muteHttpExceptions: true,
  });
  check_(start, "start upload");

  const uploadUrl = header_(start, "x-goog-upload-url");
  const finish = UrlFetchApp.fetch(uploadUrl, {
    method: "post",
    contentType: mimeType,
    headers: { "X-Goog-Upload-Offset": "0", "X-Goog-Upload-Command": "upload, finalize" },
    payload: bytes,
    muteHttpExceptions: true,
  });
  check_(finish, "upload");
  return JSON.parse(finish.getContentText()).file;
}

function waitUntilActive_(file) {
  let current = file;
  for (let i = 0; i < 40 && current.state === "PROCESSING"; i++) {
    Utilities.sleep(3000);
    const res = UrlFetchApp.fetch(API_ROOT + "/v1beta/" + file.name, {
      headers: { "x-goog-api-key": apiKey_() },
      muteHttpExceptions: true,
    });
    check_(res, "check upload");
    current = JSON.parse(res.getContentText());
  }
  if (current.state !== "ACTIVE") {
    throw new Error("Gemini could not process the video (state " + current.state + ")");
  }
  return current;
}

function deleteFile_(name) {
  UrlFetchApp.fetch(API_ROOT + "/v1beta/" + name, {
    method: "delete",
    headers: { "x-goog-api-key": apiKey_() },
    muteHttpExceptions: true,
  });
}

function generate_(mediaParts, fileName, sourceLabel) {
  const prompt = [
    "You write portfolio cards for Ahmed Sameh, a short-form and commercial video editor.",
    "You are given " + sourceLabel + ' and its file name: "' + fileName + '".',
    "Describe what this edit is and what it is for. Use the client, brand or creator name when it is visible or in the file name.",
    "Only state what you can see or hear; do not invent facts, numbers or results.",
    "Fields:",
    "- title: English, at most 6 words.",
    "- titleAr: Arabic, at most 8 words; brand names stay in Latin letters.",
    "- description: English, one sentence, at most 22 words, about the edit (purpose, pacing, captions, motion, sound).",
    "- descriptionAr: the same in natural Arabic.",
    "- role: 3 to 5 editing tasks in English separated by commas, e.g. \"Hooks, pacing, captions, sound\".",
    "- category: the single best fit from the list.",
    "- categories: every category from the list that applies, including category. Add \"Shorts\" when the video is vertical or under a minute.",
  ].join("\n");

  const body = {
    contents: [{ role: "user", parts: mediaParts.concat([{ text: prompt }]) }],
    generationConfig: {
      temperature: 0.4,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          titleAr: { type: "STRING" },
          description: { type: "STRING" },
          descriptionAr: { type: "STRING" },
          role: { type: "STRING" },
          category: { type: "STRING", enum: CONFIG.categories },
          categories: { type: "ARRAY", items: { type: "STRING", enum: CONFIG.categories } },
        },
        required: ["title", "titleAr", "description", "descriptionAr", "role", "category", "categories"],
      },
    },
  };

  const res = fetchWithRetry_(API_ROOT + "/v1beta/models/" + model_() + ":generateContent", {
    method: "post",
    contentType: "application/json",
    headers: { "x-goog-api-key": apiKey_() },
    payload: JSON.stringify(body),
    muteHttpExceptions: true,
  });
  check_(res, "generate");

  const json = JSON.parse(res.getContentText());
  const parts =
    (json.candidates && json.candidates[0] && json.candidates[0].content && json.candidates[0].content.parts) || [];
  const details = JSON.parse(parts.map((part) => part.text || "").join(""));

  const categories = (details.categories || []).filter((c) => CONFIG.categories.indexOf(c) >= 0);
  if (categories.indexOf(details.category) < 0) {
    categories.unshift(details.category);
  }

  return {
    title: details.title,
    titleAr: details.titleAr,
    description: details.description,
    descriptionAr: details.descriptionAr,
    role: details.role,
    category: details.category,
    categories: categories,
    model: model_(),
  };
}

/* ---------- Helpers ---------- */

function apiKey_() {
  const key = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
  if (!key) {
    throw new Error("Add GEMINI_API_KEY in Project Settings > Script properties");
  }
  return key;
}

function model_() {
  return PropertiesService.getScriptProperties().getProperty("GEMINI_MODEL") || DEFAULT_MODEL;
}

/** Retries when Gemini is busy or rate-limited (429/5xx), waiting longer each time. */
function fetchWithRetry_(url, options) {
  let res = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    res = UrlFetchApp.fetch(url, options);
    const code = res.getResponseCode();
    if (code !== 429 && code < 500) {
      return res;
    }
    Utilities.sleep(8000 * (attempt + 1));
  }
  return res;
}

function check_(res, step) {
  const code = res.getResponseCode();
  if (code < 200 || code >= 300) {
    throw new Error(step + " failed (" + code + "): " + res.getContentText().slice(0, 200));
  }
}

function header_(res, name) {
  const headers = res.getAllHeaders();
  const match = Object.keys(headers).find((key) => key.toLowerCase() === name);
  if (!match) {
    throw new Error("Missing " + name + " header");
  }
  return headers[match];
}

function parse_(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}
