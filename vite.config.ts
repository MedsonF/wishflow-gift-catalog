import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env': {
      POSTGRES_USER: JSON.stringify(process.env.POSTGRES_USER || 'postgres'),
      POSTGRES_HOST: JSON.stringify(process.env.POSTGRES_HOST || 'chat_quadrobd'),
      POSTGRES_DB: JSON.stringify(process.env.POSTGRES_DB || 'lista'),
      POSTGRES_PASSWORD: JSON.stringify(process.env.POSTGRES_PASSWORD || 'OvHsBEvEUzcHa6otaqHadimeOFDt3qfb'),
      POSTGRES_PORT: JSON.stringify(process.env.POSTGRES_PORT || '5432'),
    },
  },
}));
