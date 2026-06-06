import fs from 'fs';
import path from 'path';


export async function updateClonedIngestionRule(newParamListName) {
  const valuesPath = path.resolve('./tests/data-engineering/data-ingestion/values.js');
  let content = fs.readFileSync(valuesPath, 'utf-8');

  // Replace the line where RULE_GROUP_CLONED is defined
  content = content.replace(
    /const INGESTION_RULE_CLONED = '.*?';/,
    `const INGESTION_RULE_CLONED = '${newParamListName}';`
  );

  fs.writeFileSync(valuesPath, content, 'utf-8');
  console.log(`✅ Updated RULE_GROUP_CLONED = "${newParamListName}" in values.js`);
}


/**
 * Updates the INGESTION_PARAMETER_LIST_CLONED value in values.js at runtime.
 * @param {string} newParamListName - The cloned parameter list name (e.g. paramlist_pr_1759738879374)
 */
export function updateClonedParameterList(newParamListName) {
  const valuesPath = path.resolve('./tests/data-engineering/data-ingestion/values.js');
  let content = fs.readFileSync(valuesPath, 'utf-8');

  // Replace the line where INGESTION_PARAMETER_LIST_CLONED is defined
  content = content.replace(
    /const INGESTION_PARAMETER_LIST_CLONED = '.*?';/,
    `const INGESTION_PARAMETER_LIST_CLONED = '${newParamListName}';`
  );

  fs.writeFileSync(valuesPath, content, 'utf-8');
  console.log(`✅ Updated INGESTION_PARAMETER_LIST_CLONED = "${newParamListName}" in values.js`);
}


export function updateClonedRuleGroupResult(newParamListName) {
  const valuesPath = path.resolve('./tests/data-engineering/data-ingestion/values.js');
  let content = fs.readFileSync(valuesPath, 'utf-8');

  // Replace the line where RULE_GROUP_CLONED is defined
  content = content.replace(
    /const RULE_GROUP_CLONED = '.*?';/,
    `const RULE_GROUP_CLONED = '${newParamListName}';`
  );

  fs.writeFileSync(valuesPath, content, 'utf-8');
  console.log(`✅ Updated RULE_GROUP_CLONED = "${newParamListName}" in values.js`);
}

export function updateClonedDatapodName(newDatapodName) {
  const valuesPath = path.resolve('./tests/data-engineering/data-preparation/values.js');
  let content = fs.readFileSync(valuesPath, 'utf-8');

  // Replace the line where DATAPOD_CLONE is defined
  content = content.replace(
    /const DATAPOD_CLONE = '.*?';/,
    `const DATAPOD_CLONE = '${newDatapodName}';`
  );

  fs.writeFileSync(valuesPath, content, 'utf-8');
  console.log(`✅ Updated DATAPOD_CLONE = "${newDatapodName}" in values.js`);
}

