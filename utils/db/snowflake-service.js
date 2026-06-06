import snowflake from "snowflake-sdk";

export class SnowflakeService {

  constructor() {

    this.config = {
      account: "your_account",      // ex: xy12345.ap-south-1
      username: "your_username",
      password: "your_password",
      warehouse: "COMPUTE_WH",
      database: "TEST_DB",
      schema: "PUBLIC",
      role: "ACCOUNTADMIN"
    };

    this.connection = null;
    this.isConnected = false;
  }

  // =====================================================
  // CONNECTION
  // =====================================================

  async connect() {

    if (this.isConnected)
      return;

    this.connection =
      snowflake.createConnection(this.config);

    await new Promise((resolve, reject) => {

      this.connection.connect((err, conn) => {

        if (err) {
          console.error("🔴 Snowflake connection failed");
          reject(err);
        }
        else {
          console.log("🟢 Snowflake CONNECTED");
          this.isConnected = true;
          resolve(conn);
        }

      });

    });
  }

  async close() {

    if (!this.connection)
      return;

    await new Promise((resolve, reject) => {

      this.connection.destroy(err => {

        if (err)
          reject(err);
        else {
          console.log("🟢 Snowflake DISCONNECTED");
          resolve();
        }

      });

    });

    this.isConnected = false;
    this.connection = null;
  }

  // =====================================================
  // CORE QUERY
  // =====================================================

  async query(sql, binds = []) {

    if (!this.isConnected)
      throw new Error("Snowflake not connected");

    console.log("🔎 Snowflake SQL:", sql);

    return new Promise((resolve, reject) => {

      this.connection.execute({

        sqlText: sql,
        binds,

        complete: (err, stmt, rows) => {

          if (err)
            reject(err);
          else
            resolve(rows);

        }

      });

    });
  }

  // =====================================================
  // DATABASE OPERATIONS
  // =====================================================

  async createDatabase(dbName) {

    await this.query(
      `CREATE DATABASE IF NOT EXISTS ${dbName}`
    );
  }

  async createSchema(schemaName) {

    await this.query(
      `CREATE SCHEMA IF NOT EXISTS ${schemaName}`
    );
  }

  async createTable(table, definition) {

    await this.query(`
      CREATE TABLE IF NOT EXISTS ${table}
      (${definition})
    `);
  }

  async dropTable(table) {

    await this.query(
      `DROP TABLE IF EXISTS ${table}`
    );
  }

  // =====================================================
  // CRUD OPERATIONS
  // =====================================================

  async insert(table, data) {

    const columns =
      Object.keys(data).join(",");

    const values =
      Object.values(data)
        .map(v => `'${v}'`)
        .join(",");

    await this.query(`
      INSERT INTO ${table}
      (${columns})
      VALUES (${values})
    `);
  }

  async find(table, where = {}) {

    let sql =
      `SELECT * FROM ${table}`;

    const keys =
      Object.keys(where);

    if (keys.length) {

      const clause =
        keys.map(
          k => `${k}='${where[k]}'`
        ).join(" AND ");

      sql += ` WHERE ${clause}`;
    }

    return await this.query(sql);
  }

  async findByUUID(table, uuid) {

    return this.find(table, { uuid });
  }

  async findActive(table, uuid) {

    return this.find(
      table,
      { uuid, active: "Y" }
    );
  }

  async update(table, where, updates) {

    const setClause =
      Object.entries(updates)
        .map(
          ([k, v]) => `${k}='${v}'`
        ).join(",");

    const whereClause =
      Object.entries(where)
        .map(
          ([k, v]) => `${k}='${v}'`
        ).join(" AND ");

    await this.query(`
      UPDATE ${table}
      SET ${setClause}
      WHERE ${whereClause}
    `);
  }

  async delete(table, where) {

    const clause =
      Object.entries(where)
        .map(
          ([k, v]) => `${k}='${v}'`
        ).join(" AND ");

    await this.query(`
      DELETE FROM ${table}
      WHERE ${clause}
    `);
  }

  // =====================================================
  // VERSION VALIDATION
  // =====================================================

  async getActiveVersion(table, uuid) {

    const rows =
      await this.findActive(table, uuid);

    if (rows.length !== 1)
      throw new Error(
        "Invalid active version state"
      );

    return rows[0].VERSION;
  }

  async getHighestVersion(table, uuid) {

    const rows =
      await this.findByUUID(table, uuid);

    if (!rows.length)
      throw new Error("No versions found");

    return Math.max(
      ...rows.map(
        r => Number(r.VERSION)
      )
    ).toString();
  }

  async assertSingleActive(table, uuid) {

    const rows =
      await this.findByUUID(table, uuid);

    const active =
      rows.filter(
        r => r.ACTIVE === "Y"
      );

    if (active.length > 1)
      throw new Error(
        "Multiple active versions detected"
      );

    return {
      docs: rows,
      totalVersions: rows.length,
      activeCount: active.length
    };
  }

  // =====================================================
  // ENTITY VALIDATOR
  // =====================================================

  createEntityValidator(table, uuid) {

    return {

      expectCreate: async () => {

        const state =
          await this.assertSingleActive(
            table,
            uuid
          );

        if (state.totalVersions !== 1)
          throw new Error(
            "Create validation failed"
          );

        return this.getActiveVersion(
          table,
          uuid
        );
      },

      expectUpdate: async oldVersion => {

        const newVersion =
          await this.getActiveVersion(
            table,
            uuid
          );

        if (
          Number(newVersion) <=
          Number(oldVersion)
        )
          throw new Error(
            "Version not incremented"
          );

        return newVersion;
      },

      expectDelete: async () => {

        const active =
          await this.findActive(
            table,
            uuid
          );

        if (active.length)
          throw new Error(
            "Delete validation failed"
          );
      }

    };
  }

}
