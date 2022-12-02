#!/usr/bin/env node
import { runCli } from "~/cli/index.js";
import { logger } from "~/utils/logger.js";
import { renderTitle } from "~/utils/renderTitle.js";
import { createDopplerEnvironment } from "./runner/createDopplerEnvironment.js";
import { installDependencies } from "./runner/installDependencies.js";
import { buildPackageInstallerMap, PackageInstallerMap } from "./utils/installer.js";

export interface CreateDopplerEnvironment {
  apps: PackageInstallerMap;
}

const main = async () => {
  renderTitle();

  const {
    apps,
    flags: { noInstall },
  } = await runCli();

  /** Build App mapping with options */
  const useApps = buildPackageInstallerMap(apps);

  /** Populate Doppler Environment */
  await createDopplerEnvironment({ apps: useApps });

  /** Install Dependencies */
  if (!noInstall) {
    await installDependencies();
  }

  process.exit(0);
};

main().catch((err) => {
  logger.error("Aborting installation...");
  if (err instanceof Error) {
    logger.error(err);
  } else {
    logger.error("An unknown error has occurred. Please open an issue on github with the below:");
    console.log(err);
  }
  process.exit(1);
});
