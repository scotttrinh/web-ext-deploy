import { getCorrectZip, getFullPath, getIsFileExists } from "../../utils";
import deployToFirefox from "./firefox-deploy";

export class FirefoxOptions {
  /** The `sessionid` cookie value to login to the publisher's account. If you're having a hard time obtaining it, run: `web-ext-deploy --get-cookies=firefox` */
  sessionid: string;

  /** The extension ID. E.g. `https://addons.mozilla.org/en-US/developers/EXT_ID` */
  extId: string;

  /**
   * The path to the ZIP, relative from the current working directory (`process.cwd()`).<br>
   * You can use `{version}` to pull the current version of the `package.json`, e.g. `some-zip-v{version}.zip`
   */
  zip: string;

  /**
   * If applicable, the path to the ZIP source, relative from the current working directory (`process.cwd()`).<br>
   * You can use `{version}` to pull the current version of the `package.json`, e.g. `some-zip-v{version}.zip`
   */
  zipSource?: string;

  /**
   * A description of the changes in this version, compared to the previous one.<br>
   * It's recommended to use instead `--firefox-changelog` , so it stays up to date.
   */
  changelog?: string;

  /**
   * A description of the technical changes made in this version, compared to the previous one.<br>
   * This will only be seen by the Firefox Addons reviewers.<br>
   * It's recommended to use instead `--firefox-dev-changelog` , so it stays up to date.
   */
  devChangelog?: string;

  /** If enabled, all the actions taken for each store will be logged to the console. */
  verbose?: boolean;

  constructor(options) {
    if (!options.extId) {
      throw new Error(
        getErrorMessage(
          "No extension ID is provided, e.g. https://addons.mozilla.org/en-US/firefox/addon/EXT_ID"
        )
      );
    }

    if (!options.sessionid) {
      throw new Error(
        getErrorMessage(
          `No cookie header is provided. If you're having a hard time obtaining it, run:
web-ext-deploy --get-cookies=firefox`
        )
      );
    }

    // Zip checking
    if (!options.zip) {
      throw new Error(getErrorMessage("No zip is provided"));
    }

    if (!getIsFileExists(options.zip)) {
      throw new Error(
        getErrorMessage(`Zip doesn't exist: ${getFullPath(options.zip)}`)
      );
    }

    if (options.zipSource && !getIsFileExists(options.zipSource)) {
      throw new Error(
        getErrorMessage(
          `Zip source doesn't exist: ${getFullPath(options.zipSource)}`
        )
      );
    }
  }
}

function getErrorMessage(message: string): string {
  return `Firefox: ${message}`;
}

export async function prepareToDeployFirefox(
  options: FirefoxOptions
): Promise<boolean> {
  options.zip = getCorrectZip(options.zip);
  if (options.zipSource) {
    options.zipSource = getCorrectZip(options.zipSource);
  }

  if (options.changelog) {
    options.changelog = options.changelog.split("\\\n").join("\n");
  }

  if (options.devChangelog) {
    options.devChangelog = options.devChangelog.split("\\\n").join("\n");
  }

  // Validate the options
  new FirefoxOptions(options);
  return deployToFirefox(options);
}
