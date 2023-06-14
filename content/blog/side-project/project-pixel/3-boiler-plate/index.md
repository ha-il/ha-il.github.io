---
title: "[당신의 작업실] 3. 개발 환경 구축하기"
date: "2023-06-13T12:20:03.000Z"
description: "바벨(Babel), 노드몬(Nodemon), 웹팩(Webpack), SCSS 환경을 구축했습니다."
category: "Project"
featuredImage: "../../../../../src/images/sideProject-256x256.png"
mobileImage: "../../../../../src/images/sideProject-512x256x2.png"
---
- **당신의 작업실 프로젝트 링크**: https://pixel-workroom.herokuapp.com/
- **프로젝트 깃허브 저장소 링크** : https://github.com/ha-il/project-pixel

## 1. 바벨 환경 구축하기

이번 프로젝트에서 바벨은 **NodeJS가 최신 자바스크립트 코드를 이해할 수 있도록 컴파일하기 위해서** 필요했습니다. 바벨 사이트의 [Setup](https://babeljs.io/setup#installation) 을 보면서 바벨 환경을 구축했습니다. 순서는 아래와 같습니다.

1. babel.core를 설치합니다.
```
npm install --save-dev @babel/core
```
2. 루트 디렉터리에 `babel.config.json`파일을 생성합니다.

3. bael/preset-env를 설치합니다.
```
npm install @babel/preset-env --save-dev
```

4. `babel.config.json`에 아래와 같이 작성합니다.
```
{
  "presets": ["@babel/preset-env"]
}
```

5. `package.json`파일의 `scripts`에 아래와 같이 작성합니다.
```
"scripts": {
    "dev:server": "babel-node src/server.js"
},
```

이렇게 스크립트를 작성하면 `npm run dev:server`를 실행할 때마다 babel-node가 경로로 설정해준 파일을 실행합니다.

하지만, 경로의 파일에서 코드를 수정했을 때, 해당 수정 사항이 반영된 파일을 실행시키려면 **스크립트를 다시 실행해야 하는 불편함**이 있었습니다.

이런 불편함을 해소하기 위해 노드몬을 사용하기로 했습니다.

## 2. 노드몬 환경 구축하기

노드몬은 **설정한 디렉터리의 파일 변경이 감지되면 Node 애플리케이션을 자동으로 다시 시작해주는 도구**입니다. 노드몬을 사용하여 바벨을 실행시키는 방법 역시 바벨 사이트의 [Setup](https://babeljs.io/setup#installation)에 나와 있습니다. 노드몬 환경 구축 과정은 아래와 같습니다. 


1. [nodenon](https://github.com/remy/nodemon)을 설치합니다.
```
npm i nodemon --save-dev
```

2. `package.json`파일의 `scripts`를 아래와 같이 수정합니다.
```
"scripts": {
    "dev:server": "nodemon --exec babel-node src/server.js"
},
```
위와 같이 설정해주면, babel-node를 실행시킬 경로에 있는 파일을 수정했을 경우 해당 파일을 자동으로 다시 시작해줍니다.

## 3. 웹팩 환경 구축하기

이번 프로젝트는 main.js에 모든 파일을 작성하는 것이 아니라, 자바스크립트 코드를 모듈화하여 여러 개의 자바스크립트 파일을 작성하여 진행할 계획이었습니다. 그렇기 때문에 **여러 개의 파일을 하나의 번들로 묶어주는 모듈 번들러**인 웹팩이 필요했습니다.

웹팩은 여러개의 파일을 하나의 번들로 묶어주기 때문에, **파일 수를 줄여서 네트워크 비용을 절감**할 수 있고 **초기 로딩 속도를 향상**시킬 수 있다는 장점이 있습니다. 웹팩을 사용하는 이유에 대해서 궁금한 점은 웹팩 사이트의 [Why webpack](https://webpack.kr/concepts/why-webpack/)을 읽어보면 더 자세히 알 수 있습니다.


웹팩 환경 설정은 웹팩 홈페이지의 [Getting Started](https://webpack.js.org/guides/getting-started/#npm-scripts)를 보면서 진행했습니다. 순서는 아래와 같습니다. 

1. webpack과 webpack-cli를 설치합니다.
(웹팩 v4 이상을 사용 중이고 커맨드 라인에서 웹팩을 호출하려는 경우 CLI도 설치해야 합니다.)
```
npm install --save-dev webpack webpack-cli
```

2. 루트 디렉터리에 `webpack.config.js` 파일을 생성하고 아래와 같이 작성합니다.
```javascript
const path = require("path");

module.exports = {
  // entry는 웹팩을 적용할 파일을 의미함.
  entry: {
    main: "./src/client/js/main.js",
  },
  // output은 웹팩 적용 후에 생성되는 파일을 의미함.
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
};
```
3. `package.json`파일의 `scripts`에 아래와 같이 작성합니다.
```
"scripts": {
    "dev:server": "babel-node src/server.js",
    "dev:assets": "webpack"
},
```
여기까지 진행하면 웹팩 환경 설정을 통해 프론트엔드의 자바스크립트 파일의 모듈을 번들링했지만, 해당 파일들의 코드 중에는 **브라우저가 이해할 수 없는 최신 코드**가 있을 수 있습니다.

따라서, `webpack.config.js` 파일에 **바벨**을 사용할 수 있도록 설정하여 **코드의 호환성**을 높여야 합니다. 웹팩의 바벨 설정은 [babel-loader](https://github.com/babel/babel-loader) 를 보고 작성했습니다. 순서는 아래와 같습니다.

1. `babel-loader`를 설치합니다.
```
npm install -D babel-loader
```
2. `webpack.config.js`에 아래와 같이 `mode`와 `module`을 작성합니다.
```javascript
const path = require("path");

module.exports = {
  entry: {
    main: "./src/client/js/main.js",
  },
  // 모드를 development로 설정하면 개발 중에는 babel을 적용하지 않음
  // 배포할 때는 production 모드로 설정하면 됨
  mode: 'development'
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        // 모든 js파일에 대해서 babel/preset-env를 적용
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};

```

## 4. SCSS 환경 구축하기

SCSS를 사용하면 CSS 코드를 중첩해서 사용할 수 있기 때문에 **CSS코드를 구조화**해서 볼 수 있어서 조금 더 직관적이라는 장점이 있습니다. 그리고 **변수**를 사용할 수 있어서 코드를 작성하고 수정할 때 더 편리합니다. SCSS를 사용하기 위해서는 웹팩을 통해 설정을 해줘야 하는데 그때 필요한 로더가 3가지 있습니다. 

- [sass-loader](https://github.com/webpack-contrib/sass-loader): SCSS파일을 CSS로 컴파일하는 로더
- [css-loader](https://webpack.js.org/loaders/css-loader/): @import 및 url()을 import/require()와 같이 해석해주는 로더
- [style-loader](https://webpack.js.org/loaders/style-loader/): DOM에 CSS를 삽입하는 로더

이 로더들을 설치하는 과정을 포함해서 SCSS를 설정하는 순서는 아래와 같습니다.

1. `sass`와 3가지 로더를 설치합니다.
```
npm install sass sass-loader css-loader style-loader --save-dev
```
2. `webpack.config.js` 파일에 아래와 같이 작성합니다.
```javascript
const path = require("path");

module.exports = {
  entry: {
    main: "./src/client/js/main.js",
  },
  mode: 'development',
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        // 생략...
      },
      {
        test: /\.scss$/,
        // 웹팩은 뒤에 위치한 로더부터 적용시키기 때문에 먼저 적용되어야 하는 로더가 뒤로 가야한다.
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};

```

3. client 폴더(프론트엔드 코드를 작성하는 폴더)에 styles.scss 파일을 생성하고 main.js 파일에 임포트합니다.
```javascript
// main.js
import "../scss/styles.scss";
```
4. [MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin/)을 설치합니다.
(이 플러그인을 사용하지 않으면 웹팩 실행 후 js파일과 css파일이 분리되지않고 하나의 js파일로 생성됩니다. 이 플러그인은 CSS를 별도의 파일로 추출하여 CSS가 포함된 JS 파일당 CSS 파일을 생성합니다.)
```
npm install --save-dev mini-css-extract-plugin
```
5. `webpack.config.js` 파일에 `MiniCssExtractPlugin`을 적용합니다.
6. 추가적으로 `watch` 속성도 정의합니다.
```javascript
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: {
    main: "./src/client/js/main.js",
  },
  mode: 'development',
  watch: true,
  // MiniCssExtractPlugin 적용
  plugins: [
    new MiniCssExtractPlugin({
      // 이걸 설정해주지 않으면, js 파일명과 똑같은 파일명의 CSS 파일이 생성됨
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        // 생략...
      },
      {
        test: /\.scss$/,
        // MiniCssExtractPlugin 적용
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
```
이제 `npm run dev:assets`를 실행하면 웹팩이 실행되면서 SCSS를 적용할 수 있게 됩니다.

`watch`를 true로 설정하면 프론트엔드 파일을 수정하고 저장할 때마다 `npm run dev:assets`을 실행시키지 않아도 됩니다.


## 5. 노드몬 설정 수정하기

위와 같은 과정을 거쳤을 때 예기치 않은 동작이 발생했습니다. `webpack.config.js`파일과 `client` 폴더 안의 `js` 파일과 `scss`파일을 수정할 때도 노드몬이 작동했습니다. 노드몬은 **백엔드 코드를 저장할 때만** 재시작이 되도록 설정하고 싶었기 때문에, **클라이언트 관련 파일들은 무시**하도록 설정해줘야 했습니다. 이를 위해서 `nodemon.json` 파일을 생성해야 했는데, 관련 정보를 [노드몬 깃허브 저장소](https://github.com/remy/nodemon)에서 발견할 수 있었고, 아래 순서에 따라 파일을 생성하고 작성했습니다.

1. 루트 디렉터리에 `nodemon.json`파일을 만들고 아래와 같이 작성합니다.
```
{
  "ignore": ["webpack.config.js", "src/client/*", "assets/*"],
  "exec": "babel-node src/init.js"
}
```
2. `package.json`파일의 `scripts`의 `dev:server` 속성을 아래와 같이 수정합니다.
```
"scripts": {
    "dev:server": "nodemon",
    "dev:assets": "webpack"
},
```


## 6. 환경 구축 후 폴더 경로의 변화

이렇게 개발 환경을 구축했더니 아래와 같은 폴더 구조가 나왔습니다.

```
├─ src
│  ├─ client
│  │  ├─ js
│  │  │   ├── components # Component Class를 확장시킨 컴포넌트 파일
│  │  │   ├── core 
│  │  │   │    └─ Component.js # Component Class 파일
│  │  │   ├── utils # 유틸 함수
│  │  │   └── main.js
│  │  └─ scss
│  │     ├─ _variables.scss
│  │     └─ styles.scss
│  ├─ server.js
│  └─ views
│     └─ layout.pug
├─ node_modules
├─ babel.config.json # 바벨 설정 파일
├─ nodemon.json # 노드몬 설정 파일
├─ package-lock.json
├─ package.json
├─ webpack.config.js # 웹팩 설정 파일
├─ README.md
└─ .gitignore
```

이렇게 개발 환경 설정까지 예광탄을 던져봤습니다. 그 다음으로 걱정되는 부분은 **DB 연결**이었기에 그 부분으로 또다시 예광탄을 던졌습니다. DB 연결에 대한 내용은 [다음 포스팅](https://ha-il.github.io/side-project/project-pixel/3-boiler-plate)에서 이어가겠습니다.

## 참고자료
- Babel Setup: [https://babeljs.io/setup#installation](https://babeljs.io/setup#installation)
- Nodenon github repository: [https://github.com/remy/nodemon](https://github.com/remy/nodemon)
- Why webpack: [https://webpack.kr/concepts/why-webpack/](https://webpack.kr/concepts/why-webpack/)
- Webpack Getting Started: [https://webpack.js.org/guides/getting-started/#npm-scripts](https://webpack.js.org/guides/getting-started/#npm-scripts)
- sass-loader: [https://github.com/webpack-contrib/sass-loader](https://github.com/webpack-contrib/sass-loader)
- css-loader: [https://webpack.js.org/loaders/css-loader/](https://webpack.js.org/loaders/css-loader/)
- style-loader: [https://webpack.js.org/loaders/style-loader/](https://webpack.js.org/loaders/style-loader/)  
- MiniCssExtractPlugin: [https://webpack.js.org/plugins/mini-css-extract-plugin/](https://webpack.js.org/plugins/mini-css-extract-plugin/)
