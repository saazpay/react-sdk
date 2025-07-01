#!/usr/bin/env node

import { mkdir, copyFile, readdir, stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get project root
const projectRoot = process.cwd();

// Source = template 'saazpay' folder in your CLI package
const sourceRoot = path.join(__dirname, "templates", "saazpay");

// Destination = user project 'saazpay' folder
const targetRoot = path.join(projectRoot, "src", "components", "saazpay");

// Command line args
const [, , command, folderName] = process.argv;

if (command !== "add" || !folderName) {
  console.error("Usage: npx @saazpayhq/react add template");
  process.exit(1);
}

if (folderName !== "saazpay") {
  console.error(`Unknown template folder: ${folderName}`);
  process.exit(1);
}

/**
 * Recursively copy directory structure
 */
async function copyDirectory(srcDir, destDir) {
  const entries = await readdir(srcDir, { withFileTypes: true });

  await mkdir(destDir, { recursive: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else if (entry.isFile()) {
      await copyFile(srcPath, destPath);
      console.log(`✅  Copied ${srcPath} -> ${destPath}`);
    }
  }
}

// Start the copy
await copyDirectory(sourceRoot, targetRoot);

console.log(
  "🚀  Saazpay starter templates copied successfully. You're ready to go!"
);
