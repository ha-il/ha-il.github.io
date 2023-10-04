---
title: "[타입스크립트] 변수와 함수의 타입 정의"
date: "2023-09-21T23:06:00.000Z"
description: "타입스크립트의 변수와 함수 타입 정의를 다뤘습니다."
category: "typescript"
featuredImage: "../../../../src/images/ts-256x256.png"
mobileImage: "../../../../src/images/ts-512x256x2.png"
---

## 1. 타입스크립트를 배우면 좋은 이유

1. 에러를 사전에 방지해준다.

자바스크립트는 동적 타입 언어이다. 자바스크립트 런타임은 코드가 실행될 때 자신이 무엇을 해야 할지 결정하기 위해 값의 타입을 확인한다. 그리고 값의 타입에 일치하지 않는 동작을 시도할 때 타입에러가 발생한다. 예를 들면 함수가 아닌 변수를 함수처럼 호출하는 경우 말이다. 함수가 아닌 변수를 호출하는 코드를 작성할 때 에러를 발생시켜주면 런타임 에러를 방지할 수 있을 것이다.

자바스크립트 내에서는 에러가 아니지만 높은 확률로 에러를 발생시킬 수 있는 코드가 있다. 예를 들어, 객체에 존재하지 않는 속성에 접근할 때 undefined를 반환하는 경우 말이다. undefined를 반환하게 할 것이 아니라, 객체에 존재하지 않는 속성에 접근하는 코드를 작성할 때 에러를 발생시켜주면 런타임 에러를 방지할 수 있을 것이다.

이처럼 자바스크립트는 코드를 실행해야만 어떤 일이 벌어지는지 확인할 수 있다. 코드를 실행하기 전에 에러를 미리 발견할 수 있다면 좋을 것이다. 이 문제를 정적 타입 검사를 하는 타입스크립트로 해결할 수 있다. 

2. 코드 가이드 및 자동 완성.

VSCode를 사용할 경우 타입스크립트의 타입추론으로 인한 자동 완성 기능을 활용할 수 있다. 자동완성 기능의 장점은 내가 올바른 변수 또는 프로퍼티에 접근하고 있는지 빠르게 파악할 수 있다는 것이다. 따라서 빠르고 정확하게 코드를 작성할 수 있어서 개발 생산성을 향상시킬 수 있다.

## 2. 변수의 타입 정의

변수에 타입을 정의하는 기본적인 형태는 아래와 같다.

```ts
const 변수명: 타입 = 값;
```

`타입` 부분에 사용할 수 있는 원시 타입과 예시는 아래와 같다.

```ts
// string, number, boolean
const myName: string = 'hail';
const myNumber: number = 57;
const isTrue: boolean = true;

// Array
const myTeam1: string[] = ['정현수', '원성준', '고영우'];
const myTeam2: Array<string> = ['정현수', '원성준', '고영우'];

// ReadonlyArray: 변경 불가능한 배열을 정의하는 특수 타입
const readOnlyTeam1: ReadonlyArray<string> = ['정현수', '원성준', '고영우'];
const readOnlyTeam2: readonly string[] = ['정현수', '원성준', '고영우'];
readOnlyTeam1.push('누군가') // 에러 발생: Property 'push' does not exist on type 'readonly string[]'
readOnlyTeam2.push('누군가') // 에러 발생: Property 'push' does not exist on type 'readonly string[]'

// 튜플(tuple): 배열 길이가 고정되고 각 요소 타입이 정의된 배열
const bestPlayer: [number, string] = [57, '정현수'];

// 튜플: readonly로 설정 가능하다.
const bestPlayer: readonly [number, string] = [57, '정현수'];
bestPlayer[1] = '누군가' // 에러 발생: Cannot assign to '1' because it is a read-only property.

// 튜플: 옵셔널 속성 `?`을 사용할 수 있으나 튜플 요소 끝에만 올 수 있다.
// 옵셔널 속성은 length 속성 타입에 영향을 준다.
const bestPlayer: [number, string, string?] = [57, '정현수'];
bestPlayer.length // (property) length: 2 | 3

// 튜플: 나머지 요소(rest elements) `...`도 사용할 수 있다.
const arsenal = ['커브', '패스트볼', '슬라이더', '체인지업']
const bestPlayer: [number, string, ...string[]] = [57, '정현수', ...arsenal];
bestPlayer.length // (property) length: number

// null, undefined
const empty: null = null;
let nothing: undefined;

// any: 특정 값으로 인하여 타입 검사 오류가 발생하는 것을 원하지 않을 때 사용한다.
let obj: any = { x: 0 };
// 아래의 코드들은 전부 에러 없이 실행된다.
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
```

위와 같이 변수의 타입정의 방법이 존재하지만, 변수의 경우 타입 표기가 따로 필요하지 않는 경우가 많다. 타입스크립트는 가능하다면 자동으로 코드 내의 있는 타입들을 추론하고자 시도한다. 변수의 타입은 해당 변수의 초깃값의 타입을 바탕으로 추론된다.

## 3. 함수의 타입 정의

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

타입스크립트는 `return`문을 바탕으로 반환 타입을 추론할 수 있기 때문에, 함수의 반환 타입을 명시하지 않고 생략하는 경우도 있다. 다만, 함수의 경우 문서화를 위해서 파라미터와 반환 값의 타입을 명시하기도 한다. 

### 3.1 함수 타입 표현식

함수 타입을 정의하는 또다른 방법으로는 함수 타입 표현식이 있다. 함수 타입 표현식은 화살표 함수와 문법적으로 유사하다.

```ts
// 반환 값에 대한 타입을 ':'가 아닌, '=>'로 정의했다.
type GreetFunction = (a: string) => void;
function greeter(fn: GreetFunction) {
  fn("Hello, World");
}

function printToConsole(s: string) {
  console.log(s);
}
 
greeter(printToConsole);
```

### 3.2 콜백 함수의 옵셔널 파라미터

콜백에 대한 함수 타입을 작성할 때, 해당 인수 없이 호출할 의도가 없는 한, 선택적 매개변수를 사용하지 않는 것이 좋다. 아래 예시를 확인해보자.

```ts
// callback의 파라미터 index를 옵셔널 파라미터로 설정했다는 것은....
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}

// 아래의 두 호출이 동작하기를 바라는 것이다.
myForEach([1, 2, 3], (a) => console.log(a));
myForEach([1, 2, 3], (a, i) => console.log(a, i.toFixed()));
```
콜백 함수의 파라미터를 옵셔널 파라미터로 지정한 예시인데, 위 예시는 아래와 같은 문제를 발생시킨다.

```ts
// callback의 파라미터 index를 옵셔널 파라미터로 설정했다는 것은....
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    // callback에 index로 undefined가 제공될 수도 있다는 의미이다.
    callback(arr[i], i);
  }
}

myForEach([1, 2, 3], (a) => console.log(a));
// 에러 발생: 타입스크립트는 undefined가 될 수도 있는 값에 `toFixed()` 메서드를 사용하는 것을 허용하지 않는다.
myForEach([1, 2, 3], (a, i) => console.log(a, i.toFixed()));
```

### 3.3 함수 타입 정의 시 사용되는 타입

- **void**

void는 값을 반환하지 않는 함수의 반환 값을 의미한다. 함수에 return문이 없거나, 명시적으로 값을 반환하지 않을 때, 추론되는 타입이다.

자바스크립트에서는, 아무것도 반환하지 않는 함수는 암묵적으로 undefined 값을 반환하지만 타입스크립트에서 void와 undefined는 같은 것으로 간주되지 않는다.

```ts
// function noop(): void
function noop() {
  return;
}
```

- **unknown**

unknown 타입은 모든 값을 나타낸다. any 타입과 유사하지만, unknown 타입에는 어떤 값을 할당하는 것이 유효하지 않기 때문에 더 안전하다.

```ts
function f1(a: any) {
  a.b(); // OK
}
function f2(a: unknown) {
  a.b(); // 에러 발생: 'a' is of type 'unknown'.
}
```

- **never**

never 타입은 결코 관측될 수 없는 값을 의미한다. 반환 타입에서는, 해당 함수가 예외를 발생시키거나, 프로그램 실행을 종료함을 의미한다.
```ts
function fail(msg: string): never {
  throw new Error(msg);
}
```

never은 TypeScript가 유니온에 아무것도 남아있지 않다고 판단했을 때 또한 나타난다.
```ts
function fn(x: string | number) {
  if (typeof x === "string") {
    // do something
  } else if (typeof x === "number") {
    // do something else
  } else {
    x; // 'never' 타입이 됨!
  }
}
```

### 3.4 나머지 매개변수와 인수

- **나머지 매개변수(Rest Parameter)**

자바스크립트에서 '나머지 매개변수'는 함수에 전달된 인자들의 목록을 배열로 전달받는다. 따라서 파라미터의 타입 역시 배열로 정의해주면 된다. 정의해주지 않을 경우 암묵적으로 any[]로 정의된다.

```ts
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}
// 'a' gets value [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);
```

- **나머지 인수(Rest Argument)**

스프레드 문법 `...`을 이용하여 함수에게 배열의 요소를 인자로 전달할 수 있다. 다만 아래 예시와 같이 예상치 못한 에러가 발생할 수 있다.

```ts
const args = [8, 5];
// args의 타입은 `number[]`로 추론된다.
// const args: number[]

function add(a: number, b: number) {
  return a + b
}

// Error: A spread argument must either have a tuple type or be passed to a rest parameter.
// 에러 발생: 스프레드 인수는 튜플 유형이거나 나머지 매개변수로 전달되어야 합니다.
add(...args)
```
스프레드 문법을 사용해서 인자를 두 개 전달했는데도 에러가 발생한다. 이는 `args`가 `number[]` 타입으로 추론되고 있기 때문이다. 명시적으로 2개의 인자를 가지는 배열로 추론되지 않기 때문에 타입스크립트가 에러를 발생시키는 것이다.

이런 상황에서 [공식문서](https://www.typescriptlang.org/ko/docs/handbook/2/functions.html#%EB%82%98%EB%A8%B8%EC%A7%80-%EC%9D%B8%EC%88%98rest-argument)가 제시하는 해결책은 `as const`를 사용하는 것이다.

```ts
const args = [8, 5] as const
// args의 타입은 `readonly [8, 5]`로 추론된다.
// const args: readonly [8, 5]

function add(a: number, b: number) {
  return a + b
}

add(...args) 
```
