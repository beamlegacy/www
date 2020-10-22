rm -rf dist
yarn parcel build index.html bright_paper.html --public-url https://beamapp.co
cp -a static/. dist
