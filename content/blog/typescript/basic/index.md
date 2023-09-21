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
