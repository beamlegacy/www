rm -rf dist
yarn parcel build index.html --public-url https://beamapp.co
cp -a static/. dist
