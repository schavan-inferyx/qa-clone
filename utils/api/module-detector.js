// export class ModuleDetector {

import { MongoService } from "../db/mongo";

//   static resolve(operatorType) {

//     if (!operatorType) {
//       return {
//         module: "Unknown",
//         subModule: "Unknown"
//       };
//     }

//     const type = operatorType.toLowerCase();

//     let module = "Unknown";
//     let subModule = "Unknown";

//     switch (type) {

//       // Data Quality
//       case "dqgroupexec":
//       case "dqexec":
//         module = "Data Quality";
//         subModule = "Result";
//         break;

//       // Data Profiling
//       case "profilegroupexec":
//       case "profileexec":
//         module = "Data Profiling";
//         subModule = "Result";
//         break;

//       // Data Ingestion
//       case "ingestgroupexec":
//       case "ingestexec":
//         module = "Data Ingestion";
//         subModule = "Result";
//         break;

//       // Data Preparation
//       case "mapexec":
//       case "operatorexec":
//         module = "Data Preparation";
//         subModule = "Result";
//         break;

//       // Data Recon
//       case "reconexec":
//       case "recongroupexec":
//         module = "Data Recon";
//         subModule = "Result";
//         break;

//       default:
//         module = "Unknown";
//         subModule = "Unknown";
//     }

//     return { module, subModule };
//   }
// }


export class ModuleDetector {

  static mongo = new MongoService();
  static cache = new Map();
  static connected = false;

  static async init() {
    if (!this.connected) {
      await this.mongo.connect();
      this.connected = true;
    }
  }

  static async resolve(operatorType) {

    if (!operatorType) {
      return { module: "Unknown", subModule: "Unknown" };
    }

    const key = operatorType.toLowerCase();

    // ✅ Cache
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    await this.init();

    // 🔥 ALWAYS search { name, active: "Y" }
    const meta = await this.mongo.findActiveMetaByName(key);

    if (!meta) {
      const unknown = { module: "Unknown", subModule: "Unknown" };
      this.cache.set(key, unknown);
      return unknown;
    }

    // 🔥 REAL SOURCE OF TRUTH
    const rawMenu = meta.menu || "Unknown";

    const module = this.normalizeMenu(rawMenu);

    const result = {
      module,
      subModule: "Result"   // Exec → Result
    };

    this.cache.set(key, result);

    return result;
  }

  // 🔥 Only normalize format — not remap business logic
  static normalizeMenu(menu) {

    if (!menu) return "Unknown";

    // Convert camelCase / PascalCase to spaced words
    // Example: DataPreparation → Data Preparation
    return menu
      .replace(/([A-Z])/g, " $1")
      .trim();
  }
}