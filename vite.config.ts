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
    // Emit a static SPA shell at dist/client/_shell.html so Netlify / Vercel
    // can rewrite every unknown path to it (see netlify.toml + vercel.json).
    // Without this, Nitro tries to prerender "/" and crashes any route whose
    // SSR pass touches browser-only state.
    spa: {
      enabled: true,
      maskPath: "/",
      prerender: { outputPath: "/_shell" },
    },
  },
});
