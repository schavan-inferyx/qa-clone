import { MongoClient } from "mongodb";

export class MongoService {
  constructor() {
    this.uri = "mongodb://admin:20Admin19@3.6.247.212:27017/";
    this.dbName = "framework";

    this.client = null;
    this.db = null;
    this.isConnected = false;
  }

  // =====================================================
  // CONNECTION
  // =====================================================

  async connect() {
    try {
      if (this.isConnected) {
        console.log("🟡 MongoDB already connected");
        return;
      }

      console.log("🔵 Connecting to MongoDB...");

      this.client = new MongoClient(this.uri, {
        maxPoolSize: 10,
        minPoolSize: 1,
        serverSelectionTimeoutMS: 5000,
      });

      await this.client.connect();

      this.db = this.client.db(this.dbName);
      this.isConnected = true;

      console.log("🟢 MongoDB CONNECTED successfully");
      console.log(`   Host: ${this.uri}`);
      console.log(`   Database: ${this.dbName}`);
    }
    catch (error) {
      console.error("🔴 MongoDB CONNECTION FAILED");
      console.error(error.message);
      this.isConnected = false;
      throw error;
    }
  }

  async close() {
    try {
      if (!this.client || !this.isConnected) {
        console.log("🟡 MongoDB already disconnected");
        return;
      }

      console.log("🔵 Disconnecting MongoDB...");

      await this.client.close();

      this.client = null;
      this.db = null;
      this.isConnected = false;

      console.log("🟢 MongoDB DISCONNECTED successfully");
    }
    catch (error) {
      console.error("🔴 MongoDB DISCONNECT FAILED");
      console.error(error.message);
      throw error;
    }
  }

  collection(name) {
    if (!this.isConnected)
      throw new Error("MongoDB not connected");

    return this.db.collection(name);
  }

  // =====================================================
  // BASIC HELPERS
  // =====================================================

  async findByUUID(collection, uuid) {
    console.log(`🔎 Mongo Query: ${collection} | UUID: ${uuid}`);

    return this.collection(collection)
      .find({ uuid })
      .toArray();
  }

  async findActive(collection, uuid) {
    console.log(`🔎 Mongo Query Active: ${collection} | UUID: ${uuid}`);

    return this.collection(collection)
      .find({ uuid, active: "Y" })
      .toArray();
  }

  async getActiveVersion(collection, uuid) {
    const active = await this.findActive(collection, uuid);

    if (active.length !== 1)
      throw new Error(`Expected 1 active version, found ${active.length}`);

    console.log(`🟢 Active version found: ${active[0].version}`);

    return active[0].version;
  }

  async getHighestVersion(collection, uuid) {
    const docs = await this.findByUUID(collection, uuid);

    if (!docs.length)
      throw new Error("No versions found");

    const highest =
      docs.map(d => Number(d.version))
          .sort((a, b) => b - a)[0]
          .toString();

    console.log(`🟢 Highest version: ${highest}`);

    return highest;
  }

  async assertSingleActive(collection, uuid) {
    const docs = await this.findByUUID(collection, uuid);
    const activeDocs = docs.filter(d => d.active === "Y");

    console.log(
      `📊 State Check | Collection: ${collection} | UUID: ${uuid} | Total: ${docs.length} | Active: ${activeDocs.length}`
    );

    if (activeDocs.length > 1)
      throw new Error("Multiple active versions detected");

    return {
      docs,
      totalVersions: docs.length,
      activeCount: activeDocs.length
    };
  }

  async findActiveMetaByName(name) {
  console.log(`🔎 Mongo Meta Lookup | name: ${name}`);

  const docs = await this.collection("meta")
    .find({ name, active: "Y" })
    .toArray();

  if (!docs.length) {
    console.warn(`⚠️ No active meta found for: ${name}`);
    return null;
  }

  return docs[0];
}

  async waitForStableState(collection, uuid, expectedActiveCount, timeout = 5000) {
    console.log(
      `⏳ Waiting for stable state | Collection: ${collection} | UUID: ${uuid} | Expected Active: ${expectedActiveCount}`
    );

    const start = Date.now();

    while (Date.now() - start < timeout) {
      const { activeCount } =
        await this.assertSingleActive(collection, uuid);

      if (activeCount === expectedActiveCount) {
        console.log("🟢 Stable state achieved");
        return;
      }

      await new Promise(r => setTimeout(r, 200));
    }

    console.error("🔴 Stable state NOT achieved");

    throw new Error(
      `State not stable. Expected activeCount=${expectedActiveCount}`
    );
  }

  // =====================================================
  // ENTITY WRAPPER
  // =====================================================

  createEntityValidator(collection, uuid) {
    console.log(
      `🧩 Creating validator | Collection: ${collection} | UUID: ${uuid}`
    );

    return {
      waitForActive: (count) =>
        this.waitForStableState(collection, uuid, count),

      expectCreate: () =>
        this.expectCreate(collection, uuid),

      expectUpdate: (oldVersion) =>
        this.expectUpdate(collection, uuid, oldVersion),

      expectDelete: () =>
        this.expectDelete(collection, uuid),

      expectRestoreLatest: (versionCountBefore) =>
        this.expectRestoreLatest(collection, uuid, versionCountBefore),

      getActiveVersion: () =>
        this.getActiveVersion(collection, uuid),

      assertState: () =>
        this.assertSingleActive(collection, uuid)
    };
  }
}
