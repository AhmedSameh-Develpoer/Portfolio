# Ahmed Sameh Portfolio

Clean bilingual React portfolio for Ahmed Sameh, focused on short-form,
commercial, creator, real estate, gaming, and AI video editing work.

## Run Locally

```bash
pnpm install
pnpm run dev
```

Local URL:

```text
http://127.0.0.1:5173/
```

## Build

```bash
pnpm run build
```

## Add YouTube Videos

Edit `src/portfolio-data.ts`, then add or replace `youtubeUrl` in
`featuredWork`.

Supported formats:

```text
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://www.youtube.com/shorts/VIDEO_ID
```

The site automatically converts the link into an embedded video.

## Main Files

- `src/App.tsx`: page structure
- `src/portfolio-data.ts`: work samples, contacts, clients, services
- `src/styles.css`: visual design
- `public/assets/ahmed-sameh-portrait.jpg`: hero portrait
- `public/assets/ahmed-sameh-cv.pdf`: downloadable CV

