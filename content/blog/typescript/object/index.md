---
title: "[타입스크립트] 객체 타입 정의"
date: "2023-09-21T23:07:00.000Z"
description: "타입스크립트의 인터페이스, 유니언/인터섹션 타입, 타입 별칭, 이넘을 다룹니다."
category: "typescript"
featuredImage: "../../../../src/images/ts-256x256.png"
mobileImage: "../../../../src/images/ts-512x256x2.png"
---

## 1. 인터페이스

타입스크립트에서 인터페이스(interface)는 객체 타입을 정의할 때 사용하는 문법이다.

인터페이스로 타입을 정의할 수 있는 부분은 아래와 같다.

- 객체의 속성과 속성 타입
- 함수의 파라미터와 반환값 타입
- 함수의 스펙(파라미터 개수와 반환값 여부 등)
- 배열과 객체를 접근하는 방식
- 클래스

### 1.1 인터페이스를 이용한 객체 타입 정의

```ts
interface Player {
  id: number;
  name: string;
  // 속성에 ?를 붙이면 옵션 속성을 사용할 수 있다.
  age?: number;
}

const hail: Player = { id: 1, name: '하일' };
```

### 1.2 인터페이스로 함수 파라미터 타입 정의

```ts
function printName(player: Player) {
  console.log(player.name);
}

printName(hail); // '하일'
```

### 1.3 인터페이스로 함수 반환 타입 정의

```ts
function getPlayer(player: Player): Player {
  return player;
}
```

### 1.4 인터페이스 상속

```ts
interface Player {
  id: number;
  name: string;
  age?: number;
}
interface BaseballPlayer extends Player {
  position: string;
}

const hyeonsu: BaseballPlayer = {
  id: 57,
  name: '정현수',
  position: '투수',
};
```
한 번에 여러개의 타입을 상속할 수도 있다.

```ts
interface Player {
  id: number;
  name: string;
  age?: number;
}

interface Student {
  grade: string
}

interface BaseballPlayer extends Player, Student {
  position: string;
}

const hyeonsu: BaseballPlayer = {
  id: 57,
  name: '정현수',
  position: '투수',
  grade: '4학년'
};
```

### 1.5 인터페이스로 배열 인덱싱 타입 정의

- 인덱싱: 객체의 특정 속성에 접근하거나 배열의 인덱스로 특정 요소에 접근햐는 동작을 말한다.

```ts
interface StringArray {
  [index: number]: string;
}

const myTeam: StringArray = ['정현수', '원성준', '고영우'];
```

이렇게 배열을 인덱싱 타입으로 정의할 수 있지만, 위의 경우 string[] 형식으로 정의하는 것이 더 편하다.

### 1.6 인터페이스에서 인덱스 시그니처로 객체 인덱싱 타입 정의

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
다만 인덱스 시그니처와 특정 속성을 섞어서 정의할 때, 특정 속성의 타입이 인덱스 시그니처의 타입과 일치하지 않으면 에러가 발생한다.
```ts
interface someObj {
  [property: string]: string;
  id: string;
  created_at: string;
  status: number; // 에러 발생: Property 'status' of type 'number' is not assignable to 'string' index type 'string'.
}
```
다른 타입의 속성을 섞어서 써야 한다면 아래 예시처럼 유니언 타입을 사용하여 문제를 해결할 수 있다.

```ts
interface someObj {
  [property: string]: string | number;
  id: string;
  created_at: string;
  status: number;
}
```

참고로 인덱스 시그니처도 `readonly`로 설정할 수 있다.

```ts
interface ReadonlyStringArray {
  readonly [index: number]: string;
}
 
let myArray: ReadonlyStringArray = ['a', 'b', 'c']
console.log(myArray[2]) // "c"
myArray[2] = "Mallory"; // 에러 발생: Index signature in type 'ReadonlyStringArray' only permits reading.
```

### 1.7 인터페이스의 선언 병합

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

### 1.8 인터페이스의 readonly 속성

인터페이스의 속성 앞에 `readonly` 키워드를 추가하면 타입스크립트에서 읽기 전용으로 표시할 수 있다. 읽기 전용으로 표시된 속성을 수정하려고 할 경우 타입 검사에 걸린다.

```ts
interface User {
  // id 속성을 읽기 전용으로 표시했다. 
  readonly id: number
}

const hail:User = {id: 1}

// 읽기 전용인 id 속성을 읽는 것은 가능하다.
console.log(`ID: ${hail.id}`) // "ID: 1"
// 읽기 전용인 id 속성을 수정하는 것은 에러를 발생시킨다.
hail.id = 2 // Cannot assign to 'id' because it is a read-only property.
```
수정이 불가능하지만, 값이 절대로 수정이 불가능하다는 것은 아니다. 읽기 전용으로 표시한 속성이 객체라면 내부 내용을 변경할 수 있다. 속성 자체를 수정하는 것은 여전히 불가능하다.

```ts
interface User {
  // loginMetod 속성을 읽기 전용으로 표시했다.
  readonly loginMetod: {email: string, name: string}
}

function updateLoginMethod(user:User){
  // loginMetod 속성은 읽기 전용이지만 내부 속성은 수정이 가능하다.
  user.loginMetod.email = '유저가 원하는 이메일 주소'
  user.loginMetod.name = '유저가 원하는 이름'
}

function deleteLoginMetod(user:User){
  // loginMetod 속성은 읽기 전용이라 속성 자체를 수정하는 것은 불가능하다.
  user.loginMetod = null // Cannot assign to 'loginMetod' because it is a read-only property.
}
```

## 1.9 초과된 속성 검사(Excess Property Checks)

타입스크립트에서 객체 리터럴은 다른 변수에 할당하거나 인수로 전달할 때 초과된 속성 검사를 거치게 된다. 초과된 속성 검사는 객체 리터럴의 타입에 없는 속성이 있으면 오류를 발생시킨다.

```ts
interface User {
  id?: string
  name?: string
}

function createUser(user: User): User {
  return { id: user.id, name: user.name }
}

// name 속성은 옵셔널이니까 아래처럼 namee으로 잘 못 입력해도 에러가 없지 않을까?
const me = createUser({ id:1, namee: '하일' }) // 에러 발생...
/* 에러 메시지
  Argument of type '{ id: string; namee: string; }' is not assignable to parameter of type 'User'.
  
  Object literal may only specify known properties, but 'namee' does not exist in type 'User'. Did you mean to write 'name'?
*/
```
물론 이 예시에서 이 에러를 굳이 해결하지 않는 것이 더 좋을지도 모르겠다. name의 오타를 수용하지 않는 것이 더 좋기 때문이다. 하지만 기존의 인터페이스를 수정하기 어려운 상태에서 새로운 속성을 추가해야 하는 상황이라고 가정해본다면, 새로운 속성을 추가할 때 에러가 발생하지 않도록 초과된 속성 검사를 우회해야 할지도 모른다.

초과된 속성 검사를 우회할 수 있는 방법은 세 가지가 있다. 

- **1. 타입 단언을 사용한다.**

```ts
interface User {
  id?: string
  name?: string
}

function createUser(user: User): User {
  return { id: user.id, name: user.name }
}

// 에러가 발생하지 않는다. 
const me = createUser({ id: "1", namee: '하일' } as User)

console.log(me) // { "id": "1", "name": undefined } 
```
당장 타입 검사는 통과하지만 가장 코드 실행시 발생할 수 있는 문제를 방지하지는 못하기 때문에 가장 좋은 해결책은 아니다.

- **2. 인덱스 시그니처를 추가한다.**

인터페이스가 이미 지정된 속성 외의 다른 속성도 얼마든지 가질 수 있다면 인덱스 시그니처를 추가하는 것이 좋은 방법이 될 수 있다.

```ts
interface User {
  id?: string
  name?: string
  // 인덱스 시그니처를 추가한다.
  [propName: string]: string | undefined;
}

function createUser(user: User): User {
  return { id: user.id, name: user.name }
}

// 에러가 발생하지 않는다. 
const me = createUser({ id: "1", namee: '하일' })

console.log(me) // { "id": "1", "name": undefined } 
```

- **3. 객체를 다른 변수에 할당하고 인수로 전달한다.**

```ts
interface User {
  id?: string
  name?: string
}

function createUser(user: User): User {
  return { id: user.id, name: user.name }
}

// 함수의 인자로 전달할 객체를 다른 변수에 할당한다.
const hail = { id: "1", namee: '하일' }

// 그 변수를 인자로 전달한다.
const me = createUser(hail) // 에러가 발생하지 않는다.

console.log(me) // { "id": "1", "name": undefined } 
```

위 코드에서 에러가 발생하지 않는 이유는 무엇일까? 초과된 속성 검사는 객체 리터럴을 다른 변수에 할당하거나 인수로 전달할 때 수행된다. `hail`이라는 변수를 `createUser`라는 함수에 인자로 전달할 때는 초과된 속성 검사가 수행되지 않는다.

```ts
// 여기서는 객체 리터럴을 다른 변수에 할당하고 있으므로 초과된 속성 검사가 수행된다.
// hail이라는 변수는 따로 타입이 지정되어있지 않기 때문에 아래 코드는 검사가 수행되어도 에러가 발생하지 않는다.
const hail = { id: "1", namee: '하일' }

// 함수에 인자를 전달하는 것뿐이므로 초과된 속성 검사가 수행되지 않는다. 
const me = createUser(hail) // 에러가 발생하지 않는다. 
```
다만, 함수의 인자 타입과 인자로 전달할 변수의 타입에서 공통된 속성이 없을 경우 에러가 발생한다.

```ts
interface User {
  id?: string
  name?: string
}

function createUser(user: User): User {
  return { id: user.id, name: user.name }
}

// 변수 hail의 속성은 User 타입과 일치하는 부분이 전혀 없다.
const hail = { idd: "1", namee: '하일' }

// createUser의 파라미터는 User타입이다.
// User 타입과 일치하는 부분이 전혀 없는 hail 변수는 타입 검사를 통과할 수 없다.
const me = createUser(hail) // 에러 발생
/* 에러 메시지
  Type '{ idd: string; namee: string; }' has no properties in common with type 'User'.
*/
```

초과된 속성 검사를 우회하는 방법을 살펴봤지만, 복잡한 객체 리터럴이 아닐 경우에는 우회하지 않는 편이 바람직하다. 초과된 속성 검사가 발생시키는 에러를 우회하면 그것이 버그로 이어질 가능성이 높기 때문이다. 당장 위의 세 가지 방법에서 보여준 예시만 봐도, console.log에 찍힌 name 속성이 전부 undefined인 것을 확인할 수 있다. undefined 값은 예상치 못한 버그로 이어지는 경우가 많다.

## 2. 연산자를 사용한 타입 정의

### 2.1 유니언 타입

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


### 2.2 인터섹션 타입

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

## 3. 타입 별칭

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
### 3.1 타입 별칭과 인터페이스의 차이



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


### 3.2 타입 별칭과 인터페이스는 언제 쓰는 것이 좋을까?

- 타입 별칭으로만 정의할 수 있는 타입에는 타입 별칭을 사용한다. 

  타입 별칭으로만 정의할 수 있는 타입은 아래와 같다.

  - 원시 타입
  - 인터섹션 타입, 유니언 타입
  - 유틸리티 타입, 맵드 타입

- 백엔드와 인터페이스를 정의할 때는 인터페이스를 사용한다. 

서비스의 요구 사항이 변경되어 인터페이스를 확장시켜야 하는 경우가 있다. 타입의 확장 측면에서는 상속이나 선언 병합 등을 활용해 유연하게 확장할 수 있는 인터페이스가 더 적합하다.

## 4. 이넘(enum)

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


## 4.1 숫자형 이넘
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

## 4.2 문자형 이넘

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

## 4.3 const 이넘

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