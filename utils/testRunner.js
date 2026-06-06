// Test Runner Utility - For Jenkins and CI/CD integration
const { exec } = require("child_process")
const path = require("path")
const fs = require("fs")

class TestRunner {
  constructor() {
    this.testDir = "./tests"
  }

  // Run all tests in a project
  async runProject(projectName) {
    const projectPath = path.join(this.testDir, projectName)
    if (!fs.existsSync(projectPath)) {
      throw new Error(`Project ${projectName} not found`)
    }

    const command = `npx playwright test ${projectPath} --project=${projectName}-tests`
    return this.executeCommand(command)
  }

  // Run all tests in a module
  async runModule(projectName, moduleName) {
    const modulePath = path.join(this.testDir, projectName, moduleName)
    if (!fs.existsSync(modulePath)) {
      throw new Error(`Module ${moduleName} not found in project ${projectName}`)
    }

    const command = `npx playwright test ${modulePath}`
    return this.executeCommand(command)
  }

  // Run a specific test file
  async runTest(testFilePath) {
    if (!fs.existsSync(testFilePath)) {
      throw new Error(`Test file ${testFilePath} not found`)
    }

    const command = `npx playwright test ${testFilePath}`
    return this.executeCommand(command)
  }

  // Run tests in sequence (for Jenkins)
  async runSequence(testFiles) {
    const results = []
    for (const testFile of testFiles) {
      console.log(`🏃 Running: ${testFile}`)
      try {
        const result = await this.runTest(testFile)
        results.push({ file: testFile, status: "passed", result })
      } catch (error) {
        results.push({ file: testFile, status: "failed", error: error.message })
      }
    }
    return results
  }

  executeCommand(command) {
    return new Promise((resolve, reject) => {
      console.log(`🚀 Executing: ${command}`)
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Error: ${error.message}`)
          reject(error)
          return
        }
        if (stderr) {
          console.warn(`⚠️ Warning: ${stderr}`)
        }
        console.log(`✅ Output: ${stdout}`)
        resolve(stdout)
      })
    })
  }
}

module.exports = { TestRunner }
