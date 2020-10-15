rm -rf dist
yarn parcel build index.html
cp -a static/. dist