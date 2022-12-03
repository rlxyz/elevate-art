import path from "path";
import { fileURLToPath } from "url";

// With the move to TSUP as a build tool, this keeps path routes in other files (installers, loaders, etc) in check more easily.
// Path is in relation to a single index.js file inside ./dist
const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
export const PKG_ROOT = path.join(distPath, "../");

//export const PKG_ROOT = path.dirname(require.main.filename);

export const TITLE_TEXT = ` _____  __     _____  _____  _____  _____  _____    _____  _____  _____
|   __||  |   |   __||  |  ||  _  ||_   _||   __|  |  _  || __  ||_   _|
|   __||  |__ |   __||  |  ||     |  | |  |   __|  |     ||    -|  | |  
|_____||_____||_____|  \___/ |__|__|  |_|  |_____|  |__|__||__|__|  |_|
`;

export const DEFAULT_APP_NAME = "@elevateart/core";
export const SETUP_ELEVATEART_APP = "@elevateart/core";
