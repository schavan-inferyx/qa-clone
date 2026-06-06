import { selectDropdownWithFromControl } from "../../../utils/dropdownHelper";

export default {
  /* ---------------- Root Menu ---------------- */

  menu: {
    home: "//app-menu//a[@href='#/home']",
    dataDiscovery: "//app-menu//a[@href='#/data-discovery']",
    dataGlossary: "//span[normalize-space()='Data Glossary']",
    // dataGlossary:"(//span[contains(text(),'Data Glossary')])[1]",
    //dataDomain: "//app-menu//a[@href='#/datadomain/list']",
    dataDomain: "//span[normalize-space()='Data Domain']",

    dataAsset: "//span[normalize-space()='Data Asset']",
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
  
  form: {
    add:{
    name: "//input[@formcontrolname='name']",
    parent: "//p-tabpanel//p-dropdown",
    description: "//textarea[@formcontrolname='desc']",
    uuid: "input[formcontrolname='uuid']"
    
      },
      fields: {
        name: "input[formcontrolname='name']",
        displayName: "input[formcontrolname='displayName']",
        description: "//textarea[@formcontrolname='desc']",
      }}
    },

    /* ---------------- Data Domain ---------------- */

    dataDomain: {
    list: "//span[normalize-space()='Data Domain']",
    form: {
      name: "//input[@formcontrolname='name']",
      parent: "//p-tabpanel//p-dropdown",
      description: "//textarea[@formcontrolname='desc']",
      uuid: "input[formcontrolname='uuid']"

    }
  },
    /* ---------------- Data Asset ---------------- */

    dataAsset: {
     list: "//span[normalize-space()='Data Asset']",
   form: {
        name: 'input[formcontrolname="name"]',
        parent: '//p-tabpanel//p-dropdown',
        dataDomain: 'p-dropdown[formcontrolname="domainUuid"]',
        assetType: "//label[normalize-space()='Type']/following::span[@role='combobox'][1]",
        entity: "p-dropdown[class='p-element p-inputwrapper ng-untouched ng-pristine ng-invalid ng-star-inserted']",

        visibility: 'p-dropdown["class="p-element p-inputwrapper ng-pristine ng-valid ng-star-inserted ng-touched"]'
    }
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
}};
