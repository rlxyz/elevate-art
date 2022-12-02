import chalk from "chalk";
import fs from "fs-extra";
import ora from "ora";
import { CreateDopplerEnvironment } from "../index.js";

export const createDopplerEnvironment = async ({ apps }: CreateDopplerEnvironment) => {
  for (const [name, pkgOpts] of Object.entries(apps)) {
    if (pkgOpts.inUse) {
      const spinner = ora(`Populating Doppler Environment ${name}...`).start();

      const dopplerEnvironment = `setup:
  project: apps-www
  config: localhost`;

      fs.writeFile(`${pkgOpts.directory}/doppler.yaml`, dopplerEnvironment);

      spinner.succeed(chalk.green(`Successfully setup boilerplate for ${chalk.green.bold(name)}`));
    }
  }
};
