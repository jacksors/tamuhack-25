// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

import { Vpc } from ".sst/platform/src/components/aws";

export default $config({
  app(input) {
    return {
      name: "tamuhack-25",
      removal: "remove",
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("HackathonWeb", {
      domain:
        $app.stage === "production"
          ? {
              name: "dreamdrive.app",
              redirects: ["www.dreamdrive.app"],
            }
          : $app.stage === "dev"
            ? { name: "dev.dreamdrive.app" }
            : undefined,
    });
  },
});
