---
title: "[타입스크립트] 클래스와 타입 모듈"
date: "1999-01-01T00:00:00.000Z"
description: "타입스크립트의 클래스와 타입 모듈을 다룹니다."
category: "typescript"
featuredImage: "../../../../src/images/ts-256x256.png"
mobileImage: "../../../../src/images/ts-512x256x2.png"
---

## 1. 클래스

타입스크립트로 클래스를 작성할 때는 생성자 메서드에서 사용될 클래스 속성들을 미리 정의해 주어야 한다.

```ts
class HttpClient {
  // 자바스크립트에서는 constructor에서 사용될 속성을 미리 정의해주지 않아도 에러가 발생하지 않았다.
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  fetch(url: string = this.baseUrl): void {
    window.fetch(url);
  }
}

const httpClient = new HttpClient('https://ha-il.github.io/');
```
### 1.1 클래스 접근 제어자

위 예시에서 httpClient의 baseUrl 속성은 마음대로 접근하고 수정할 수 있는 상황이다.
```ts
console.log(httpClient.baseUrl); // https://ha-il.github.io/

httpClient.baseUrl = 'https://이상한사이트.com/';

console.log(httpClient.baseUrl); // https://이상한사이트.com/
```

클래스의 속성에 마음대로 접근할 수 있는 상황은 에러를 일으킬 확률이 높다. 클래스 접근 제어자를 사용하면 이 문제를 해결할 수 있다.

- **public**
클래스 안에 선언된 속성과 메서드를 어디서든 접근할 수 있게 한다. 클래스 안에서 속성과 메서드를 선언할 때 접근 제어자를 별도로 붙이지 않았다면 기본적으로 public으로 간주된다.

- **private**
클래스 코드 외부에서 클래스의 속성과 메서드에 접근할 수 없다. 클래스의 속성과 메서드는 클래스 내부에서만 접근할 수 있다. 외부에서 접근을 시도하면 에러가 발생한다. 상속받은 클래스라고 해도 접근할 수 없다.

```ts
class HttpClient {
  // private로 선언
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  // private로 정의
  private fetch(url: string = this.baseUrl): void {
    window.fetch(url);
  }
}

const httpClient = new HttpClient('https://ha-il.github.io/');


console.log(httpClient.baseUrl); // 에러 발생
// Property 'baseUrl' is private and only accessible within class 'HttpClient'.

httpClient.fetch() // 에러 발생
// Property 'fetch' is private and only accessible within class 'HttpClient'.
```
- **protected**
클래스 코드 외부에서 클래스의 속성과 메서드에 접근할 수 없다. 다만, 상속받은 클래스에서는 사용할 수 있다.

```ts
class HttpClient {

  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public fetch(url: string = this.baseUrl): void {
    window.fetch(url);
  }
}

class SonHttpClient extends HttpClient {

  constructor(baseUrl: string) {
    super(baseUrl)
    // fetch가 HttpClient에서 protected로 정의되어 있어서 접근이 가능하다.
    // private로 정의되어 있었다면 접근할 수 없기 때문에 에러가 발생한다. 
    this.fetch(baseUrl)
  }
}

const httpClient = new SonHttpClient('https://ha-il.github.io/');


httpClient.fetch() // 에러 발생: 여전히 외부에서 접근은 불가능하다.
// Property 'fetch' is protected and only accessible within class 'HttpClient' and its subclasses.
```

## 2. 타입 모듈

타입스크립트 프로젝트 내에서 자바스크립트 코드나 타입 코드를 작성하면 기본적으로 전역 유효 범위를 갖는다. 타입스크립트 입장에서는 어느 파일에서 변수나 타입을 선언하든 전역 변수로 간주하기 때문에 같은 프로젝트 내에서는 이미 선언된 이름을 사용할 수 없다. 아래 예시를 확인해보자.

```ts
// ./src/app.ts
type User = {
  id: number
  name: string
} // 에러 발생: Duplicate identifier 'User'.
```
```ts
// ./src/util.ts
type User = {
  id: number
  name: string
} // 에러 발생: Duplicate identifier 'User'.
```

다른 파일에 선언된 타입들이 타입스크립트의 모듈 관점에서 전역으로 등록되어 있기 때문에 같은 이름으로 재선언이 불가능한 코드를 작성하면 에러가 발생한다. 

### 2.1 타입스크립트 모듈화 문법: import type

다른 파일에서 타입을 가져올 때도 함수나 객체를 가져오는 것처럼 import 구문을 사용할 수 있다. 하지만 타입 코드의 경우 `type`이라는 키워드를 추가로 사용하여 해당 코드가 타입 코드라는 것을 명시할 수 있다. 

```ts
// util.ts
interface User {
  id: number;
  name: string;
}

export default User;
```
```ts
// app.ts
import type User from "./util";
```
타입을 함수나 객체 등과 함께 가져와야 하는 경우에도 아래 예시처럼 type 키워드를 사용할 수 있다.

```ts
// util.ts
interface User {
  id: number;
  name: string;
}

function sayHello() {
  console.log('Hello!');
}

export { type User, sayHello };
```
```ts
// app.ts
import { type User, sayHello } from './util';
```

### 2.2 타입스크립트 모듈화 전략: Barrel

여러 개의 파일에서 모듈을 정의하고 가져올 때 아래와 같이 import 구문이 많아져 가독성이 떨어지는 상황이 벌어지기도 한다.

```ts
// ./player/pitcher.ts
interface Pitcher {
  name: string;
}

export { Pitcher };

// ./player/catcher.ts
interface Catcher {
  name: string;
}

export { Catcher };

// ./player/batter.ts
interface Batter {
  name: string;
}

export { Batter };
```
```ts
// app.ts
import { Pitcher } from './player/pitcher';
import { Catcher } from './player/catcher';
import { Batter } from './player/batter';
```
가져올 모듈의 성격이 같다면 하나의 파일에서 관리하는 것이 가독성 측면에서 좋다. 아래의 예시를 보자.

```ts
// ./player/index.ts
// index.ts 파일에서 통합하고 싶은 모듈을 각각 가져와서 다시 내보낸다.
// 모든 로직을 index.ts에 모아서 작성하는 것이 아니다.

export { Pitcher } from './pitcher';
export { Catcher } from './catcher';
export { Batter } from './batter';
```
```ts
// app.ts
// import 구문을 한 줄로 줄여서 가독성을 높였다.
import { Pitcher, Catcher, Batter } from './player';
```
이렇게 여러 개의 파일에서 가져온 모듈을 마치 하나의 통처럼 관리하는 방식을 배럴이라 부른다.

