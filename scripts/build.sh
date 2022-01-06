rm -rf dist
yarn parcel build './src/**/*.html'
cp -a static/. dist
