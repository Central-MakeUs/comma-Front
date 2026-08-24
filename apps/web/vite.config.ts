import { sentryVitePlugin } from '@sentry/vite-plugin';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const SENTRY_ORG = process.env.SENTRY_ORG ?? 'comma-3l';
const canUploadSentrySourceMaps = Boolean(process.env.SENTRY_AUTH_TOKEN);

export default defineConfig({
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
