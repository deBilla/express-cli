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

    if (!Array.isArray(response.data)) {
      throw new Error("Invalid GitHub response");
    }

    for (const file of response.data) {
      const filePath = path.join(localDir, file.name.replace("sample-module", moduleName));

      if (file.type === "dir") {
        await fs.ensureDir(filePath);
        await fetchFilesFromGitHub(file.url, filePath, moduleName);
      } else if (file.type === "file") {
        const fileResponse = await axios.get(file.download_url);
        let updatedContent = fileResponse.data.replace(/SampleModule/g, capitalize(moduleName));
        updatedContent = updatedContent.replace(/sample-module/g, moduleName);
        
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

  // Update src/index.ts to include the new module
  const indexTsPath = path.join(process.cwd(), "src", "index.ts");
  let indexTsContent = await fs.readFile(indexTsPath, "utf8");

  // Add import statement for the new module
  const importStatement = `import ${capitalize(moduleName)}Router from "./modules/${moduleName}/${moduleName}.route";\n`;
  if (!indexTsContent.includes(importStatement)) {
    indexTsContent = importStatement + indexTsContent;
  }

  // Add app.use() for the new module after app.use(express.urlencoded({ extended: true }));
  const useStatement = `app.use(${capitalize(moduleName)}Router);\n`;
  if (!indexTsContent.includes(useStatement)) {
    indexTsContent = indexTsContent.replace(
      `app.use(express.urlencoded({extended: true}));`,
      `app.use(express.urlencoded({extended: true}));\n${useStatement}`
    );
  }

  await fs.writeFile(indexTsPath, indexTsContent, "utf8");
  console.log(`✅ Module '${moduleName}' added successfully to index.ts.`);
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
