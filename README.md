# WebExt Deploy

The ultimate automation tool for deploying to multiple extension stores simultaneously!

Made by [avi12](https://avi12.com)

Supported stores:

- [Chrome Web Store](https://chrome.google.com/webstore/category/extensions)
  - [`.env` snippet](#chromeenv)
  - [CLI API](#chrome-web-store-cli)
  - [Node.js API](#chrome-web-store-api)
- [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/extensions)
  - [`.env` snippet](#firefoxenv)
  - [CLI API](#firefox-add-ons-cli)
  - [Node.js API](#firefox-add-ons-api)
- [Edge Add-ons](https://microsoftedge.microsoft.com/addons)
  - [`.env` snippet](#edgeenv)
  - [CLI API](#edge-add-ons-cli)
  - [Node.js API](#edge-add-ons-api)
- [Opera Add-ons](https://addons.opera.com/en/extensions)
  - [`.env` snippet](#operaenv)
  - [CLI API](#opera-add-ons-cli)
  - [Node.js API](#opera-add-ons-api)

# Core packages/APIs used

- [Playwright](https://github.com/microsoft/playwright) - for updating extensions on Opera Add-ons store.
- [Chrome Web Store Publish API](https://developer.chrome.com/docs/webstore/using_webstore_api)
- [Microsoft Edge Publish API](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/api/using-addons-api)
- [Firefox Add-ons Store Submission API](https://blog.mozilla.org/addons/2022/03/17/new-api-for-submitting-and-updating-add-ons/)

# Installing

```shell
npm i -D web-ext-deploy
# or
pnpm i -D web-ext-deploy
# or
yarn add -D web-ext-deploy
```

or install globally

```shell
npm i -g web-ext-deploy
# or
pnpm i -g web-ext-deploy
# or
yarn global add web-ext-deploy
```

Deployment to Chrome Web Store: [follow this guide](https://github.com/DrewML/chrome-webstore-upload/blob/main/How%20to%20generate%20Google%20API%20keys.md).  
Deployment to Edge Add-ons Store: [follow this guide](https://github.com/avi12/web-ext-deploy/blob/main/EDGE_PUBLISH_API.md).

# Usage

## 1. Obtain the relevant cookie(s) of the publisher's account:

### Disclaimer: I do NOT take any responsibility for leaked cookies or credentials.

- Opera: `sessionid`, `csrftoken`

If you have a hard time obtaining the cookie(s), you can run:

```shell
web-ext-deploy --get-cookies=opera
```

Note that for the Chrome Web Store, you'll use the Chrome Web Store Publish API.  
As for the Edge Add-ons Store, you'll use the Microsoft Edge Publish API.

## 2. Decide how to access the data & credentials

- [`.env` files method](#env-files-method)
- [CLI arguments method](#cli-arguments-method)
- [Node.js API method](#nodejs-api-method)

## `.env` files method

Use the `.env` [snippet(s)](#possible-env-files) relevant to your extension.  
Include each one in your root directory.  
Make sure to have `*.env` in your `.gitignore`  
Note that if you used the aforementioned `--get-cookies`, it automatically added the `.env` listing(s) to it.

To use the `.env` files, in the CLI:

```shell
web-ext-deploy --env
```

### Additional arguments for the `.env` mode:

- `--verbose` boolean?  
  If specified, the steps of every store will be logged to the console.

- `--publish-only` (`"chrome" | "firefox" | "edge" | "opera"`)[]?  
  If specified, for each specified store that has an `.env` file, it will be deployed.  
  E.g. if you have `chrome.env`, `firefox.env`, `opera.env`, and you run:

  ```shell
  web-ext-deploy --env --publish-only=chrome firefox
  ```

  It will only deploy to Chrome Web Store and Firefox Add-ons Store.

- `--zip` string?  
  If specified, it will be used for every `.env` that the `ZIP` is not specified.

- `--firefox-changelog` string?  
  If specified and `firefox.env` exists, it will be used to provide changelog for the Firefox users.  
  New lines (`\n`) are supported.

- `--firefox-dev-changelog` string?  
  If specified and `firefox.env` exists, it will be used to provide changelog for the Firefox Add-ons reviewers.  
  New lines (`\n`) are supported.

- `--edge-dev-changelog` string?  
  If specified and `edge.env` exists, it will be used to provide changelog for the Edge Add-ons reviewers.  
  New lines (`\n`) are supported.

- `--opera-changelog` string?  
  If specified and `opera.env` exists, it will be used to provide changelog for the Opera users.  
  New lines (`\n`) are supported.

### Notes:

- Chrome Web Store:

  - `REFRESH_TOKEN`, `CLIENT_ID`, `CLIENT_SECRET` - follow [this guide](https://github.com/DrewML/chrome-webstore-upload/blob/master/How%20to%20generate%20Google%20API%20keys.md).
  - `EXT_ID` - Get it from `https://chrome.google.com/webstore/detail/EXT_ID`, e.g. `https://chrome.google.com/webstore/detail/fcphghnknhkimeagdglkljinmpbagone`

- Firefox Add-ons store:

  - `EXT_ID` - Get it from `https://addons.mozilla.org/addon/EXT_ID`
  - `ZIP` - The relative path to the ZIP. You can use `{version}`, which will be replaced by the `version` entry from your `package.json`
  - `ZIP_SOURCE` - Optional. The relative path to the ZIP that contains the [source code](https://www.npmjs.com/package/zip-self) of your extension, if applicable.
  - `JWT_ISSUER`, `JWT_SECRET` - obtain from the [Developer Hub](https://addons.mozilla.org/developers/addon/api/key/).

- Edge Add-ons store:

  - `CLIENT_ID`, `CLIENT_SECRET`, `ACCESS_TOKEN_URL`, `ACCESS_TOKEN` - follow [this guide](https://github.com/avi12/web-ext-deploy/blob/main/EDGE_PUBLISH_API.md)
  - `PRODUCT_ID` - Get it from `https://partner.microsoft.com/en-us/dashboard/microsoftedge/PRODUCT_ID`
  - `ZIP` - You can use `{version}`

- Opera Add-ons store:
  - `PACKAGE_ID` - Get it from `https://addons.opera.com/developer/package/PACKAGE_ID`
  - `ZIP` - You can use `{version}`
  - **Source code inspection**:  
    The Opera Add-ons reviewers require inspecting your extension's source code.  
    This can be done by doing **one** of the following:
    - Uploading the ZIP that contains the [source code](https://www.npmjs.com/package/zip-self) to a public folder on a storage service (e.g. [Google Drive](https://drive.google.com)).
    - Making the extension's code open source on a platform like GitHub, with clear instructions on the `README.md`, and then linking to its repository.
- The keys are case-insensitive, as they will be [camel-cased](https://www.npmjs.com/package/camel-case) anyway.

### Possible `.env` files

#### `chrome.env`

```dotenv
REFRESH_TOKEN="RefreshToken"
CLIENT_ID="ClientID"
CLIENT_SECRET="ClientSecret"
ZIP="dist/some-zip-v{version}.zip"
EXT_ID="ExtensionID"
```

#### `firefox.env`

```dotenv
JWT_ISSUER="JwtIssuer"
JWT_SECRET="JwtSecret"
ZIP="dist/some-zip-v{version}.zip"
ZIP_SOURCE="dist/some-zip-source-v{version}.zip"
EXT_ID="ExtensionID"
```

#### `edge.env`

```dotenv
CLIENT_ID="ClientID"
CLIENT_SECRET="ClientSecret"
ACCESS_TOKEN_URL="AccessTokenURL"
ACCESS_TOKEN="AccessToken"
ZIP="dist/some-zip-v{version}.zip"
PRODUCT_ID="ProductID"
```

#### `opera.env`

```dotenv
SESSIONID="sessionid_value"
CSRFTOKEN="csrftoken_value"
ZIP="dist/some-zip-v{version}.zip"
PACKAGE_ID=123456
```

## CLI arguments method

Use it only if your extension's code will not be published.

```shell
web-ext-deploy --chrome-zip="some-zip-v{version}.zip" --chrome-ext-id="ExtensionID" --firefox-zip="some-zip-v{version}.zip" --firefox-ext-id="ExtensionID"
```

### CLI API

Stores:

- [Chrome Web Store](#chrome-web-store-cli)
- [Firefox Add-ons](#firefox-add-ons-cli)
- [Edge Add-ons](#edge-add-ons-cli)
- [Opera Add-ons](#opera-add-ons-cli)

Options:

- `--verbose` boolean?  
  If specified, the steps of every store will be logged to the console.

- `--zip` string?  
  If specified, it will be used for every store that the `zip` is not specified.  
  For example, in

  ```shell
  web-ext-deploy --zip="zip-v{version}.zip" --chrome-refresh-token="refreshToken" --firefox-sessionid="sessionid_value" --edge-zip="some-zip-v{version}.zip"
  ```

  the `zip-v{version}.zip` will be used for the Chrome Web Store version _and_ the Firefox Add-ons version.

#### Chrome Web Store CLI

- `--chrome-ext-id` string  
  Get it from `https://chrome.google.com/webstore/detail/EXT_ID`, e.g. `https://chrome.google.com/webstore/detail/fcphghnknhkimeagdglkljinmpbagone`
- `--chrome-refresh-token` string  
  The refreshToken you have registered.
- `--chrome-client-id` string  
  The client ID you have registered.
- `--chrome-client-secret` string  
  The client secret you have registered.
- `--chrome-zip` string  
  The relative path to the ZIP from the root.  
  You can use `{version}` in the ZIP filename, which will be replaced by the version in `package.json`

To get your `--chrome-refresh-token`, `--chrome-client-id` and `--chrome-client-secret`, follow [this guide](https://github.com/DrewML/chrome-webstore-upload/blob/master/How%20to%20generate%20Google%20API%20keys.md).  
 Example:

```shell
web-ext-deploy --chrome-ext-id="ExtensionID" --chrome-refresh-token="RefreshToken" --chrome-client-id="ClientID" --chrome-client-secret="ClientSecret" --chrome-zip="some-zip-v{version}.zip"
```

#### Firefox Add-ons CLI

- `--firefox-ext-id` string  
  The extension ID from the store URL, e.g. `https://addons.mozilla.org/addon/EXT_ID`
- `--firefox-jwt-issuer` string  
  The JWT issuer.
- `--firefox-jwt-secret` string  
  The JWT secret.
- `--firefox-zip` string  
  The relative path to the ZIP from the root.  
  You can use `{version}` in the ZIP filename, which will be replaced by the `version` entry from your `package.json`
- `--firefox-zip-source` string?  
  The relative path to the ZIP that contains the source code of your extension, if applicable.  
  You can use `{version}` as well.  
  Note that if your extension's source code _is_ required to be seen by the review team, you **do not** want to store the command with the package.
- `--firefox-changelog` string?  
  The changes made in this version compared to the previous one. The Firefox users will see this.  
  You can use `\n` for new lines.
- `--firefox-dev-changelog` string?  
  The technical changes made in this version, which will be seen by the Firefox Add-ons reviewers.  
  You can use `\n` for new lines.

Get your `--firefox-jwt-issuer` and `--firefox-jwt-secret` from the [Developer Hub](https://addons.mozilla.org/developers/addon/api/key/).

Example:

```shell
web-ext-deploy --firefox-ext-id="ExtensionID" --firefox-jwt-issuer="JwtIssuer" --firefox-jwt-secret="JwtSecret" --firefox-zip="dist/some-zip-v{version}.zip" --firefox-changelog="Changelog\nWith line breaks" --firefox-dev-changelog="Changelog for reviewers\nWith line breaks"
```

#### Edge Add-ons CLI

- `--edge-product-id` string  
  The product ID from the Edge Add-ons Dashboard, e.g. `https://partner.microsoft.com/en-us/dashboard/microsoftedge/PRODUCT_ID`
- `--edge-client-id` string  
  The client ID.
- `--edge-client-secret` string  
  The client secret.
- `--edge-access-token-url` string  
  The access token URL.
- `--edge-access-token` string  
  The access token.
- `--edge-zip` string  
  The path to the ZIP from the root.  
  You can use `{version}` in the ZIP filename, which will be replaced by the `version` entry in `package.json`
- `--edge-dev-changelog` string?  
  The technical changes made in this version, which will be seen by the Edge Add-ons reviewers.  
  You can use `\n` for new lines.

To get your `--edge-access-token`, `--edge-client-id`, `--edge-client-secret`, `--edge-access-token-url`, follow [this guide](https://github.com/avi12/web-ext-deploy/blob/main/EDGE_PUBLISH_API.md).

Example:

```shell
web-ext-deploy --edge-product-id="ProductID" --edge-access-token="accessToken value" --edge-client-id="clientId" --edge-client-secret="clientSecret" --edge-access-token-url="accessTokenUrl" --edge-zip="dist/some-zip-v{version}.zip" --edge-dev-changelog="Changelog for reviewers\nWith line breaks"
```

**Note:**  
Due to the way the Edge dashboard works, when an extension is being reviewed or its review has just been canceled, it will take about a minute until a cancellation will cause its state to change from "In review" to "In draft", after which the new version can be submitted.  
Therefore, expect for longer wait times if you run the tool on an extension you had just published/canceled.

#### Opera Add-ons CLI

- `--opera-package-id` number  
  The extension ID from the Opera Add-ons Dashboard, e.g. `https://addons.opera.com/developer/package/PACKAGE_ID`
- `--opera-sessionid` string  
  The value of the cookie `sessionid`, which will be used to log in to the publisher's account.
- `--opera-csrftoken` string  
  The value of the cookie `csrftoken`, which will be used to upload the ZIP.
- `--opera-zip` string  
  The relative path to the ZIP from the root.  
  You can use `{version}` in the ZIP filename, which will be replaced by the `version` entry in `package.json`
- `--opera-changelog` string?  
  The changes made in this version, which will be seen by the Opera Add-ons reviewers.  
  You can use `\n` for new lines.

Example:

```shell
web-ext-deploy --opera-package-id=123456 --opera-sessionid="sessionid_value" --opera-csrftoken="csrftoken_value" --opera-zip="dist/some-zip-v{version}.zip" --opera-changelog="Changelog\nWith line breaks"
```

**Notes:**

- Source code inspection:  
  The Opera Add-ons reviewers require inspecting your extension's source code.  
  This can be done by doing **one** of the following:

  - Uploading the ZIP that contains the [source code](https://www.npmjs.com/package/zip-self) to a public folder on a storage service (e.g. [Google Drive](https://drive.google.com))
  - Making the extension's code open source on a platform like GitHub, with clear instructions on the `README.md`, and then linking to its repository.

  Note that you **do not** want to store the command with your extension package, as the review team will have access to your precious cookies.

## Node.js API method

### ESM

```ts
import { deployChrome, deployFirefoxSubmissionApi, deployEdgePublishApi, deployOpera } from "web-ext-deploy";
```

### Node.js API

- [Chrome Web Store](#chrome-web-store-api)
- [Firefox Add-ons](#firefox-add-ons-api)
- [Edge Add-ons](#edge-add-ons-api)
- [Opera Add-ons](#opera-add-ons-api)

#### Chrome Web Store API

`deployChrome` object  
Options:

- `extId` string  
  Get it from `https://chrome.google.com/webstore/detail/EXT_ID`, e.g. `https://chrome.google.com/webstore/detail/fcphghnknhkimeagdglkljinmpbagone`
- `refreshToken` string  
  The refresh token.
- `clientId` string  
  The client ID.
- `clientSecret` string  
  The client secret.
- `zip` string  
  The relative path from the root to the ZIP.  
  You can use `{version}` to use the `version` entry from your `package.json`
- `verbose` boolean?  
  If `true`, it will be logged to the console when the uploading has begun.

To get your `refreshToken`, `clientId`, and `clientSecret`, follow [this guide](https://github.com/DrewML/chrome-webstore-upload/blob/master/How%20to%20generate%20Google%20API%20keys.md).  
Returns `Promise<true>` or throws an exception.

#### Firefox Publish API

`deployFirefoxSubmissionApi` object  
Options:

- `extId` string  
  Get it from `https://addons.mozilla.org/addon/EXT_ID`
- `jwtIssuer` string  
  The JWT issuer.
- `jwtSecret` string  
  The JWT secret.
- `zip` string  
  The relative path from the root to the ZIP.  
  You can use `{version}` in the ZIP filename, which will be replaced by the `version` entry from your `package.json`
- `zipSource` string?  
  The relative path from the root to the ZIP that contains the source code of your extension, if applicable.  
  You can use `{version}` as well.  
  Note that if your extension's source code _is_ required to be seen by the review team, you **do not** want to store the deployment script with the package.
- `changelog` string?  
  The changes made in this version, compared to the previous one, which will be seen by the Firefox users.  
  I recommend providing the changelog via `--firefox-changelog`, so it stays dynamic.
- `devChangelog` string?  
  The technical changes made in this version, compared to the previous one, which will be visible only to the Firefox Add-ons reviewers.  
  I recommend providing the changelog via `--firefox-dev-changelog`, so it stays up to date.
- `verbose` boolean?  
  If `true`, every step of uploading to the Firefox Add-ons will be logged to the console.

Get your `jwtIssuer` and `jwtSecret` from the [Developer Hub](https://addons.mozilla.org/developers/addon/api/key/).  
Returns `Promise<true>` or throws an exception.

#### Edge Publish API

`deployEdgePublishApi` object  
Options:

- `productId` string  
  Get it from `https://partner.microsoft.com/en-us/dashboard/microsoftedge/PRODUCT_ID`

- `accessToken` string  
  The access token.

- `clientId` string  
  The client ID.

- `clientSecret` string  
  The client secret.

- `accessTokenUrl` string  
  The access token URL.

- `zip` string  
  The relative path from the root to the ZIP.  
  You can use `{version}` in the ZIP filename, which will be replaced by the `version` entry from your `package.json`
- `devChangelog` string?  
  The technical changes made in this version, compared to the previous one, which will be visible only to the Edge Add-ons reviewers.  
  I recommend providing the changelog via `--edge-dev-changelog`, so it stays up to date.
- `verbose` boolean?  
  If `true`, every step of uploading to the Edge Add-ons will be logged to the console.

To get your `accessToken`, `clientId`, `clientSecret`, and `accessTokenUrl`, follow [this guide](https://github.com/avi12/web-ext-deploy/blob/main/EDGE_PUBLISH_API.md).  
Returns `Promise<true>` or throws an exception.

**Note:**  
Due to the way the Edge dashboard works, when an extension is being reviewed or its review has just been canceled, it will take about a minute until a cancellation will cause its state to change from "In review" to "In draft", after which the new version can be submitted.  
Therefore, expect for longer wait times if you run the tool on an extension you had just published/canceled.

#### Opera Publish API

`deployOpera` object  
Options:

- `packageId` number  
  The package ID of the extension from the store dashboard, e.g. `https://addons.opera.com/developer/package/PACKAGE_ID`
- `sessionid` string  
  The value of the cookie `sessionid`, which will be used to log in to the publisher's account.
- `csrftoken` string  
  The value of the cookie `csrftoken`, which will be used to upload the ZIP.
- `zip` string  
  The relative path from the root to the ZIP.  
  You can use `{version}` in the ZIP filename, which will be replaced by the `version` entry from your `package.json`
- `changelog` string?  
  The changes made in this version, compared to the previous one, which will be seen by the Opera users.  
  I recommend providing the changelog via `--opera-changelog`, so it stays up to date.
- `verbose` boolean?  
  If `true`, every step of uploading to the Opera Add-ons will be logged to the console.

If you have a hard time obtaining the values of the cookies `sessionid` and `csrftoken`, you can run:

```shell
web-ext-deploy --get-cookies=opera
```

Returns `Promise<true>` or throws an exception.

**Notes:**

- Source code inspection:  
  The Opera Add-ons reviewers require inspecting your extension's source code.  
  This can be done by doing **one** of the following:

  - Uploading the ZIP that contains the [source code](https://www.npmjs.com/package/zip-self) to a public folder on a storage service (e.g. [Google Drive](https://drive.google.com))
  - Making the extension's code open source on a platform like GitHub, with clear instructions on the `README.md`, and then linking to its repository.

  Note that you **do not** want to store the deployment script with your extension package, as the review team will have access to your precious cookies.  
  If you'll open-source the extension on GitHub, you can exclude the deployment script by listing it in `.gitignore`

Examples:

```ts
import { deployChrome, deployFirefoxSubmissionApi, deployEdgePublishApi, deployOpera } from "web-ext-deploy";

deployChrome({
  extId: "ExtensionID",
  refreshToken: "refreshToken",
  clientId: "clientId",
  clientSecret: "clientSecret",
  zip: "dist/some-zip-v{version}.zip",
  verbose: false
}).catch(console.error);

deployFirefoxSubmissionApi({
  extId: "EXT_ID",
  jwtIssuer: "jwtIssuer",
  jwtSecret: "jwtSecret",
  zip: "dist/some-zip-v{version}.zip",
  zipSource: "dist/zip-source-v{version}.zip",
  changelog: "Some changes",
  devChangelog: "Changes for reviewers",
  verbose: false
}).catch(console.error);

deployEdgePublishApi({
  productId: "PRODUCT_ID",
  clientId: "clientId",
  clientSecret: "clientSecret",
  accessTokenUrl: "accessTokenUrl",
  accessToken: "accessToken",
  zip: "dist/some-zip-v{version}.zip",
  devChangelog: "Changes for reviewers",
  verbose: false
}).catch(console.error);

deployOpera({
  packageId: 123456,
  sessionid: "sessionid_value",
  csrftoken: "csrftoken_value",
  zip: "dist/some-zip-v{version}.zip",
  changelog: "Some changes",
  verbose: false
}).catch(console.error);
```
