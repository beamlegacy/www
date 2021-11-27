rm -rf dist
yarn parcel build index.html bright_paper.html
cp -a static/. dist
