import chalk from "chalk";
import { execa } from "execa";
import ora from "ora";
import { getPackageManager } from "~/utils/getPackageManager.js";
import { logger } from "~/utils/logger.js";

export const installDependencies = async () => {
  logger.info("Installing dependencies...");
  const pkgManager = getPackageManager();
  const spinner = ora(`Running ${pkgManager} install...\n`).start();
  await execa(pkgManager, ["i"], { cwd: "../" });
  spinner.succeed(chalk.green("Successfully installed dependencies!\n"));
};
