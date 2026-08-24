import { sentryVitePlugin } from '@sentry/vite-plugin';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const SENTRY_ORG = process.env.SENTRY_ORG ?? 'comma-3l';
const canUploadSentrySourceMaps = Boolean(process.env.SENTRY_AUTH_TOKEN);
const sentryEnvironment = process.env.VERCEL_ENV ?? process.env.SENTRY_ENVIRONMENT ?? 'development';

export default defineConfig({
  define: {
    'import.meta.env.VITE_SENTRY_ENVIRONMENT': JSON.stringify(sentryEnvironment)
  },
  plugins: [
    vanillaExtractPlugin(),
    react(),
    canUploadSentrySourceMaps &&
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: SENTRY_ORG,
        project: 'comma-web',
        telemetry: false,
        sourcemaps: {
          filesToDeleteAfterUpload: './dist/**/*.map'
        }
      })
  ],
  build: {
    sourcemap: canUploadSentrySourceMaps ? 'hidden' : false
  },
  server: {
    host: '127.0.0.1',
    port: 5173
  }
});
