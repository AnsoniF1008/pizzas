import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function staticSubRoutes() {
  const rewrite = (req, _res, next) => {
    const [pathPart, qs] = (req.url || "").split("?");
    const suffix = qs ? `?${qs}` : "";
    if (pathPart === "/3d" || pathPart === "/3d/") req.url = `/3d/index.html${suffix}`;
    else if (pathPart === "/line" || pathPart === "/line/") req.url = `/line/index.html${suffix}`;
    next();
  };
  return {
    name: "static-sub-routes",
    configureServer(server) { server.middlewares.use(rewrite); },
    configurePreviewServer(server) { server.middlewares.use(rewrite); },
  };
}

export default defineConfig({
  plugins: [react(), staticSubRoutes()],
});
