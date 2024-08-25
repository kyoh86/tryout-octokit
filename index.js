// Try to get client with this package

import { Octokit as OctokitCore } from "@octokit/core";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";
import { requestLog } from "@octokit/plugin-request-log";
import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";
import consoleLogLevel from "console-log-level";

const Octokit = OctokitCore.plugin(restEndpointMethods).plugin(requestLog);
const ClientID = "";
const baseOption = {
  clientType: "github-app",
  clientId: ClientID,
  onVerification: async (verification) => {
    console.info("Open", verification.verification_uri);
    console.info("Enter code:", verification.user_code);
    // TODO: If it does not inistalled, ddu-source-github should be installed.
    // https://github.com/settings/apps/ddu-source-github/installations
  },
}

async function getOptions(options) {
  console.log(options);
  const auth = createOAuthDeviceAuth(options);
  console.log(auth);

  const newone = await auth({ type: "oauth" });
  return {
    ...options,
    authentication: newone,
  };
}

async function getClient(hostname) {
  return new Octokit({
    log: consoleLogLevel({
      auth: "secret123",
      level: "trace",
    }),
    authStrategy: createOAuthDeviceAuth,
    auth: await getOptions(baseOption),
  });
}

async function main() {
  const client = await getClient("github.com");
  console.log(client);
  console.log(
    JSON.stringify(await client.rest.users.getAuthenticated(), undefined, "  "),
  );
}

await main();
