#!/usr/bin/env node
import yargs from "yargs";
import { getCookies, getJsonStoresFromCli } from "./cli";
import {
  ChromeOptions,
  prepareToDeployChrome
} from "./stores/chrome/chrome-input";
import {
  FirefoxOptions,
  prepareToDeployFirefox
} from "./stores/firefox/firefox-input";
import { EdgeOptions, prepareToDeployEdge } from "./stores/edge/edge-input";
import { OperaOptions, prepareToDeployOpera } from "./stores/opera/opera-input";

const isUseCli = Boolean(
  process.argv[1].match(/web-ext-deploy[\\/](?:dist|src)[\\/]index\.(?:ts|js)$/)
);

const { argv } = yargs(process.argv.slice(2)).options({
  env: { type: "boolean", default: false },
  getCookies: { type: "array" },
  firefoxChangelog: { type: "string" },
  firefoxDevChangelog: { type: "string" },
  edgeDevChangelog: { type: "string" },
  operaChangelog: { type: "string" },
  verbose: { type: "boolean" }
});

async function initCli() {
  if (!isUseCli) {
    return;
  }

  // @ts-ignore
  if (argv.getCookies) {
    // @ts-ignore
    await getCookies(argv.getCookies as string[]);
    process.exit();
    return;
  }

  const storeFuncs = {
    chrome: deployChrome,
    firefox: deployFirefox,
    edge: deployEdge,
    opera: deployOpera
  };

  const storeJsons = getJsonStoresFromCli();
  const storeEntries = Object.entries(storeJsons);
  const promises = storeEntries.map(([store, json]) => storeFuncs[store](json));
  try {
    await Promise.all(promises);
  } catch (e) {
    throw new Error(e);
  }
}

initCli().catch(console.error);

export async function deployChrome(options: ChromeOptions): Promise<boolean> {
  return prepareToDeployChrome(options);
}

export async function deployFirefox(options: FirefoxOptions): Promise<boolean> {
  // @ts-ignore
  if (argv.firefoxChangelog) {
    // @ts-ignore
    options.changelog = argv.firefoxChangelog;
  }
  // @ts-ignore
  if (argv.firefoxDevChangelog) {
    // @ts-ignore
    options.devChangelog = argv.firefoxDevChangelog;
  }
  return prepareToDeployFirefox(options);
}

export async function deployEdge(options: EdgeOptions): Promise<boolean> {
  // @ts-ignore
  if (argv.edgeDevChangelog) {
    // @ts-ignore
    options.devChangelog = argv.edgeDevChangelog;
  }
  return prepareToDeployEdge(options);
}

export async function deployOpera(options: OperaOptions): Promise<boolean> {
  // @ts-ignore
  if (argv.operaChangelog) {
    // @ts-ignore
    options.changelog = argv.operaChangelog;
  }
  return prepareToDeployOpera(options);
}
