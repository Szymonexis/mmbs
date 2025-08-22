import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		rollupOptions: {
			output: {
				entryFileNames: `assets/[name].[hash].${Date.now()}.js`,
				chunkFileNames: `assets/[name].[hash].${Date.now()}.js`,
				assetFileNames: `assets/[name].[hash].${Date.now()}.[ext]`
			}
		}
	}
});
