---
title: "[당신의 작업실] 4. 데이터베이스 연결"
date: "2023-06-13T12:20:04.000Z"
description: "MongoDB 연결과 예광탄의 궤적"
category: "project"
featuredImage: "../../../../../src/images/sideProject-256x256.png"
mobileImage: "../../../../../src/images/sideProject-512x256x2.png"
---
- 당신의 작업실 프로젝트 링크: https://pixel-workroom.herokuapp.com/
- 프로젝트 깃허브 저장소 링크 : https://github.com/ha-il/project-pixel

## 들어가기 전에

이번 글은 [이전 글](https://ha-il.github.io/side-project/project-pixel/3-boiler-plate/)에서 다뤘던 개발 환경(Webpack, Babel) 설정 이후, 데이터베이스 연결에 대한 내용을 다룹니다.

## 1. MongoDB 선택 이유

[MongoDB](https://www.mongodb.com/)는 **문서 기반**(document-based) 데이터베이스여서, 관계형 데이터베이스와는 다르게 구조화된 테이블이나 스키마를 사용하지 않고 **JSON 형식**의 문서를 저장하고 쿼리 작업을 할 수 있습니다. 아직 SQL은 다뤄본적이 없지만, JSON 형식에는 익숙한 상태였기 때문에 MongoDB를 데이터베이스로 선택했습니다.

## 2. MongoDB 설치

MongoDB 설치는 MongoDB 사이트 공식문서의 [Install MongoDB](https://www.mongodb.com/docs/manual/installation/)을 참고해서 진행했습니다. 저는 맥OS에서 설치하는 방법을 따랐고 사전에 [Homebrew](https://brew.sh/index_ko)가 설치되어 있었습니다. 설치 과정은 아래와 같습니다.

1. Xcode 커맨드라인 도구를 설치하기 위해 맥OS 터미널에 아래 명령어를 입력합니다.
```
xcode-select --install
```

2. MongoDB Homebrew 탭을 추가합니다. (탭은 패키지 저장소의 위치를 지정하는 역할을 합니다.)
```
brew tap mongodb/brew
```

3. Homebrew와 기존 패키지를 업데이트합니다.
```
brew update
```

4. MongoDB Community Edition을 설치합니다.
```
brew install mongodb-community@6.0
```

5. 맥OS 터미널에서 아래 명령어를 입력하고 설치를 확인합니다.
```
mongosh
```

이때 등장하는 `Connecting to:		mongodb://127.0.0.1:27017/`는 개발환경에서 사용될 `DB_URL`이 됩니다.

## 3. Mongoose 설치

백엔드로 Node.js를 사용하고, 데이터베이스로 MongoDB를 사용하고 있으므로, [Mongoose](https://nomadcoders.co/wetube/lectures/2671)를 사용하는 것이 좋다고 생각했습니다. Mongoose는 **Node.js에서 MongoDB와 상호작용하기 위한** 객체 모델링 도구입니다. Mongoose를 사용하면 Node.js에서 MongoDB를 조작하기 위한 쿼리 작성과 스키마 기반의 데이터 모델링을 할 수 있습니다. Mongoose 설치 방법은 Mongoose 사이트의 [Getting Started](https://mongoosejs.com/docs/index.html)를 참고했으며, 순서는 아래와 같습니다.

1. `mongoose`를 설치합니다.
```
npm install mongoose --save
```
2. `.env` 파일을 생성하고 `DB_URL`을 작성합니다. (my-project 부분은 재량)
```
DB_URL=mongodb://127.0.0.1:27017/my-project
```

3. `src` 폴더에 `db.js` 파일을 생성하고 아래와 같이 입력합니다.
```javascript
// db.js
import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

db.on("error", (error) => console.log("❌ DB Error", error));
db.once("open", () => console.log("✅ Connected to DB"));
```

4. `server.js` 파일에 `db.js`을 임포트합니다.
```javascript
// server.js
import "./db.js";
import express from "express";
```

`npm run dev:server` 명령어를 실행하면 데이터베이스가 연결됩니다.

## 4. 데이터베이스 연결 후 폴더 경로의 변화

데이터베이스 연결을 마지막으로 프로젝트의 초기 보일러 플레이트 세팅을 완료했습니다. [(당시 커밋)](https://github.com/ha-il/project-pixel/tree/09dd9640ad96b99e9ef52168313972a8676c9e52)

```
├─ src
│  ├─ client
│  │  ├─ js
│  │  │   ├── components 
│  │  │   ├── core 
│  │  │   │    └─ Component.js 
│  │  │   ├── utils 
│  │  │   └── main.js
│  │  └─ scss
│  │     ├─ _variables.scss
│  │     └─ styles.scss
│  ├─ db.js # MongoDB 연결 파일
│  ├─ server.js
│  └─ views
│     └─ layout.pug
├─ node_modules
├─ .gitignore
├─ README.md
├─ babel.config.json 
├─ nodemon.json 
├─ package-lock.json
├─ package.json
└─ webpack.config.js 

```
이렇게 데이터베이스 연결까지 예광탄을 쏴보니, 정말 마치 예광탄의 궤적이 보이는 것처럼 프로젝트의 전반적인 구조가 눈에 보이기 시작했고, 아래와 같이 다음에 해야 할 일들이 자연스럽게 떠올랐습니다.

```
`SPA 구현은 확인되었으니, 이제 홈 페이지를 구성하는 주요 컴포넌트들을 작성하면 되겠다.`

`각 컴포넌트에서 서버로 데이터를 요청하려면 서버에서 api router를 설정해야겠다.`

`클라이언트의 요청에 응답하려면 api 경로별로 요청을 처리할 컨트롤러를 만들어야겠다.`
```

이렇게 예광탄을 하나씩 쏴보면서 프로젝트를 개발할 수 있는 초기 보일러 플레이팅 세팅을 마치고 나니까, 프로젝트 구현에 있어서 **기술적 제약**이 많이 감소했습니다. **기능을 구현하지 못 할 것을 걱정할 필요 없이**, 기획과 디자인을 진행할 수 있게 되었습니다. 따라서 [다음 글](https://ha-il.github.io/side-project/project-pixel/5-plan-and-design)에서는 이번 프로젝트가 왜 "당신의 작업실"이 되었는지, 그 기획과 디자인에 대해서 이야기해보겠습니다.

## 참고자료
- MongoDB: [https://www.mongodb.com/](https://www.mongodb.com/)

- Install MongoDB: [https://www.mongodb.com/docs/manual/installation/](https://www.mongodb.com/docs/manual/installation/)

- Homebrew: [https://brew.sh/index_ko](https://brew.sh/index_ko)

- Mongoose Getting Started: [https://mongoosejs.com/docs/index.html](https://mongoosejs.com/docs/index.html)