import dotenv from "dotenv"
dotenv.config()

const SERVER = process.env.SERVER || "test2.inferyx.com"
const DEFAULT_ACCOUNT_NAME = "Inferyx Account"
export default {


  plus: {

    entityStructure: {
      defaultOrg: {
        organisationName: "Inferyx8",
        accountName: "Inferyx Account Automation",
        domain: 'Inferyx.com',
        authorizedProducts:["Data Engineering", "Data Analytics", "Data Catalog","Administration"],
        applications: {
          dataEngineering: ["Anti Money Laundering"],
          dataAnalytics: ["Anti Money Laundering"],
          dataCatalog: ["Anti Money Laundering"],
          administration: ["Administration"],
          
        },
        appList: [
          {
            key: "AML",
            name: "Anti Money Laundering3",
            code: "AML",
            displayName: "Anti Money Laundering3",
            desc: "AML application for compliance monitoring",

            defaultEngine: "FILE",
            engineName: "DEFAULT",
            reportingEngine: "DEFAULT",
            currency: "USD",
            applicationCategory: "DEFAULT",

            modelPort: "7071",
            account: DEFAULT_ACCOUNT_NAME,
            // modules: [
            //   "resource_high",
            //   "resource_med",
            //   "resource_low"
            // ]
            batchUser:"sys_admin"
          }
        ],
        users: {
          admin: {
            org_admin: "Org Admin",
            acc_admin: "Account Admin",
            app_admin: "Application Admin"
          },
          data:{
            data_engineer: "aml_data_engineer",
            data_ops: "aml_data_ops",
            data_scientist: "aml_data_scientist",
            meta_ops: "aml_meta_ops",
            data_steward: "aml_data_steward"
          }
        },
      },
      org1: {
        organisationName: "Jio",
        accountName: "JioAccount",
        domain: 'Jio.com',
        applications: {
          dataEngineering: ["Anti Money Laundering"],
          dataAnalytics: ["Anti Money Laundering"],
          dataCatalog: ["Anti Money Laundering"],
          administration: ["Administration"]
        },
        users: {
          admin: {
            org_admin: "jio_org_admin",
            acc_admin: "jio_acc_admin",
            app_admin: "jio_app_admin"
          },
          data:{
            data_engineer: "aml_data_engineer",
            data_ops: "aml_data_ops",
            data_scientist: "aml_data_scientist",
            meta_ops: "aml_meta_ops",
            data_steward: "aml_data_steward"
          }
        }
      },
      org2: {
        organisationName: "Solera",
        accountName: "SoleraAccount",
        domain: 'Solera.com', 
        applications: {
          dataEngineering: ["Anti Money Laundering"],
          dataAnalytics: ["Anti Money Laundering"],
          dataCatalog: ["Anti Money Laundering"],
          administration: ["Administration"]
        },
        users: {
          admin: {
            org_admin: "solera_org_admin",
            acc_admin: "solera_acc_admin",
            app_admin: "solera_app_admin",
          },
          data:{
            data_engineer: "aml_data_engineer",
            data_ops: "aml_data_ops",
            data_scientist: "aml_data_scientist",
            meta_ops: "aml_meta_ops",
            data_steward: "aml_data_steward"
          }
        }
      }

    },
    platform: {
      url: `https://${SERVER}/platform/#/login`,
      username: "demo",
      password: "20Inferyx!987",
    },
    admin: {
      url: `https://${SERVER}/admin/#/login`,
      username: "sys_admin",
      password: "20Inferyx!9",
      defaultRole: "System Admin",
      role: "System Admin"
    },
    workbench: {
      url: `https://${SERVER}/workbench/#/login`,
      username: "demo",
      password: "20Inferyx!987",
      defaultRole: "Data Analyst",
      role: "Data Analyst"
    },
    dataEngineering: {
      url: `https://${SERVER}/data-engineering/#/login`,
      username: "demo",
      password: "20Inferyx!987",
      defaultRole: "Data Engineer",
    },
    dataAnalytics: {
      url: `https://${SERVER}/data-analytics/#/login`,
      username: "demo",
      password: "20Inferyx!9",
      defaultRole: "Data Scientist",
    },
    dataCatalog: {
      url: `https://${SERVER}/data-catalog/#/login`,
      username: "demo",
      password: "20Inferyx!987",
      defaultRole: "Data Steward",
    },

    productWiseAllowedRoles: {
      admin: ["System Admin", "Org Admin", "Account Admin", "Application Admin"],
      dataEngineering: ["Data Engineer", "Data Ops"],
      dataAnalytics: ["Data Scientist", "Meta Ops"],
      dataCatalog: ["Data Steward"]
    }

  },
  js:{
    url:"https://test2.inferyx.com/framework/app/index.html#!/login",
    username:"",
    password:"",
  }
}
