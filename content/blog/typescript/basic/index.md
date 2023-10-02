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
const myTeam2: Array<string> = ['황영묵', '최수현', '윤준호', '류현인'];

// 튜플(tuple): 배열 길이가 고정되고 각 요소 타입이 정의된 배열
const bestPlayer: [number, string] = [57, '정현수'];

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


## 4. 인터페이스

타입스크립트에서 인터페이스(interface)는 객체 타입을 정의할 때 사용하는 문법이다.

인터페이스로 타입을 정의할 수 있는 부분은 아래와 같다.

- 객체의 속성과 속성 타입
- 함수의 파라미터와 반환값 타입
- 함수의 스펙(파라미터 개수와 반환값 여부 등)
- 배열과 객체를 접근하는 방식
- 클래스

### 4.1 인터페이스를 이용한 객체 타입 정의

```ts
interface Player {
  id: number;
  name: string;
  // 속성에 ?를 붙이면 옵션 속성을 사용할 수 있다.
  age?: number;
}

const hail: Player = { id: 1, name: '하일' };
```

### 4.2 인터페이스로 함수 파라미터 타입 정의

```ts
function printName(player: Player) {
  console.log(player.name);
}

printName(hail); // '하일'
```

### 4.3 인터페이스로 함수 반환 타입 정의

```ts
function getPlayer(player: Player): Player {
  return player;
}
```

### 4.4 인터페이스 상속

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

### 4.5 인터페이스로 배열 인덱싱 타입 정의

- 인덱싱: 객체의 특정 속성에 접근하거나 배열의 인덱스로 특정 요소에 접근햐는 동작을 말한다.

```ts
interface StringArray {
  [index: number]: string;
}

const myTeam: StringArray = ['정현수', '원성준', '고영우'];
```

이렇게 배열을 인덱싱 타입으로 정의할 수 있지만, 위의 경우 string[] 형식으로 정의하는 것이 더 편하다.

### 4.6 인터페이스로 객체 인덱싱 타입 정의

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

### 4.7 인터페이스의 선언 병합

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

## 5. 연산자를 사용한 타입 정의

### 5.1 유니언 타입

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

function printPersonInfo(person: Player | Staff) {
  console.log(person.id);
}

printPersonInfo({ id: 1, name: '하일' }); // 1
```

유니언 타입 사용 시 주의사항이 있다. 함수의 파라미터에 유니언 타입을 선언하면 함수 안에서는 두 타입의 공통 속성과 메서드만 자동 완성된다. 함수 파라미터에 유니언 타입을 사용하면 함수에 어떤 값이 들어올지 알 수 없기 때문에 가장 안전한 방식으로 타입의 속성과 API를 자동 완성 해주기 때문이다.

```ts
function printPersonInfo(person: Player | Staff) {
  console.log(person.name); // 타입 에러
  console.log(person.role); // 타입 에러
  console.log(person.id); // 통과
}
```

유니언 타입은 리터럴 타입과 함께 자주 사용된다.

리터럴 타입은 구체적인 문자열과 숫자 값을 타입 위치에서 지정할 수 있는 타입이다. 리터럴 타입 그 자체만으로는 활용성이 떨어지지만, 유니언 타입과 함께 사용하면 특정 종류의 값들만 허용하는 타입을 만들 수 있다. 이로 인해 유니언 타입으로 지정한 값 이외의 값을 방지하여 오류 발생 확률을 낮출 수 있다.

```ts
type Direction = "left" | "right" | "center"

function printText(s: string, alignment: Direction) {
  // ...
}

type Result = -1 | 0 | 1

function compare(a: string, b: string): Result {
  return a === b ? 0 : a > b ? 1 : -1;
}
```


### 5.2 인터섹션 타입

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

## 6. 타입 별칭

타입 별칭(type alias)는 특정 타입이나 인터페이스 등을 참조할 수 있는 타입 변수를 의미한다. 변수 처럼 타입에 의미를 담아 여러 곳에서 재사용할 수 있다. 기본적인 사용법은 아래와 같다.

```ts
// 원시 타입: 타입을 string으로 지정하는 것보다, Username이라는 이름으로 지정하면 의미 파악이 더 쉽다.
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
### 6.1 타입 별칭과 인터페이스의 차이



- **타입 확장 관점에서 차이**
이 둘의 가장 핵심적인 차이는, 타입 별칭은 새 프로퍼티 추가에 개방되어 있지 않은 반면, 인터페이스의 경우 항상 확장될 수 있다는 점이다.

타입 확장은 이미 정의되어 있는 타입들을 조합해서 더 큰 의미의 타입을 생성하는 것을 말한다. 인터페이스 섹션에서 살펴봤듯 인터페이스는 상속이라는 개념으로 타입을 확장할 수 있다.

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

타입 별칭은 원시 타입, 유니언 타입, 제네릭, 유틸리티 타입 등 다양한 타입에 사용할 수 있다.

인터페이스는 주로 객체의 타입을 정의하는데 사용한다.


### 6.2 타입 별칭과 인터페이스는 언제 쓰는 것이 좋을까?

- 타입 별칭으로만 정의할 수 있는 타입에는 타입 별칭을 사용한다. 

  타입 별칭으로만 정의할 수 있는 타입은 아래와 같다.

  - 원시 타입
  - 인터섹션 타입, 유니언 타입
  - 유틸리티 타입, 맵드 타입

- 백엔드와 인터페이스를 정의할 때는 인터페이스를 사용한다. 

서비스의 요구 사항이 변경되어 인터페이스를 확장시켜야 하는 경우가 있다. 타입의 확장 측면에서는 상속이나 선언 병합 등을 활용해 유연하게 확장할 수 있는 인터페이스가 더 적합하다.

## 7. 이넘(enum)
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


## 7.1 숫자형 이넘
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

## 7.2 문자형 이넘

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

문자형 이넘의 경우 넘겨 받을 문자열을 제한해야 할 때 사용하면 좋다. 문자열은 오타가 발생하기 쉽기 때문에 오류를 자주 발생시킨다. 문자열 이넘으로 넘겨 받을 문자열을 제한해주면 오타가 발생할 확률이 줄어든다.

## 7.3 const 이넘

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

## 8. 클래스

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
### 8.1 클래스 접근 제어자

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
## 9. 제네릭

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

### 9.1 제네릭을 사용하는 이유

타입 코드의 중복을 최소화할 수 있기 때문이다. 위에서 예시로 들었던 `foo`함수는 받은 인자를 반환하는 단순한 함수기 때문에 어떤 타입이든 받을 수 있다. 하지만 타입스크립트를 사용하기 때문에 받는 타입에 따라서 다른 함수를 작성해줘야 한다. 그럴 경우 코드의 중복이 발생한다. 제네릭을 사용하면 함수를 사용 할 때마다 타입을 넘겨주면 되기 때문에 타입 정의 코드의 중복을 최소화할 수 있다.

any타입을 써도 중복은 해결할 수 있지만, 에러의 사전 방지나 코드 에디터의 자동완성 기능을 사용할 수 없기 때문에 추천하지 않는다. 

### 9.2 인터페이스와 제네릭

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

### 9.3 제네릭의 타입 제약

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

### 9.4 좋은 제네릭 함수를 작성하는 방법

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

## 10. 타입 추론

타입 추론이란 타입스크립트가 코드를 해석하여 적절한 타입을 정의하는 동작을 의미한다. 타입 추론이 가능하기 때문에 타입 지정을 생략할 수 있는 코드에서는 생략이 가능하다. 이는 코드를 간결하게 해주어 코드의 가독성을 높이는 효과가 있다. 


### 10.1 변수의 타입 추론

변수 타입은 선언하는 시점에 할당된 값을 기반으로 추론된다. 

```ts
let stringVar = 'Hello, world!' // let stringVar: string
let numberVar = 123 // let numberVar: number
let booleanVar = true // let booleanVar: boolean

let whatAmI // let whatAmI: any
whatAmI = 123 // let whatAmI: any
```
`whatAmI`변수의 경우 선언은 했지만 값은 할당하지 않았다. 따라서 해당 변수의 타입은 any이다. 이후에 값을 할당하더라도 타입은 any이다. 타입스크립트 입장에서는 선언 후에 어떤 값이 할당될 지 알 수 없기 때문이다.

### 10.2 함수의 타입 추론

- **반환 값 타입 추론**

타입스크립트는 함수의 파라미터와 내부 동작에 따라서 함수의 반환값 타입을 추론할 수 있다.

```ts
// sum 함수의 반환 값 타입을 지정해주지 않았다. 
function sum(a: number, b: number) {
  return a + b
}

// 타입 추론으로 인해 result는 number로 추론된다.
let result = sum(2, 3) // let result: number
```

- **파라미터 타입 추론**

파라미터의 경우 타입을 지정하는 경우가 많지만, 기본값을 설정한 경우 기본값에 따라서 파라미터 타입이 추론된다. 

```ts
function sum(a: number, b = 3) { // (parameter) b: number
  return a + b
}

let result = sum(2) // let result: number
console.log(result) // 5
```
### 10.3 함수와 제네릭의 추론

제네릭 함수를 사용할 때 제네릭으로 특정 타입을 넘겨주지 않더라도, 인자로 받은 값을 기준으로 타입을 추론한다.

```ts
function firstElement<Type>(arr: Type[]): Type | undefined {
  console.log(arr[0], typeof arr[0])
  return arr[0];
}

// 제네릭으로 아무것도 넘겨주지 않았지만 함수는 동작한다.
firstElement(['a', 'b', 'c']); //  "a",  "string" 
firstElement([1, 2, 3]) // 1,  "number" 
firstElement([true, false, false]) // true,  "boolean" 

```

### 10.4 인터페이스와 제네릭의 추론

인터페이스에 제네릭을 사용할 때도, 제네릭으로 넘겨 받은 타입을 기준으로 타입을 추론할 수 있다.

```ts
interface Message<T> {
  text: T
  isFocused: boolean
}

// 제네릭으로 string 타입을 넘겼으므로 text 속성의 타입은 string으로 추론된다.
let message: Message<string> = {
  // (property) Message<string>.text: string
  // (property) Message<string>.text: string
}
```
인터페이스의 상속과 제네릭이 얽혀있는 경우에도 타입 추론이 가능하다.

```ts
interface Message<T> {
  text: T
  isFocused: boolean
}

interface ErrorMessage<K> extends Message<K> {
  status: number
}

let errorMessage: ErrorMessage<string> = {
  // (property) Message<string>.text: string
  // (property) Message<T>.isFocused: boolean
  // (property) ErrorMessage<K>.status: number
}
```
위 예시를 보면 `ErrorMessage` 인터페이스에 제네릭으로 string 타입을 넘겨줬지만, 정작 `ErrorMessage`에서는 넘겨 받은 제네릭을 사용하고 있지 않다. 하지만 넘겨 받은 제네릭을 부모 인터페이스인 `Message`로 넘겨 주고 있고, 이로 인해서 `errorMessage`의 `text` 속성은 string 타입으로 추론되고 있다.


## 11. 타입 단언(type assertion)

타입 단언은 타입스크립트의 타입 추론에 기대지 않고 개발자가 직접 타입을 명시하여 해당 타입으로 강제하는 것을 의미한다. 이미 운영되고 있는 자바스크립트 애플리케이션에 타입스크립트를 적용할 때 사용할 수 있다. 아래 예시의 `oldObj`를 기존에 존재하던 자바스크립트 객체라고 생각하면서 예시를 보자.

```ts
const oldObj = {
  id: 1,
}

oldObj.value = '업데이트' // 에러 발생: Property 'value' does not exist on type '{ id: number; }'
```
타입스크립트 입장에서 `value`라는 속성은 `oldObj`에 존재하지 않기 때문에 함부로 추가할 수 없어서 에러가 발생한다. 하지만 반드시 `value`를 추가해야 한다면 `as`라는 키워드를 사용하여 타입 단언을 하면 된다.

```ts
interface MyObject {
  id: number
  value: string
}

const oldObj = {
  id: 1,
} as MyObject

oldObj.value = '업데이트' // 에러가 발생하지 않는다.
```
또 다른 예시로는 `document.getElementById`가 있다. 코드상에서 `document.getElementById`가 사용되는 경우, 타입스크립트는 이때 HTMLElement 중에 무언가가 반환된다는 것만을 알 수 있는 반면에, 개발자는 페이지 상에서 사용되는 ID로는 언제나 HTMLCanvasElement가 반환된다는 사실을 이미 알고 있다. 이런 경우 타입 단언을 사용하면 타입을 좀 더 구체적으로 명시할 수 있다. 

```ts
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
// 꺾쇠괄호를 사용하는 것 또한 (코드가 .tsx 파일이 아닌 경우) 가능하며, 이는 동일한 의미를 가진다.
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

### 11.1 as를 사용할 수 있는 대상
```ts
// 원시값
let me = 'hail' as string

// 객체
let obj = {} as { id: number }

// 함수의 호출 결과
function justReturn(x: any) {
  return x
}
let value = justReturn(123) as number
```
### 11.2 타입 단언 사용 시 주의 사항

- **호환되지 않는 데이터 타입으로는 단언할 수 없다.**

예를 들자면, string 값을 number로 단언할 수는 없다.

```ts
let value = "1004" as number // 에러 발생
/*
Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. 
If this was intentional, convert the expression to 'unknown' first.
*/
```

- **타입 단언으로 타입 에러를 해결할 수 있지만, 실행 에러는 방지하지 못 한다.**

```ts
interface User {
  id: number
  name: string
}

function getUser() {
  return { name: '하일' }
}

// getUser가 반환하는 값이 User 인터페이스와 일치한다고 단언했다.
let hail = getUser() as User

// 하지만 단언과 달리 hail이라는 객체에 id라는 속성은 없다.
console.log(hail.id) // undefined
```
위 예시의 `getUser` 함수의 반환 값은 `User` 인터페이스와 일치하지 않는다. 하지만 `as`를 사용해서 `User` 인터페이스와 일치한다고 단언했다. 이렇게 작성하면 VSCode 상에서는 에러가 발생하지 않는다. 하지만 단언과 달리 `hail.id`는 존재하지 않기 때문에, `hail.id`를 함수의 인자로 사용할 경우 실행 에러가 발생할 확률이 높다.

타입 단언은 타입 에러 해결을 간편하게 해주지만 실행 에러를 방지하지 못 하기 때문에 남용해서는 안 된다. 타입 단언보다 타입 추론에 의존하는 것이 더 안전하다.

### 11.3 null 아님 보장 연산자(non null assertion)

'null 아님 보장 연산자'는 null 타입을 체크할 때 유용하게 쓰는 연산자다. 프론트엔드 프로그래밍을 하다보면, 함수에 특정한 값을 인자로 전달하려고 했지만 어떠한 이유로 null 값이 전달되는 경우가 종종 있다. 따라서 함수에 null 값이 들어왔을 때 대처하는 코드를 작성해야 하는 경우가 있다. 아래 예시를 보자.

```ts
interface BaseballPlayer {
    backNumber: number
    name: string
}

// null 값이 들어올 수 있는 함수라 가정하고 파라미터의 타입을 유니언 타입으로 지정했다.
function IntroducePlayer(player: BaseballPlayer | null){
  // 에러 발생: 'player' is possibly 'null'
  return `${player.backNumber}번 ${player.name} 선수를 소개합니다!`
}
```
타입스크립트 입장에서는 `player`가 null이라면 `backNumber`와 `name`이라는 속성은 존재하지 않기 때문에 에러를 발생시킨 것이다. if문을 사용해서 null을 체크하는 로직을 넣어도 되지만, 파라미터가 null이 아니라는 확신이 있다면 null 아님 보장 연산자인 `!`를 사용할 수 있다.

```ts
function IntroducePlayer(player: BaseballPlayer | null){
  // 에러가 발생하지 않는다.
  return `${player!.backNumber}번 ${player!.name} 선수를 소개합니다!`
}
```

as와 마찬가지로 `!` 연산자 또한 실행 에러까지 막아주지는 않는다. 타입스크립트에게 이 값이 null이 아니라고 단언해줄 뿐, 코드가 실행될 때 null 값이 들어온다면 실행 에러를 발생시킨다. 따라서 `!` 연산자는 반드시 해당 값이 null 또는 undefined가 아닌 경우에만 사용해야 한다.

## 12. 타입 가드(type guard)

타입 가드란 여러 개의 타입으로 지정된 값을 특정 위치에서 원하는 타입으로 구분하는 것을 의미한다. 함수 파라미터 타입을 유니언 타입으로 지정한 경우 유용하게 사용할 수 있다. 아래 예시를 보자.

```ts
function foo(x: number | string) {
  // 에러 발생: Property 'toUpperCase' does not exist on type 'string | number'.
  //          Property 'toUpperCase' does not exist on type 'number'.
  console.log(x.toUpperCase())
}
```

함수 `foo`의 파라미터 `x`는 number 또는 string 타입이다. 함수 `foo`는 `x` 에 `toUpperCase()`라는 string 메서드를 사용하고 있다. 하지만 타입스크립트 입장에서 `x`는 string이 아닐 수도 있다. 따라서 타입스크립트가 에러를 발생시키는 것이다. 타입 가드를 해주면 에러를 해결할 수 있다. 아래 예시를 보자.

```ts
function foo(x: number | string) {
  if(typeof x === 'string'){
      console.log(x.toUpperCase())
  }
  if(typeof x === 'number'){
      console.log(x.toFixed())
  }
}

foo('hello, world!') // HELLO, WORLD!
foo(123.45) // 123
```

이 에러는 타입 단언으로 해결할 수도 있다. 하지만 타입 단언은 실행 시점의 에러를 방지하지 못 한다. 

타입 가드에 사용 되는 주요 연산자 아래와 같다. 참고로 아래 연산자들은 타입스크립트가 아닌 자바스크립트 연산자이다.
참고로, 위의 주요 연산자 외에도 단순한 논리/비교 연산자(`===`, `>=` 등)로도 타입 가드를 적용할 수 있다.

### 12.1 타입 가드에 사용되는 연산자: typeof

`typeof`는 특정 코드의 타입을 문자열 값으로 반환해준다.

```ts
function typeOf<T>(x: T) {
  console.log(typeof x)
}

typeOf('Hello, world!') // "string" 
typeOf(123) // "number" 
typeOf(true) // "boolean" 
typeOf(function () { }) // "function" 
typeOf(['정현수', '원성준', '고영우']) // "object" 
typeOf({ id: 1, name: 'hail' }) // "object" 
```
아래 코드는 `typeof`를 활용한 타입 가드 예시이다.

```ts
function foo(x: number | string) {
  if(typeof x === 'string'){
      console.log(x.toUpperCase())
  }
  if(typeof x === 'number'){
      console.log(x.toFixed())
  }
}

foo('hello, world!') // HELLO, WORLD!
foo(123.45) // 123
```
`typeof`가 반환할 수 있는 문자열 값은 아래와 같다.

- "string"
- "number"
- "bigint"
- "boolean"
- "symbol"
- "undefined"
- "object"
- "function"

목록을 보면 `typeof`는 'null'을 반환하지 않는다. `typeof null`은 'object'를 반환한다. `typeof = 'object'`로 타입 가드를 할 경우에 null 타입 값에 대해 타입 가드를 수행할 수 없다. 그럴 경우 Truthy/Falsy 값을 활용하여 타입 가드를 수행하면 된다.

```ts
function foo(x: string[] | null) {
  // x의 Truthy/Falsy 여부를 판별하면 null에 대한 타입가드를 수행할 수 있다. 
  if (x && typeof x === 'object') {
    console.log(x.map(i => i))
  }
  else {
    console.log(`${x} 좋아해`)
  }
}

foo(['정현수', '원성준', '고영우']) // ["정현수", "원성준", "고영우"] 
foo(null) // null 좋아해
```

### 12.2 타입 가드에 사용되는 연산자: instanceof

`instanceof`는 변수가 대상 객체의 프로토타입 체인에 포함되는지 확인하여 true/false를 반환해준다. `instanceof` 연산자는 주로 클래스 타입이 유니언 타입으로 묶여 있을 때 타입을 구분하기 위해 사용한다. 아래 예시를 확인해보자.

```ts
class User {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }
}

function getUserName(user: User | string) {
    if (user instanceof User) {
        console.log(user.name)
    } else {
        console.log(`해당 인자는 User의 프로토타입 체인에 포함되지 않습니다.`)
    }
}

const hail = new User(1, '하일')

getUserName(hail) // 하일 

getUserName({ id: 1, name: '하일' }) // 해당 인자는 User의 프로토타입 체인에 포함되지 않습니다. 
```

### 12.3 타입 가드에 사용되는 연산자: in

`in` 연산자는 객체에 속성이 있는지 판별하여 true/false를 반환해준다.

```ts
const user = {
    id: 1,
    name: '하일'
}

console.log('id' in user) // true
console.log('loggedIn' in user) // false
```
아래 코드는 `in`을 활용한 타입 가드 예시이다.

```ts
interface Player {
    id: number;
    position: string;
}

interface Staff {
    id: number;
    role: string;
}

function printPersonInfo(person: Player | Staff) {
    if ('position' in person) {
        console.log(person.position)
    }
    if ('role' in person) {
        console.log(person.role)
    }
}

printPersonInfo({ id: 2, position: '투수' }) // 투수
printPersonInfo({ id: 1, role: '감독' }) // 감독
```

### 12.4 타입 가드: 배열과 원시 타입

배열로 여러 인자를 받는 경우, 하나의 인자만 받는 경우, 이렇게 두 가지 경우에 대응하는 함수를 작성해야 할 때도 있다. 이 때는 `Array.isArray`를 사용해서 타입 가드를 하면 된다.

```ts
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // 여기에서 'x'는 'string[]' 타입이다.
    console.log("Hello, " + x.join(" and "));
  } else {
    // x는 string[]이 아니라면 반드시 string이다.
    // 따라서 else에서 별도 처리를 하지 않아도 된다.
    // 여기에서 'x'는 'string' 타입이다.
    console.log("Welcome lone traveler " + x);
  }
}
```


### 12.5 타입 가드 함수

타입 가드 함수는 주로 객체 유니언 타입 중 하나를 구분하는 데 사용하며, `in` 연산자과 역할은 같지만 좀 더 복잡한 경우에도 사용할 수 있다. 복잡한 상황이란, 여러 인터페이스에 공통된 속성이 많아서 `in` 연산자만으로 타입 가드를 하기가 어려운 상황을 말한다. 아래의 예시를 확인해보자.

```ts
interface Staff {
    name: string
    role: string
}

interface Player {
    name: string
    backNumber: number
}

interface Pitcher {
    name: string
    backNumber: number
    arsenal: string[]
}

function printPersonInfo(person: Staff | Player | Pitcher){
    if('backNumber' in person) {
        console.log(person.backNumber) // 이때 person의 타입: '(parameter) person: Player | Pitcher'
    }
}
```
`printPersonInfo`함수의 파라미터 `person`이 `Pitcher`타입일 때만 `backNumber`를 출력하기 위해 `in`으로 타입 가드를 했다. 하지만 if문 안의 `person`의 타입을 확인해보면 `Player | Pitcher` 타입인 것을 확인할 수 있다. `backNumber`라는 속성은 `Player`에도 있고 `Pitcher`에도 있기 때문이다. 타입 가드가 제대로 이뤄지지 않은 것이다. 이럴 때 타입 가드 함수를 사용하면 문제를 해결할 수 있다.


```ts
interface Staff {
  name: string
  role: string
}

interface Player {
  name: string
  backNumber: number
}

interface Pitcher {
  name: string
  backNumber: number
  arsenal: string[]
}

// 타입 가드 함수
function isPitcher(person: Staff | Player | Pitcher): person is Pitcher {
  return (person as Pitcher).arsenal !== undefined
}

function printPersonInfo(person: Staff | Player | Pitcher) {
  // 타입 가드 함수 사용
  if (isPitcher(person)) {
    console.log(person.backNumber) // 이때 person의 타입: '(parameter) person: Player | Pitcher'
  }
}
```
타입 가드 함수의 로직을 좀 더 자세히 살펴보자.

```ts
// isPitcher 함수의 파라미터는 Staff | Player | Pitcher라는 유니언 타입으로 정의되었다.
function isPitcher(person: Staff | Player | Pitcher): person is Pitcher {
  // 파라미터가 유니언 타입이라서 공통 속성에만 접근할 수 있으므로 as를 사용하여 Pitcher 타입으로 강제한다.
  // arsenal 속성이 undefined가 아니라는 것은, person이 arsenal 속성을 가진다는 뜻이다.
  // 유니언 타입 중에서 arsenal 속성을 가진 타입은 Pitcher 뿐이다.
  return (person as Pitcher).arsenal !== undefined
}
// `person is Pitcher`의 의미는 반환 겂이 true라면 person이라는 파라미터의 타입은 Pitcher로 간주한다는 의미이다.
```

### 12.6 구별된 유니언(Discriminated unions)

([타입스크립트 공식문서 핸드북](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)에 'Discriminated unions'에 대한 내용이 나오는데, 이번 글에서는 이것을 '구별된 유니언'으로 해석해서 다루겠다.)

구별된 유니언의 경우 string이나 number 같은 원시 타입보다, 여러 속성을 가지고 있는 객체 타입에 타입 가드를 해야 할 때 유용하게 사용된다. 공식문서에 나와 있는 아래의 예시를 살펴보자.

```ts
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}
```
`Shape` 인터페이스를 보면, 도형의 모양에 대한 속성들이 작성되어 있다. `circle`일 경우 `radius`가 필요하고, `square`일 경우 `sideLength`가 필요하기 때문에, radius와 sideLength를 옵셔널 속성으로 지정했다. Shape 인터페이스를 활용하여 원과 정사각형의 넓이를 구할 수 있는 함수 `getArea`를 작성해보자.

```ts
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    // 에러 발생: 'shape.radius' is possibly 'undefined'.
    return Math.PI * shape.radius ** 2;
  }
}
```
`shape.kind === "circle"`로 타입가드를 해줬지만 에러가 발생하는 모습이다. 이는 `radius`가 옵셔널 타입이기 때문이다. 여기서 null 아님 보장 연산자 `!`를 사용하는 방법도 있지만, 실행 에러를 방지해주지 않기 때문에 최선의 해결책은 아니다. 이 문제를 해결하기 위해서는 kind 속성을 기반으로 타입가드를 할 수 있게 Shape 인터페이스를 수정해야 한다.

```ts
interface Circle {
  kind: "circle";
  radius: number;
}
 
interface Square {
  kind: "square";
  sideLength: number;
}

// 기존의 Shape 인터페이스를 Circle과 Square로 분리하고, 두 인터페이스를 유니언 타입으로 지정했다.
type Shape = Circle | Square;

function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    // 에러가 발생하지 않는다. 타입 가드가 의도한대로 수행되었다. 
    return Math.PI * shape.radius ** 2;
  }
}
```
위 예시처럼 유니언 타입의 모든 타입이 리터럴 타입으로 공통 속성을 갖는 경우(위의 경우 kind가 공통 속성이다), 타입스크립트는 이를 '구별된 유니언'으로 간주하고 유니언의 멤버를 좁힐 수 있게 된다.

- 리터럴 타입: 원시 타입인 string이나 number가 아니라, 'Hello, world'나 1004처럼 특정 문자열이나 숫자를 의미한다. 

(🤔: 구별된 유니언은 언제 유용하게 쓸 수 있을까? 클라이언트와 서버간의 통신을 할 때 사용할 수 있을 것 같다. 요청을 보낼 때는 GET, POST, DELETE 등을 리터럴 타입으로 다루고 'method'라는 공통 속성으로 이용해서 유니언 타입을 만들어 볼 수 있겠다. 응답을 받을 때는 상태 코드를 기준으로 200, 404 등을 리터럴 타입으로 다루고 'status'를 공통 속성으로 이용해서 유니언 타입을 만들어 볼 수 있겠다.)

## 13. 타입 호환(type compatibility)

타입 호환이란 서로 다른 타입이 2개 있을 때 특정 타입이 다른 타입에 포함되는지를 의미한다.

```ts

let stringVar:string = 'Hello, world!'
let helloVar:'Hello, world!' = 'Hello, world!'

// 타입이 호환되는 경우
stringVar = helloVar // 에러 없음: string 타입이 'Hello, world!' 타입을 포함하기 때문

// 타입이 호환되지 않는 경우
helloVar = stringVar // 에러 발생: 'Hello, world!'이 string 타입을 포함하지 않기 때문
```

### 13.1 구조적 타이핑(structural typing)

구조적 타이핑이란 타입 유형보다는 타입 구조로 호환 여부를 판별하는 언어적 특성을 의미한다. 타입스크립트의 타입 호환은 구조적 타이핑을 따른다.

```ts
type Pitcher = {
    name: string;
    backNumber: number;
}

interface Batter {
    name: string;
    backNumber: number;
}

let a:Pitcher = {
    name: '정현수',
    backNumber: 57
}

let b:Batter = {
    name: '원성준',
    backNumber: 7
}

a = b // 에러 없음: Pitcher와 Batter가 동일한 구조를 가지고 있기 때문
b = a // 에러 없음
```

### 13.2 객체 타입의 호환

구조적 타이핑에서 봤던 예시는 타입 별칭인 Pitcher와 인터페이스인 Batter가 완전히 동일한 구조를 가지고 있다. 하지만 완전히 동일한 구조를 가지고 있어야 호환이 되는 것은 아니다.
```ts
interface Player {
    name: string;
    backNumber: number;
}

type Pitcher = {
    name: string;
    backNumber: number;
    arsenal: string[]
}

let player: Player = {
    name: '원성준',
    backNumber: 7
}

let pitcher: Pitcher = {
    name: '정현수',
    backNumber: 7,
    arsenal: ['커브', '패스트볼', '슬라이더', '체인지업']
}

player = pitcher // 호환 가능: pitcher 객체에 Player 인터페이스의 필수 속성인 name과 backNumber가 정의되어 있기 때문
pitcher = player // 호환 불가능: player 객체에 Pitcher 타입 별칭의 필수 속성인 arsenal이 정의되어 있지 않기 때문
```

### 13.3 함수 타입의 호환

함수 타입도 구조가 유사하면 호환된다.

```ts
let printMessage = (message: string) => console.log(message)
let printText = (text: string) => console.log(text)

printMessage = printText // 호환 가능
printText = printMessage // 호환 가능
```
아래와 같이 구조가 다른 경우에는 호환이 불가능할 수도 있다.

```ts
let printText = (text: string) => console.log(text)
let printMessage = (message: string, status: number) => console.log(message, status)

printMessage = printText // 호환 가능
printText = printMessage // 호환 불가 
```
위 예시에서 `printText = printMessage`가 호환 불가인 이유를 좀 더 자세히 설명하겠다. 변수 `printText`에는 인자를 한 개 받는 함수가 할당되어 있다. 그런 변수에 인자를 두 개 받아야 동작하는 `printMessage`라는 함수를 할당한 상황이다. 그러면 `printText`가 인자를 두 개 받을 수 있을 것 같지만 `printText`는 함수 표현식에 정의된대로 여전히 1개의 인자만 받는다. 따라서 첫 번째 인자는 전달이 가능하지만 두 번째 인자는 전달이 불가능하기 때문에 두 번째 인자는 `undefined`가 되고 예상한 것과 다른 결과 값이 나오게 된다. 이러한 이유로 `printText = printMessage`는 호환되지 않는 것이다.

반면 `printMessage = printText`는 인자의 개수가 다르지만 호환이 가능하다. 변수 `printMessage`에는 인자를 두 개 받는 함수가 할당되어 있다. 그런 변수에 인자를 한 개 받아야 동작하는 `printText`라는 함수를 할당한 상황이다. 인자를 한 개만 받는 함수가 할당되어 있지만 `printMessage`는 함수 표현식에 정의된대로 여전히 인자를 두 개 받아야 한다. 따라서 첫 번째 인자만 사용되고 두 번째 인자는 버려진다. 두 번째 인자를 사용하지 않았지만 함수의 동작은 깨지지 않고 동작하기 때문에 `printMessage = printText`는 호환이 가능하다.

이처럼 함수 타입의 호환은 '기존 함수 코드의 동작을 보장해 줄 수 있는가?'라는 관점에서 이해하면 된다.

## 14. 타입 모듈

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

### 14.1 타입스크립트 모듈화 문법: import type

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

### 14.2 타입스크립트 모듈화 전략: Barrel

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

## 15. 유틸리티 타입(utility type)

유틸리티 타입은 이미 정의되어 있는 타입 구조를 변경하여 재사용하고 싶을 때 사용하는 타입이다. 타입스크립트에서 미리 정의해 놓은 내장 타입이다. 따라서 아래와 같이 타입스크립트 설정 파일의 lib 속성을 변경해주면 사용할 수 있다.

```ts
{
  "compilerOptions": {
    "lib": ["ESNext"], // ESNext: 최신 자바스크립트 문법을 의미
  },
}
```
아래에서 다룰 유틸리티 타입을 포함한 타입스크립트의 모든 유틸리티 타입은 [TypeScript-Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)에서 확인할 수 있다.

### 15.1 Pick 유틸리티 타입

Pick 유틸리티 타입은 특정 타입의 속성을 뽑아서 새로운 타입을 만들어 낼 때 사용한다. 객체 형태의 타입반 대상 타입으로 취급할 수 있다.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}
// Pick으로 속성을 추출하여 타입 정의
type UserName = Pick<User, 'name'>;
// 여러개 추출하여 타입 정의도 가능
type UserInfo = Pick<User, 'name' | 'email'>;

const hail: UserName = {
  name: '하일',
};
const taesan: UserInfo = {
  name: '태산',
  email: 'taesan@gmail.com',
};
```

### 15.2 Omit 유틸리티 타입

Omit 타입은 특정 타입에서 속성 몇 개를 제외한 나머지 속성으로 새로운 타입을 생성할 때 사용하는 유틸리티 타입이다. 객체 형태의 타입반 대상 타입으로 취급할 수 있다. Pick 타입과 정확히 반대의 역할을 한다.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}
// Omit으로 특정 속성을 제외하여 타입 정의
type UserProfile = Omit<User, 'id'>;
// 여러개를 제외하여 타입 정의도 가능
type UserId = Omit<User, 'name' | 'email'>;

const hail: UserProfile = {
  name: '하일',
  email: 'hail@gmail.com',
};

const myId: UserId = {
  id: 1,
};
```
### 15.3 Partial 유틸리티 타입

Partial 타입은 특정 타입의 모든 속성을 모두 옵션 속성으로 변환한 타입을 생성해준다. 객체 형태의 타입반 대상 타입으로 취급할 수 있다.

```ts
interface User {
  id: number;
  name: string;
}

type PartialUser = Partial<User>;

const emptyUser: PartialUser = {};
const onlyIdUser: PartialUser = { id: 1 };
const onlyNameUser: PartialUser = { name: '하일' };
const fullUser: PartialUser = { id: 1, name: '하일' };
```

주로 HTTP PUT처럼 데이터를 수정하는 REST API를 전송할 때 종종 사용된다. 예를 들어 유저의 프로필을 업데이트하는 `updateUserProfile`이라는 함수가 있다고 가정해보자. 이 함수는 유저 프로필에서 업데이트할 정보를 파라미터로 받는다. 유저의 프로필에는 유저네임, 이메일 등 다양한 속성이 있다. 프로필을 업데이트할 때 반드시 모든 속성을 변경하는 것은 아니다. 때로는 유저네임만, 때로는 유저네임과 이메일을 같이 수정할 수도 있다. 이런 모든 경우의 수에 맞춰서 함수의 파라미터 타입을 지정해주는 일은 번거로운 일이다. 이 때 아래와 같이 Partial 타입을 사용하면 속성을 선택적으로 재사용할 수 있다. 

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

function updateUserProfile(user: Partial<User>) {
  // ...
}

```

### 15.4 Exclude 유틸리티 타입

Exclude 타입은 유니언 타입을 구성하는 특정 타입을 제외할 때 사용한다.

```ts
type BaseballPosition = 'Pitcher' | 'Catcher' | 'Batter';
type OnlyBattery = Exclude<BaseballPosition, 'Batter'>;
// type OnlyBattery = "Pitcher" | "Catcher"
type OnlyPitcher = Exclude<BaseballPosition, 'Catcher' | 'Batter'>;
// type OnlyPitcher = "Pitcher"
```

### 15.5 Record 유틸리티 타입

Record 타입은 타입 1개를 속성의 키로 받고 다른 타입 1개를 속성 값으로 받아 객체 타입으로 변환해준다. 속성의 키로 받을 타입에는 string, number, string 유니언, number 유니언 타입 등이 들어갈 수 있다. 값으로 받을 타입은 아무 타입이나 들어갈 수 있다.

```ts
type BaseballPosition = 'Pitcher' | 'Catcher' | 'Batter';
type BaseballPlayer = {
  name: string;
  backNumber: number;
};

type Monsters = Record<BaseballPosition, BaseballPlayer>;

const monsters: Monsters = {
  Pitcher: {
    name: '정현수',
    backNumber: 57,
  },
  Catcher: {
    name: '윤준호',
    backNumber: 22,
  },
  Batter: {
    name: '원성준',
    backNumber: 7,
  },
};
```
유니언 타입과 객체 타입보다 더 단순한 형태의 데이터 타입을 활용하는 것도 가능하다.

```ts
type Menu = Record<string, number>

const coffeMenu:Menu = {
  americano: 4500,
  latte: 5000
}
```

## 16. 맵드 타입(mapped type)

이미 정의된 타입을 가지고 새로운 타입을 생성할 때 사용하는 타입 문법을 의미한다. 유틸리티 타입은 맵드 타입을 이용해서 구현되었다.

맵드 타입은 주로 `in`과 `keyof`를 조합해서 사용한다. 

- P `in` A: A 객체의 속성을 순회한다. (자바스크립트의 for in 반복문과 유사하다.)
- `keyof` A: A 타입의 키 값을 추출해서 문자열 유니언 타입으로 변환해준다.

두 키워드를 사용한 맵드 타입 예시는 아래와 같다. 

```ts
// 이미 정의된 BaseballPlayer 타입
type BaseballPlayer = {
  id: number;
  backNumber: number;
};

// 맵드 타입을 활용해서 새로운 Player 타입 생성
type Player = {
  [B in keyof BaseballPlayer]: string;
};

// 새로운 Player 타입 적용
const hail: Player = {
  id: '1',
  backNumber: '99',
};
```

### 16.1 매핑 수정자(mapping mnodifier)

매핑 수정자는 맵드 타입을 변환할 때 속성 성질을 변환할 수 있도록 도와주는 문법이다.

수정자: `?`, `readonly`
접두사: `+`, `-` (수정자를 추가 제거하는 데 사용. 접두사 추가 안 할시 +로 간주)

맵드 타입에 `?` 수정자를 추가하여 새로운 타입을 만드는 예시를 살펴보자.

```ts
type BaseballPlayer = {
  id: number;
  backNumber: number;
};

// '?' 수정자 추가
// 접두사 없을 시 '+'로 간주
type Player = {
  [B in keyof BaseballPlayer]?: string;
};
/* 현재 Player 타입 상황
  type Player = {
    id?: string | undefined;
    backNumber?: string | undefined;
}
*/

// 아무 속성이 없어도 에러가 발생하지 않음
const hail: Player = {};
```

이번에는 `-?`로 기존의 옵셔널 속성을 필수 속성으로 바꿔보자.

```ts
// BaseballPlayer의 모든 속성은 옵셔널 속성이다.
type BaseballPlayer = {
  id?: number;
  backNumber?: number;
};

// '-' 접두사와 '?' 수정자를 추가했다. 
type Player = {
  [B in keyof BaseballPlayer]-?: string;
};

/* 현재 Player 타입 상황
  type Player = {
    id: string;
    backNumber: string;
}
*/

// 에러 발생: Type '{}' is missing the following properties from type 'Player': id, backNumber
const hail: Player = {};
```