---
title: "타입스크립트의 기초"
date: "2023-09-21T23:06:00.000Z"
description: "타입스크립트의 기초 문법을 정리했습니다."
category: "typescript"
featuredImage: "../../../../src/images/ts-256x256.png"
mobileImage: "../../../../src/images/ts-512x256x2.png"
---

## 1. 타입스크립트를 배우면 좋은 이유

1. 에러를 사전에 방지해준다.

아래 예시처럼 함수 인자의 타입을 미리 정해주면 에러를 방지할 수 있다.

```ts
function sum(a: number, b: number) {
  return a + b;
}
```

함수를 호출할 때 인자의 타입이 맞지 않으면 개발 툴에서 미리 경고해준다.

2. 코드 가이드 및 자동 완성.

VSCode를 사용할 경우 타입스크립트의 타입추론으로 인한 자동 완성 기능을 활용할 수 있다. 따라서 빠르고 정확하게 코드를 작성할 수 있어서 개발 생산성을 향상시킬 수 있다.

## 2. 변수와 함수의 타입 정의

변수에 타입을 정의하는 기본적인 형태는 아래와 같다.

```ts
const 변수명: 타입 = 값;
```

`타입` 부분에 사용할 수 있는 기본 타입과 예시는 아래와 같다.

```ts
// string, number, boolean
const myName: string = 'hail';
const myNumber: number = 57;
const isTrue: boolean = true;

// Array
const myTeam1: string[] = ['정현수', '원성준', '고영우'];
const myTeam2: Array<string> = ['황영묵', '최수현', '윤준호', '류현인'];

// 튜플(tuple): 배열 길이가 고정되고 각 요소 타입이 정의된 배열
const bestPlayer: [number, string] = [57, '정현수'];

// null, undefined
const empty: null = null;
let nothing: undefined;
```

함수에 타입을 정의하는 기본적인 형태는 아래와 같다.

```ts
function 함수명(파라미터명: 파라미터타입): 반환값타입 {
  return;
}
```

예시는 아래와 같다.

```ts
// 함수
function sayFighting(name: string): string {
  return `${name}, 화이팅!`;
}
// 옵셔널 파라미터
function introducePlayer(name: string, team?: string): string {
  return `${team} ${name} 선수`;
}
```

## 3. 인터페이스

타입스크립트에서 인터페이스(interface)는 객체 타입을 정의할 때 사용하는 문법이다.

인터페이스로 타입을 정의할 수 있는 부분은 아래와 같다.

- 객체의 속성과 속성 타입
- 함수의 파라미터와 반환값 타입
- 함수의 스펙(파라미터 개수와 반환값 여부 등)
- 배열과 객체를 접근하는 방식
- 클래스

### 3.1 인터페이스를 이용한 객체 타입 정의

```ts
interface Player {
  id: number;
  name: string;
  // 속성에 ?를 붙이면 옵션 속성을 사용할 수 있다.
  age?: number;
}

const hail: Player = { id: 1, name: '하일' };
```

### 3.2 인터페이스로 함수 파라미터 타입 정의

```ts
function printName(player: Player) {
  console.log(player.name);
}

printName(hail); // '하일'
```

### 3.3 인터페이스로 함수 반환 타입 정의

```ts
function getPlayer(player: Player): Player {
  return player;
}
```

### 3.4 인터페이스 상속

```ts
interface BaseballPlayer extends Player {
  position: string;
}

const hyeonsu: BaseballPlayer = {
  id: 57,
  name: '정현수',
  position: '투수',
};
```

### 3.5 인터페이스로 배열 인덱싱 타입 정의

- 인덱싱: 객체의 특정 속성에 접근하거나 배열의 인덱스로 특정 요소에 접근햐는 동작을 말한다.

```ts
interface StringArray {
  [index: number]: string;
}

const myTeam: StringArray = ['정현수', '원성준', '고영우'];
```

이렇게 배열을 인덱싱 타입으로 정의할 수 있지만, 위의 경우 string[] 형식으로 정의하는 것이 더 편하다.

### 3.6 인터페이스로 객체 인덱싱 타입 정의

```ts
interface TeamMember {
  [position: string]: number;
}

const mosters: TeamMember = {
  pitcher: 8,
  catcher: 2,
  infielder: 7,
  outfielder: 4,
};

const pitcherNumber = mosters.pitcher;
```

위 예시의 인터페이스 정의처럼 정확한 속성 이름을 명시하지 않고 속성 이름의 타입과 속성 값의 타입을 정의하는 문법을 인덱스 시그니처(index signature)라고 한다.

인덱스 시그니처가 적용되어 있는 경우에는 코드 자동 완성 기능을 사용할 수 없다. 따라서 객체의 속성 이름과 개수가 구체적으로 정의되어 있다면 인터페이스에서 속성 이름과 속성 값의 타입을 명시하는 것이 좋다.

아래와 같이 특정 속성 타입과 인덱스 시그니처를 섞어서 정의할 수도 있다.

```ts
interface someObj {
  [property: string]: string;
  id: string;
  created_at: string;
}
```

### 3.7 인터페이스의 선언 병합

선언 병합이란, 동일한 이름으로 인터페이스를 여러 번 선언했을 때 해당 인터페이스의 타입 내용을 합치는 것을 선언 병합이라고 한다.

```ts
interface MyFavorite {
  first: string;
  second: string;
}

interface MyFavorite {
  third: string;
}

const favoritePlayer: MyFavorite = {
  first: '정현수',
  second: '원성준',
  third: '고영우',
};
```
(🤔: 개인적인 생각으로는, 선언 병합 방식으로 인터페이스를 사용하면 추후 유지보수할 때 혼란이 생길 것 같다. 선언 병합에 대한 베스트 프렉티스를 발견한다면 추후에 추가하겠다.)

## 4. 연산자를 사용한 타입 정의

### 4.1 유니언 타입

유니언 타입은 'A 또는 B'라는 의미를 가진 타입으로 `|` 연산자를 사용한다. 여러 개의 타입 중 1개의 타입을 사용하겠다고 선언하는 타입이다.

```ts
interface Player {
  id: number;
  name: string;
}

interface Staff {
  id: string;
  role: string;
}

function printPersonInfo(pserson: Player | Staff) {
  console.log(pserson.id);
}

printPersonInfo({ id: 1, name: '하일' }); // 1
```

유니언 타입 사용 시 주의사항이 있다. 함수의 파라미터에 유니언 타입을 선언하면 함수 안에서는 두 타입의 공통 속성과 메서드만 자동 완성된다. 함수 파라미터에 유니언 타입을 사용하면 함수에 어떤 값이 들어올지 알 수 없기 때문에 가장 안전한 방식으로 타입의 속성과 API를 자동 완성 해주기 때문이다.

```ts
function printPersonInfo(pserson: Player | Staff) {
  console.log(pserson.name); // 타입 에러
  console.log(pserson.role); // 타입 에러
  console.log(pserson.id); // 통과
}
```

### 4.2 인터섹션 타입

인터섹션 타입은 'A 그리고 B'라는 의미를 가진 타입으로 `&` 연산자를 사용한다. 타입 2개를 하나로 합쳐서 사용할 수 있는 타입이다.

```ts
interface Player {
  id: number;
}

interface User {
  name: string;
}

function printUserData(data: Player & User) {
  console.log(data);
}

printUserData({ id: 1, name: '하일' });
```

## 5. 타입 별칭

타입 별칭(type alias)는 특정 타입이나 인터페이스 등을 참조할 수 있는 타입 변수를 의미한다. 변수 처럼 타입에 의미를 담아 여러 곳에서 재사용할 수 있다. 기본적인 사용법은 아래와 같다.

```ts
// 기본 타입: 타입을 string으로 지정하는 것보다, Username이라는 이름으로 지정하면 의미 파악이 더 쉽다.
type Username = string;

// 유니언 타입
type ID = number | string;

// 객체 타입: 위에서 지정한 타입 변수를 사용해서 반복되는 타입 지정을 줄였다.
type User = {
  name: Username;
  id: ID;
};

interface UserI {
  name: Username;
  id: ID;
}

const hail: User = { id: 1, name: '하일' };
```
### 5.1 타입 별칭과 인터페이스의 차이

- **코드 에디터에서 표기 방식 차이**

코드 에디터에서 변수에 연결된 타입 별칭 위에 마우스 커서를 올리면 아래와 같이 타입의 구체적인 모양을 볼 수 있다.

```ts
type TUser = {
  name: string;
  id: number;
};

const typeUser: TUser = { name: '타입 유저', id: 1 };

// TUser 위에 커서를 올리면 아래 내용을 담은 작은 창이 뜬다.
/* 
type TUser = {
  name: string;
  id: number;
} 
*/
```
반면, 변수에 연결된 인터페이스 위에 마우스 커서를 올리면 아래와 같이 인터페이스의 이름만 뜬다.
```ts
interface IUser {
  name: string;
  id: number;
}

const interUser: IUser = { name: '인터페이스 유저', id: 2 };
// IUser 위에 커서를 올리면 아래 내용을 담은 작은 창이 뜬다.
// interface IUser
```

- **사용할 수 있는 타입의 차이**

타입 별칭은 기본 타입, 유니언 타입, 제네릭, 유틸리티 타입 등 다양한 타입에 사용할 수 있다.

인터페이스는 주로 객체의 타입을 정의하는데 사용한다.

- **타입 확장 관점에서 차이**
타입 확장은 이미 정의되어 있는 타입들을 조합해서 더 큰 의미의 타입을 생성하는 것을 말한다. 인터페이스 섹션에서 살펴봤듯 

인터페이스는 상속이라는 개념으로 타입을 확장할 수 있다.

타입 별칭은 인터섹션 타입으로 객체 타입을 2개 합쳐서 타입을 확장한다. 아래 예시를 확인해보자.

```ts
type User = {
  id: number;
  name: string;
};

type Player = {
  team: string;
};

type BaseballPlayer = User & Player;

const hail: BaseballPlayer = {
  id: 1,
  name: '하일',
  team: '최강 몬스터즈',
};
```
### 5.2 타입 별칭과 인터페이스는 언제 쓰는 것이 좋을까?

타입 별칭으로만 정의할 수 있는 타입에는 타입 별칭을 사용한다. 타입 별칭으로만 정의할 수 있는 타입은 아래와 같다.

- 기본 타입
- 인터섹션 타입, 유니언 타입
- 유틸리티 타입, 맵드 타입

백엔드와 인터페이스를 정의할 때는 인터페이스를 사용한다. 서비스의 요구 사항이 변경되어 인터페이스를 확장시켜야 하는 경우가 있다. 타입의 확장 측면에서는 상속이나 선언 병합 등을 활용해 유연하게 확장할 수 있는 인터페이스가 더 적합하다.

## 6. 이넘(enum)
이넘은 특정 값의 집합을 의미하는 데이터 타입이다. 상수 집합이라고도 표현한다. 상수는 변하지 않는 고정 값을 의미한다. 자바스크립트에서는 const를 사용하여 상수를 표현한다. 상수는 이 값이 어떤 의미를 갖는지 알려 줌으로써 가독성을 높이는 장점이 있다.

여러개의 상수를 하나의 단위로 묶으면 이넘이 된다. 비슷한 성격이나 같은 범주에 있는 상수를 하나로 묶어 더 큰 단위의 상수로 만드는 것이 이넘의 역할이다. enum 문법은 아래와 같이 사용한다.
```ts
enum Coffee {
  Americano,
  Latte,
  Cappuccino
}

const myFavorite = Coffee.Americano
console.log(myFavorite); // 0
const yourFavorite = Coffee[0]
console.log(yourFavorite); // Americano
```


## 6.1 숫자형 이넘
이넘에 선언된 속성은 기본적으로 숫자 값을 가진다. 그래서 위에서 Coffee.Americano를 콘솔에 찍었을 때 0이라는 값이 출력되는 것이다. 첫 번째 속성에는 0이 할당 되고, 그 다음부터는 순서대로 1씩 증가한 값이 할당된다. 

`Coffee[0]`를 콘솔에 찍어보면 'Americano'라는 결과가 나오는데, 값으로 속성을 찾고 있는 상황이다. 이는 타입스크립트의 내부 규칙 때문에 그렇다. enum을 자바스크립트로 컴파일하면 아래와 같은 결과가 나온다.

```js
var Coffee;
(function (Coffee) {
    Coffee[Coffee["Americano"] = 0] = "Americano";
    Coffee[Coffee["Latte"] = 1] = "Latte";
    Coffee[Coffee["Cappuccino"] = 2] = "Cappuccino";
})(Coffee || (Coffee = {}));
```
위와 같이 속성과 값이 거꾸로 연결괴어 할당되는 것을 리버스 매핑(reverse mapping)이라고 한다.

속성의 초깃 값은 변경이 가능하다. 첫 번째 속성의 시작 값을 변경하더라도 순서대로 선언된 이넘 속성의 값은 1씩 증가한다.
```ts
enum Coffee {
  Americano = 11,
  Latte,
  Cappuccino,
}

console.log(Coffee.Americano); // 11
console.log(Coffee.Latte); // 12
console.log(Coffee.Cappuccino); // 13
console.log(Coffee[13]); // Cappuccino
```

실제로 숫자형 이넘을 작성할 때는 명시적으로 값을 설정하는 것이 값을 더 빠르게 파악할 수 있어서 좋다.

## 6.2 문자형 이넘

이넘의 속성 값에 문자열을 연결한 이넘을 의미한다. 모든 속성 값을 지정해줘야 하고, 속성 순서대로 값이 증가하는 규칙도 없다.

```ts
enum Coffee {
  Americano = 'Americano',
  Latte = 'Latte',
  Cappuccino = 'Cappuccino',
}

console.log(Coffee.Americano); // "Americano"
console.log(Coffee.Latte); // "Latte"
console.log(Coffee.Cappuccino); // "Cappuccino"
```


이넘 속성 이름과 값을 동일한 문자열로 관리하는 것이 일반적인 코딩 컨벤션이라고 한다. 실전에서는 숫자형 이넘보다 문자형 이넘 방식을 더 많이 사용한다고 한다. 

## 6.3 const 이넘
const 이란 이넘을 선언할 때 앞에 const를 붙인 이넘을 의미한다. const를 이넘 앞에 붙이면 컴파일 결과물의 코드양이 줄어든다.

먼저, const를 사용하지 않은 일반적인 문자형 이넘의 컴파일 결과를 보자.

```ts
// 문자형 이넘
enum Coffee {
  Americano = 'Americano',
  Latte = 'Latte',
  Cappuccino = 'Cappuccino',
}
```
```js
// 믄자형 이넘 컴파일 결과
"use strict";
var Coffee;
(function (Coffee) {
    Coffee["Americano"] = "Americano";
    Coffee["Latte"] = "Latte";
    Coffee["Cappuccino"] = "Cappuccino";
})(Coffee || (Coffee = {}));
```
다음으로, const 이넘의 컴파일 결과를 보자.
```ts
const enum Coffee {
  Americano = 'Americano',
  Latte = 'Latte',
  Cappuccino = 'Cappuccino'
}
```
```js
// const 이넘 컴파일 결과
"use strict";
```

이렇게 코드 양을 줄여준다는 장점이 있지만, const 이넘을 사용할 경우 항상 속성에 고정 값만 넣어 주어야 한다는 제약이 있다. 

## 7. 클래스

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
### 7.1 클래스 접근 제어자

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
## 8. 제네릭

제네릭은 타입을 미리 정의하지 않고 사용하는 시점에 원하는 타입을 정의해서 쓸 수 있는 문법이다. 쉽게 말하면 '타입을 넘기고 그 타입을 그대로 받는다'는 것이다. 제네릭은 `<>`로 표기하며 기본 문법은 아래와 같다.

```ts
function foo<T>(x: T):T {
  return x
}

// 제네릭으로 기본 타입을 넘겨서 사용할 수 있다.
foo<string>('Hello, world!')

// 제네릭으로 넘겨준 기본 타입에 위배되는 타입의 값을 넘겨주면 에러가 발생한다.
foo<string>(123) // 에러 발생

// 타입 추론 덕분에 제네릭으로 타입을 넘겨주지 않아도 함수를 사용할 수 있다.
foo(123)
```

### 8.1 제네릭을 사용하는 이유

타입 코드의 중복을 최소화할 수 있기 때문이다. 위에서 예시로 들었던 `foo`함수는 받은 인자를 반환하는 단순한 함수기 때문에 어떤 타입이든 받을 수 있다. 하지만 타입스크립트를 사용하기 때문에 받는 타입에 따라서 다른 함수를 작성해줘야 한다. 그럴 경우 코드의 중복이 발생한다. 제네릭을 사용하면 함수를 사용 할 때마다 타입을 넘겨주면 되기 때문에 타입 정의 코드의 중복을 최소화할 수 있다.

any타입을 써도 중복은 해결할 수 있지만, 에러의 사전 방지나 코드 에디터의 자동완성 기능을 사용할 수 없기 때문에 추천하지 않는다. 

### 8.2 인터페이스와 제네릭

제네릭을 사용하면 인터페이스의 중복도 줄일 수 있다. 아래와 같이 인터페이스가 있는 경우를 생각해보자.
```ts
interface StringMessage {
  text: string
  isFocused: boolean
}

interface NumberMessage {
  text: number
  isFocused: boolean
}

const helloWorld: StringMessage = { text: 'Hello, world!', isFocused: true }
const oneTwoThree: NumberMessage = { text: 123, isFocused: false }
```
두 개의 인터페이스는 text 속성의 타입을 제외하고 동일한 구조를 가지고 있다. 아래 예시처럼 제네릭을 사용하면 중복을 해소할 수 있다.

```ts
interface Message<T> {
  text: T
  isFocused: boolean
}

const helloWorld: Message<string> = { text: 'Hello, world!', isFocused: true }
const oneTwoThree: Message<number> = { text: 123, isFocused: false }
```

### 8.3 제네릭의 타입 제약

제네릭은 타입을 미리 정의하지 않고 호출하는 시점에 타입을 정의하기 때문에 타입을 별도로 제약하지 않을 경우 아무 타입이나 받을 수 있게 된다. 아무 타입이 아니라 몇 개의 타입만 제네릭으로 받을 수 있게 제약을 건다면 제네릭을 더욱 안전하게 사용할 수 있을 것이다.

- **extends를 사용한 타입 제약**

```ts
// 기본 타입으로 제약
function foo<T extends string>(x: T): T {
  return x
}

foo<string>('Hello, world!') // 문제 없음
foo<number>('Hello, world!') // 오류 발생
```
위의 예시는 기본 타입으로 제약을 했지만, extends를 사용하면 타입의 속성으로도 제약을 할 수 있다. 아래 예시를 보자.

```ts
// 타입의 속성으로 제약
function foo<T extends { length: number }>(x: T) {
  return x.length
}

foo('Hello, world!') // string은 length 속성을 가진다.
foo([1, 2, 3]) // Array는 length 속성을 가진다.
foo({ length: 1004 }) // length 속성을 가진 객체이다.
foo(123) // 에러 발생: number는 length 속성을 가지지 않는다. 
```

- **keyof**

`keyof`는 특정 타입의 키 값을 추출해서 문자열 유니언 타입으로 변환해준다.

```ts
type Player = keyof { id: number, name: string, loggedIn: boolean };
// type Player = "id" | "name" | "loggedIn" 와 동일하다.
```

keyof는 extends와 함께 사용할 수도 있다.

```ts
function foo<T extends keyof { id: number, name: string }>(x: T): T {
  return x
}

// keyof { id: number, name: string }는 
// "id" | "name"과 같다.

foo('Hello, world!') // type "id" | "name"
foo(123) // type "id" | "name"
foo('id')
foo('name')
```
`<T extends keyof { id: number, name: string }>`를 보면 number 타입인 id와 string 타입인 name을 받는 것이라 생각할 수 있겠지만, keyof는 **키 값**을 추출해서 **문자열 유니언 타입**으로 변환하는 것이기 때문에 속성의 타입과는 관련이 없다. 

`keyof { id: number, name: string }`는 `"id" | "name"`를 의미하고, 여기에 `extends`를 사용하면 'id' 또는 'name'이라는 문자열만 허용한다는 것이다. 그래서 'Hello, world!'와 123은 허용하지 않는 것이다.