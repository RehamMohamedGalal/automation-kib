import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    baseURL: "https://e-commerce-kib.netlify.app",
    browserName: "chromium",
    headless: false,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  testDir: "./tests",
  projects: [
    {
      name: "api",
      testMatch: "**/tests/*",
      use: {
        extraHTTPHeaders: {
          // Example of setting a global header
          "Content-Type": "application/json",
        },
      },
    },
  ],
});
