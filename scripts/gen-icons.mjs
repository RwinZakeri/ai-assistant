import { execSync } from "child_process";
import os from "os";
import path from "path";

import fs from "fs";
import { glob } from "glob";

const isWindows = os.platform() === "win32";

const SVG_PATH = path.resolve("src", "assets", "images", "svg");

fs.readdirSync(SVG_PATH)
  .filter((file) => file.endsWith(".tsx"))
  .forEach((file) => fs.unlinkSync(path.join(SVG_PATH, file)));

(async () => {
  const svgFiles = await glob(
    isWindows
      ? `${SVG_PATH.replace(/\\/g, "/")}/**/*.svg`
      : path.join(SVG_PATH, "*.svg")
  );

  if (svgFiles.length === 0) {
    console.log("No SVG files found.");
    return;
  }

  const command = `svgr --out-dir "${SVG_PATH}" ${svgFiles
    .map((f) => `"${f}"`)
    .join(" ")}`;
  execSync(command, { stdio: "inherit" });
})();
