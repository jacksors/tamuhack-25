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
    const vpc =
      $app.stage === "dev"
        ? new sst.aws.Vpc("aggietrack", {
            bastion: true,
            az: 2,
            nat: "ec2",
          })
        : sst.aws.Vpc.get(
            "tamuhack-25-dev-aggietrack",
            "vpc-006d4dfc841e59ec5",
          );

    const appDb =
      $app.stage === "dev"
        ? new sst.aws.Postgres("AppDB", {
            vpc,
            instance: "t4g.micro",
            database: "hackathon",
            transform: {
              instance: {
                skipFinalSnapshot: true,
              },
            },
          })
        : sst.aws.Postgres.get("AppDB", {
            id: "tamuhack-25-dev-appdbinstance",
          });

    const betterAuthSecret = new sst.Secret("BETTER_AUTH_SECRET");
    const googleClientId = new sst.Secret("GOOGLE_CLIENT_ID");
    const googleClientSecret = new sst.Secret("GOOGLE_CLIENT_SECRET");
    const openaiApiKey = new sst.Secret("OPENAI_API_KEY");

    new sst.aws.Nextjs("HackathonWeb", {
      vpc: vpc,
      link: [appDb, googleClientId, googleClientSecret, openaiApiKey],
      environment: {
        BETTER_AUTH_URL: "https://dreamdrive.app",
        BETTER_AUTH_SECRET: betterAuthSecret.value,
      },
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

    return {
      database: {
        host: appDb.host,
        port: appDb.port,
        username: appDb.username,
        password: appDb.password,
        database: appDb.database,
      },
    };
  },
});
