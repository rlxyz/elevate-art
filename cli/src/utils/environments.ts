import type { PackageManager } from "~/utils/getPackageManager.js";

// Turning this into a const allows the list to be iterated over for programatically creating prompt options
// Should increase extensability in the future
export const availableEnvironments = ["localhost", "staging", "production"] as const;
export type AvailableEnvironments = typeof availableEnvironments[number];

export interface InstallerOptions {
  projectDir: string;
  pkgManager: PackageManager;
  noInstall: boolean;
  packages?: PackageInstallerMap;
  projectName?: string;
}

export type PackageInstallerMap = {
  [pkg in AvailableEnvironments]: {};
};

export const buildEnvironmentInstallerMap = (environments: AvailableEnvironments[]): PackageInstallerMap => ({
  localhost: {},
  staging: {},
  production: {},
});
