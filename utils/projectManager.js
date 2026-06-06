
// utils/projectManager.js
import projectConfig from "../utils/config/inferyx-project-config.json";

export class ProjectManager {
  // ------------------------------------------------
  // Detect project based on test file path
  // ------------------------------------------------
  detectProject(testFilePath) {
    const normalizedPath = testFilePath.replace(/\\/g, "/");
    const parts = normalizedPath.split("/");

    const testsIndex = parts.indexOf("tests");
    if (testsIndex === -1 || parts.length < testsIndex + 2) {
      throw new Error(
        `Invalid test path structure: ${testFilePath}`
      );
    }

    // tests/<project-name>/...
    const projectName = parts[testsIndex + 1];
    const project = projectConfig[projectName];

    if (!project) {
      throw new Error(
        `Project "${projectName}" not found in inferyx-project-config.json`
      );
    }

    return {
      ...project,
      name: projectName,
    };
  }

  // ------------------------------------------------
  // Detect module (data-ingestion, users, etc.)
  // ------------------------------------------------
  detectModule(testFilePath) {
    const normalizedPath = testFilePath.replace(/\\/g, "/");
    const parts = normalizedPath.split("/");

    const testsIndex = parts.indexOf("tests");
    if (testsIndex === -1 || parts.length < testsIndex + 3) {
      return "unknown";
    }

    // tests/<project>/<module>/...
    return parts[testsIndex + 2] || "unknown";
  }

  // ------------------------------------------------
  // Determine run level
  // ------------------------------------------------
  getRunLevel(testFilePath) {
    return testFilePath.endsWith(".spec.js") ? "spec" : "unknown";
  }

  // ------------------------------------------------
  // ✅ NEW: Resolve server base URL
  // ------------------------------------------------
  getServerUrl(serverKey) {
    const servers = projectConfig.servers;

    if (!servers || !servers[serverKey]) {
      throw new Error(
        `Server "${serverKey}" not defined in inferyx-project-config.json`
      );
    }

    return servers[serverKey];
  }
}
