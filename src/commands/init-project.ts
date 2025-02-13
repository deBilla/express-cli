import * as fs from 'fs';
import * as path from 'path';
import { runCommand } from "../utils/command-utils";
import { spawnSync } from 'child_process';

const BOILERPLATE_REPO = "https://github.com/deBilla/express-boilerplate-repo";

export function setupFirebaseProject(projectName: string) {
  console.log(`Cloning boilerplate repository for project: ${projectName}...`);
  runCommand(`git clone ${BOILERPLATE_REPO} temp-boilerplate`);

  const projectDir = path.join(process.cwd(), projectName);

  console.log("Copying boilerplate...");

  // Ensure functions directory exists
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }

  // Copy the contents from the boilerplate to the functions directory
  runCommand(`cp -r temp-boilerplate/* ${projectDir}/`);
  runCommand("rm -rf temp-boilerplate");
  runCommand(`rm -rf ${projectDir}/src/modules/sample-module`);


  console.log(`Project setup complete! Your project is located at: ${projectDir} 🚀`);
}
