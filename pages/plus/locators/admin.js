import { namespace } from "base";
import { group } from "node:console";
import { register } from "node:module";
import list from "postcss/lib/list";

export default {
  /* ---------------- Root Menus ---------------- */

  menus: {
    home: "//app-menu//a[@href='#/home']",
    product: "//app-menu//a[@href='#/product/list']",
    organization: "//app-menu//a[@href='#/organization/list']",
    account: "//app-menu//a[@href='#/account/list']",
    application: "//app-menu//a[@href='#/application/list']",
    security: "//app-menu//a[@href='#/security/user/list']",
    monitoring: "//app-menu//a[@href='#/monitoring/batchexecutor/list']",
    general: "//app-menu//a[@href='#/general/activity/list']",
    metadata: "//app-menu//a[@href='#/metadata/search']",
    hamburger: "//i[@class='pi pi-bars']",

  },

  forms: {
    description: "//textarea[@formcontrolname='desc']",
  },

  tabs: {
    overview: "//ul[@role='tablist']//span[contains(normalize-space(),'Overview')]",
    general: "//ul[@role='tablist']//span[contains(normalize-space(),'General')]",
    product: "//ul[@role='tablist']//span[contains(normalize-space(),'Product')]",
    security: "//ul[@role='tablist']//span[contains(normalize-space(),'Security')]",
    groups: "//ul[@role='tablist']//span[contains(normalize-space(),'Groups')]",
    session: "//ul[@role='tablist']//span[contains(normalize-space(),'Session Context')]",
    holidayDetails: "//ul[@role='tablist']//span[contains(normalize-space(),'Holiday Details')]"
  },

  breadcrumb: {
    add: "//ol[@class='p-breadcrumb-list']//span[contains(.,'Add')]",
    view: "//ol[@class='p-breadcrumb-list']//span[contains(.,'View')]"

  },


  readonly: {
    uuid: "input[formcontrolname='uuid']",
  },


  /* ---------------- Product ---------------- */

  product: {
    list: "//app-menu//a[@href='#/product/list']"
  },

  /* ---------------- Organization ---------------- */

  organization: {
    list: "//app-menu//a[@href='#/organization/list']",
    form: {
      add: {
        nameAlreadyExistsError: "//input[@formcontrolname='name']/following-sibling::div[contains(@class,'p-error')]",
        breadcrumb: {
          add: "//ol[@class='p-breadcrumb-list']//span[contains(.,'Add')]",
          view: "//ol[@class='p-breadcrumb-list']//span[contains(.,'View')]"

        },
        icons: {
          helpIcon: "//div[@ptooltip='Help']",
          closeIcon: "//div[@ptooltip='Close']"
        },
        name: "//input[@formcontrolname='name']",
        displayName: "//input[@formcontrolname='displayName']",
        description: "//textarea[@formcontrolname='desc']",
        domain: "//input[@formcontrolname='domain']",
        tags: "//p-chips[@formcontrolname='tags']",
        whitelistIp: "//label[text()='Whitelist IP']/following-sibling::div//p-chips",
        resourceMultiSelect: "//p-multiselect[@formcontrolname='resourceInfo']",
        toggles: {
          activeYes: "//p-selectbutton[@formcontrolname='active']//span[text()='YES']",
          activeNo: "//p-selectbutton[@formcontrolname='active']//span[text()='NO']",
          lockedYes: "//p-selectbutton[@formcontrolname='locked']//span[text()='YES']",
          lockedNo: "//p-selectbutton[@formcontrolname='locked']//span[text()='NO']",
          publishedYes: "//p-selectbutton[@formcontrolname='published']//span[text()='YES']",
          publishedNo: "//p-selectbutton[@formcontrolname='published']//span[text()='NO']",
          publicYes: "//p-selectbutton[@formcontrolname='publicFlag']//span[text()='YES']",
          publicNo: "//p-selectbutton[@formcontrolname='publicFlag']//span[text()='NO']",
        },
        logos: {
          wideAdd: "//i[@ptooltip='Add Wide Logo']",
          wideRemove: "//i[@ptooltip='Remove Wide Logo']",
          squareAdd: "//i[@ptooltip='Add Square Logo']",
          squareRemove: "//i[@ptooltip='Remove Square Logo']"
        },
        actions: {
          cancel: "//button//span[text()='Cancel']",
          submit: "//button//span[text()='Submit']"
        },

        tabs: {
          contact: "//span[text()='Contact']",
          phone: "//span[text()='Phone']",
          email: "//span[text()='Email']",
          address: "//span[text()='Address']",
          mailServer: "//span[text()='Mail Server']",
          notification: "//span[text()='Notification']",
          product: "//span[text()='Product']",
          productTab: {
            productDropdown: "//p-multiselect[@formcontrolname='productType']"
          }
        },
        tabActions: {
          productAdd: "(//button[@icon='pi pi-plus'])[7]",
          productRemove: "(//button[@ptooltip='Remove' or @ptooltip='Delete'])[7]"
        },
        emptyState: "//td[contains(text(),'No records found')]"
      },
      view: {
        breadcrumb: {
          home: "//p-breadcrumb//span[text()='Home']",
          organization: "//p-breadcrumb//span[text()='Organization']",
          view: "//p-breadcrumb//span[text()='View']",
        },
        icons: {
          homeDisabled: "//div[@ptooltip='Home' and contains(@class,'is-disabled')]",
          edit: "//i[contains(@class,'fa-pen-to-square')]",
          dependencies: "//div[@ptooltip='Dependencies']",
          refresh: "//div[@ptooltip='Refresh']",
          help: "//div[@ptooltip='Help']",
          close: "//div[@ptooltip='Close']",
        },

        identifiers: {
          orgId: "//input[@formcontrolname='orgId']",
          uuid: "//input[@formcontrolname='uuid']",
          versionDropdown: "//p-dropdown[@formcontrolname='version']",
        },

        audit: {
          createdBy: "//input[@formcontrolname='createdBy']",
          createdOn: "//input[@formcontrolname='createdOn']",
        },

        fields: {
          name: "//input[@formcontrolname='name']",
          displayName: "//input[@formcontrolname='displayName']",
          description: "//textarea[@formcontrolname='desc']",
          domain: "//input[@formcontrolname='domain']",
          tags: "//p-chips[@formcontrolname='tags']",
          whitelistIp: "//label[text()='Whitelist IP']/following-sibling::div//p-chips",
          resourceMultiSelect: "//p-multiselect[@formcontrolname='resourceInfo']",
        },

        toggles: {
          activeYes: "//p-selectbutton[@formcontrolname='active']//span[text()='YES']",
          activeNo: "//p-selectbutton[@formcontrolname='active']//span[text()='NO']",
          lockedYes: "//p-selectbutton[@formcontrolname='locked']//span[text()='YES']",
          lockedNo: "//p-selectbutton[@formcontrolname='locked']//span[text()='NO']",
          publishedYes: "//p-selectbutton[@formcontrolname='published']//span[text()='YES']",
          publishedNo: "//p-selectbutton[@formcontrolname='published']//span[text()='NO']",
          publicYes: "//p-selectbutton[@formcontrolname='publicFlag']//span[text()='YES']",
          publicNo: "//p-selectbutton[@formcontrolname='publicFlag']//span[text()='NO']",
        },

        logos: {
          wideAdd: "//i[@ptooltip='Add Wide Logo']",
          wideRemove: "//i[@ptooltip='Remove Wide Logo']",
          squareAdd: "//i[@ptooltip='Add Square Logo']",
          squareRemove: "//i[@ptooltip='Remove Square Logo']",
        },

        actions: {
          cancel: "//button//span[text()='Cancel']",
          submit: "//button//span[text()='Submit']",
        },

        tabs: {
          contact: { tab: "//span[text()='Contact']" },
          phone: { tab: "//span[text()='Phone']" },
          email: { tab: "//span[text()='Email']" },
          address: { tab: "//span[text()='Address']" },
          mailServer: { tab: "//span[text()='Mail Server']" },
          notification: { tab: "//span[text()='Notification']" },
          product: {
            tab: "//span[text()='Product']",
            productTypeDropdown: "//p-dropdown[@formcontrolname='productType']",
            startDate: "//p-calendar[@formcontrolname='startDate']",
            endDate: "//p-calendar[@formcontrolname='endDate']",
            activeCheckbox: "//p-checkbox[@formcontrolname='active']",
          },
        },

        tabActions: {
          add: "//div[contains(@class,'p-tabview-panel')]//button[@ptooltip='Add']",
          remove: "//div[contains(@class,'p-tabview-panel')]//button[@ptooltip='Remove' or @ptooltip='Delete']",
        },

        emptyState: "//td[contains(text(),'No records found')]",
      },


    },
  },

  /* ---------------- Account ---------------- */

  account: {
    list: "//app-menu//a[@href='#/account/list']",


    form: {
      breadcrumb: {
        add: "//span[normalize-space()='Add']",
        view: "//span[normalize-space()='View']",
      },

      fields: {
        name: "input[formcontrolname='name']",
        displayName: "input[formcontrolname='displayName']",
        description: "//textarea[@formcontrolname='desc']",
      },

      readonly: {
        uuid: "input[formcontrolname='uuid']",
        accountId: "input[formcontrolname='accountId']",
      },

      actions: {
        submit: "//button[normalize-space()='Submit']",
        cancel: "//button[normalize-space()='Cancel']",
        closeIcon: "//i[contains(@class,'pi-times')]",
      },

    },

  },

  /* ---------------- Application ---------------- */

  application: {

    breadcrumb: {
      add: "//span[normalize-space()='Add']",
      view: "//span[normalize-space()='View']",
    },
    tabs: {
      overview: "//ul[@role='tablist']//span[contains(normalize-space(),'Overview')]",
      general: "//ul[@role='tablist']//span[contains(normalize-space(),'General')]"

    },

    form: {
      code: "//input[@formcontrolname='code']",
      name: "//input[@formcontrolname='appName']",
      displayName: "//input[@formcontrolname='displayName']",
      desc: "//textarea[@formcontrolname='desc']",
      defaultEngine: "//p-dropdown[@formcontrolname='defaultEngine']",
      engineName: "//p-dropdown[@formcontrolname='engineName']",
      reportingEngine: "//p-dropdown[@formcontrolname='reportingEngine']",
      currency: "//p-dropdown[@formcontrolname='currency']",
      applicationCategory: "//p-dropdown[@formcontrolname='applicationCategory']",
      modelPort: "//input[@formcontrolname='modelPort']",
      account: "//p-dropdown[@formcontrolname='account']",
      module: "//p-multiselect[@formcontrolname='module']",
      submit: "//button[.//span[text()='Submit']]"
    },

    view: {
      uuid: "//input[@formcontrolname='uuid']"
    }
  },

  /* ---------------- Security ---------------- */

  security: {
    user: "//app-menu//a[@href='#/security/user/list']",
    group: "//app-menu//a[@href='#/security/group/list']",
    role: "//app-menu//a[@href='#/security/role/list']",
    privilege: "//app-menu//a[@href='#/security/privilege/list']",
    userGroup: "//app-menu//a[@href='#/security/userGroup/list']"
  },

  user: {

    form: {
      username: "#name",
      organizationLabel: "Organization",
      firstName: "//input[@formcontrolname='firstName']",
      lastName: "//input[@formcontrolname='lastName']",
      gracePeriod: "//input[@role='spinbutton']",
      password: 'input[type="password"]',
      expiryDate: "//p-calendar[@formcontrolname='expiryDate']",
      email: "//input[@placeholder='No Email Configured']",
      emailSubmit: "(//button[.='Submit'])[2]",
      passwordToggle: "//p-password//eyeicon",
      emailField: "//input[@formcontrolname='emailId']",
      defaultGroupLabel: "//label[normalize-space()='Default Group']/following::span[contains(@class,'p-dropdown-label')]",
      description: "//textarea[@formcontrolname='desc']",

    },

    groups: {
      tab: "//ul[@role='tablist']//a[.='Groups']",
      openPicker: "//label[normalize-space()='Groups']/following-sibling::div//i[contains(@class,'pi-plus')]",
      searchInput: '//input[contains(@placeholder,"Search Groups")]',
      checkbox: '//td//div[contains(@class,"p-checkbox-box")]',
      dialogSubmit: '//div[@role="dialog"]//button[span[text()="Submit"]]'
    }

  },

  group: {

    form: {

      name:
        "//input[@formcontrolname='name']",

      uuid:
        "//label[normalize-space()='UUID']/following::span[1]",

      applicationLabel:
        "Application",

      roleLabel:
        "Role",


    }
  },

  role: {

    form: {

      name: "#name",

      product: "//p-dropdown[@placeholder='Select Product']",

      role: "//p-dropdown[@formcontrolname='roleScope']",

    },

    privileges: {

      openPicker:
        "//label[normalize-space()='Privileges']/following::i[contains(@class,'pi-plus')]",

      searchInput:
        "//input[@placeholder='Search Privileges...']",

      dialogSubmit:
        "//div[@role='dialog']//button[.='Submit']",

    }

  },

  privilege: {

    form: {

      name: "#name",
      metaTypeLabel: "//p-dropdown[@formcontrolname='meta']",
      typeLabel: "//p-dropdown[@formcontrolname='type']"

    }
  },

  userGroup: {
    form: {

      name: "#name",
      selectGroups: '//p-multiselect[@formcontrolname="groupInfo"]',
      selectUsers: '//p-multiselect[@formcontrolname="userInfo"]',
    }
  },

  calendar: {

    tab: {
      overview: "overview",
      general: "general",
      holidayDetails: "holidayDetails"
    },

    form: {

      name: "//input[@formcontrolname='name']",

      workingDaysLabel:
        '//p-multiselect[@formcontrolname="nonWorkingDays"]',

      holidayTab:
        "//span[normalize-space()='Holiday Details']",

      addHolidayButton:
        '//button[@icon="pi pi-plus"]',

      holidayRow:
        "//table//tbody/tr",

      // holidayName:
      // "//input[@formcontrolname='desc']",

      // holidayDate:
      //   "p-calendar",

      // holidayOptionalCheckbox:
      // "td:nth-child(3) .p-checkbox-box"
      holidayName:
        "td:nth-child(3) input[formcontrolname='desc']",

      holidayDate:
        "td:nth-child(4) p-calendar",

      holidayOptionalCheckbox:
        "td:nth-child(5) .p-checkbox-box"

    }

  },

  category: {

    form: {

      name:
        "//input[@formcontrolname='name']"

    }

  },

  datasource: {

    form: {

      name:
        "//input[@formcontrolname='name']",

      applicationLabel:
        "//p-multiselect[@formcontrolname='application']",

      categoryLabel:"//p-dropdown[@formcontrolname='category']",
      typeLabel:
        "//p-dropdown[@formcontrolname='type']",

      authTypeLabel:
        "//p-dropdown[@formcontrolname='authType']",

      accessTypeLabel:
        "//p-dropdown[@formcontrolname='accessType']",

      driver:
        "//input[@formcontrolname='driver']",

      host:
        "//input[@formcontrolname='host']",

      port:
        "//input[@formcontrolname='port']",

      dbName:
        "//input[@formcontrolname='dbName']",
      schemaName:
        "//input[@formcontrolname='schemaName']",
      path:
        "//input[@formcontrolname='path']",
      catalogName:
        "//input[@formcontrolname='catalogName']",

      username:
        "//input[@formcontrolname='userName']",

      password:
        "//p-password[contains(@formcontrolname,'password')]//input",

      testConnectionButton:
        "//button[normalize-space()='Test']",

      connectionSpinner:
        ".pi.pi-spinner",

      connectionSuccessIcon:
        ".pi.pi-check-circle",
      addSessionParamButton: "//button[@icon='pi pi-plus']",
      sessionParamKey: "input[formcontrolname='key']",
      sessionParamValue: "input[formcontrolname='value']",

      ownerEditButton:"//div[@ptooltip='Owner']",
      ownerAddButton:"//button[@icon='pi pi-plus']",
      checkBox:"//div[@role='dialog']//p-tablecheckbox",
      selectButton:"//span[contains(.,'Select')]"
    }

  },

  product: {
    form: {
      name: "//input[@formcontrolname='name']",
      path: "//input[@formcontrolname='urlPath']",
      desc: "//textarea[@formcontrolname='desc']",
      iconSearch: ".pi-search",
      fileIcon: ".pi-file",
      displaySequence: "//p-inputnumber/span/input"
    }
  },


  /* ---------------- Monitoring ---------------- */

  monitoring: {
    batchMonitoring: "//app-menu//a[@href='#/monitoring/batchexecutor/list']",
    systemMonitoring: "//app-menu//a[@href='#/monitoring/systemMonitoring/list']",
    jobMonitoring: "//app-menu//a[@href='#/monitoring/job_monitoring']"
  },

  /* ---------------- General ---------------- */

  general: {
    activity: "//app-menu//a[@href='#/general/activity/list']",
    applicationSettings: "//app-menu//a[@href='#/general/processExec/list']",
    calendar: "//app-menu//a[@href='#/general/calendar/list']",
    category: "//app-menu//a[@href='#/general/category/list']",
    dataSource: {
      menu: "//span[.=' Data Source ']",
      list: "//app-menu//a[@href='#/general/datasource/list']",
      registerSchema: "//app-menu//a[@href='#/general/register-schema']",
      deploySchema: "//app-menu//a[@href='#/general/deploy-schema']",
      cloneSchema: "//app-menu//a[@href='#/general/clone-schema']",
      crawler: "//app-menu//a[@href='#/general/crawler/list']"
    },
    webhook: "//app-menu//a[@href='#/general/webhook/list']",
    domain: "//app-menu//a[@href='#/general/domain/list']",
    fileManager: "//app-menu//a[@href='#/general/fileManager/list']",
    lov: "//app-menu//a[@href='#/general/lov/list']",
    migrationAssist: "//app-menu//a[@href='#/general/MigrationAssist/list']",
    notificationTemplate: "//app-menu//a[@href='#/general/notiftemplate/list']",
    predictServer: "//app-menu//a[@href='#/general/predictserver']",
    page: {
      menu: "(//span[contains(text(),'Page')])[1]",
      list: "//app-menu//a[@href='#/general/pageconfig/list']",
      bulkAction: "//app-menu//a[@href='#/general/templateExec/list']"
    },
    quickLink: "//app-menu//a[@href='#/general/quicklink/list']",
    repository: "//app-menu//a[@href='#/general/repository/list']",
    resource: "//app-menu//a[@href='#/general/resource/list']",
    secretKey: {
      list: "//app-menu//a[@href='#/general/secretKey/list']",
      register: "//app-menu//a[@href='#/general/secretKey-register']"
    },
    server: '//a[@href="#/general/server/list"]',
    serverSettings: "//app-menu//a[@href='#/general/serverSettings/list']",
    session: "//app-menu//a[@href='#/general/session/list']",
    sysParam: "//span[contains(.,'SysParam')]",
    tag: "//app-menu//a[@href='#/general/tag/list']",
    webService: {
      menu: "//span[contains(text(),'Web Service')]",
      list: "//app-menu//a[@href='#/general/api/list']",
      client: "//app-menu//a[@href='#/general/apiclient/list']"
    }
  },

  server: {

    form: {
      name: "//input[@formcontrolname='name']",
      desc: "//textarea[@formcontrolname='desc']",
      scriptPath: "//input[@formcontrolname='scriptPath']"
    }

  },


  apiClient: {

    form: {
      name: "//input[@formcontrolname='name']",
      desc: "//textarea[@formcontrolname='desc']",
      type: "//p-multiselect[@formcontrolname='type']",
      grantType: "//p-multiselect[@formcontrolname='grantType']",
    }

  },

  sysParam: {
    form: {
      name: "//input[@formcontrolname='name']",
      date: "//p-calendar[@formcontrolname='value']//input",
      desc: "//textarea[@formcontrolname='desc']"
    },

    view: {
      uuid: "//input[@formcontrolname='uuid']"
    }
  },


  tag: {
    form: {
      name: "//input[@formcontrolname='name']",
      desc: "//textarea[@formcontrolname='desc']",
    },

    view: {
      uuid: "//input[@formcontrolname='uuid']"
    }
  },


  /* ---------------- Metadata ---------------- */

  metadata: {
    search: "//app-menu//a[@href='#/metadata/search']",
    list: "//app-menu//a[@href='#/metadata/list']",
    graph: "//app-menu//a[@href='#/metadata/graph']",
    analysis: "//app-menu//a[@href='#/metadata/analysis']",
    navigator: "//app-menu//a[@href='#/metadata/navigator']",
    privileges: "//app-menu//a[@href='#/metadata/privileges']",
    crawler: {
      menu: "(//span[contains(text(),'Crawler')])[1]",
    },
    register: {
      menu: "(//span[contains(text(),'Register')])[1]",
      list: "//ul[@class='p-tabview-nav']//span[contains(.,'List')]",
      logs: "//ul[@class='p-tabview-nav']//span[contains(.,'Logs')]",
      datasource: "//p-dropdown[@formcontrolname='dataSource']",
      registerYesRadio: "//div[@aria-checked='false']",
      registerNoRadio: "//div[@aria-checked='true']",
      searchButton: "//form//p-button[@label='Search']",
      refreshIcon: "//div[@ptooltip='Refresh']",
      registeringStatusLable: "//span[normalize-space()='REGISTERING']",
      datasourceSearchInput: "//input[@placeholder='Search...']",
      registeredStatusLabel: "//span[normalize-space()='REGISTERED']",
    }
  },

  quickLink: {
    form: {
      name: "//input[@formcontrolname='name']",
      url: "//input[@formcontrolname='url']",
      account: "//p-dropdown[@formcontrolname='account']",
      selectProducts: "//p-multiselect[@formcontrolname='product']",
      cacheSwitch: "//p-inputswitch[@formcontrolname='cache']"
    }

  },

  webService: {
    form: {
      name: "//input[@formcontrolname='name']",
      apiType: "//p-dropdown[@formcontrolname='apiType']",
      sourceUrl: "//input[@formcontrolname='sourceUrl']",
      requestFormat: "//p-dropdown[@formcontrolname='requestFormat']",
      responseFormat: "//p-dropdown[@formcontrolname='responseFormat']",
      desc: "//textarea[@formcontrolname='desc']",
      targetClass: "//input[@formcontrolname='targetClass']",
      targetMethod: "//input[@formcontrolname='targetMethod']",
    }
  },

  migrationAssist: {
    import: {
      menu: "//span[normalize-space()='Import']",
      name: "//input[@formcontrolname='name']",
      fileInput: "//input[@type='file']"
    },
    export: {
      menu: "//ul[@data-pc-section='nav']//span[normalize-space()='Export']",
      name: "//input[@formcontrolname='name']",
      fileInput: "//input[@type='file']"
    }

  }


}
