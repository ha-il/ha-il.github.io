---
title: "[타입스크립트] 제네릭"
date: "2023-09-21T23:08:00.000Z"
description: "타입스크립트의 제네릭을 다룹니다."
category: "typescript"
featuredImage: "../../../../src/images/ts-256x256.png"
mobileImage: "../../../../src/images/ts-512x256x2.png"
---

## 1. 제네릭

제네릭은 타입을 미리 정의하지 않고 사용하는 시점에 원하는 타입을 정의해서 쓸 수 있는 문법이다. 쉽게 말하면 '타입을 넘기고 그 타입을 그대로 받는다'는 것이다. 제네릭은 `<>`로 표기하며 기본 문법은 아래와 같다.

```ts
function foo<T>(x: T):T {
  return x
}

// 제네릭으로 원시 타입을 넘겨서 사용할 수 있다.
foo<string>('Hello, world!')

// 제네릭으로 넘겨준 원시 타입에 위배되는 타입의 값을 넘겨주면 에러가 발생한다.
foo<string>(123) // 에러 발생

// 타입 추론 덕분에 제네릭으로 타입을 넘겨주지 않아도 함수를 사용할 수 있다.
foo(123)
```

### 1.1 제네릭을 사용하는 이유

타입 코드의 중복을 최소화할 수 있기 때문이다. 위에서 예시로 들었던 `foo`함수는 받은 인자를 반환하는 단순한 함수기 때문에 어떤 타입이든 받을 수 있다. 하지만 타입스크립트를 사용하기 때문에 받는 타입에 따라서 다른 함수를 작성해줘야 한다. 그럴 경우 코드의 중복이 발생한다. 제네릭을 사용하면 함수를 사용 할 때마다 타입을 넘겨주면 되기 때문에 타입 정의 코드의 중복을 최소화할 수 있다.

any타입을 써도 중복은 해결할 수 있지만, 에러의 사전 방지나 코드 에디터의 자동완성 기능을 사용할 수 없기 때문에 추천하지 않는다. 

### 1.2 인터페이스와 제네릭

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

### 1.3 타입 별칭과 제네릭

주로 객체 타입을 정의하는 인터페이스와 달리 타입 별칭은 다양한 종류의 타입을 정의할 수 있으므로, 타입 별칭을 사용하면 다른 종류의 제네릭 헬퍼 타입을 정의할 수 있다.

```ts
type OrNull<Type> = Type | null;
 
type OneOrMany<Type> = Type | Type[];
 
type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;
 
type OneOrManyOrNullStrings = OneOrManyOrNull<string>;
```

### 1.4 제네릭의 타입 제약

제네릭은 타입을 미리 정의하지 않고 호출하는 시점에 타입을 정의하기 때문에 타입을 별도로 제약하지 않을 경우 아무 타입이나 받을 수 있게 된다. 아무 타입이 아니라 몇 개의 타입만 제네릭으로 받을 수 있게 제약을 건다면 제네릭을 더욱 안전하게 사용할 수 있을 것이다.

- **extends를 사용한 타입 제약**

```ts
// 원시 타입으로 제약
function foo<T extends string>(x: T): T {
  return x
}

foo<string>('Hello, world!') // 문제 없음
foo<number>('Hello, world!') // 오류 발생
```
위의 예시는 원시 타입으로 제약을 했지만, extends를 사용하면 타입의 속성으로도 제약을 할 수 있다. 아래 예시를 보자.

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

### 1.5 좋은 제네릭 함수를 작성하는 방법

- **가능하다면 타입 매개변수를 제약하기보다는 타입 매개변수 그 자체를 사용하라**

```ts
function firstElement1<Type>(arr: Type[]) {
  return arr[0];
}
 
function firstElement2<Type extends any[]>(arr: Type) {
  return arr[0];
}
 
// a: number (good)
const a = firstElement1([1, 2, 3]);
// b: any (bad)
const b = firstElement2([1, 2, 3]);
```
`firstElement2`의 반환 타입이 any로 추론된 이유가 뭘까? **제네릭은 타입을 미리 정의하지 않고 호출하는 시점에 타입을 정의한다**. `firstElement2`라는 함수의 타입 매개변수는 `any[]`타입으로 제약된 상태로 정의되어 있고, 이는 해당 함수를 호출하는 시점에 정의된다. 따라서, `firstElement2`의 반환 값 또한 any로 추론되는 것이다.

이렇게 타입 제약을 할 경우 예상하지 못한 결과가 나올 수도 있기 때문에, 가능하다면 타입 매개변수를 제약하지말고 그대로 사용하는 것이 좋다.


- **가능하다면 타입 매개변수를 최소로 사용하라**

```ts
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func);
}
 
function filter2<Type, Func extends (arg: Type) => boolean>(
  arr: Type[],
  func: Func
): Type[] {
  return arr.filter(func);
}
```
제네릭 함수는 입력 값과 출력 값의 타입에 관련이 있는 경우 의미가 있다. `filter2`에서 `Func` 타입 매개변수는 입력 값과 출력 값의 타입에 큰 관련이 없다. 함수를 더 이해하기 어렵게 만들 뿐이다. 

(🤔: 공식문서에서 이 예시를 처음 봤을 때는 '굳이 타입 매개변수를 늘려서 작성하는 사람이 있을까?' 싶긴 했다. 하지만 생각해보니 가독성 측면에서 오히려 도움이 된다고 생각해서 위와 같이 추가적으로 타입 매개변수를 작성하는 경우가 있을 것도 같았다. 나의 경우 팀원들이 쉽게 이해할 수 있도록 컴포넌트 이름을 최대한 자세하게 지으려고 노력했었는데, 결과적으로는 컴포넌트의 구조의 깊이만 깊어지고 이름도 쓸데없이 길어져서 오히려 가독성이 떨어진 경우가 있었다. 아마 타입스크립트의 이 예시도 이해를 돕기 위해 작성한 코드가 오히려 가독성을 떨어뜨리는 예시가 아닐까 싶다. 실전에서 이런 경우가 발생하면 추후에 예시를 추가하겠다.)

- **만약 타입 매개변수가 한 곳에서만 사용된다면, 정말로 필요한 건지 다시 생각해 봐야 한다.**

```ts
// Str은 함수의 파라미터 타입에만 사용되고 있다.
function greet<Str extends string>(s: Str) {
  console.log("Hello, " + s);
}
 
greet("world");
```
```ts
// 이렇게 쓰는 편이 더 좋지 않을까?
function greet(s: string) {
  console.log("Hello, " + s);
}
```

타입 매개변수는 여러 값의 타입을 연관시키는 용도로 사용한다. 만약 타입 매개변수가 한 번만 사용되었다면, 어떤 것도 연관시키지 않고 있는 것입니다. 그럴 땐 아예 사용하지 않는 편이 더 좋을 수 있다.