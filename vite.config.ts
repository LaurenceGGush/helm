import react from "@vitejs/plugin-react"
import { resolve } from "path"
import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig } from "vite"
import eslint from "vite-plugin-eslint"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		eslint(),
		react({
			fastRefresh: process.env.NODE_ENV !== "test",
		}),
		visualizer(),
	],
	build: {
		rollupOptions: {
			input: {
				index: resolve(__dirname, "index.html"),
			},
		},
	},
	server: { host: "127.0.0.1", port: 3000 },
})
