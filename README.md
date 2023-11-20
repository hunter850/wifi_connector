### Webpack 5 Requires At Least Node.js 10.13.0 (LTS)

nodejs: [https://nodejs.org/en/](https://nodejs.org/en/ "https://nodejs.org/en/")

### Dependencies

1.open terminal and input
npm init -y


2.open package.json
delete
scripts: {
    "test": "echo \"Error: no test specified\" && exit 1"
}

add 
"scripts": {
    "dev": "set \"NODE_ENV=development\" && webpack serve --mode=development",
    "start": "set \"NODE_ENV=development\" && webpack serve --mode=development",
    "build": "set \"NODE_ENV=production\" && webpack --mode=production"
},


3.open terminal and input
yarn add -D @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript @pmmmwh/react-refresh-webpack-plugin @types/node @types/react @types/react-dom @types/webpack @types/webpack-bundle-analyzer @types/webpack-dev-server @typescript-eslint/eslint-plugin @typescript-eslint/parser babel-loader copy-webpack-plugin css-loader css-minimizer-webpack-plugin dotenv eslint eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks html-webpack-plugin mini-css-extract-plugin postcss postcss-loader postcss-preset-env prettier react-refresh sass sass-loader style-loader terser-webpack-plugin thread-loader ts-node typescript webpack webpack-bundle-analyzer webpack-cli webpack-dev-server cross-env wait-on concurrently @electron-forge/cli @electron-forge/maker-deb @electron-forge/maker-rpm @electron-forge/maker-squirrel @electron-forge/maker-zip electron

yarn add core-js react react-dom regenerator-runtime electron-squirrel-startup

4.if yarn can't add dependencies because of certificate try input command below in terminal
yarn config set "strict-ssl" false