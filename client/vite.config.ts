import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
		port: 5173,
		host: "0.0.0.0",
		cors: true
	}
})
