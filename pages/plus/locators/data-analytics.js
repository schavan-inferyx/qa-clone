export default {
  menus: {
    home: "//a[contains(@href,'#/home')]",
    dataVisualization:"//a[contains(@href,'#/data-visualization')]",
    businessRules:"//a[contains(@href,'#/business-rule')]",
    alertGeneration:"//a[contains(@href,'#/alert-generation')]",
    caseManagement:"//a[contains(@href,'#/case-management')]",
    workflowManager:"//a[contains(@href,'#/workflow-manager')]",
    entityResolution:"//a[contains(@href,'#/entity-resolution')]",
    dataScience:"//a[contains(@href,'#/data-science')]",
    knowledgeGraph:"//a[contains(@href,'#/knowledge-graph')]",
    dataPipeline:"//a[contains(@href,'#/data-pipeline')]",
    batchScheduler:"//a[contains(@href,'#/batchscheduler')]"
  },

  /* ---------------- Data Visualization ---------------- */

  dataVisualization: {
    dashboard: "(//app-menu//a[@href='#/data-visualization/dashboard-list'])[2]",
    vizpod: "//app-menu//a[@href='#/data-visualization/vizpod-list']",
    report: "//app-menu//a[@href='#/data-visualization/report-list']",
    semanticModel: "//app-menu//a[@href='#/semantic-model/list']",
    parameterList: "//app-menu//a[@href='#/data-visualization/list-param']",
    results: "//app-menu//a[@href='#/data-visualization/list-result']"
  },

  /* ---------------- Business Rules ---------------- */

  businessRules: {
    rule: "//app-menu//a[@href='#/business-rule/list']",
    parameterList: "//app-menu//a[@href='#/business-rule/list-param']",
    ruleGroup: "//app-menu//a[@href='#/business-rule/list-group']",
    ruleResults: "//app-menu//a[@href='#/business-rule/list-result']",
    compareResults: "//app-menu//a[@href='#/business-rule/compare-results']",
    criteria: "//app-menu//a[@href='#/business-rule/list-criteria']"
  },

  /* ---------------- Alert Generation ---------------- */

  alertGeneration: {
    rule: "//app-menu//a[@href='#/alert-generation/list']",
    ruleGroup: "//app-menu//a[@href='#/alert-generation/list-group']",
    ruleResults: "//app-menu//a[@href='#/alert-generation/list-result']"
  },

  /* ---------------- Case Managment ---------------- */

  caseManagement: {
    rule: "//app-menu//a[@href='#/case-management/list']",
    ruleGroup: "//app-menu//a[@href='#/case-management/list-group']",
    ruleResults: "//app-menu//a[@href='#/case-management/list-result']"
  },

  /* ---------------- Workflow Manager ---------------- */

  workflowManager: {
    rule: "//app-menu//a[@href='#/workflow-manager/list']",
    ruleResults: "//app-menu//a[@href='#/workflow-manager/list-result']"
  },

  /* ---------------- Entity Resolution ---------------- */

  entityResolution: {
    entity: "//app-menu//a[@href='#/entity-resolution/list']",
    rule: "//app-menu//a[@href='#/entity-resolution/rule-list']",
    exclusionList: "//app-menu//a[@href='#/entity-resolution/er-list']",
    ruleResults: "//app-menu//a[@href='#/entity-resolution/list-result']",
    parameterList: "//app-menu//a[@href='#/entity-resolution/list-param']"
  },

  /* ---------------- Data Science ---------------- */

  dataScience: {
    algorithm: "//app-menu//a[@href='#/data-science/algorithm-list']",
    distribution: "//app-menu//a[@href='#/data-science/distribution-list']",
    operator: "//app-menu//a[@href='#/data-science/operator-list']",
    parameterList: "//app-menu//a[@href='#/data-science/list-param']",
    parameterSet: "//app-menu//a[@href='#/data-science/paramset-list']",
    exploratoryAnalysis: "//app-menu//a[@href='#/data-science/exploratory-analysis']",
    notebook: "//app-menu//a[@href='#/data-science/dsNotebook/list']",
    featureList: "//app-menu//a[@href='#/data-science/feature-list']",
    featureGroup: "//app-menu//a[@href='#/data-science/featurepod-list']",
    model: "//app-menu//a[@href='#/data-science/model-list']",
    training: "//app-menu//a[@href='#/data-science/train-list']",
    evaluation: "//app-menu//a[@href='#/data-science/eval-list']",
    prediction: "//app-menu//a[@href='#/data-science/predict-list']",
    modelDeploy: "//app-menu//a[@href='#/data-science/model-model-deploy-list']",
    simulation: "//app-menu//a[@href='#/data-science/simulate-list']",
    results: "//app-menu//a[@href='#/data-science/trainexec-list']",
    generativeAI: "//app-menu//a[@href='#/data-science/generative-ai']",
    whatIfAnalysis: "//app-menu//a[@href='#/data-science/what-if-analysis']"
  },

  /* ---------------- Knowledge Graph ---------------- */

  knowledgeGraph: {
    list: "//app-menu//a[@href='#/knowledge-graph/list']",
    results: "//app-menu//a[@href='#/knowledge-graph/list-result']",
    parameterList: "//app-menu//a[@href='#/knowledge-graph/list-param']",
    analysis: "//app-menu//a[@href='#/knowledge-graph/analysis']",
    simulate: "//app-menu//a[@href='#/knowledge-graph/graph-list']"
  },

  /* ---------------- Data Pipeline ---------------- */

  dataPipeline: {
    list: "//app-menu//a[@href='#/data-pipeline/list']",
    parameterList: "//app-menu//a[@href='#/data-pipeline/list-param']",
    result: "//app-menu//a[@href='#/data-pipeline/result']"
  },

  /* ---------------- Batch Schedular (UI typo preserved) ---------------- */

  batchScheduler: {
    batch: "//app-menu//a[@href='#/batchscheduler/ListBatch']",
    scheduler: "//app-menu//a[@href='#/batchscheduler/Scheduler/list']",
    results: "//app-menu//a[@href='#/batchscheduler/ListBatchResult']"
  }
}
