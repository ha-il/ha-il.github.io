---
title: "[CRA 환경설정] 타입스크립트 환경 설정"
date: "2023-08-26T16:47:00.000Z"
description: "언제나 즐거운 환경설정"
category: "typescript"
featuredImage: "../../../../../src/images/ts-256x256.png"
mobileImage: "../../../../../src/images/ts-512x256x2.png"
---

## 작성 계기

원티드 프리온보딩 프론트엔드 과정에서 ESLint, Prettier, Husky로 프로젝트 환경 설정하는 방법을 배웠다. 해당 과정에서는 JavaScript 기반으로 환경을 설정했지만, 사실 요즘 타입스크립트를 쓰지 않는 경우가 거의 없다. 앞으로의 프로젝트도 타입스크립트로 진행할 확률이 높기 때문에, 우선 타입스크립트 환경 설정을 먼저 하려고 한다.

환경 설정 이후에 정적 페이지를 AWS S3에 올리는 연습도 할 예정이라, 빠르게 정적페이지를 빌드할 수 있는 CRA를 선택했고, CRA 초기 환경에서부터 다른 설정들을 조금씩 더해볼 것이다.

## 1. 타입스크립트 기반의 CRA 프로젝트 생성하기
우선 [CRA 공식문서](https://create-react-app.dev/docs/adding-typescript)를 보면 CRA 프로젝트에 타입스크립트를 추가하는 방법을 설명하고 있다. 이번 글에서는 처음부터 타입스크립트 기반으로 CRA를 설치하는 방법으로 진행하지만, 이미 존재하는 CRA 프로젝트에 타입스크립트를 추가하는 방법도 있으니 공식문서를 확인해보기 바란다.

일단 아래의 명령어를 실행한다.

```
npx create-react-app my-app --template typescript
```
실행하고 CRA 프로젝트를 확인해보면 `tsconfig.json`이라는 파일을 확인할 수 있다. 이 파일은 타입스크립트 프로젝트가 어떻게 컴파일될지 세부적인 옵션을 정의하는 파일이다. (타입스크립트로 컴파일하면 자바스크립트 파일이 생성된다.)

## 2. tsconfig.json 파일 살펴보기

tsconfig.json 파일은 처음에는 아래와 같이 작성되어있다.
```json
// tsconfig.json
{
  // 컴파일러 옵션
  "compilerOptions": {
    "target": "es5", // 컴파일 결과물에 적용시킬 자바스크립트 스펙.
    "lib": ["dom", "dom.iterable", "esnext"], // 브라우저 DOM API, 자바스크립트 내장 API의 타입 선언 파일.
    "allowJs": true, // 자바스크립트 파일을 함께 사용하는 것을 허용,
    "skipLibCheck": true, // 타입 정의 파일의 타입 체크를 스킵.
    "esModuleInterop": true, // 컴파일러의 동작을 변경하여 타입스크립트가 CommonJS/AMD/UMD를 ES6 모듈과 유사하게 취급해서 발생하는 문제를 해결.
    "allowSyntheticDefaultImports": true,
    "strict": true, // 엄격한 체크 여부.
    "forceConsistentCasingInFileNames": true, // 파일 이름에 일관된 대소문자 사용 강제.
    "noFallthroughCasesInSwitch": true, // 스위치 문 안에 비어 있지 않은 모든 케이스에 break, return 또는 throw가 포함되어 있는지 확인
    "module": "esnext", // 프로그램의 모듈 시스템을 설정. 최신 노드 프로젝트에는 "nodeNext"도 고려 가능.
    "moduleResolution": "node", // 모듈 해석(각 import가 어떤 모듈을 가리키는지 해석하는 과정) 전략 설정.
    "resolveJsonModule": true, // JSON을 가져오고 해당 JSON 파일의 유형의 유효성 검사 가능
    "isolatedModules": true, // 트랜스파일러(ex.바벨)을 사용할 때, 단일 파일 트랜스파일 프로세스에서 올바르게 해석할 수 없는 특정 코드를 작성하는 경우 TypeScript에서 경고하도록 지시.
    "noEmit": true, // 컴파일러 출력 파일(ex.자바스크립트 파일)을 내보내지 않음.
    "jsx": "react-jsx", // 컴파일 결과물에 적용시킬 jsx 변환 형식.

    /* CRA 초기 설정에는 없지만 알아두면 좋은 옵션들
    "sourceMap": true, // 컴파일된 자바스크립트 파일의 에러를 타입스크립트 파일에 표시해줌. 디버깅에 도움.
    "baseUrl": "src", //모듈 해석 기준 경로 지정. 다른 폴더의 파일 임포트 시 baseUrl 기준으로 경로 설정. 경로 간결해짐.
    "paths": {
      "api": ["api/*"] // paths 속성의 경로는 baseUrl로 시작하게 됨. 경로 간결해짐.
    },
    "noUnusedParameters": true // 함수에서 사용하지 않는 매개변수에 대한 오류 표시. */
  },
  // 루트 옵션
  "include": ["src"] // 타입스크립트 컴파일 대상 파일의 패턴을 지정하는 속성.
}
```
별도로 지정하고 싶은 옵션이 없다면, 처음 CRA 생성 시 만들어진 tsconfig.json의 옵션을 그대로 따르면 된다. 하지만 개인적으로 바꾸고 싶은 옵션이나, 팀원 간 상의를 통해 수정하고 싶은 옵션이 있다면 위 예시를 참고하여 tsconfig.json 파일에서 옵션을 수정하면 된다. 위 예시에서는 실전에서 쓸만 할 것이라 판단되는 옵션만 작성했다. 다른 옵션을 알고 싶다면 타입스크립트 [공식 문서](https://www.typescriptlang.org/tsconfig)를 확인하기 바란다.



### 2.1 질문: strict 속성을 true 설정하고 하위 속성 중 하나를 false로 하면 적용될까?

tsconfig.json 파일을 보면, 컴파일러 옵션에 strict 속성이 있다. strict 속성을 true로 설정하면 아래의 속성들도 true로 설정된다.
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true, 
    /*
    "alwaysStrict": true // use strict 모드로 파일을 컴파일하고, 컴파일한 파일 위에 'use strict' 코드를 추가.
    "noImplicitAny": true // 타입 정의가 안 된 코드에서 경고를 표시하는 옵션. any 타입으로라도 명시해야 함.
    "noImplicitThis": true // this 타입이 암묵적으로 any 타입을 가리키면 에러를 표시.
    "strictBindCallApply": true // 자바스크립트의 call(), bind(), apply() API를 사용할 때 인자 타입이 적절한지 검사하는 옵션.
    "strictFunctionTypes": true // 함수의 파라미터 타입을 엄격하게 검사하는 옵션.
    "strictNullChecks": true // null과 undefined 값이 모두 타입으로 취급되도록 타입 검사 수준을 높이는 옵션.
    "strictPropertyInitialization": true // 클래스 안에서 속성 타입이 정의되고 생성자에서 초기화까지 되어 있는지 검사하는 옵션.
    "useUnknownInCatchVariables": true // try catch 구문에서 catch err 파라미터 타입을 unknown으로 변환해주는 옵션.
    */
  },
}

```
stirct 속성은 true로 설정하되, noImplicitAny 속성만 false로 설정하는 것이 가능할까?

먼저, stirct 속성만 true 설정해보자.
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
  },
}

```
그러면 아래 코드는 에러가 발생한다.

```ts
const fn = arg => arg;
// Error: Parameter 'arg' implicitly has an 'any' type.
```

이번에는, stirct 속성은 true, noImplicitAny 속성은 false로 해보자.

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true, 
    "noImplicitAny": false,
  },
}
```
그러면 에러 또는 경고가 발생하지 않는다.
```ts
const fn = arg => arg;
// 에러나 경고는 발생하지 않지만 메시지를 확인할 수 있음
// Parameter 'arg' implicitly has an 'any' type, but a better type may be inferred from usage.
```
이렇게 strict 속성의 하위 속성 중에서 원하지 않는 옵션은 개별적으로 끌 수 있다. 

## 3. 타입스크립트 프로젝트에서 외부 라이브러리 사용하기

타입스크립트 프로젝트에서 외부 라이브러리를 사용하려면 해당 라이브러리의 **타입 선언 파일**이 필요하다. 타입 선언 파일이란 **d.ts** 확장자를 갖는 타입스크립트 파일을 말한다. 프로젝트에서 자주 사용되는 공통 타입이나 프로젝트 전반에 걸쳐 사용하는 라이브러리 타입을 정의하는 파일이다.

외부 라이브러리의 타입 선언 파일에 대해서는 다음과 같은 3가지 경우가 있을 수 있다.

1. 타입 선언 파일이 **DefinitelyTyped** 깃헙 저장소에 있는 경우.

2. 타입 선언 파일이 **라이브러리에 내장**되어 있는 경우.

3. 타입 선언 파일을 **직접 작성**해야 하는 경우.

### 3.1 DefinitelyTyped

[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) 깃헙 저장소는, 각종 자바스크립트 라이브러리의 타입 정의 파일을 보관하는 곳이다. 내가 사용하는 라이브러리의 이름을 검색하면 타입 정의 파일 찾을 수 있다.

DefinitelyTyped에 내가 원하는 라이브러리의 타입 정의 파일이 있다면, 아래의 명령어를 입력해서 쉽게 설치할 수 있다.

```
npm install --save-dev @types/라이브러리이름

# ex. npm install --save-dev @types/node
# ex. npm install --save-dev @types/jquery
```
내가 사용할 라이브러리의 타입 정의 파일이 DefinitelyTyped에 존재하는 지 알 수 있는 더 쉬운 방법은 [npm](https://www.npmjs.com/)에 라이브러리를 검색해보는 것이다. 만약 DefinitelyTyped에 존재한다면 라이브러리 이름 옆에 **DT**라는 문자가 표시되어 있다. 

### 3.2 라이브러리에 내장

라이브러리에 따라서 타입 정의 파일이 내장되어 있는 경우도 있다. [npm](https://www.npmjs.com/)에 검색했을 때, 라이브러리 이름 옆에 **TS**라는 문자가 표시되어 있다면 타입 정의 파일이 내장되어 있다는 의미이다.

### 3.3 직접 작성

DefinitelyTyped에도 없고, 라이브러리에 내장되어 있지 않다면 타입 정의 파일을 직접 입력해야 한다. 만약 규모가 큰 라이브러리를 사용한다면, 타입 정의 파일 전체를 작성하기는 어렵다. 그럴 때는 해당 라이브러리에서 사용할 API나 코드 먼저 타입을 작성하는 방식으로 진행하면 된다. 루트 디렉터리에 `global.d.ts` 파일을 만들어 필요한 부분만 타입을 정의하면 된다. 물론 프로젝트에 따라서 파일명과 위치는 달라질 수 있다.

## 마치며

이번 글에서는 CRA 프로젝트를 타입스크립트 기반으로 생성하고, tsconfig.json 파일을 통해 컴파일러 옵션을 설정하는 방법을 중점적으로 다뤘다. 다음 글에서는 ESLint와 Prettier, Husky 설정하는 방법을 다뤄보겠다.