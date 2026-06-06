import { Client } from "trino-client";

export class IcebergService {

  constructor() {

    this.config = {
      server: "http://13.203.6.118:8080",   // change host
      catalog: "iceberg",
      schema: "default",
      user: "admin",
    };

    this.client = null;
    this.isConnected = false;
  }

  // =====================================================
  // CONNECTION
  // =====================================================

  async connect() {

    if (this.isConnected)
      return;

    try {

      this.client = new Client(this.config);

      await this.query("SELECT 1");

      this.isConnected = true;

      console.log("🟢 Iceberg CONNECTED");

    }
    catch (error) {

      this.isConnected = false;

      console.error("🔴 Iceberg CONNECTION FAILED");

      throw error;
    }
  }

  async close() {

    this.client = null;

    this.isConnected = false;

    console.log("🟢 Iceberg DISCONNECTED");
  }

  // =====================================================
  // CORE QUERY
  // =====================================================

  async query(sql) {

    if (!this.client)
      throw new Error("Iceberg not connected");

    console.log("🔎 Iceberg SQL:", sql);

    const iterator =
      await this.client.query(sql);

    const rows = [];

    for await (const row of iterator)
      rows.push(row);

    return rows;
  }

  // =====================================================
  // BASIC HELPERS
  // =====================================================

  async findByUUID(table, uuid) {

    return await this.query(`
      SELECT *
      FROM ${table}
      WHERE uuid='${uuid}'
    `);
  }

  async findActive(table, uuid) {

    return await this.query(`
      SELECT *
      FROM ${table}
      WHERE uuid='${uuid}'
      AND active='Y'
    `);
  }

  async getActiveVersion(table, uuid) {

    const rows =
      await this.findActive(table, uuid);

    if (rows.length !== 1)
      throw new Error(
        `Expected 1 active version, found ${rows.length}`
      );

    return rows[0].version;
  }

  async getHighestVersion(table, uuid) {

    const rows =
      await this.findByUUID(table, uuid);

    if (!rows.length)
      throw new Error("No versions found");

    return rows
      .map(r => Number(r.version))
      .sort((a, b) => b - a)[0]
      .toString();
  }

  async assertSingleActive(table, uuid) {

    const rows =
      await this.findByUUID(table, uuid);

    const active =
      rows.filter(r => r.active === "Y");

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

  async waitForStableState(
    table,
    uuid,
    expectedActiveCount,
    timeout = 10000
  ) {

    const start = Date.now();

    while (Date.now() - start < timeout) {

      const state =
        await this.assertSingleActive(
          table,
          uuid
        );

      if (state.activeCount === expectedActiveCount)
        return;

      await new Promise(r => setTimeout(r, 500));
    }

    throw new Error(
      "Iceberg state not stable"
    );
  }

  // =====================================================
  // SNAPSHOT VALIDATION
  // =====================================================

  async getSnapshots(table) {

    return await this.query(`
      SELECT *
      FROM ${table}$snapshots
      ORDER BY committed_at DESC
    `);
  }

  async getSnapshotCount(table) {

    const snapshots =
      await this.getSnapshots(table);

    return snapshots.length;
  }

  async getLatestSnapshot(table) {

    const snapshots =
      await this.getSnapshots(table);

    if (!snapshots.length)
      throw new Error("No snapshots found");

    return snapshots[0];
  }

  // =====================================================
  // CRUD VALIDATORS
  // =====================================================

  async expectCreate(table, uuid) {

    const state =
      await this.assertSingleActive(
        table,
        uuid
      );

    if (state.totalVersions !== 1)
      throw new Error(
        "Create must produce exactly 1 version"
      );

    if (state.activeCount !== 1)
      throw new Error(
        "Created entity must be active"
      );

    return this.getActiveVersion(
      table,
      uuid
    );
  }

  async expectUpdate(
    table,
    uuid,
    oldVersion
  ) {

    const state =
      await this.assertSingleActive(
        table,
        uuid
      );

    if (state.activeCount !== 1)
      throw new Error(
        "Update must result in 1 active version"
      );

    const newVersion =
      await this.getActiveVersion(
        table,
        uuid
      );

    if (Number(newVersion) <= Number(oldVersion))
      throw new Error(
        "Version did not increment"
      );

    return newVersion;
  }

  async expectDelete(table, uuid) {

    const active =
      await this.findActive(
        table,
        uuid
      );

    if (active.length !== 0)
      throw new Error(
        "Delete must result in zero active versions"
      );
  }

  // =====================================================
  // ENTITY VALIDATOR WRAPPER
  // =====================================================

  createEntityValidator(table, uuid) {

    return {

      waitForActive: count =>
        this.waitForStableState(
          table,
          uuid,
          count
        ),

      expectCreate: () =>
        this.expectCreate(
          table,
          uuid
        ),

      expectUpdate: oldVersion =>
        this.expectUpdate(
          table,
          uuid,
          oldVersion
        ),

      expectDelete: () =>
        this.expectDelete(
          table,
          uuid
        ),

      getActiveVersion: () =>
        this.getActiveVersion(
          table,
          uuid
        ),

      assertState: () =>
        this.assertSingleActive(
          table,
          uuid
        ),

      getSnapshots: () =>
        this.getSnapshots(table)

    };
  }

}

export default {
  /* ---------------- Root Menu ---------------- */
  menu: {
    home: "//app-menu//a[@href='#/home']",
    dataDiscovery: "//app-menu//a[@href='#/data-discovery']",
    dataGlossary: "//span[normalize-space()='Data Glossary']",
    // dataGlossary:"(//span[contains(text(),'Data Glossary')])[1]",
    //dataDomain: "//app-menu//a[@href='#/datadomain/list']",
    dataDomain: "//span[normalize-space()='Data Domain']",

    dataAsset: "//app-menu//a[@href='#/dataasset/list']",
    dataProduct: "//app-menu//a[@href='#/dataproduct/list']",
    workflowManager: "//app-menu//span[normalize-space()='Workflow Manager']/ancestor::a",
    addIcon: "//button[@icon='pi pi-plus']"
  },

  breadcrumb: {
    add: "//ol[@class='p-breadcrumb-list']//span[contains(.,'Add')]",

    view: "//ol[@class='p-breadcrumb-list']//span[contains(.,'View')]"
  },



  readonly: {
    uuid: "//div[contains(@class,'form-field')][.//label[normalize-space()='UUID']]//input",
  },
  forms: {
    description: "//textarea[@formcontrolname='desc']"
  },


  tabs: {
    overview: "//ul[@role='tablist']//span[contains(normalize-space(),'Overview')]",
    general: "//ul[@role='tablist']//span[contains(normalize-space(),'General')]",
    product: "//ul[@role='tablist']//span[contains(normalize-space(),'Product')]",
    security: "//ul[@role='tablist']//span[contains(normalize-space(),'Security')]",
    groups: "//ul[@role='tablist']//span[contains(normalize-space(),'Groups')]",
    session: "//ul[@role='tablist']//span[contains(normalize-space(),'Session Context')]",
    holidayDetails: "//ul[@role='tablist']//span[contains(normalize-space(),'Holiday Details')]",
    firstCheckBox: "(//div[@class='p-checkbox-box p-component'])[1]",
    glossary: "(//span[normalize-space()='Glossary'])[1]"
  },
  actions: {
    cancel: "//button//span[text()='Cancel']",
    submit: "//button//span[text()='Submit']",
    ok: "//button[normalize-space()='Ok']",
    switchToList: "//span[@class='p-button-icon pi pi-list']"
  },


  /* ---------------- Data Glossary ---------------- */
  dataGlossary: {
    //list: "//app-menu//a[@href='#/dataglossary/list']",
    list: "//span[normalize-space()='Data Glossary']",
    add: {
      nameAlreadyExistsError: "//input[@formcontrolname='name']/following-sibling::div[contains(@class,'p-error')]",
      breadcrumb: {
        add: "//ol[@class='p-breadcrumb-list']//span[contains(.,'Add')]",
        view: "//ol[@class='p-breadcrumb-list']//span[contains(.,'View')]"
      },
      form: {
        name: "//input[@formcontrolname='name']",
        parent: "//p-tabpanel//p-dropdown",
        description: "//textarea[@formcontrolname='desc']",
        uuid: "input[formcontrolname='uuid']"
      },
      fields: {
        name: "input[formcontrolname='name']",
        displayName: "input[formcontrolname='displayName']",
        description: "//textarea[@formcontrolname='desc']",
      },

      /* ---------------- Data Domain ---------------- */
      dataDomain: {
        list: "//span[normalize-space()='Data Domain']",
        form: {
          name: "//input[@formcontrolname='name']",
          parent: "//p-tabpanel//p-dropdown",
          description: "//textarea[@formcontrolname='desc']",
          uuid: "input[formcontrolname='uuid']"
        },

        /* ---------------- Data Asset ---------------- */
        dataAsset: {
          list: "//app-menu//a[@href='#/dataasset/list']",
        },

        /* ---------------- Data Product ---------------- */
        dataProduct: {
          list: "//app-menu//a[@href='#/dataproduct/list']",
        },

        /* ---------------- Data Classification ---------------- */
        dataClassification: {
          root: "//app-menu//span[normalize-space()='Data Classification']/ancestor::a",

          list: "//app-menu//a[@href='#/classification/list']",
          rule: "//app-menu//a[@href='#/classificationrule/list']",
          ruleGroup: "//app-menu//a[@href='#/classificationrulegroup/list']",
          results: "//app-menu//a[@href='#/classificationresult/list']",
        },

        /* ---------------- Workflow Manager ---------------- */
        workflowManager: {
          root: "//app-menu//span[normalize-space()='Workflow Manager']/ancestor::a",

          list: "//app-menu//a[@href='#/workflow-manager/list']",
          results: "//app-menu//a[@href='#/workflow-manager/list-result']",
        },
      }
    }
  }
};
