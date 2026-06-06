export default {

  login: {
    usernameInput: "//input[@placeholder='Username']",
    passwordInput: "//input[@placeholder='Password']",
    loginButton: "//button[contains(text(),'Login')]",
    appSwitcher: "//i[@class='fa fa-exchange']",
    appSelect: "//select[@ng-model='selectedApp']",
    roleSelect: "//select[@ng-model='selectedRole']",
    submitButton: "(//form[@role='form'])[1]//button[@type='submit']",
  },
  dataPipeline: {
    menuLink: "//span[normalize-space()='Data Pipeline']",
    listLink: "//a[@href='#!/datapipeline/ListPipeline']",
    resultsLink: "//a[@href='#!/datapipeline/ListPipelineResult']",
    searchInput: "(//input[@type='search'])[1]",
    actionButton: "(//button[contains(text(),'Action')])[1]",
    executeLink: "(//ul//a[.=' Execute'])[last()]",
    viewLink: "(//a[contains(text(),'View')])[1]",
    viewJSLink: "(//a[contains(@ng-disabled, \"row.entity.execCreated=='Y'\")])[1]",
    okButton: "//button[contains(text(),'Ok')]",
    spinner: "//div[@class='spinner']",
    successMessage: "text=Request Submitted Successfully",
    succeededStatus: "text=Succeeded",
    autorefreshCheckbox: "(//input[@type='checkbox'])[1]",
  },


  dataVisualization: {
    menuLink: "(//span[normalize-space()='Data Visualization'])[1]",
    listLink: "//a[@href='#!/datavisualization/dashboardList']",
    resultsLink: "//a[@href='#!/datavisualization/Report/ResultList']",
    dashboard: "(//a[@href='#!/datavisualization/dashboardList'])[2]",
    dashboardSearch: "//input[@ng-model='searchdashboard']",
    dashboardCard: "(//div[@class='dashboard-card'])[1]",
    dashboardBedcrumb: "//ol[contains(@class,'breadcrumb')]//li[contains(@class,'breadcrumb-item')]",
    dashboardTitle: "//div[@class='caption dashbord-name-wrapping']//span",
    breadcrumbIcons: "//div[contains(@class,'card-header')][.//div[contains(@class,'caption dashbord-name-wrapping')]//span[normalize-space()]]//div[contains(@class,'card-actions')]//a[@uib-tooltip]",
    dashboardCardTitles: "//div[@class='form-group row height-inherit']//div[contains(@class,'card-header')]//span",
  },

  dataPreparation: {
    usernameInput: "//input[@placeholder='Username']",
    dataPreparationLink: "(//span[normalize-space()='Data Preparation'])[1]",
    mapLink: "(//span[normalize-space()='Map'])[1]",
    maprule: "//a[@href='#!/datapreparation/list?type=map']",
    mapruleResult: "//a[@href='#!/datapreparation/MapResultList']",
  },
  dataQuality: {
    dataQualityLink: "(//span[normalize-space()='Data Quality'])[1]",
    rule: "//a[@href='#!/dataquality/ListDq']",
    ruleResult: "//a[@href='#!/dataquality/DqResultList']",
    viewJSLink: "(//a[contains(.,'View')])[1]",

  },

  dataProfiling: {
    dataProfilingLink: "(//span[normalize-space()='Data Profiling'])[1]",
    rule: "//a[@href='#!/dataprofiling/ListProfile']",
    ruleResult: "//a[@href='#!/dataprofilingProfileResultList']",
  },

  dataIngestion: {
    dataIngestionLink: "(//span[normalize-space()='Data Ingestion'])[1]",
    rule: "//a[@href='#!/dataingestion/DataIngestion/IngestList']",
    ruleResult: "//a[@href='#!/dataingestion/DataIngestion/IngestResultList']",
  },

  dataRecon: {
    dataReconLink: "(//span[normalize-space()='Data Reconciliation'])[1]",
    rule: "//a[@href='#!/datareconciliation/ListRecon']",
    ruleResult: "//a[@href='#!/datareconciliation/ListReconResult']",
  },


}
