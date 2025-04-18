import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'process';

export default defineConfig({
	plugins: [react()],
	define: {
		'process.env.NODE_ENV': JSON.stringify(
			process.env.NODE_ENV || 'development'
		),
	},
});
