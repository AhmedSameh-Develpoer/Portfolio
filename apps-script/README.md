# Drive sync

`drive-sync.gs` watches the portfolio Drive folder. When a video is uploaded,
it sends the video to Gemini, which writes the card for it (English and Arabic
title and description, editing role, category). The site reads the results and
shows those videos at the top of the work grid, newest upload first; the first
one gets the large card.

- Runs every 15 minutes on its own.
- `https://<site>/?admin` shows a **Refresh from Drive** button that checks the
  folder right away.
- Each run handles up to 3 videos; a bigger backlog is finished over the next
  runs (or by pressing Refresh again).
- Videos over 20 MB are described from their Drive thumbnail and file name
  (sending bigger files makes Apps Script run out of memory).
- Videos not described yet (Gemini busy or out of quota) still show on the
  site, titled from the file name, with a category from the folder name.
- The whole folder is scanned, subfolders included, so keep test files and
  duplicate versions out of it.
- Videos listed by hand in `src/portfolio-data.ts` are never duplicated.
- If Gemini is busy (429/5xx), the script retries and tries again next run;
  those errors do not count against a video's 3 attempts.

## Setup (once, about 10 minutes)

1. **Gemini key.** Open <https://aistudio.google.com/apikey> with your Google
   account and create an API key.
2. **Script.** Open <https://script.google.com>, click **New project**, name it
   `Portfolio Drive Sync`, delete the sample code and paste all of
   `drive-sync.gs`.
3. **Properties.** Project Settings (gear icon) → Script properties → add:
   - `GEMINI_API_KEY` = the key from step 1
   - `REFRESH_TOKEN` = any secret word (optional, recommended)
   - `GEMINI_MODEL` = a newer model name, if you want one (optional)
4. **Test.** In the editor pick `processNewVideos` and click **Run**. Approve the
   Drive and external-request permissions. Check the execution log.
5. **Schedule.** Pick `installTrigger` and click **Run** once.
6. **Publish.** Deploy → New deployment → type **Web app** → Execute as **Me**,
   Who has access **Anyone** → Deploy. Copy the URL that ends in `/exec`.
7. **Connect the site.** Paste that URL into `driveSyncEndpoint` in
   `src/portfolio-data.ts` and publish the site.
8. **Admin button.** Open the site with `?admin=<REFRESH_TOKEN>` (or just
   `?admin` if you skipped the token).

## Notes

- Drive videos only show a thumbnail and play on the site when they are shared
  as "Anyone with the link". Set `shareNewVideos: true` in `CONFIG` to have the
  script do that for each new upload.
- To describe everything again (for example after changing the prompt), run
  `forgetAllVideos`, then `processNewVideos`.
- After editing the script, use Deploy → Manage deployments → Edit → New version
  so the web app URL serves the new code.
