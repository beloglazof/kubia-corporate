#!/bin/bash

cd /home/slava/account-corporate
git pull origin corporate
npx yarn && npx yarn build
npm run copy-build:corporate