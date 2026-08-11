import { mkdir, writeFile } from "node:fs/promises";

const workerSource = `const INDEX_PATH = "/index.html";

function hasFileExtension(pathname) {
  return /\\.[a-zA-Z0-9]+$/.test(pathname);
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404) {
      return response;
    }

    const url = new URL(request.url);

    if (request.method === "GET" && !hasFileExtension(url.pathname)) {
      return env.ASSETS.fetch(new Request(new URL(INDEX_PATH, url.origin), request));
    }

    return response;
  },
};
`;

await mkdir("dist/server", { recursive: true });
await writeFile("dist/server/index.js", workerSource);
