// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "tamuhack-25",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc("aggietrack", {
      bastion: true,
      az: 2,
      nat: "ec2",
    });

    const appDb =
      $app.stage === "production" || $app.stage === "dev"
        ? new sst.aws.Postgres("AppDB", {
            vpc,
            proxy: $app.stage === "production" ? true : undefined,
            instance: "t4g.micro",
            database: "hackathon",
            transform: {
              instance: {
                skipFinalSnapshot: $app.stage !== "production",
              },
            },
          })
        : sst.aws.Postgres.get("AppDB", { id: "hackathon-dev-appdbinstance" });

    const betterAuthSecret = new sst.Secret("BETTER_AUTH_SECRET");
    const googleClientId = new sst.Secret("GOOGLE_CLIENT_ID");
    const googleClientSecret = new sst.Secret("GOOGLE_CLIENT_SECRET");

    new sst.aws.Nextjs("HackathonWeb", {
      vpc: vpc,
      link: [appDb, googleClientId, googleClientSecret],
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
