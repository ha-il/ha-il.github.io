---
title: "[CRA 환경설정] Husky 환경 설정"
date: "2023-08-28T15:27:00.000Z"
description: "git hook 자동화를 위한 Husky 설정"
category: "typescript"
featuredImage: "../../../../../src/images/ts-256x256.png"
mobileImage: "../../../../../src/images/ts-512x256x2.png"
---

이전 글 ["[CRA 환경설정] ESLint와 Prettier 환경 설정"](https://ha-il.github.io/configure/cra-configure/eslint/)에서 이어지는 글입니다.

## 들어가기 전에

지난 글에서는 ESLint와 Prettier를 설정해봤다. 이번에는 린팅과 포맷팅을 커밋 또는 푸쉬 전에 자동으로 수행할 수 있도록 husky를 설정하는 과정을 다뤄보려고 한다.

## 1. git hook

이번 설정의 목적은 커밋과 푸쉬 전에 린팅과 포맷팅을 자동화하기 위함이다. 그렇다면 커밋과 푸쉬 전에 특정한 동작을 수행할 수 있도록 설정해야 하는데, 그 설정을 git hook이라 부른다. git hook 설정 과정은 사전 과정이 필요한데 이 과정이 강제되지 않기 때문에, 사전 설정을 개인의 자율로 맡기게 된다. 이렇게 되면 git hook 설정이 모든 팀원들에게 적용되어 있다는 것을 보장할 수 없기 때문에, 자동으로 git hook을 설정하는 방법이 필요하다. 이 때 필요한 것이 바로 `Husky`라는 패키지이다.

## 2. Husky 🐶

> Modern native git hooks made easy
>
> Husky improves your commits and more 🐶 woof! (귀여워...😭)
>
> You can use it to lint your commit messages, run tests, lint code, etc... when you commit or push. Husky supports all Git hooks.

[Husky](https://typicode.github.io/husky/)는 git hook 설정을 도와주는 패키지이다. 가장 큰 장점은 git hook 설정을 npm install만으로 가능하게 해준다는 것이다. 팀 프로젝트를 할 때, 저장소에서 클론한 후 npm install을 하지 않는 경우는 거의 없다. 이렇게 프로젝트 진행 과정 중에서 반드시 들어가는 npm install 과정에 git hook 설정 과정을 포함시키면서, 모든 팀원이 일관된 git hook 설정을 가질 수 있도록 한다.

### 2.1 Husky 설치 과정

설치 과정은 [husky-Getting started](https://typicode.github.io/husky/getting-started.html)를 참고했다.

1. husky를 설치한다.

```
npm install husky --save-dev
```

2. 아래 명령어를 실행시켜 git hook을 사용할 수 있게 한다.
```
npx husky install
```

3. npm install 할 때 자동으로 git hook을 설정하기 위해 아래와 같이 스크립트를 작성한다.

```json
// package.json
{
  "scripts": {
      "prepare": "husky install"
  },
}
```

### 2.2 Husky로 hook 만들기

hook을 만들기 전에 생각해봐야할 부분이 있다. 바로 커밋 전(pre-commit), 푸쉬 전(pre-push)에 어떤 행동을 하게 할 것인지를 생각해봐야 한다. 당연히 커밋 전이든 푸쉬 전이든 린팅하는 것이 가장 좋지 않느냐라고 말할 수 있지만, 이 또한 팀원들의 작업 스타일에 따라 다르다. 

예를 들어, eslint 규칙으로 console을 금지했다고 가정해보자. console은 확인 차원에서 많이 쓰기도 하고, 그날 푸쉬 할만큼 작업을 완료하지는 못해서 console을 포함한 채로 커밋을 해야하는 경우가 생길지도 모른다. 이런 상황이 팀에서 자주 발생한다면 커밋 전에는 포맷팅만 체크하고, 푸쉬할 때는 린팅을 체크하는 방식으로 유연하게 훅을 적용할 수도 있다. 이처럼 팀원 또는 개인의 스타일에 따라 어떤 훅을 만들 것인지 결정하면 된다.

나의 경우 일단 코드 스타일 자체를 좀 빡빡하게 유지시키고 싶다는 생각이 있어서 커밋 전, 푸쉬 전 모두 린팅과 포맷팅을 적용하는 방식으로 훅을 만들어 보려고 한다.

훅을 만드는 Husky의 명령어는 `husky add <file> [cmd]`의 형식을 가진다. 이 형식으로 hook을 만들어보자.

1. 먼저 커밋 전(pre-commit) 상황에서 사용할 훅을 만든다.

```
npx husky add .husky/pre-commit "npm run format && npm run lint"
```
설치가 잘 진행됐다면 .husky 폴더와 그 안에 pre-commit이라는 파일이 만들어졌을 것이다. 만약 훅의 내용을 바꾸고 싶다면 해당 파일에 들어가서 코드를 수정하면 된다.

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run format && npm run lint  # 여기를 수정하면 된다.

```
git commit을 통해 hook이 잘 적용되었는지 확인해보자. 잘 적용되었다면 터미널에 훅으로 설정한 명령어들(format, lint)이 실행될 것이다.

2. 그 다음으로 푸쉬 전(pre-push) 상황에서 사용할 훅을 만든다.

```
npx husky add .husky/pre-push "npm run format && npm run lint"
```
마찬가지로 git push를 통해 hook이 잘 적용되었는지 확인해보자.

## 3. lint-staged 적용하기

Husky와 더불어 자주 사용되는 패키지가 있어서 소개한다. 바로 `lint-staged`라는 패키지이다. 이 패키지는 이름 그대로 staged된 파일에 대해서만 lint를 실행하기 위해 만들어졌다. 린팅은 많은 과정을 포함한 작업으로 적지 않은 시간이 소요되는데, 전체 파일에 대해서 린팅을 수행할 경우 많은 시간이 든다. 따라서 커밋할 예정인, 즉 staged 상태인 파일에 대해서만 린팅을 수행하는 편이 효율적이다. 한 번 설치해서 사용해보자.

참고로 이번처럼 CRA를 사용하는 경우라면 [lint-staged 깃헙 저장소](https://github.com/okonet/lint-staged)보다 CRA 공식 문서에서 [Create React App-Formatting Code Automatically](https://create-react-app.dev/docs/setting-up-your-editor/)를 참고하는 편이 더 이해하기 쉬울 것이다.

1. lint-staged를 설치한다.
```
npm install --save-dev lint-staged
```

2. package.json 파일에 "lint-staged"를 추가해준다.

주의!: "lint-staged"를 "scripts"에 추가하는 것이 아니다. scripts 밖에 추가한다.

```json
{
  "scripts": {
    "lint": "eslint . --cache",
    "format": "prettier . --write --cache",
    "prepare": "husky install"
  },
  // scripts 밖에 추가
  "lint-staged": {
    "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}": [
      "npm run format",
      "npm run lint"
    ]
  },
}
```

3. .husky/pre-commit 파일을 수정한다.

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged 
```

4. git commit 명령어로 테스트해보자.

이 구간에서 많은 오류가 발생했는데 전부 명령어를 잘 못 작성해서 발생했다. 내가 에러를 경험한 상황은 이러했다.

- "lint-staged"에 명령어를 &&로 묶어서 작성했을 때 => &&를 인식하지 못한다.
```json
"lint-staged": {
    "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}": [
      "format && eslint",
  ]
},
```

- "lint-staged"에 명령어를 npm run 없이 작성했을 때 => 명령어 실행이 안 된다.
```json
"lint-staged": {
    "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}": [
      "format",
      "lint"
  ]
},
```
아래와 같이 작성하면 오류없이 실행됐다.
```json
"lint-staged": {
    "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}": [
      "npm run format",
      "npm run lint"
  ]
},
```

## 마치며

여기까지 설정했다면 내가 계획했던 개발 단계에서의 환경 설정은 끝이다. 이제는 배포 단계에서 적용시킬 CI/CD에 대한 환경 설정이 필요하다. 다음 글에서는 배포와 CI/CD에 대해서 다루겠다.