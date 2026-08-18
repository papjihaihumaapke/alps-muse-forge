// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    // Disable prerender: the preview server it spins up expects a build
    // artifact named after the entry (server.js), but the Cloudflare adapter
    // emits index.mjs, causing every `bun run build:dev` to fail at the
    // `[prerender] Crawling: /` step. The deployed Worker still SSRs every
    // route at request time — prerender is a build-time optimization, not a
    // requirement.
    prerender: { enabled: false },
  },
  vite: {
    server: {
      proxy: {
        // Lovable's asset host only exists on the deployed site. Without this,
        // every /__l5e/assets-v1/... image (product photos, fonts, backgrounds)
        // 404s locally and tiles render blank.
        "/__l5e": {
          target: "https://annie-ling.hilalmalik.tech",
          changeOrigin: true,
        },
      },
    },
  },
});
