# webgl2 auto-completion
npm install --save-dev @types/webgl2

# browserify
npm install -g browserify
npm install -g watchify
npm install --save-dev tinyify

browserify index.js > ../build/bundle.js
watchify index.js -o ../build/bundle.js -v
browserify -p tinyify index.js > ../build/bundle.js

# jsdoc
npm install -g jsdoc
jsdoc src/wgl/Matrix4.js -d docs

# run js directly
node file.js

# lodash

# ui
dat.gui