---
title: "[타입스크립트] 타입 추론, 타입 단언, 타입 호환"
date: "2023-09-21T23:09:00.000Z"
description: "타입스크립트의 타입 추론, 타입 단언, 타입 호환을 다룹니다."
category: "typescript"
featuredImage: "../../../../src/images/ts-256x256.png"
mobileImage: "../../../../src/images/ts-512x256x2.png"
---

## 1. 타입 추론

타입 추론이란 타입스크립트가 코드를 해석하여 적절한 타입을 정의하는 동작을 의미한다. 타입 추론이 가능하기 때문에 타입 지정을 생략할 수 있는 코드에서는 생략이 가능하다. 이는 코드를 간결하게 해주어 코드의 가독성을 높이는 효과가 있다. 


### 1.1 변수의 타입 추론

변수 타입은 선언하는 시점에 할당된 값을 기반으로 추론된다. 

```ts
let stringVar = 'Hello, world!' // let stringVar: string
let numberVar = 123 // let numberVar: number
let booleanVar = true // let booleanVar: boolean

let whatAmI // let whatAmI: any
whatAmI = 123 // let whatAmI: any
```
`whatAmI`변수의 경우 선언은 했지만 값은 할당하지 않았다. 따라서 해당 변수의 타입은 any이다. 이후에 값을 할당하더라도 타입은 any이다. 타입스크립트 입장에서는 선언 후에 어떤 값이 할당될 지 알 수 없기 때문이다.

### 1.2 함수의 타입 추론

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
### 1.3 함수와 제네릭의 추론

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

### 1.4 인터페이스와 제네릭의 추론

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


## 2. 타입 단언(type assertion)

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

### 2.1 as를 사용할 수 있는 대상
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
### 2.2 타입 단언 사용 시 주의 사항

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

### 2.3 null 아님 보장 연산자(non null assertion)

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


## 3. 타입 호환(type compatibility)

타입 호환이란 서로 다른 타입이 2개 있을 때 특정 타입이 다른 타입에 포함되는지를 의미한다.

```ts

let stringVar:string = 'Hello, world!'
let helloVar:'Hello, world!' = 'Hello, world!'

// 타입이 호환되는 경우
stringVar = helloVar // 에러 없음: string 타입이 'Hello, world!' 타입을 포함하기 때문

// 타입이 호환되지 않는 경우
helloVar = stringVar // 에러 발생: 'Hello, world!'이 string 타입을 포함하지 않기 때문
```

### 3.1 구조적 타이핑(structural typing)

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

### 3.2 객체 타입의 호환

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

객체 타입 호환에서 주의할 점이 하나 있는데, 타입스크립트에서 객체의 각 속성의 호환 여부를 판단할 때 해당 속성이 읽기 전용인지는 고려하지 않는다는 것이다.

```ts
interface Person {
  name: string;
  age: number;
}
 
interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}
 
let writablePerson: Person = {
  name: "하일",
  age: 100,
};
 
// 각 객체의 속성의 읽기 전용 여부가 다르지만 호환된다.
let readonlyPerson: ReadonlyPerson = writablePerson;
 
// 아래와 같이 예상치 못한 동작이 발생한다.
console.log(readonlyPerson.age); // prints '42'
writablePerson.age++;
console.log(readonlyPerson.age); // prints '43'
```

### 3.3 함수 타입의 호환

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