---
title: "[CRA 환경설정] ESLint와 Prettier 환경 설정"
date: "2023-08-27T17:22:00.000Z"
description: "TypeScript 기반의 CRA에 ESLint와 Prettier를 적용해보자"
category: "cra"
featuredImage: "../../../../../src/images/cra-es-pre-256x256.png"
mobileImage: "../../../../../src/images/cra-512x256x2.png"
---

이전 글 ["[CRA 환경설정] 타입스크립트 환경 설정
"](https://ha-il.github.io/configure/cra-configure/tsconfig/)에서 이어지는 글입니다.

## 들어가기 전에

지난 글에서는 타입스크립트 기반으로 CRA 프로젝트를 작성하고 타입스크립트 컴파일러 설정까지 했다. 이번에는 ESLint와 Prettier를 설정해보려 한다. 

## 1. ESLint와 Prettier란?

ESLint와 Prettier를 설명하기 전에 린터와 포맷터에 대해서 알고 갈 필요가 있다.

- **린터**: 코드에서 틀린 문법 사항이나 사전에 정의한 코드 스타일을 준수하고 있는지 알려주는 도구
- **포맷터**: 사전에 정의한 코드 스타일에 맞게 코드를 변환시켜주는 도구

린터와 포맷터 모두 코드 스타일 일치에 도움을 주는 도구지만, **린터**는 스타일에서 벗어난 코드에 대해 에러나 경고 등으로 알려주는 **정적인 방식**을 취한다면, **포맷터**는 스타일에서 벗어난 코드를 자동으로 스타일에 맞는 코드로 변환시켜주는 **직접적인 방식**을 취한다.

여러 사람이 같이 작업하는 경우 자신의 코딩 방식과 작업 환경에 따라서 코드 스타일이 천차만별인데, 린터와 프리티어를 사용하면 여러 사람이 같이 작업하더라도 **코드 스타일을 일관되게 유지**할 수 있다는 장점이 있다. 코드 스타일이 일관되면 프로젝트 코드를 읽을 때 **가독성도 상승**하고, 사전에 미리 코드 스타일을 정의해두면 작업할 때에는 코드 스타일에 대해서 일일히 신경쓰지 않고 작업할 수 있어서 **작업 효율도 상승**한다.

자바스크립트 진영에서 자주 사용되는 린터와 포맷터가 바로 **ESLint**와 **Prettier**이다.

## 2. ESLint

### 2.1 ESLint 설치 과정

이제 ESLint를 설치해보자. 참고로 이번 설치 과정은 [typescript-eslint의 getting-started](https://typescript-eslint.io/getting-started)를 참고해서 진행했다.

**1. 아래 명령어로 eslint와 타입스크립트, 플러그인 등을 설치한다.**

참고로, 타입스크립트 기반으로 CRA 프로젝트를 생성했다면 이미 설치되어 있기 때문에 이 과정은 생략해도 된다.

```
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint typescript
```
<br/>

**2. 루트 디렉터리에 ESLint 설정 파일인 `.eslintrc.cjs` 파일을 생성하고 아래 코드를 입력한다.**

참고로, ESM(ECMAScript Modules)를 사용하지 않는 경우 .eslintrc 파일의 확장자를 `.eslintrc.js`로 해도 괜찮다. 자세한 내용은 [ESLint - Configuration Files](https://eslint.org/docs/latest/use/configure/configuration-files)을 참조하기 바란다.

```js
// `.eslintrc.cjs` 

/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  // 'eslint:recommended': ESLint에 내장된 권장 구성 설정.
  // 'plugin:@typescript-eslint/recommended': eslint:recommended와 비슷하지만 플러그인에서 타입스크립트 관련 규칙을 사용한다는 점이 다름
  
  parser: '@typescript-eslint/parser', 
  // parser: 위와 같이 설정하지 않을 경우, ESLint가 TypeScript 코드를 일반 JavaScript처럼 구문 분석하려고 시도할 때 오류가 발생.
  plugins: ['@typescript-eslint'], 
  // 코드베이스 내에서 typescript-eslint 규칙을 사용할 수 있게 설정
  root: true,
  // ESLint가 이 루트 디렉터리 밖에서 구성 파일을 검색하면 안 된다는 것을 명시적으로 표시
};
```
<br/>

**3. ESLint를 실행하기 위해 아래 명령어를 입력한다.**

```
npx eslint .
```

하지만 이 상태로 입력하면 실행은 되지만 아무런 메시지가 뜨지 않아서 설치가 잘 되었는지 알 수가 없다. 테스트를 위해 일부러 ESLint 규칙을 어기는 코드를 입력해보자. 아래와 같이 변수를 var로 선언하고 참조하지 않으면 에디터 상에서 에러 1개와 경고 1개가 뜬다. 

```tsx
// App.tsx
var a = 123;
// Unexpected var, use let or const instead. eslint(no-var)
//'a' is assigned a value but never used. eslint(@typescript-eslint/no-unused-vars)
```
이 상태로 `npx eslint .` 명령어를 입력하면 아래와 같은 에러 메시지가 나온다.

```
../cra-config/src/App.tsx
  error    Unexpected var, use let or const instead  no-var
  warning  'a' is assigned a value but never used    @typescript-eslint/no-unused-vars

✖ 2 problems (1 error, 1 warning)
```
이렇게 결과가 나오면 ESLint가 규칙 위반을 잘 잡아내고 있다는 것으로, ESLint가 잘 작동하고 있음을 확인할 수 있다.

<br/>

**팁!: 혹시 VSCode에서 파일을 저장할 때 ESLint 규칙에 따라 자동 변환 된다면?**

VSCode에서 var로 변수를 선언하고 저장할 때마다 자동으로 const로 바뀐다면, settings.json 파일에서 아래와 같이 옵션의 값을 false로 바꿔주면 된다.
```json
// settings.json
{
  "editor.codeActionsOnSave": { "source.fixAll.eslint": false },
}
```
반대로, 파일 저장시 자동으로 ESLint 규칙에 맞게 자동으로 코드를 수정하고 싶다면 해당 옵션을 true로 바꾸면 된다.
```json
// settings.json
{
  "editor.codeActionsOnSave": { "source.fixAll.eslint": true },
} 
```
### 2.2 ESLint 규칙(rules) 설정하기

위에서 생성했던 `.eslintrc.cjs` 파일을 확인해보면 아무런 규칙도 설정되어 있지 않다.
```js
// `.eslintrc.cjs` 

/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],  
  parser: '@typescript-eslint/parser', 
  plugins: ['@typescript-eslint'], 
  root: true,
};
```

하지만 eslint 명령어를 돌렸을 때 'no-var'와 '@typescript-eslint/no-unused-vars' 규칙에 위반됐다는 메시지를 받았다. 이 규칙들은 'extends'에 추가된 `'eslint:recommended'`와 `'plugin:@typescript-eslint/recommended'`라는 설정에서 나온 것이다. 이 설정들은 자주 사용되는 규칙들을 모아뒀기 때문에 그대로 사용해도 무리는 없지만, 내 맘대로 바꾸고 싶은 규칙도 있을 수 있다. 그럴 때는 .eslintrc.cjs에서 `rules` 속성을 추가해주면 된다.

```js
// `.eslintrc.cjs` 

/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    'no-var': 'warn', // var는 경고만!
    '@typescript-eslint/no-unused-vars': 'off', // 선언했지만 참조 안 하는 변수는 허용!
  },
};
```
이렇게 설정하고 아래 코드를 입력해보자.
```tsx
// App.tsx
var a = 123;
```
그리고 `npx eslint .` 명령어를 입력해보자.
```
../cra-config/src/App.tsx
warning  Unexpected var, use let or const instead  no-var

✖ 1 problem (0 errors, 1 warning)
```
rules에서 설정한대로 var를 사용하면 경고만 뜨고, 참조하지 않은 변수의 경우 아무런 메시지도 뜨지 않는다. 이렇게 rules를 이용해서 세부적인 규칙을 설정할 수 있다.

하지만 [ESLint-Rules Reference](https://eslint.org/docs/latest/rules/)를 보면 규칙이 정말 많다. 이 모든 규칙을 전부 수동으로 설정하는 것보다, 이미 규칙들이 설정되어 있는 설정 파일을 다운 받아서 사용하고, 맘에 들지 않는 규칙만 rules를 이용해서 수정하는 방식을 추천한다.

스타일 가이드를 검색해보면 에어비엔비 스타일 가이드(Airbnb Style Guide)가 가장 많이 나온다. 대기업의 개발팀에서는 어떤 스타일로 코딩하는지 궁금하기도 하고, 개인이 설정한 파일보다 기업에서 여러명이 합의해서 만들어낸 스타일 규칙이 더 믿을만 하다고 생각해서 이번 프로젝트에 도입해보려고 한다. 에어비엔비 스타일 가이드의 규칙이 궁금하다면 [Airbnb Style Guide 깃헙 저장소](https://github.com/airbnb/javascript)를 확인해보자.

### 2.3 eslint-config-airbnb 

npm으로 eslint-config-airbnb를 설치하면 에어비엔비 스타일 가이드를 설치하여 프로젝트에 적용시킬 수 있다. 이번 프로젝트는 타입스크립트를 적용할 예정이기 때문에, 타입스크립트 가이드까지 같이 설치해보자.

**1. 먼저 eslint-config-airbnb를 설치한다.**
```
npx install-peerdeps --dev eslint-config-airbnb
# -peerdeps는 다른 패키지와 호환 가능한 버전으로 패키지를 설치하는 옵션
```
<br/>

**2. 다음으로 eslint-config-airbnb-typescript를 설치한다.**
```
npm install eslint-config-airbnb-typescript --save-dev
```
<br/>

**3. .eslintrc.cjs 파일에서 extends에 'airbnb'와 'airbnb-typescript'를 추가한다.**
```js
// `.eslintrc.cjs` 

/* eslint-env node */
module.exports = {
  // 추가!
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb-typescript',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
  },
};
```
<br/>

**4. .eslintrc.cjs 파일에서 아래와 같이 parserOptions을 추가한다.**

```js
// `.eslintrc.cjs` 

/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb-typescript',
  ],
  parser: '@typescript-eslint/parser',
  // 추가!
  parserOptions: {
    project: './tsconfig.json', // tsconfig.json 파일 위치에 따라 다를 수 있음
  },
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
  },
};
```
이 때 .eslintrc.cjs 파일에서 'Parsing error: ESLint was configured to run on ...' 에러가 발생할 수 있다. 이러한 오류는 TypeScript 구성에 포함되지 않은 파일에 대한 타입 정보를 생성하도록 ESLint 구성이 요청하기 때문에 발생한다.

이럴 때는 .eslintrc.cjs 파일만 린팅을 적용하지 않으면 된다. 이럴 때 사용할 수 있는 방법은 `.eslintignore` 파일을 생성하거나 .eslintrc.cjs파일에 `ignorePatterns` 속성을 추가하는 것이다.

나는 `.eslintignore` 파일을 따로 생성했다. ESLint 파일의 코드가 지금은 얼마 안 되지만, 속성이나 룰을 추가하면 할 수록 양이 많아진다. 린팅하고 싶지 않은 파일을 추가하기 위해서 긴 코드를 뒤적이는 것보다, 다른 파일로 분리할 수 있다면 분리해서 관리하는 것이 더 효율적이라 판단했다. 

<br/>

**5. `.eslintignore` 파일을 생성하고 아래와 같이 작성한다.**
```
.eslintrc.cjs
node_modules 
```
node_modules의 경우에도 린팅이 필요없기 때문에 같이 추가해줬다.

<br/>

**6. 아래 명령어를 실행해서 린팅이 잘 되는지 확인하자.**
```
npx eslint . --ext .js,.jsx,.ts,.tsx
```

CRA 초기 설정을 한 상태에서 아무런 수정없이 에어비엔비 스타일 가이드를 적용해서 린팅하면 에러 메시지가 몇 개 뜰 것이다. 에러메시지가 떴다면 에어비엔비 스타일 가이드가 잘 적용된 것이다.

### 2.4 ESLint CLI

바로 위의 eslint 명령어를 보면 `--ext`라는 명령어 옵션을 확인할 수 있다. 이렇게 eslint 명령어에도 다양한 옵션이 있다. 이번에는 실제 프로젝트에서 사용했던 옵션만 소개하겠다. 나머지 옵션은 [ESLint - Command Line Interface Reference](https://eslint.org/docs/latest/use/command-line-interface)에서 확인할 수 있다.

- **--ext**: 이 옵션을 사용하면 지정한 디렉터리에서 대상 파일을 검색할 때 ESLint가 사용하는 파일 확장명을 지정할 수 있다.

- **--fix**: 이 옵션은 ESLint가 가능한 한 많은 문제를 수정하도록 지시한다. 실제 파일 자체에 대한 수정이 이루어지며 수정되지 않은 나머지 문제만 출력된다.

- **--cache**: 변경된 파일에 대해서만 작업할 수 있도록 처리된 파일에 대한 정보를 저장한다. 이 옵션을 활성화하면 변경된 파일만 린팅되도록 하여 ESLint의 런타임 성능을 크게 향상시킬 수 있다. 캐시는 기본적으로 .eslintcache에 저장된다.

참고로, --cache 옵션을 사용한다면, .gitignore 파일에 .eslintcache를 추가해줘야 한다. 내가 돌린 eslint에 대한 캐싱 정보는 다른 사람에게 필요 없기 때문이다.

### 2.5 ESLint 스크립트 만들기

자신이 원하는 ESLint CLI 옵션을 추가해서 package.json 파일에 lint 스크립트를 추가해보자.

```json
{
  "scripts": {
    "lint": "eslint . --cache"
  },
}

```
이렇게 설정하면 `npm run lint` 명령어로 린팅을 진행할 수 있다.

## 3. Prettier

### 3.1 ESLint가 있는데 굳이 Prettier를 써야 할까?

사실, ESLint에 각종 규칙을 넣고, VSCode 익스텐션을 쓰거나, --fix 옵션 등을 쓰면 Prettier가 필요 없지 않을까라는 생각도 든다. 하지만 Prettier 같은 포맷터를 쓰기를 추천한다. 

포맷터의 경우 코드에서 문법, 로직, 이름 지정 등에 관여하지 않고, 공백이나 줄바꿈 등의 문제에만 관여하기 때문에 일반적으로는 매우 빠르게 실행된다. 반면 린터는 검사해야할 규칙이 많고, 중간 작업(분석, 검사, 보고, 수정)이 많기 때문에 포맷터에 비해 느리다.

따라서, 공백이나 줄바꿈 등의 서식에 대한 규칙은 포맷터에 맡기고, 로직이나 이름 지정 등에 대한 규칙은 린터에게 맡기는 것이 작업 효율성을 높일 수 있다. 이에 대한 자세한 내용은 [typescript-eslint: What About Formatting?](https://typescript-eslint.io/linting/troubleshooting/formatting/)에서 살펴볼 수 있다.

### 3.2 Prettier 설치하기

**1. `prettier`와 `eslint-config-prettier`를 설치한다.**

```
npm install --save-dev prettier eslint-config-prettier
```
eslint-config-prettier는 왜 설치할까? extends에는 많은 eslint 규칙들이 들어가는데, 간혹 eslint 규칙 중에 서식에 대한 규칙이 포함된 경우가 있다. 그 상태에서 Prettier를 같이 사용하면 Prettier의 규칙과 ESLint의 규칙이 충돌할 수 있다. eslint-config-prettier를 설치하고 적용하면 ESLint의 규칙 중에서 서식과 관련된 규칙을 비활성화한다. 따라서 Prettier와 ESLint의 역할을 확실하게 나눌 수 있게 된다.

<br/>

**2. `.eslintrc.cjs` 파일의 extends에 'prettier'를 추가한다.**

```js
// `.eslintrc.cjs` 

/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb-typescript',
    // 추가!
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
  },
};
```
<br/>

**3. 루트 디렉터리에 `.prettierrc.cjs` 파일을 생성하고 아래와 같이 코드를 작성한다.**

```js
// prettier.config.js, .prettierrc.js, prettier.config.cjs, or .prettierrc.cjs

/** @type {import("prettier").Config} */
const config = {
  tabWidth: 2, // 들여쓰기 수준당 공백 개수를 지정.
  semi: true, 문 끝 // 문 끝에 세미콜론을 인쇄.
  singleQuote: true, // 큰따옴표 대신 작은따옴표를 사용.
};

module.exports = config;
```
나의 경우 eslint 설정 파일도 확장자를 cjs로 했기 때문에 Prettier 설정 파일도 cjs로 생성했으나, 프로젝트에 따라서 확장자를 달리할 수 있다. 자세한 내용은 [Prettier-Configuration File](https://prettier.io/docs/en/configuration)을 참고하기 바란다.

<br/>

**4. Prettier가 잘 적용되었는지 확인해보자.**

확인을 위해 App.tsx 파일의 코드를 아래와 같이 바꿔봤다. return문 끝에 세미콜론을 제거하고 말도 안되는 공백을 넣어봤다.

(참고로 에디터 설장 때문에 저장할 때마다 자동으로 포맷팅된다면, VSCode의 경우 settings.json 파일에서 `"editor.formatOnSave"`와 `editor.codeActionsOnSave` 기능을 잠시 꺼보자.)

```jsx
function App() {
  return (
    <div className="App">
            <p>Hello Prettier!</p>
    </div>
  )
}
```

이 상태로 아래 명령어를 돌려보자.
```
npx prettier . --write 
```

Prettier가 잘 적용됐다면 아래와 같이 코드가 포맷팅 될 것이다.

```jsx
function App() {
  return (
    <div className="App">
      <p>Hello Prettier!</p>
    </div>
  );
}
```

### 3.3 Prettier 규칙

Prettier는 ESLint에 비해 규칙이 많지 않아서 공식 문서를 한 번 읽어보고 맘에 드는 규칙을 골라보는 것도 괜찮다. 아래 항목은 내가 공식문서를 읽고 실제로 쓸 것 같은 규칙들을 추린 것이며, 모든 규칙이 궁금하다면 [Prettier-Options](https://prettier.io/docs/en/options)를 확인해보자.

참고로 아래 옵션에 값으로 설정된 모든 값들은 Prettier 기본 값이다.

```jsx
module.exports = {
  PrintWidth: 80, // 프린터가 래핑할 줄 길이를 지정합니다.
  tabWidth: 2, // 들여쓰기 수준당 공백 개수를 지정합니다.
  useTabs: false, // 공백 대신 탭으로 줄을 들여쓰기합니다.
  semi: true, // 문 끝에 세미콜론을 인쇄합니다.
  singleQuote: false, // 큰따옴표 대신 작은따옴표를 사용합니다.
  quoteProps: 'as-needed', // 객체의 프로퍼티가 따옴표로 묶일 때 변경합니다.
    /*
      as-needed - 필요한 경우에만 개체 속성 주위에 따옴표를 추가합니다.
      consistent- 객체에서 하나 이상의 프로퍼티에 따옴표가 필요한 경우 모든 프로퍼티를 따옴표로 묶습니다.
      preserve - 객체 속성에서 따옴표의 입력 사용을 존중합니다.
    */
  jsxSingleQuote: false, // JSX에서는 큰따옴표 대신 작은따옴표를 사용합니다.
  trailingComma: 'all', // 여러 줄로 쉼표로 구분된 구문 구조에서는 가능한 한 후행 쉼표를 인쇄합니다. (예를 들어 한 줄 배열에는 후행 쉼표가 표시되지 않습니다.)
    /*
      all - 가능한 경우 후행 쉼표 사용
      es5 - ES5에서 유효한 경우 후행 쉼표(객체, 배열 등). TypeScript의 유형 매개변수에는 후행 쉼표가 없습니다.
      none - 후행 쉼표가 없습니다.
    */
  bracketSpacing: true, // 객체 리터럴의 괄호 사이에 공백을 인쇄합니다.
  bracketSameLine: false, // 여러 줄로 된 HTML(HTML, JSX, Vue, Angular) 요소의 >를 다음 줄에 단독으로 두지 않고 마지막 줄 끝에 배치합니다(자체 닫는 요소에는 적용되지 않음).
  arrowParens: 'always', // 단독 화살표 함수 매개변수 주위에 괄호를 넣습니다.
    /*
      always - 항상 포함
      avoid - 가능하면 생략
    */
  singleAttributePerLine: false, // HTML, Vue 및 JSX에서 한 줄당 단일 속성을 적용합니다.
};
```
### 3.4 Prettier CLI

Prettier가 잘 적용되었는지 확인하기 위해 사용했던 명령어를 보면 `--write`라는 옵션을 확인할 수 있다. 이처럼 Prettier에도 다양한 CLI가 있는데, 내가 실제로 사용해봤던 옵션 위주로 설명하겠다. 나머지 옵션이 궁금하다면 [Prettier-CLI](https://prettier.io/docs/en/cli)를 참고하기 바란다.

- **--write**: Prettier 규칙에 따라 모든 파일을 제자리에 다시 작성. (Prettier를 실행하면 자동으로 코드를 고쳐준다는 의미.)

- **--cache**: 변경 사항이 있는 파일에 대해서만 포맷팅. (캐시 파일은 node_modules 안에 있기 때문에 ESLint와 달리 캐시 파일을 .gitignore에 추가할 필요가 없음)

### 3.5 Prettier 스크립트 만들기

ESLint처럼 Prettier 또한 스크립트를 만들어 두려고 한다. 자신이 원하는 Prettier CLI 옵션을 추가해서 package.json 파일에 format 스크립트를 추가해보자.

```json
{
  "scripts": {
    "lint": "eslint . --cache",
    "format": "prettier . --write --cache"
  },
}

```
이렇게 설정하면 `npm run format` 명령어로 포맷팅을 진행할 수 있다.

## 4. VSCode 익스텐션 쓰면되는데 왜 이렇게 까지 해야하나요?

사실 VSCode를 사용하는 사람 중에 Prettier나 ESLint 익스텐션을 사용하지 않는 사람은 거의 없을 것이다. 이 글에서 다룬 것처럼 힘들게 ESLint와 Prettier를 설정해주지 않아도 작업에도 문제없고, 코드 포맷팅에도 문제가 없을 것이다. 하지만 프로젝트가 팀 단위로 가게 되면 이러한 환경설정이 필요해진다. 모든 팀원의 컴퓨터가 나와 같은 로컬 환경이 아니기 때문에 얼마든지 변수가 발생할 수 있다. 따라서 코드 에디터의 익스텐션이 아니라 설정 파일을 따로 만들어서 공유하면 로컬 환경이 다르더라도 동일한 규칙을 가져갈 수 있다. 하지만 이런 의문이 생길 수도 있다. 

"규칙을 파일로 설정하는 것까지는 오케이. 그런데 왜 스크립트까지 설정하나요?"

스크립트를 설정하는 이유는 린팅과 포맷팅을 자동화하기 위해서다. 혼자 작업할 경우 파일을 저장할 때마다 린팅과 포맷팅이 이뤄지도록 VSCode 익스텐션을 쓰면 되기 때문에 자동화의 필요성을 느끼지 못할 수 있다. 하지만 이게 팀 프로젝트라고 생각했을 때, 린팅과 포맷팅이 되지 않은 코드의 커밋 또는 푸쉬가 팀 레포지토리로 들어온다고 생각해보자. 스타일이 일치되지 않은 코드를 허가하고 싶지는 않을 것이다. 바로 그 때, 커밋을 하고 푸쉬를 하는 바로 그 때 린팅과 포맷팅을 자동으로 처리하기 위해서 굳이 스크립트를 작성한 것이다.

이렇게 커밋과 푸쉬 전에 린팅와 포맷팅을 강제할 수 있는 방법은 `git hook`을 이용하는 것이다. 이에 대해서는 다음 글에서 다루겠다.