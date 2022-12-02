import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";
import { DEFAULT_APP_NAME, SETUP_ELEVATEART_APP } from "~/consts.js";
import { getPackageManager } from "~/utils/getPackageManager.js";
import { getVersion } from "~/utils/getPackageVersion.js";
import { availableApps, AvailableApps } from "~/utils/installer.js";
import { logger } from "~/utils/logger.js";

interface CliFlags {
  noInstall: boolean;
  default: boolean;
  CI: boolean /** @internal - used in CI */;
  docs: boolean /** @internal - used in CI */;
  www: boolean /** @internal - used in CI */;
  rng: boolean /** @internal - used in CI */;
}

interface CliResults {
  appName: string;
  apps: AvailableApps[];
  flags: CliFlags;
}

const defaultOptions: CliResults = {
  appName: DEFAULT_APP_NAME,
  apps: ["rng", "docs", "www"],
  flags: {
    noInstall: false,
    default: false,
    CI: false,
    docs: false,
    www: false,
    rng: false,
  },
};

export const runCli = async () => {
  const cliResults = defaultOptions;

  const program = new Command().name(SETUP_ELEVATEART_APP);

  // TODO: This doesn't return anything typesafe. Research other options?
  // Emulate from: https://github.com/Schniz/soundtype-commander
  program
    .description(`A CLI for setting up the core development infrastructure for ${DEFAULT_APP_NAME}`)
    .option("--noInstall", "Explicitly tell the CLI to not run the package manager's install command", false)
    .option("-y, --default", `Bypass the CLI and use all default options to bootstrap a new ${DEFAULT_APP_NAME} app`, false)
    /** START CI-FLAGS */
    /**
     * @experimental - used for CI E2E tests
     * If any of the following option-flags are provided, we skip prompting
     */
    .option("--CI", "Boolean value if we're running in CI", false)
    /**
     * @experimental - used for CI E2E tests
     * Used in conjunction with `--CI` to skip prompting
     */
    .option(
      "--www [boolean]",
      "Experimental: Boolean value if we should setup apps-www. Must be used in conjunction with `--CI`.",
      (value) => !!value && value !== "false",
    )
    /**
     * @experimental - used for CI E2E tests
     * Used in conjunction with `--CI` to skip prompting
     */
    .option(
      "--docs [boolean]",
      "Experimental: Boolean value if we should setup apps-docs. Must be used in conjunction with `--CI`.",
      (value) => !!value && value !== "false",
    )
    /**
     * @experimental - used for CI E2E tests
     * Used in conjunction with `--CI` to skip prompting
     */
    .option(
      "--rng [boolean]",
      "Experimental: Boolean value if we should setup apps-rng. Must be used in conjunction with `--CI`.",
      (value) => !!value && value !== "false",
    )
    /** END CI-FLAGS */
    .version(getVersion(), "-v, --version", "Display the version number")
    .addHelpText(
      "afterAll",
      `\n This application was hacked together by ${chalk.hex("#E8DCFF").bold("@rlxyz")} to build the core infrastructure for ${chalk
        .hex("#E24A8D")
        .underline("https://elevate.art")} \n`,
    )
    .parse(process.argv);

  // FIXME: TEMPORARY WARNING WHEN USING YARN 3. SEE ISSUE #57
  if (process.env.npm_config_user_agent?.startsWith("yarn/3")) {
    logger.warn(`  WARNING: It looks like you are using Yarn 3. This is currently not supported,
  and likely to result in a crash. Please run create-t3-app with another
  package manager such as pnpm, npm, or Yarn Classic.
  See: https://github.com/t3-oss/create-t3-app/issues/57`);
  }

  cliResults.flags = program.opts();

  /**
   * @internal - used for CI E2E tests
   */
  let CIMode = false;
  if (cliResults.flags.CI) {
    CIMode = true;
    cliResults.apps = [];
    if (cliResults.flags.www) cliResults.apps.push("www");
    if (cliResults.flags.docs) cliResults.apps.push("docs");
    if (cliResults.flags.rng) cliResults.apps.push("rng");
  }

  // Explained below why this is in a try/catch block
  try {
    const pkgManager = getPackageManager();
    if (pkgManager !== "pnpm") {
      logger.error(` WARNING: It looks like you are using ${pkgManager}. This is currently not supported.`);
      throw new Error(`Unsupported package manager: ${pkgManager}. Please uses pnpm.`);
    }

    // if --CI flag is set, we are running in CI mode and should not prompt the user
    // if --default flag is set, we should not prompt the user
    if (!cliResults.flags.default && !CIMode) {
      cliResults.apps = await promptApps();

      if (!cliResults.flags.noInstall) {
        cliResults.flags.noInstall = !(await promptInstall());
      }
    }
  } catch (err) {
    // If the user is not calling create-t3-app from an interactive terminal, inquirer will throw an error with isTTYError = true
    // If this happens, we catch the error, tell the user what has happened, and then continue to run the program with a default t3 app
    // eslint-disable-next-line -- Otherwise we have to do some fancy namespace extension logic on the Error type which feels overkill for one line
    if (err instanceof Error && (err as any).isTTYError) {
      logger.warn(`${SETUP_ELEVATEART_APP} needs an interactive terminal to provide options`);
      logger.info(`Bootstrapping a default t3 app in ./${cliResults.appName}`);
    } else {
      throw err;
    }
  }

  return cliResults;
};

const promptApps = async (): Promise<AvailableApps[]> => {
  const { apps } = await inquirer.prompt<Pick<CliResults, "apps">>({
    name: "apps",
    type: "checkbox",
    message: "Which apps would you like to enable?",
    choices: availableApps.map((pkgName) => ({
      name: pkgName,
      checked: false,
    })),
  });
  return apps;
};

const promptInstall = async (): Promise<boolean> => {
  const pkgManager = getPackageManager();

  const { install } = await inquirer.prompt<{ install: boolean }>({
    name: "install",
    type: "confirm",
    message: `Would you like us to run '${pkgManager}` + (pkgManager === "yarn" ? `'?` : ` install'?`),
    default: true,
  });

  if (install) {
    logger.success("Alright. We'll install the dependencies for you!");
  } else {
    if (pkgManager === "yarn") {
      logger.info(`No worries. You can run '${pkgManager}' later to install the dependencies.`);
    } else {
      logger.info(`No worries. You can run '${pkgManager} install' later to install the dependencies.`);
    }
  }

  return install;
};
