import axios from "axios";
import fs from "fs-extra";
import path from "path";

const GITHUB_REPO_URL =
  "https://api.github.com/repos/deBilla/express-boilerplate-repo/contents/src/modules/sample-module";

async function fetchFilesFromGitHub(
  url: string,
  localDir: string,
  moduleName: string
): Promise<void> {
  try {
    const response = await axios.get(url, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });

    const pascalCaseName = moduleName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
    const camelCaseName = pascalCaseName.charAt(0).toLowerCase() + pascalCaseName.slice(1);

    if (!Array.isArray(response.data)) {
      throw new Error("Invalid GitHub response");
    }

    for (const file of response.data) {
      const filePath = path.join(
        localDir,
        file.name.replace("sample-module", moduleName)
      );

      if (file.type === "dir") {
        await fs.ensureDir(filePath);
        await fetchFilesFromGitHub(file.url, filePath, moduleName);
      } else if (file.type === "file") {
        const fileResponse = await axios.get(file.download_url);
        let updatedContent = fileResponse.data.replace(
          /SampleModule/g,
          pascalCaseName
        );
        updatedContent = updatedContent.replace(/sample-module/g, moduleName);
        updatedContent = updatedContent.replace(/sampleModule/g, camelCaseName);

        await fs.writeFile(filePath, updatedContent, "utf8");
        console.log(`Created: ${filePath}`);
      }
    }
  } catch (error: any) {
    console.error("Error fetching module:", error.message);
  }
}

export async function addModule(moduleName: string): Promise<void> {
  if (!moduleName) {
    console.error("Please provide a module name.");
    process.exit(1);
  }

  const targetDir = path.join(process.cwd(), "src", "modules", moduleName);
  await fs.ensureDir(targetDir);

  console.log(`Fetching module '${moduleName}' from GitHub...`);
  await fetchFilesFromGitHub(GITHUB_REPO_URL, targetDir, moduleName);

  const pascalCaseName = moduleName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  const camelCaseName = pascalCaseName.charAt(0).toLowerCase() + pascalCaseName.slice(1);

  // Update src/index.ts to include the new module
  const indexTsPath = path.join(process.cwd(), "src", "index.ts");
  let indexTsContent = await fs.readFile(indexTsPath, "utf8");

  // Add import statement for the new module
  const importStatement = `import ${camelCaseName}Router from "./modules/${moduleName}/${moduleName}.route";\n`;
  if (!indexTsContent.includes(importStatement)) {
    indexTsContent = importStatement + indexTsContent;
  }

  // Add app.use() for the new module after app.use(express.urlencoded({ extended: true }));
  const useStatement = `app.use('/v1/${moduleName}', ${camelCaseName}Router);`;
  if (!indexTsContent.includes(useStatement)) {
    indexTsContent = indexTsContent.replace(
      `app.use(express.urlencoded({extended: true}));`,
      `app.use(express.urlencoded({extended: true}));\n${useStatement}`
    );
  }

  await updateConfigFile(moduleName);

  await fs.writeFile(indexTsPath, indexTsContent, "utf8");
  console.log(`✅ Module '${moduleName}' added successfully to index.ts.`);
}

async function updateConfigFile(moduleName: string): Promise<void> {
  const configPath = path.join(
    process.cwd(),
    "src/server-config",
    "configurations.ts"
  );
  let configContent = await fs.readFile(configPath, "utf8");

  const pascalCaseName = moduleName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  const camelCaseName = pascalCaseName.charAt(0).toLowerCase() + pascalCaseName.slice(1);

  const tableName = moduleName
    .replace(/([a-z])([A-Z])/g, "$1_$2") // Convert camelCase to snake_case
    .toLowerCase()
    .replace(/-/g, "_") + "s"; // Convert kebab-case to snake_case and add "s"
  const tableEntry = `${camelCaseName}Table: "${tableName}",`;

  // Ensure the table entry is added only if it doesn’t already exist
  if (!configContent.includes(tableEntry)) {
    configContent = configContent.replace(
      /postgres:\s*{([\s\S]*?)pool:/,
      `postgres: {\n    ${tableEntry}\n    $1pool:`
    );

    await fs.writeFile(configPath, configContent, "utf8");
    console.log(`✅ Updated config.ts with ${moduleName} table.`);
  }
}
