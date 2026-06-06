import mysql from "mysql2/promise";

export class MySQLService {

  constructor() {

    this.config = {
      host: "13.203.6.118",
      port: 3306,
      user: "admin",
      password: "20Admin19",
      database: "test",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };

    this.pool = null;
    this.isConnected = false;
  }

  // =====================================================
  // CONNECTION
  // =====================================================

  async connect() {

    if (this.isConnected)
      return;

    try {

      this.pool =
        mysql.createPool(this.config);

      await this.query("SELECT 1");

      this.isConnected = true;

      console.log("🟢 MySQL CONNECTED");

    }
    catch (error) {

      this.isConnected = false;

      console.error("🔴 MySQL CONNECTION FAILED");

      throw error;
    }
  }

  async close() {

    if (!this.pool)
      return;

    await this.pool.end();

    this.pool = null;
    this.isConnected = false;

    console.log("🟢 MySQL DISCONNECTED");
  }

  // =====================================================
  // CORE QUERY
  // =====================================================

  async query(sql, params = []) {

    if (!this.pool)
      throw new Error("MySQL not connected");

    console.log("🔎 MySQL SQL:", sql);

    const [rows] =
      await this.pool.execute(sql, params);

    return rows;
  }

  // =====================================================
  // DATABASE OPERATIONS
  // =====================================================

  async createDatabase(dbName) {

    await this.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\``
    );
  }

  async dropDatabase(dbName) {

    await this.query(
      `DROP DATABASE IF EXISTS \`${dbName}\``
    );
  }

  async databaseExists(dbName) {

    const rows =
      await this.query(
        `
        SELECT SCHEMA_NAME
        FROM INFORMATION_SCHEMA.SCHEMATA
        WHERE SCHEMA_NAME = ?
        `,
        [dbName]
      );

    return rows.length > 0;
  }

  // =====================================================
  // TABLE OPERATIONS
  // =====================================================

  async createTable(table, definition) {

    await this.query(
      `
      CREATE TABLE IF NOT EXISTS \`${table}\`
      (${definition})
      `
    );
  }

  async dropTable(table) {

    await this.query(
      `DROP TABLE IF EXISTS \`${table}\``
    );
  }

  async tableExists(table) {

    const rows =
      await this.query(
        `
        SELECT TABLE_NAME
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = ?
        `,
        [
          this.config.database,
          table
        ]
      );

    return rows.length > 0;
  }

  // =====================================================
  // CRUD OPERATIONS
  // =====================================================

  async insert(table, data) {

    const keys =
      Object.keys(data);

    const values =
      Object.values(data);

    const columns =
      keys.map(k => `\`${k}\``)
          .join(",");

    const placeholders =
      keys.map(() => "?")
          .join(",");

    const sql =
      `
      INSERT INTO \`${table}\`
      (${columns})
      VALUES (${placeholders})
      `;

    const result =
      await this.query(sql, values);

    return result.insertId;
  }

  async find(table, where = {}) {

    let sql =
      `SELECT * FROM \`${table}\``;

    const keys =
      Object.keys(where);

    let values = [];

    if (keys.length) {

      const clause =
        keys.map(
          k => `\`${k}\`=?`
        ).join(" AND ");

      sql += ` WHERE ${clause}`;

      values =
        Object.values(where);
    }

    return await this.query(
      sql,
      values
    );
  }

  async findByUUID(table, uuid) {

    return this.find(
      table,
      { uuid }
    );
  }

  async findActive(table, uuid) {

    return this.find(
      table,
      {
        uuid,
        active: "Y"
      }
    );
  }

  async update(table, where, updates) {

    const setKeys =
      Object.keys(updates);

    const whereKeys =
      Object.keys(where);

    const setClause =
      setKeys.map(
        k => `\`${k}\`=?`
      ).join(",");

    const whereClause =
      whereKeys.map(
        k => `\`${k}\`=?`
      ).join(" AND ");

    const values = [
      ...Object.values(updates),
      ...Object.values(where)
    ];

    await this.query(
      `
      UPDATE \`${table}\`
      SET ${setClause}
      WHERE ${whereClause}
      `,
      values
    );
  }

  async delete(table, where) {

    const keys =
      Object.keys(where);

    const clause =
      keys.map(
        k => `\`${k}\`=?`
      ).join(" AND ");

    const values =
      Object.values(where);

    await this.query(
      `
      DELETE FROM \`${table}\`
      WHERE ${clause}
      `,
      values
    );
  }

  // =====================================================
  // VERSION VALIDATION
  // =====================================================

  async getActiveVersion(table, uuid) {

    const rows =
      await this.findActive(
        table,
        uuid
      );

    if (rows.length !== 1)
      throw new Error(
        "Invalid active version state"
      );

    return rows[0].version;
  }

  async getHighestVersion(table, uuid) {

    const rows =
      await this.findByUUID(
        table,
        uuid
      );

    if (!rows.length)
      throw new Error(
        "No versions found"
      );

    return Math.max(
      ...rows.map(
        r => Number(r.version)
      )
    ).toString();
  }

  async assertSingleActive(table, uuid) {

    const rows =
      await this.findByUUID(
        table,
        uuid
      );

    const active =
      rows.filter(
        r => r.active === "Y"
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
