---
title: "[타입스크립트] 타입 가드"
date: "2023-09-21T23:10:00.000Z"
description: "타입스크립트의 기초 문법을 정리했습니다."
category: "typescript"
featuredImage: "../../../../src/images/ts-256x256.png"
mobileImage: "../../../../src/images/ts-512x256x2.png"
---
## 1. 타입 가드(type guard)

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

### 1.1 타입 가드에 사용되는 연산자: typeof

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

### 1.2 타입 가드에 사용되는 연산자: instanceof

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

### 1.3 타입 가드에 사용되는 연산자: in

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

### 1.4 타입 가드: 배열과 원시 타입

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


### 1.5 타입 가드 함수

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

### 1.6 구별된 유니언(Discriminated unions)

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
