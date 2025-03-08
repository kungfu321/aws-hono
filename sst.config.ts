/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "aws-hono",
      // removal: input?.stage === "production" ? "retain" : "remove",
      // protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          region: "ap-northeast-1",
        }
      },
    };
  },
  async run() {
    const userPool = new sst.aws.CognitoUserPool("MyUserPool");
    const resourceServer = "resourceservername";
    const authScopes = [`${resourceServer}/read`];
    new aws.cognito.ResourceServer("myResourceServer", {
      identifier: resourceServer,
      userPoolId: userPool.id,
      name: "My API Resource Server",
      scopes: [
        { scopeName: "read", scopeDescription: "Read access to data" },
      ],
    });
    const domain = new aws.cognito.UserPoolDomain("main", {
      domain: $interpolate`${userPool.id.apply(id => id.split('-')[2].replace('_', '').toLowerCase())}${resourceServer}`,
      userPoolId: userPool.id,
    });

    userPool.addClient("myClient", {
      transform: {
        client: {
          generateSecret: true,
          allowedOauthScopes: authScopes,
          allowedOauthFlowsUserPoolClient: true,
          allowedOauthFlows: ["client_credentials"],
          callbackUrls: [],
          explicitAuthFlows: ["ALLOW_REFRESH_TOKEN_AUTH"]
        },
      }
    })

    const api = new sst.aws.ApiGatewayV1("MyApi");
    const authorizer = api.addAuthorizer({
      name: "myAuthorizer",
      userPools: [userPool.arn]
    });
    const auth = {
      auth: {
        cognito: {
          authorizer: authorizer.id,
          scopes: authScopes
        }
      }
    };
    api.route("GET /api/{proxy+}", "src/index.handler", auth);
    api.route("POST /api/{proxy+}", "src/index.handler", auth);

    api.deploy();
  },
});
