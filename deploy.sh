#!/bin/bash

git fetch

# Current Branch Name
BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo BRANCH: $BRANCH

# Current Commit Hash
CURRENT_HASH=$(git rev-parse HEAD)
echo CURRENT : $CURRENT_HASH

# Remote Commit Hash
REMOTE_HASH=$(git rev-parse origin/$BRANCH)
echo REMOTE : $REMOTE_HASH

if [[ "$CURRENT_HASH" != "$REMOTE_HASH" ]];  then
	echo "Sync with Git Repository"
	git pull origin $BRANCH --rebase

	echo "Start Client Deploy"
	cd ./client
    npm install
    npm run build
	sudo mv ./dist/* /var/www/html
	echo "Client Deployed"

	echo "Start Server Deploy"
	cd ../server
    npm install
	npm run build
	npm run prod-start
	echo "Server Deployed"
else
	echo $(date)
	echo "변경 사항이 없습니다".
fi

