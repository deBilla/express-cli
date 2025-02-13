import { execSync } from 'child_process';

export function runCommand(command: string, cwd: string = process.cwd()) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit', cwd });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    process.exit(1);
  }
}
