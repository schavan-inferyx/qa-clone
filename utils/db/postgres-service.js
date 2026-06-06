import pkg from "pg";
const { Pool } = pkg;

export class PostgresService {

  constructor() {

    this.config = {
      host: "13.203.6.118",
      port: 5432,
      user: "admin",
      password: "20Admin19",
      database: "postgres", // default connection db
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

    this.pool = null;
    this.isConnected = false;
  }

  // =====================================================
  // CONNECTION
  // =====================================================

  async connect() {

    if (this.isConnected) {
      console.log("🟡 PostgreSQL already connected");
      return;
    }

    try {

      console.log("🔵 Connecting to PostgreSQL...");

      this.pool = new Pool(this.config);

      const client = await this.pool.connect();

      await client.query("SELECT NOW()");

      client.release();

      this.isConnected = true;

      console.log("🟢 PostgreSQL CONNECTED successfully");
      console.log(`   Host: ${this.config.host}`);
      console.log(`   Database: ${this.config.database}`);

    }
    catch (error) {

      console.error("🔴 PostgreSQL CONNECTION FAILED");
      console.error(error.message);

      this.isConnected = false;

      throw error;
    }
  }

  async close() {

    if (!this.pool) {
      console.log("🟡 PostgreSQL already disconnected");
      return;
    }

    await this.pool.end();

    this.pool = null;
    this.isConnected = false;

    console.log("🟢 PostgreSQL DISCONNECTED successfully");
  }

  // =====================================================
  // DATABASE OPERATIONS
  // =====================================================

  async createDatabase(dbName) {

    console.log(`🛠 Creating database: ${dbName}`);

    await this.query(
      `CREATE DATABASE ${dbName}`
    );

    console.log(`🟢 Database created: ${dbName}`);
  }

  async dropDatabase(dbName) {

    console.log(`🛠 Dropping database: ${dbName}`);

    await this.query(
      `DROP DATABASE IF EXISTS ${dbName}`
    );

    console.log(`🟢 Database dropped: ${dbName}`);
  }

  async databaseExists(dbName) {

    const result = await this.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    return result.rowCount > 0;
  }

  // =====================================================
  // TABLE OPERATIONS
  // =====================================================

  async createTable(tableName, schema) {

    console.log(`🛠 Creating table: ${tableName}`);

    await this.query(
      `CREATE TABLE IF NOT EXISTS ${tableName} (${schema})`
    );

    console.log(`🟢 Table ready: ${tableName}`);
  }

  async dropTable(tableName) {

    await this.query(
      `DROP TABLE IF EXISTS ${tableName}`
    );

    console.log(`🟢 Table dropped: ${tableName}`);
  }

  async tableExists(tableName) {

    const result = await this.query(
      `
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = $1
      )
      `,
      [tableName]
    );

    return result.rows[0].exists;
  }

  // =====================================================
  // CRUD OPERATIONS
  // =====================================================

  async insert(table, data) {

    const keys = Object.keys(data);

    const values = Object.values(data);

    const columns = keys.join(",");

    const placeholders =
      keys.map((_, i) => `$${i + 1}`).join(",");

    const query =
      `INSERT INTO ${table} (${columns})
       VALUES (${placeholders})
       RETURNING *`;

    const result = await this.query(query, values);

    console.log(`🟢 Inserted into ${table}`);

    return result.rows[0];
  }

  async find(table, where = {}) {

    const keys = Object.keys(where);

    let query = `SELECT * FROM ${table}`;

    let values = [];

    if (keys.length) {

      const conditions =
        keys.map((k, i) => `${k} = $${i + 1}`).join(" AND ");

      query += ` WHERE ${conditions}`;

      values = Object.values(where);
    }

    const result = await this.query(query, values);

    return result.rows;
  }

  async findOne(table, where) {

    const rows = await this.find(table, where);

    return rows[0] || null;
  }

  async update(table, where, data) {

    const setKeys = Object.keys(data);
    const whereKeys = Object.keys(where);

    const setClause =
      setKeys.map((k, i) => `${k} = $${i + 1}`).join(",");

    const whereClause =
      whereKeys.map(
        (k, i) => `${k} = $${setKeys.length + i + 1}`
      ).join(" AND ");

    const values = [
      ...Object.values(data),
      ...Object.values(where),
    ];

    const query =
      `UPDATE ${table}
       SET ${setClause}
       WHERE ${whereClause}
       RETURNING *`;

    const result = await this.query(query, values);

    console.log(`🟢 Updated ${table}`);

    return result.rows;
  }

  async delete(table, where) {

    const keys = Object.keys(where);

    const clause =
      keys.map((k, i) => `${k} = $${i + 1}`).join(" AND ");

    const values = Object.values(where);

    const query =
      `DELETE FROM ${table}
       WHERE ${clause}`;

    await this.query(query, values);

    console.log(`🟢 Deleted from ${table}`);
  }

  // =====================================================
  // RAW QUERY
  // =====================================================

  async query(sql, params = []) {

    if (!this.pool)
      throw new Error("Postgres not connected");

    console.log("🔎 SQL:", sql);

    return await this.pool.query(sql, params);
  }

  // =====================================================
  // TRANSACTION
  // =====================================================

  async transaction(callback) {

    const client = await this.pool.connect();

    try {

      await client.query("BEGIN");

      const result =
        await callback(client);

      await client.query("COMMIT");

      return result;

    }
    catch (error) {

      await client.query("ROLLBACK");

      throw error;
    }
    finally {

      client.release();
    }
  }

}






// const pg = new PostgresService();

// await pg.connect();

// await pg.createDatabase("test_db");

// await pg.createTable(
//   "account",
//   `
//   uuid VARCHAR(50) PRIMARY KEY,
//   name TEXT,
//   active CHAR(1),
//   version INT
//   `
// );

// await pg.insert("account", {
//   uuid: "123",
//   name: "Test Account",
//   active: "Y",
//   version: 1
// });

// const rows =
//   await pg.find("account", { uuid: "123" });

// console.log(rows);

// await pg.update(
//   "account",
//   { uuid: "123" },
//   { name: "Updated" }
// );

// await pg.delete(
//   "account",
//   { uuid: "123" }
// );

// await pg.close();
