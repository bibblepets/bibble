import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/setupTests.ts', // run once before all tests
		css: false,
		coverage: {
			reportsDirectory: 'coverage/reports',
			reporter: [
				'json-summary',
				'text',
				'lcov',
				'clover',
				'cobertura',
			],
			// thresholds: {
			// 	lines: 80,
			// 	statements: 80,
			// 	branches: 80,
			// 	functions: 80,
			// },
			include: ['src/**/*.ts', 'src/**/*.tsx'],
		},
	},
});
