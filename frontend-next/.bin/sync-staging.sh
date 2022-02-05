VERSION=$(node ./.bin/./get-version.js)
SOURCE=master
TARGET=mobile/staging/$VERSION

#git remote add remote $GITLAB_TOKEN
git checkout -b $TARGET && git merge $SOURCE | echo "Branch already exists."
git push remote HEAD:$TARGET --no-verify --force -o ci.skip
