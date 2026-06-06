export default {
  menus: {
    home: "//a[contains(@href,'#/home')]",
    dataIngestion: "//a[contains(@href,'#/data-ingestion')]",
    dataProfiling: "//a[contains(@href,'#/data-profiling')]",
    dataQuality: "//a[contains(@href,'#/data-quality')]",
    dataPreparation: "//a[contains(@href,'#/data-preparation')]",
    dataReconciliation: "//a[contains(@href,'#/data-reconciliation')]",
    dataMigration: "//a[contains(@href,'#/data-migration')]",
    dataArchival: "//a[contains(@href,'#/data-archival')]",
    dataPipeline: "//a[contains(@href,'#/data-pipeline')]",
    dataVault: "//a[contains(@href,'#/data-vault')]",
    batchScheduler: "//a[contains(@href,'#/batchscheduler')]",
    admin: "//a[contains(@href,'#/admin')]",
    metadataNavigator: "//a[.//i[contains(@class,'pi-send')]]"
  },


  form: {
    // Input fields
    description: "//textarea[@formcontrolname='desc']",
    name: "input[formcontrolname='name']",
    displayName: "input[formcontrolname='displayName']",
    tags: "p-chips[formcontrolname='tags'] input",
    //description: "textarea[formcontrolname='desc']",
    parallelThreads: "p-inputnumber[formcontrolname='numThreads'] input",

    // Toggles (YES/NO buttons)
    activeYes: "p-selectbutton[formcontrolname='active'] .p-button:first-child",
    activeNo: "p-selectbutton[formcontrolname='active'] .p-button:last-child",
    lockedYes: "p-selectbutton[formcontrolname='locked'] .p-button:first-child",
    lockedNo: "p-selectbutton[formcontrolname='locked'] .p-button:last-child",
    publishedYes: "p-selectbutton[formcontrolname='published'] .p-button:first-child",
    publishedNo: "p-selectbutton[formcontrolname='published'] .p-button:last-child",
    publicYes: "p-selectbutton[formcontrolname='publicFlag'] .p-button:first-child",
    publicNo: "p-selectbutton[formcontrolname='publicFlag'] .p-button:last-child",

    // Checkboxes
    runParallel: "p-checkbox[formcontrolname='inParallel'] input",
    runImmediate: "p-checkbox[formcontrolname='runImmediate'] input",

    // Dropdown
    rulesDropdown: "p-multiselect[formcontrolname='rules']",
    rulesTrigger: "p-multiselect[formcontrolname='rules'] .p-multiselect-trigger",

    // Job notification
    jobNotification: "div.p-inputgroup input",
    addNotification: "div.p-inputgroup button",

    // Buttons
    cancel: "p-button[label='cancel'] button",
    submit: "p-button[label='Submit'] button",

    inferSchema: "//p-button[@ptooltip='Infer Schema']//button",
    inferSchemaSubmit: "//p-dialog[@header='Infer Schema']//button[contains(.,'Submit')]"
  },

  breadcrumb: {
    add: "//ol[@class='p-breadcrumb-list']//span[contains(.,'Add')]",
    view: "//ol[@class='p-breadcrumb-list']//span[contains(.,'View')]"

  },

  dataIngestion: {
    daRule: {
  form: {

    /* ================= BASIC DETAILS ================= */

    name: "//input[@formcontrolname='name']",

    ingestionType: "//p-dropdown[@formcontrolname='type']",

    continueButton: "//button[contains(.,'Continue')]",



    /* ================= SOURCE CONFIG ================= */

    sourceDataSource: "//p-dropdown[@formcontrolname='sourceDatasource']",
    sourceType: "//p-dropdown[@formcontrolname='sourceType']",
    sourcePath: "(//input[@id='uuid'])[3]",
    sourceNameInput: "(//input[@formcontrolname='sourceName'])[1]",
    sourceNameDD: "//p-dropdown[@formcontrolname='sourceTypeName']",
    sourceFormat: "//p-dropdown[@formcontrolname='sourceFormat']",

    sourceAction: "//p-dropdown[@formcontrolname='actionType']",

    condtion: "//p-dropdown[@formcontrolname='actionCondition']",



    /* ================= TARGET CONFIG ================= */

    targetDataSource: "//p-dropdown[@formcontrolname='targetDatasource']",
    autoPopulate:"//i[@ptooltip='Auto Populate']",

    targetFormat: "//p-dropdown[@formcontrolname='targetFormat']",

    targetPath: "//input[@formcontrolname='targetPath']",
    saveMode : "//p-dropdown[@formcontrolname='saveMode']",
    loadType: "//p-dropdown[@formcontrolname='loadType']",
    targetNameDD:"//p-dropdown[@formcontrolname='targetDetail']",
    targetNameDDTable_Collection: "//p-dropdown[@formcontrolname='targetName']",
    targetType:"//p-dropdown[@formcontrolname='targetType']",
    targetNameInput: "//input[@formcontrolname='targetName']",

    /* ================= TRANSFORMATION ================= */

    sourceAttributeInput:"//input[@formcontrolname='SourceAttribute']",
    sourceAttributeDD: "//p-dropdown[@formcontrolname='SourceAttribute']",
    targetAttributeInput:"//input[@formcontrolname='TargetAttribute']",
    functionDropdown:"//p-dropdown[@formcontrolname='function']",
    removeCharDrodown:"//p-dropdown[@formcontrolname='removeChars']",
    
    attributeType: "//p-dropdown[@formcontrolname='attributeType']",

    attributeNameInput: "(//input[@type='text'])[2]",

    transformationFunction: "//p-dropdown[@formcontrolname='function']",

    transformationParameter: "//p-dropdown[@formcontrolname='parameter']",



    /* ================= EXECUTION ================= */

    executionCheckbox: "//p-checkbox//div[contains(@class,'p-checkbox-box')]",

    runLabel: "(//input[@type='text'])[3]",



    /* ================= SUBMIT ================= */

    submitButton: "//button[contains(.,'Submit')]"
  }
  },
  
  form:{
    rulesDropdown: "//p-multiselect[@formcontrolname='rules']"
  },
    rule: "//app-menu//a[contains(@href,'#/data-ingestion/list')]",
    ruleGroup: "//app-menu//a[contains(@href,'#/data-ingestion/list-group')]",
    ruleResults: "//app-menu//a[contains(@href,'#/data-ingestion/list-result')]",
    bulkAction: "//app-menu//a[contains(@href,'#/data-ingestion/list-bulkAction')]",
    parameterList: "//app-menu//a[contains(@href,'#/data-ingestion/list-param')]",

  },
  dataProfiling: {
    dprule:{
      form:{
          sourceType:"//p-dropdown[@formcontrolname='source']",
          sourceName: "//p-dropdown[@formcontrolname='name']",
          sourceAttributes: "//p-multiselect[@formcontrolname='attributes']",
          bussinessDate: "//p-dropdown[@formcontrolname='businessDate']",
          bussinessName: "//p-dropdown[@formcontrolname='businessDateName']"
      }
    },
    rule: "//app-menu//a[contains(@href,'#/data-profiling/list')]",
    ruleGroup: "//app-menu//a[contains(@href,'#/data-profiling/list-group')]",
    ruleResults: "//app-menu//a[contains(@href,'#/data-profiling/list-result')]",
    compareResults: "//app-menu//a[contains(@href,'#/data-profiling/compare-results')]",
    bulkAction: "//app-menu//a[contains(@href,'#/data-profiling/list-bulkAction')]",
    parameterList: "//app-menu//a[contains(@href,'#/data-profiling/list-param')]"
  },

  dataQuality: {
    dqrule:{
      form:{
        type:"//p-dropdown[@formcontrolname='type']",
        sourceType:"//p-dropdown[@formcontrolname='sourceType']",
        sourceName:"//p-dropdown[@formcontrolname='sourceName']",
        attribute:"//p-dropdown[@formcontrolname='attribute']",
        rowKeyType:"//p-dropdown[@formcontrolname='rowKeyType']",
        rowKey:"//p-multiselect[@formcontrolname='rowKeyList']",
        bussinessDate:"//p-dropdown[@formcontrolname='businessDate']",
        name:"//p-dropdown[@formcontrolname='businessDateAttr']",
        bussinessDateAttribute:"//p-dropdown[@formcontrolname='businessDateAttr']",
        checkType: "//p-dropdown[@formcontrolname='checkType']",
        targetType: "//p-dropdown[@formcontrolname='targetType']",
        targetName: "//p-dropdown[@formcontrolname='targetName']",
        sourceAttribute: "//p-dropdown[@formcontrolname='SourceAttribute']",
        targetAttribute: "//p-dropdown[@formcontrolname='TargetAttribute']"
      }
    },
    dataQualityRuleGroup:{
      form:{
        rules: "//p-multiselect[@formcontrolname='rules']"
      }
    },
    rule: "//app-menu//a[contains(@href,'#/data-quality/list')]",
    ruleGroup: "//app-menu//a[contains(@href,'#/data-quality/list-group')]",
    parameterList: "//app-menu//a[contains(@href,'#/data-quality/list-param')]",
    ruleResults: "//app-menu//a[contains(@href,'#/data-quality/list-result')]",
    compareResults: "//app-menu//a[contains(@href,'#/data-quality/compare-results')]",
    analysis: "//app-menu//a[contains(@href,'#/data-quality/analysis')]",
    recommender: "//app-menu//a[contains(@href,'#/data-quality/recommender')]",
    bulkAction: "//app-menu//a[contains(@href,'#/data-quality/list-bulkAction')]"
  },

  dataPreparation: {
    datapod: {
      form: {
        dataSource:"//p-dropdown[@formcontrolname='datasource']",
        dataSourceName:"//p-dropdown[@formcontrolname='sourceName']",
        datapodType:"//p-dropdown[@formcontrolname='datapodType']",
        physicalName:"//input[@formcontrolname='physicalName']",
        keyType:"//p-dropdown[@formcontrolname='keyType']",
        addAttributeButton:"//p-button[@ptooltip='Add Attribute']",
        attributeType:"//p-dropdown[@formcontrolname='type']",
        keyYesRadioButton:"//p-selectbutton[@formcontrolname='key']//span[normalize-space()='Yes']",
        submitAttributeButton:"(//p-button[.='Submit'])[2]"
      }
    },
    dataset: {
      form: {
        continueButton: "//span[normalize-space()='Continue']",
        selectSource: "//p-dropdown[@formcontrolname='sourceType']",
        sourceName: "//p-dropdown[@formcontrolname='sourceName']",
        attributeSourceName: "//input[@formcontrolname='sourceName']",
        submitButton: "(//span[normalize-space()='Submit'])[2]"
      }
    },
    expression:{
      form:{
        relationType:"//p-dropdown[@formcontrolname='dependsOn']",
        relationName:"//p-dropdown[@formcontrolname='dependsOnName']",
        matchType:"//p-dropdown[@formcontrolname='matchType']",
        matchValue:"//input[@formcontrolname='matchValue']",
        matchValueDD:"//p-dropdown[@formcontrolname='matchValue']",
        notMatchType:"//p-dropdown[@formcontrolname='notMatchType']",
        notMatchValue:"//input[@formcontrolname='notMatchValue']",
        notMatchValueDD:"//p-dropdown[@formcontrolname='notMatchValue']"
      }
    },
    formula:{
      form:{
        sourceType:"//p-dropdown[@formcontrolname='sourceType']",
        sourceName:"//p-dropdown[@formcontrolname='sourceName']",
        sqlExpression:"//textarea[@formcontrolname='sqlExpression']"
      }
    },
    function:{
      form:{
        category:"//p-dropdown[@formcontrolname='category']"
      }
    },
    relation:{
      form:{
        sourceType:"//p-dropdown[@formcontrolname='sourceType']",
        sourceName:"//p-dropdown[@formcontrolname='sourceName']"
      }
    },
    map:{
      mapRule:{
        form:{
          mapType:"//p-dropdown[@formcontrolname='type']",
          sourceType:"//p-dropdown[@formcontrolname='sourceType']",
          sourceName:"//p-dropdown[@formcontrolname='sourceName']",
          targetType:"//p-dropdown[@formcontrolname='targetType']",
          targetName:"//p-dropdown[@formcontrolname='targetName']",
          sourceHashKey:"//p-dropdown[@formcontrolname='sourceHashKey']",
          targetHashKey:"//p-dropdown[@formcontrolname='targetHashKey']",
          autoPopulateButton:"//p-button[@ptooltip='Auto Populate']",
          byNameTag:"//table[@role='table']//td//span[contains(text(),'By Name')]",
          saveMode:"//p-dropdown[@formcontrolname='saveMode']"
        }
      },
      mapRuleGroup:{
        form:{
          rules:"//p-multiselect[@formcontrolname='rules']",
          allRules:"//div[@aria-label='All items unselected']"
        }
      }
    },
    operator:{
      form:{
        operatorType:"//p-dropdown[@formcontrolname='type']",
        mode:"//p-dropdown[@formcontrolname='mode']",
        apiUrl:"//input[@formcontrolname='modeInputValue']",
        className:"//input[@formcontrolname='modeInputValue']"
      }
    },
    datapodList: "//app-menu//a[contains(@href,'#/data-preparation/datapod/list')]",
    datapodBulkAction: "//app-menu//a[contains(@href,'#/data-preparation/datapod/batch-create/list')]",
    datasetList: "//app-menu//a[contains(@href,'#/data-preparation/dataset/list')]",
    expressionList: "//app-menu//a[contains(@href,'#/data-preparation/expression/list')]",
    formulaList: "//app-menu//a[contains(@href,'#/data-preparation/formula/list')]",
    functionList: "//app-menu//a[contains(@href,'#/data-preparation/function/list')]",
    parameterList: "//app-menu//a[contains(@href,'#/data-preparation/list-param')]",
    relationList: "//app-menu//a[contains(@href,'#/data-preparation/relation/list')]",
    mapList: "//app-menu//a//span[contains(text(),'Map')]",
    mapRule: "//app-menu//a[contains(@href,'#/data-preparation/map/list')]",
    mapRuleGroup: "//app-menu//a[contains(@href,'#/data-preparation/mapgroup/list')]",
    mapResults: "//app-menu//a[contains(@href,'#/data-preparation/map-result/list')]",
    mapBulkAction: "//app-menu//a[contains(@href,'#/data-preparation/list-batchCreate')]",
    operatorMenu: "//app-menu//a//span[contains(text(),'Operator')]",
    operatorList: "//app-menu//a[contains(@href,'#/data-preparation/operator/list')]",
    operatorResults: "//app-menu//a[contains(@href,'#/data-preparation/operator-result/list')]"
  },

  dataReconciliation: {
    drRule:{
      form:{
        ruleType: "//p-dropdown[@formcontrolname='type']",
        source: "//p-dropdown[@formcontrolname='source']",
        sourceName: "//p-dropdown[@formcontrolname='name']",
        sourceAttribute: "//p-dropdown[@formcontrolname='attributes']",
        sourceFunction: "//p-dropdown[@formcontrolname='srcfunction']",
        target: "//p-dropdown[@formcontrolname='target']",
        targetName: "//p-dropdown[@formcontrolname='targetname']",
        targetAttribute: "//p-dropdown[@formcontrolname='targetattr']",
        targetFunction: "//p-dropdown[@formcontrolname='targetfunc']",
        attributeMapping: "//h4[normalize-space()='Attribute Mapping']",
        autoMapButton: "//p-button[@ptooltip='Auto Map']",
        byOrder: "//span[normalize-space()='By Order']",
        joinKeyAttribute: "//div[@class='field grid align-items-center ng-star-inserted']//button[@type='button']",
        addButton: "//button[@ptooltip='Add']",
        mapSourceAttribute: "//p-dropdown[@formcontrolname='sourceAttr']",
        mapTargetAttribute: "//p-dropdown[@formcontrolname='targetAttr']",
        submitButton: "//p-button[@class='p-element']//span[@class='p-button-label ng-star-inserted'][normalize-space()='Submit']",
        compareFunction: "//p-dropdown[@formcontrolname='comparefunction']",
        thresholdType: "//p-dropdown[@formcontrolname='threshholdtype']"
      }
    },
    rule: "//app-menu//a[contains(@href,'#/data-reconciliation/list')]",
    ruleGroup: "//app-menu//a[contains(@href,'#/data-reconciliation/list-group')]",
    ruleResults: "//app-menu//a[contains(@href,'#/data-reconciliation/list-result')]",
    parameterList: "//app-menu//a[contains(@href,'#/data-reconciliation/list-param')]",
    compareResults: "//app-menu//a[contains(@href,'#/data-reconciliation/compare-results')]"
  },

  dataMigration: {
    dmRule:{
      form:{
        sourceDataSource: "//p-dropdown[@formcontrolname='sourceDatasource']",
        targetDataSource: "//p-dropdown[@formcontrolname='targetDatasource']",
        saveMode: "//p-dropdown[@formcontrolname='saveMode']"
      }
    },
    rule: "//app-menu//a[contains(@href,'#/data-migration/list')]",
    ruleResults: "//app-menu//a[contains(@href,'#/data-migration/list-result')]",
    parameterList: "//app-menu//a[contains(@href,'#/data-migration/list-param')]"
  },

  dataArchival: {
    daRule:{
      form:{
        sourceDatapod: "//p-dropdown[@formcontrolname='sourceDatapod']",
        refreshType: "//p-dropdown[@formcontrolname='refreshType']",
        incrementalKey: "//p-dropdown[@formcontrolname='incrementalKey']",
        targetDatapod: "//p-dropdown[@formcontrolname='targetDatapod']",
        auditKey: "//p-dropdown[@formcontrolname='auditKey']",
        auditValue: "//p-dropdown[@formcontrolname='auditValue']",
        audName: "//p-dropdown[@formcontrolname='auditValueField']",
        audValue: "//input[@formcontrolname='auditValueField']",
        saveMode: "//p-dropdown[@formcontrolname='saveMode']"
      }
    },
    rule: "//app-menu//a[contains(@href,'#/data-archival/list')]",
    ruleGroup: "//app-menu//a[contains(@href,'#/data-archival/list-group')]",
    ruleResults: "//app-menu//a[contains(@href,'#/data-archival/list-result')]",
    parameterList: "//app-menu//a[contains(@href,'#/data-archival/list-param')]"
  },

  dataPipeline: {
    list: "//app-menu//a[@href='#/data-pipeline/list']",
    parameterList: "//app-menu//a[@href='#/data-pipeline/list-param']",
    result: "//app-menu//a[@href='#/data-pipeline/result']",
    pipelineSearch: "//input[@placeholder='Search Keyword']"

  },

  dataVault: {
    daVault:{
      form:{
        type: "//p-dropdown[@formcontrolname='type']",
        datasource: "//p-dropdown[@formcontrolname='datasourceType']",
        sourceName: "//p-dropdown[@formcontrolname='datasource']",
        hubEntity: "//input[@formcontrolname='hubEntity']",
        linkEntity: "//input[@formcontrolname='linkEntity']",
        satelliteEntity: "//input[@formcontrolname='satelliteEntity']",
        hashKey: "//input[@formcontrolname='hashKey']",
        loadDate: "//input[@formcontrolname='loadDate']",
        recordSource: "//input[@formcontrolname='recordSource']"
      }
    },
    daHub:{
      form:{
        vault: "//p-dropdown[@formcontrolname='vault']",
        source: "//p-dropdown[@formcontrolname='sourceType']",
        sourceName: "//p-dropdown[@formcontrolname='source']",
        keyAttribute: "//p-multiselect[@formcontrolname='keyAttributes']"
      }
    },
    daLink:{
      form:{
        vault: "//p-dropdown[@formcontrolname='vault']",
        source: "//p-dropdown[@formcontrolname='sourceType']",
        sourceName: "//p-dropdown[@formcontrolname='source']"
      }
    },
    daSatellite:{
      form:{
        vault: "//p-dropdown[@formcontrolname='vault']",
        type: "//p-dropdown[@formcontrolname='type']",
        sourceName: "//p-dropdown[@formcontrolname='source']",
        keyAttribute: "//p-multiselect[@formcontrolname='attributes']"
      }
    },
    vault: "//app-menu//a[contains(@href,'#/data-vault/vault/list')]",
    hub: "//app-menu//a[contains(@href,'#/data-vault/hub/list')]",
    link: "//app-menu//a[contains(@href,'#/data-vault/link/list')]",
    satellite: "//app-menu//a[contains(@href,'#/data-vault/satellite/list')]"
  },

  batchScheduler: {
    batchRule:{
      form:{
        pipelineInfo: "//p-multiselect[@formcontrolname='pipelineInfo']",
        iteration: "//input[@formcontrolname='numIteration']"
      }
    },
    batchSchedule:{
      form:{
        type: "//p-dropdown[@formcontrolname='type']",
        scheduleName: "//p-dropdown[@formcontrolname='scheduleName']",
        startDateButton: "//button[@class='p-element p-ripple p-datepicker-trigger p-button-icon-only ng-tns-c1685646730-91 p-button p-component ng-star-inserted']",
        startDate: "//input[@class='p-element ng-tns-c1685646730-91 p-inputtext p-component ng-star-inserted']",
        endDate: "//p-calendar[@formcontrolname='endTime']",
        frequency: "//p-dropdown[@formcontrolname='frequency']",
        executeOn: "//input[@formcontrolname='executedOn']",
        suspendAfter: "//input[@formcontrolname='suspendAfter']",
        maxRetries: "//input[@formcontrolname='maxRetries']",
        startCondition: "//p-dropdown[@formcontrolname='startCondition']"
      }
    },
    batch: "//app-menu//a[contains(@href,'#/batchscheduler/ListBatch')]",
    scheduler: "//app-menu//a[contains(@href,'#/batchscheduler/Scheduler/list')]",
    results: "//app-menu//a[contains(@href,'#/batchscheduler/ListBatchResult')]"
  },

  admin: {
    fileManager: "//app-menu//a[contains(@href,'#/admin/file-manager')]",
    dataStore: "//app-menu//a[contains(@href,'#/admin/datastore/list')]"
  },
}
