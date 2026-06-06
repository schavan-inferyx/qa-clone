export default {
  common: {
    datasourceSearchInput:"//input[@placeholder='Search...']",
    loaderWithText: "//p[normalize-space()='Loading']",
    applicationSelect: "(//p-dropdown[@formcontrolname='application']//span)[1]",
    selectedRole: "(//span[@role='combobox'])[2]",
    actionButton: "(//button[.='Action'])[1]",
    executeActionButton: "//span[.='Execute']",
    // viewActionButton: "(//td//span[.='View'])[1]",
    // editActionButton: "(//td//span[.='Edit'])[1]",
    viewAction: "(//td//span[.='View'])[1]",
    editAction: "(//td//span[.='Edit'])[1]",
    deleteAction: "(//td//span[.='Delete'])[1]",
    restoreAction: "(//td//span[.='Restore'])[1]",
    lockAction: "(//td//span[.='Lock'])[1]",
    unlockAction: "(//td//span[.='Unlock'])[1]",
    publishAction: "(//td//span[.='Publish'])[1]",
    unpublishAction: "(//td//span[.='Unpublish'])[1]",
    exportAction: "(//td//span[.='Export'])[1]",
    cloneAction: "(//td//span[.='Clone'])[last()]",
    restartAction: "(//td//span[.='Restart'])[1]",
    killAction: "(//td//span[.='Kill'])[1]",
    logAction: "(//td//span[.='Log'])[1]",
    executeAction: "(//td//span[.='Execute'])[1]",
    uploadAction: "(//td//span[.='Upload'])[1]",
    downloadAction: "(//td//span[.='Download'])[1]",
    startAction: "(//td//span[.='Start'])[1]",
    launchAction: "(//td//span[.='Launch'])[1]",
    registerAction: "(//td//span[.='Register'])[1]",
    dataSourceRegisterAction: "//button[normalize-space()='Register']",

    okButton: "//button[contains(text(),'Ok')]",
    toast: {
      container: "div[role='alert'].p-toast-message",
      detail: ".p-toast-detail",
      close: ".p-toast-icon-close",
    },
    viewPage: {
      uuid: "input[formcontrolname='uuid']",
    },
    breadcrumb: {
      add: "//span[normalize-space()='Add']",
      view: "//span[normalize-space()='View']",
    }
  },
  login: {
    usernameInput: "//input[@placeholder='User Name']",
    passwordInput: "//input[@placeholder='Password']",
    loginButton: "//button[.='Login']",
  },
  applicationSelection: {
    searchInput: "//input[@placeholder='Search Application']",
    applicationCard: "//div[contains(@class,'card-inner') and @title]",

  },

  crudPage: {
    addIcon: "//button[@icon='pi pi-plus']",
   // addIcon:"(//button[@class='p-element custom-add-btn p-button-rounded p-button-text p-button-plain p-button p-component p-button-icon-only'])[1]",
    editButton: "//span[.='Edit']",
    deleteButton: "//span[.='Delete']",
    confirmDeleteButton: "//button[.='Yes']",
    saveButton: "//button[.='Save']",
    cancelButton: "//button[.='Cancel']",
    searchInput: "//input[@placeholder='Search']",
    // submitForm:"//button[.//span[text()='Submit']]",
    submitForm: "(//button[normalize-space()='Submit'])[last()]",
    continueButton:"(//button[.='Continue'])[last()]",
  },

  listTable: {
    searchInput: "(//input[@placeholder='Search Keyword'])[1]",
    tableHeaders: "//thead//th",
    tableRows: "//tbody/tr",
    firstColumnHeader: "(//thead//th)[1]",
    firstColumnCell: "(//tbody/tr[1]/td)[1]",
    columnToggleBtn: "//p-multiselect[@placeholder='Choose Columns']",
    columnPanel: "//div[contains(@class,'p-column-toggler-content')]",
    columnCheckboxes: "//div[contains(@class,'p-column-toggler-content')]//p-checkbox",
    allCheckbox: "//li[contains(@class,'p-multiselect-item')]",
    checkedCheckbox: "//li[contains(@class,'p-multiselect-item') and @aria-checked='true']",
    columnList: "//div[contains(@class,'p-multiselect-items-wrapper')]",
    actionButton: "//button[@label='Action']",
    actionMenu: {
      container: "//tbody[contains(@class,'p-datatable-tbody')]",
      enabledRow: ".//tr[contains(@class,'hover-effect') and not(contains(@class,'tl-disabled'))]",
      actionByLabel: "//span[@class='tl-icon-label' and normalize-space()='{ACTION}']",
    },
    popup: {
      ok: "//button[normalize-space()='Ok']"
    },
    readonly: {
        uuid: "input[formcontrolname='uuid']"
      }



  }

}
