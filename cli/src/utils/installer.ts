import path from "path";
import type { PackageManager } from "~/utils/getPackageManager.js";

// Turning this into a const allows the list to be iterated over for programatically creating prompt options
// Should increase extensability in the future
export const availableApps = ["www", "docs", "rng"] as const;
export type AvailableApps = typeof availableApps[number];

export interface InstallerOptions {
  projectDir: string;
  pkgManager: PackageManager;
  noInstall: boolean;
  packages?: PackageInstallerMap;
  projectName?: string;
}

export type PackageInstallerMap = {
  [pkg in AvailableApps]: {
    inUse: boolean;
    directory: string;
  };
};

export const buildPackageInstallerMap = (packages: AvailableApps[]): PackageInstallerMap => ({
  www: {
    inUse: packages.includes("www"),
    directory: path.resolve(process.cwd(), `../apps/www`),
  },
  docs: {
    inUse: packages.includes("docs"),
    directory: path.resolve(process.cwd(), `../apps/docs`),
  },
  rng: {
    inUse: packages.includes("rng"),
    directory: path.resolve(process.cwd(), `../apps/rng`),
  },
});
