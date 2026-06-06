#!/bin/bash

# 🔹 Setup Node environment

export NVM_DIR="/home/inferyx/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20

# Export npm path (optional, ensures correct npm is used)
export NPM_PATH="$(which npm)"
export PATH="$(dirname "$NPM_PATH"):$PATH"

# 🔹 Install npm dependencies and playwright browsers
npm install
npx playwright install

# 🔹 Clear existing allure results & report
for dir in allure-results allure-report; do
  if [ -d "$dir" ]; then
    echo "Cleaning previous $dir ..."
    rm -rf "$dir"
  fi
done

# 🔹 Build Playwright command based on env variables
CMD="npx playwright test"

#if [ ! -z "$TESTCASE_ID" ]; then
 # CMD="$CMD --grep $TESTCASE_ID"
#elif [ ! -z "$MODULE_NAME" ]; then
 # CMD="$CMD tests/$PROJECT_NAME/$MODULE_NAME"
#elif [ ! -z "$PROJECT_NAME" ]; then
  #CMD="$CMD tests/$PROJECT_NAME/"
#fi
if [ ! -z "$TESTCASE_ID" ]; then
  PROJECT_NAME="Individual test"
  CMD="$CMD --grep $TESTCASE_ID"
elif [ ! -z "$MODULE_NAME" ]; then
  CMD="$CMD tests/$PROJECT_NAME/$MODULE_NAME"
elif [ ! -z "$PROJECT_NAME" ]; then
  CMD="$CMD tests/$PROJECT_NAME/"
else
  PROJECT_NAME="ALL"
  CMD="$CMD tests/"
fi

echo "Running command: $CMD"
$CMD