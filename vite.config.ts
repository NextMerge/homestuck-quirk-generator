import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import eslintPlugin from "@nabla/vite-plugin-eslint";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [react(), svgr(), tsconfigPaths(), eslintPlugin()],
});
