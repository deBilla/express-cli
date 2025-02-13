import { runCommand } from "../utils/command-utils";

export function addService(serviceName: string) {
  if (!serviceName) {
    console.error("Please specify a service to add.");
    process.exit(1);
  }
  console.log(`Adding service: ${serviceName}...`);
  // Add service logic (could involve installing Firebase service, etc.)
  runCommand(`firebase deploy --only ${serviceName}`, process.cwd());
  console.log(`Service ${serviceName} added and deployed successfully!`);
}
