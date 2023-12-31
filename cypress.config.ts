import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {

    },
  },
  video: false,
  screenshotOnRunFailure: false,
  retries: {
    runMode: 0,
    openMode: 0
  },
  env: {
    baseUrl: "http://localhost:3000",
    apiToken: "1e4e2224430117b4c8ccc461b5237843"
  },
});
