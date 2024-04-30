import { devices, PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  retries: 0,
  workers: 3,

  timeout: 500,
  fullyParallel: true,

  // webServer: {
  //   command: "node server.js",
  //   port: 3000,
  //   // reuseExistingServer: !process.env.CI,
  // },
  expect: {
    timeout: 500,
  },

  use: {
    baseURL: "http://localhost:3000",
    actionTimeout: 0,
    screenshot: "only-on-failure",
    video: "retry-with-video",
    trace: "on",
  },

  projects: [
    {
      name: "chromium",
      metadata: {
        pwc: {
          tags: ["project:chrome"],
        },
      },
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: "test-results/",
};

export default config;
