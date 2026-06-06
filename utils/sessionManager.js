
// utils/sessionManager.js
import fs from "fs";
import path from "path";

export class SessionManager {
  constructor(workerIndex) {
    if (workerIndex === undefined || workerIndex === null) {
      throw new Error("SessionManager requires workerIndex");
    }

    this.workerIndex = workerIndex;
    this.rootDir = path.resolve(".sessions", `worker-${workerIndex}`);

    if (!fs.existsSync(this.rootDir)) {
      fs.mkdirSync(this.rootDir, { recursive: true });
    }
  }

  // ---------- internal helpers ----------

  _filePath(name) {
    return path.join(this.rootDir, `${name}.json`);
  }

  _exists(name) {
    return fs.existsSync(this._filePath(name));
  }

  // ---------- AUTH SESSION (login only) ----------

  hasAuthSession() {
    return this._exists("auth");
  }

  getAuthSessionPath() {
    return this.hasAuthSession() ? this._filePath("auth") : null;
  }

  saveAuthSession(storageState) {
    fs.writeFileSync(
      this._filePath("auth"),
      JSON.stringify(storageState, null, 2)
    );
  }

  // ---------- PRODUCT SESSION (derived from auth) ----------

  hasProductSession(productName) {
    if (!productName) {
      throw new Error("productName is required for product session");
    }
    return this._exists(productName);
  }

  getProductSessionPath(productName) {
    return this.hasProductSession(productName)
      ? this._filePath(productName)
      : null;
  }

  saveProductSession(productName, storageState) {
    if (!productName) {
      throw new Error("productName is required to save product session");
    }

    fs.writeFileSync(
      this._filePath(productName),
      JSON.stringify(storageState, null, 2)
    );
  }

  // ---------- optional cleanup (DO NOT call automatically) ----------

  clearProductSession(productName) {
    const file = this._filePath(productName);
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }

  clearAuthSession() {
    const file = this._filePath("auth");
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }
}
