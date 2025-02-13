#!/usr/bin/env node

import { setupFirebaseProject } from "./commands/init-project";
import { addModule } from "./commands/add-module";
import { addService } from "./commands/add-service";

// Get the command-line arguments
const args = process.argv.slice(2);
const command = args[0]; // First argument is the command (e.g., 'init', 'add')
const projectName = args[1]; // Second argument could be the project name (for init) or module name (for add)
const moduleName = args[2]; // Third argument (e.g., module name when adding a service or module)

switch (command) {
  case "init":
    if (projectName) {
      setupFirebaseProject(projectName);
    } else {
      console.error("Please provide a project name.");
      process.exit(1);
    }
    break;

  case "add":
    switch (projectName) {
      case "module":
        if (moduleName) {
          addModule(moduleName);
        } else {
          console.error("Please specify a service name to add.");
          process.exit(1);
        }
        break;
      case "service":
        if (moduleName) {
          addService(moduleName);
        } else {
          console.error("Please specify a service name to add.");
          process.exit(1);
        }
        break;
      default:
        console.log("Usage: express-deploy <command> [options]");
        console.log("Commands:");
        console.log(
          "  init <project-name>   - Initialize a new Express project with boilerplate"
        );
        console.log(
          "  add module <module-name>     - Add a module to the project"
        );
        console.log(
          "  add service <service> - Add a service to the project (e.g., Firestore, Functions)"
        );
        process.exit(1);
    }
    break;

  default:
    console.log("Usage: express-deploy <command> [options]");
    console.log("Commands:");
    console.log(
      "  init <project-name>   - Initialize a new Express project with boilerplate"
    );
    console.log("  add module <module-name>     - Add a module to the project");
    console.log(
      "  add service <service> - Add a service to the project (e.g., Firestore, Functions)"
    );
    process.exit(1);
}
