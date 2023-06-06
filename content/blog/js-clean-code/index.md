---
title: 자바스크립트 코드 작성 시 참고 사항
date: "2023-03-20T20:36:00.000Z"
description: "실전에서 사용할 수 있는 자바스크립트 코딩 팁을 정리했습니다."
category: "JavaScript"
featuredImage: "../../../src/images/js-256x256.png"
mobileImage: "../../../src/images/js-512x256x2.png"
---

아래 대부분의 항목은 흔히 모던 자바스크립트라 불리는 ES6 이후의 문법을 활용하여 코드를 작성하는 방법을 제시하는 것일 뿐, 코딩 시 반드시 지켜야 하는 어떤 규칙이나 지침을 작성한 것이 아님을 밝힙니다.

참고로, 블로그 오픈 전에 공부한 내용을 자유롭게 작성하고 저장하기 위한 용도로 올린 글이므로, 아래 내용은 추후에 얼마든지 변경 될 수 있습니다.

## 1. 전역 변수는 가급적 사용하지 말자. 
  - 변수 및 함수 이름이 충돌할 가능성이 상승한다.
  - 어디서든 접근할 수 있어서 유지보수가 어렵다.
  - 변수를 찾기 위해 전역 스코프를 탐색해야 해서 성능이 떨어진다.


## 2. var는 가급적 사용하지 말자.
  - 아래와 같은 특징 때문에, 코드의 예측이 어렵다.
    - 변수 중복 선언 허용
    - 함수 레벨 스코프
      - 함수의 코드 블록만 지역스코프로 인정하는 것이다.
      - 전역 변수를 남발할 가능성이 높아서 위험하다.
    - 호이스팅
      - 변수 선언문이 코드의 선두로 끌어올려진 것처럼 동작하는 것.


## 3. 임시 변수는 가급적 사용하지 말자.
  - 함수 내부에 임시 변수가 존재할 경우
    - 임시 변수를 조작하여 사이드 이펙트가 발생해 함수의 예측이 어려워질 수 있다.
    - 임시 변수를 조작으로 새로운 역할을 만들어서 해당 함수에 여러 역할이 부여될 수 있다.
    - 명령형 프로그래밍이 될 가능성이 높아져 코드의 예측이 어려워질 수 있다.

  Before:
  ```javascript
  function sum(a, b) {
    const result = 0;
    result = a + b;
    return result;
  }
  ```
  
  After:
  ```javascript
  function sum(a, b) {
    return a + b;
  }
  ```


## 4. 명령형보다 선언형으로 프로그래밍 해보자.
  - 상대적으로 명령형 프로그래밍은 값을 예측하기가 어렵다.

  명령형:
  ```javascript
  let sum = 0;
  const arr = [1, 2, 3, 4, 5];
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  console.log(sum); // 15
  ```
  
  선언형: 
  ```javascript
  const arr = [1, 2, 3, 4, 5];
  const sum = arr.reduce((acc, curr) => acc + curr, 0);
  console.log(sum); // 15
  ```


## 5. 함수 선언시 함수 표현식을 활용해보자.
  - 함수도 호이스팅되기 때문이다.
  
  Before:
  ```javascript
  function sum(a, b) {
    return a + b;
  }
  ```
  
  After:
  ```javascript
  const sum = function (a, b) {
    return a + b;
  }
  ```

## 6. typeof는 만능이 아니다.
  - 원시 타입은 typeof로 검사한다.
  - 객체 타입은 instanceof로 검사한다.
    - 객체 타입의 더 정확한 검사를 원할 경우 아래 메서드를 활용한다.
    - Object.prototype.toString.call()
  - 구글에 javascript is `<type>`으로 검색하면 다양한 검사 방법이 나온다.


## 7. undefined과 null을 사용할 때는 컨벤션을 정할 것.
- undefined과 null은 예측이 어렵기 때문이다.


## 8. `==` 대신 `===` 를 사용할 것

Before:
```javascript
const value = "1";

value == 1; // true
```

After:
```javascript
const value = "1";

Number(value) === 1; // true
```

## 9. 암묵적 형변환보다 명시적 형변환을 사용할 것

Before:
```javascript
const inputValue = 100;
const outoutValue = inputValue + "";

typeof outoutValue; // 'string'
```

After:
```javascript
const inputValue = 100;
const outoutValue = String(inputValue);

typeof outoutValue // 'string'

```

## 10. parseInt(string, radix)에서 radix를 생략하지 말 것.

- parseInt의 기본 값은 10이 아니다.
- 10진수로 변환되길 바란다면, radix에 10을 명시할 것.

Before:
```javascript
parseInt("010"); // 8
```

After:
```javascript
parseInt("010", 10); // 10
```

- 참고: parseInt를 Math.floor()의 대체품으로 사용하지 말 것.
  - 일부 숫자는 6.022e23(6.022 × 10^23)처럼 문자열 표현에 e 문자를 사용하기 때문에, parseInt를 매우 크거나 매우 작은 숫자의 소수점 이하 값을 자르기 위해 사용하면 예기치 못한 결과가 발생할 수 있다. 
  - 참고자료: [parseInt()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/parseInt#%EC%84%A4%EB%AA%85)


## 11. isNaN() 대신 Number.isNaN()을 사용할 것.

- isNaN() 함수는 전달된 값이 NaN인 경우 true를 반환하지만, 전달된 값이 숫자가 아닌 문자열, 객체, 배열, 빈 값(null), undefined 등일 때도 true를 반환하는 경우가 있다. 
- isNaN()은 전달받은 인수의 타입이 숫자가 아닌 경우 숫자로 암묵적 형변환을 하여 검사를 수행하는데, 숫자로 변환하는 것에 실패할 경우 NaN을 반환한다.
- 예를들어, isNaN() 함수가 인수로 "hello"를 전달받은 경우, 숫자로 형변환에 실패하고 NaN을 반환한다.
- 따라서, isNaN() 함수는 "hello"가 NaN이 아님에도 NaN으로 판별해서 true를 반환하는 것이다. 
- Number.isNaN()은 인수의 타입을 숫자로 암묵적 형변환하는 과정이 없기 때문에, 숫자가 아닌 인수가 주어졌을 때 언제나 false를 반환한다.
- 따라서 Number.isNaN()을 사용하면 예측이 쉽다.

```javascript
isNaN("hello"); // true
Number.isNaN("hello"); // false

isNaN(undefined); // true
Number.isNaN(undefined); // false

isNaN(NaN); // true
Number.isNaN(NaN); // true
```
- 참고 자료
: [isNaN()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/isNaN)

: [Number.isNaN()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN)


## 12. 경계값을 다룰 때는 값의 특성에 따라 네이밍을 할 것.

### min-max
- 최솟값과 최댓값을 다루고, 그 사이의 값들이 연속성을 가질 때 고려할 수 있는 네이밍이다.
- 나이(age)처럼 경계 구분이 필요하거나, 값의 연속성이 있는 경우 고려할 수 있다.
- 최솟값 최댓값을 다룰 때는 이상-초과, 이하-미만을 명시하면 좋다.
  - 컨벤션을 정하거나 네이밍으로 표현한다.

Before:
```javascript
const MIN_NUMBER = 1;
const MAX_NUMBER = 20;
```

After:
```javascript
// 아래 예시가 정답은 아님
const MIN_NUMBER_LIMIT = 0;  // 초과
const MAX_NUMBER_LIMIT = 19; // 미만

const MIN_IN_NUMBER = 1; // 이상
const MAX_IN_NUMBER = 20; // 이하
```

### first-last
- min-max와 달리 범위 안의 요소들이 반드시 연속성을 가지는 것은 아닐 때 고려할 수 있는 네이밍이다.
- DOM요소처럼 처음과 마지막 요소 다룰 일이 많은 경우 고려할 수 있다.

```javascript
const foo = function($firstChild, $lastChild){
  // ...
}
```


### begin-end
- 시작과 끝이 중요한 특징인 값을 다룰 때 고려할 수 있는 네이밍이다.
- 기간이나 시간을 다룰 때 고려할 수 있다.

```javascript
const reservationDate = function(beginDate, endDate){
  // ...
}
reservationDate('YYYY-MM-DD', 'YYYY-MM-DD')
```

### prefix-suffix
- 접두사, 접미사는 값이나 컴포넌트 또는 파일에 일관성을 부여해야할 때 고려할 수 있다.
- 예를 들어 리액트에서 use라는 접두사는 훅을 나타내기 때문에, 해당 접두사가 사용된 함수는 훅임을 예측할 수 있다.

```javascript
추후 예시 추가
```

## 13. 호출하는 함수 네이밍과 매개변수 순서 간의 연관성을 고려한다.
  - 호출한 함수만 봐도, 해당 함수의 역할을 유추할 수 있도록 작성한다.
  - 매개변수의 갯수는 함수에 따라 다를 수밖에 없지만, 적어도 매개변수의 순서는 해당 함수를 유추할 수 있도록 작성되어야 한다.
Before:
```javascript
// 매개변수 순서에 일관성이 없어서 함수의 역할을 유추하기 어렵다.

getDates('2021-10-31', '2021-10-01', '2021-10-15')
getRandomNumber(1, 50, 3)
```

After:
```javascript
// 함수 이름과 매개변수 순서만으로도 함수의 역할을 유추할 수 있다.

getDates('2021-10-01', '2021-10-31')
getRandomNumber(1, 50)
```

- 매개변수가 일관되지 않을 경우
  - arguments나 rest parameter 사용을 고려한다.
    ```javascript
    const foo = function(someArg, ...someArg){

    }

    const bar = function(someArg1, someArg2){
      arguments
    }
    ```

- 이미 존재하는 함수의 매개변수가 너무 많은 경우.
  - 하나. 래핑 함수를 고려한다.
    ```javascript
    function someFunc(someArg1, someArg2, someArg3, someArg4){
    }

    // 인자 순서가 일치하는 경우
    function getFunc1(someArg1, someArg2){
      someFunc(someArg1, someArg2)
    }
    
    // 인자 순서가 일치하지 않는 경우
    function getFunc2(someArg1, someArg3){
      someFunc(someArg1, undefined, someArg3)
    }
    ```
  - 둘. 객체 구조 분해 할당을 활용하여 매개변수를 객체로 만들어 넘긴다.

    Before:
    ```javascript
    function Person(name, age, location){
      this.name = name;
      this.age = age;
      this.location = location;
    }

    const hail = new Person('Ha-il', 25, 'Korea')
    ```

    After:
    ```javascript
    function Person({ name, age, location }) {
      this.name = name;
      this.age = age;
      this.location = location ?? 'korea';
    }

    const hail = new Person({ name: "Ha-il", age: 25, location: "Korea" });
    ```
    More:
    ```javascript
    function Person(name, { age, location }) {
      this.name = name;
      this.age = age;
      this.location = location;
    }

    const hail = new Person("Ha-il", { age: 25, location: "Korea" });
    ```

## 14. 삼항연산자를 일관성있게 활용할 것.

- 모든 상황에서 삼항연산자를 사용하지 말고, 일관된 상황에서 삼항연산자를 활용하는 것이 좋음.
  - 예: 삼항연산자를 사용해서 변수에 값을 할당하는 경우만 사용하겠다고 정했다면.
  
  Before:
  ```javascript
  // 삼항연산자로 변수에 값을 할당하는게 아니라 함수 실행에 사용하는 경우
  // 아래 경우도 나쁘지는 않지만, '예'에서 내가 정한 일관성에는 벗어남

  function alertMessage(isAdult) {
    isAdult
      ? alert('입장이 가능합니다.')
      : alert('입장이 불가능합니다.')
  }
  ```

  ```javascript
  // 삼항연산자를 사용해서 변수에 값을 할당하고 있으므로 일관성이 유지됨

  const welcomeMessage = function(isLogin) {
    const name = isLogin ? getName() : '이름없음';

    return `안녕하세요 ${name}`
  }
  ```

## 15. 간단한 검사 로직은 Truthy와 Falsy 활용할 것.

- Truthy는 불리언값으로 평가되어야할 문맥에서 true로 평가되는 값을 말한다.
- Falsy는 불리언으로 평가되어야할 문맥에서 false로 평가되는 값을 말한다.


```javascript
// - Falsy 값 목록(이 외에는 모두 truthy 값이다.)

false
undefined
null
0, -0, 0n
NaN
'' (빈 문자열)
```

Before:
```javascript
const printName = function (name) {
  if (name === undefined || name === null) {
    // ...
  }
};
```

After: 
```javascript
const printName = function (name) {
  if (!name) {
    // ...
  }
};
```

## 16. 단축 평가를 활용할 것.

Before:

```javascript
const fetchData = function () {
  return state.data ? state.data : "Fetching...";
};
```

After: 

```javascript
const fetchData = function () {
  return state.data || "Fetching...";
};
```

Before:

```javascript
const getActiveUserName = function (user, isLogin) {
  if (isLogin) {
    if (user) {
      if (user.name) {
        return user.name;
      } else {
        return "이름 없음";
      }
    }
  }
};
```

After: 

```javascript
const getActiveUserName = function (user, isLogin) {
  if (isLogin && user) {
    return user.name || "이름 없음";
  }
};
```

## 17. else if, else 피하기.
- if 문의 범위를 늘리는 것보다는, 명확하게 조건을 분리하는 것이 낫다.
  - 어쩔 수 없이 else if를 많이 사용해야 한다면, switch case를 고려해라.
- else를 굳이 쓰지 않아도 되는 경우라면 사용하지 마라.
  - else를 쓰면 함수에 다른 조건이 추가되었을 때 대처하기가 어렵다.

Before:
```javascript
const getHelloCustomer = function (user) {
  if (user.name) {
    return user.name
  } else {
    return "이름없음";
  }
};
```

After: 
```javascript
const getHelloCustomer = function (user) {
  if (user.name) {
    return user.name
  } 
  
  return "이름없음";
};
```

## 18. Early Return을 활용할 것.

Before:
```javascript
function loginService(isLogin, user) {
  if (!isLogin) {
    if (!checkToken()) {
      if (!user.nickName) {
        return registerUser(user);
      } else {
        refreshToken();

        return "로그인 성공";
      }
    } else {
      throw new Error("No Token");
    }
  }
}
```

After:
```javascript
function login() {
  refreshToken();
  return "로그인 성공";
}

function loginService(isLogin, user) {
  if (isLogin) {
    return;
  }

  if (!checkToken()) {
    throw new Error("No Token");
  }

  if (!user.nickName) {
    return registerUser(user);
  }

  login();
}
```

## 19. 부정 조건문 피하고 긍정 조건을 사용할 것.
- 부정 조건문은 직관적이지 않다.
- if문의 조건에는 참 조건을 넣는 것이 직관적이다.
- 어쩔 수 없이 사용해야 한다면, 함수를 따로 만들어서 위임하는 것을 고려할 수 있다.

Before:
```javascript
if (!isNaN(3)) {
  console.log("숫자입니다.");
}
```

After:
```javascript
function isNumber(num) {
  return !Number.isNaN(num) && typeof num === "number";
}

if(isNumber(3)) {
  console.log("숫자입니다.");
}
```

- 부정 조건문을 사용해야 하는 경우도 있다.
  - Early Return 활용할 때
  - 폼 검증 등에서 유효성 검사를 할 때
  - 보안 또는 검사하는 로직을 작성할 때

## 20. Default Case 고려하기
- 언제나 예외가 발생할 수 있기 때문에, 기본값을 설정해주는 것이 좋다.

Before:
```javascript
function sum(x, y) {
  return x + y;
}
```

After:
```javascript
function sum(x, y) {
  x = x || 1;
  y = y || 1;

  return x + y;
}
```
More:
```javascript
function sum(x = 1, y = 1) {
  return x + y;
}
```

## 21. 널 병합 연산자 활용하기
- 논리 연산자 OR(||)은 왼쪽 피연산자가 Falsy 값일 때 오른쪽 피연산자를 반환한다.
- 이 때, Falsy 값 중에서도 null 또는 undefined만 평가하고 싶은 경우가 있다.
- 이런 경우 널 병합 연산자 사용을 고려할 수 있다.
- 널 병합 연산자 (??)는 왼쪽 피연산자가 null 또는 undefined일 때 오른쪽 피연산자를 반환하고, 그렇지 않으면 왼쪽 피연산자를 반환하는 논리 연산자이다.

Before:
```javascript
function createElement(type, height, width) {
  const element = document.createElement(type || "div");

  element.style.height = height || 100;
  element.style.width = width || 100;

  return element;
}
```

After:
```javascript
function createElement(type, height, width) {
  const element = document.createElement(type ?? "div");

  element.style.height = height ?? 100;
  element.style.width = width ?? 100;

  return element;
}
```

- 참고: [Nullish coalescing operator](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)

## 22. 드모르간의 법칙
- !(A || B) === !A && !B
- 하나의 조건을 부정할 때, 해당 조건의 괄호로 감싸고 !를 붙여 부정하는 방법이 있다.
- 하지만 이 방법을 사용할 경우, 추후 새로운 조건을 붙여야 할 때 어려움이 발생할 수 있다.
- 이 때 드모르간의 법칙을 이용해 괄호를 분리할 경우, 새로운 조건을 붙이기 용이하다.

Before:
```javascript
if (!(isValidToken && isValidUser)) {
  console.log("로그인 실패");
}
```

After:
```javascript
if (!isValidToken || !isValidUser) {
  console.log("로그인 실패");
}
```

## 23. arr.length 사용 주의하기

- arr.length에 값을 할당할 경우, 배열이 조작되기 때문에 주의가 필요하다.

```javascript
const arr = [1, 2, 3];

console.log(arr.length); // 3

arr.length = 10;
console.log(arr.length, arr); // 10, [1, 2, 3, empty × 7]

arr.length = 0;
console.log(arr.length, arr); // 0, []
```

## 24. 배열 구조 분해 할당 활용하기

Before:
```javascript
function clickGroupButton() {
  const confirmButton = document.getElementsByTagName("button")[0];
  const cancelButton = document.getElementsByTagName("button")[1];
  const resetButton = document.getElementsByTagName("button")[2];
}
```

After:
```javascript
function clickGroupButton() {
  const [confirmButton, cancelButton, resetButton] =
    document.getElementsByTagName("button");
}
```

## 25. 배열의 불변성을 지킬 것.
- 배열을 복사해서 사용할 것

Before:
```javascript
const originArray = [1, 2, 3];

const newArray = originArray;

originArray.push(4);
originArray.unshift(0);

console.log(originArray); // [ 0, 1, 2, 3, 4 ]
console.log(newArray); // [ 0, 1, 2, 3, 4 ]
```

After: 
```javascript
const originArray = [1, 2, 3];

const newArray = [...originArray];

originArray.push(4);
originArray.unshift(0);

console.log(originArray); // [ 0, 1, 2, 3, 4 ]
console.log(newArray); // [ 1, 2, 3 ]
```

- 새로운 배열을 반환하는 메서드를 활용할 것

## 26. 배열 메서드 체이닝 활용하기

Before:
```javascript
const price = ["2000", "1000", "3000", "5000", "4000"];

const suffixWon = (price) => price + "원";
const isOverOneThousand = (price) => Number(price) > "1000";
const ascendingList = (a, b) => a - b;

function getWonPrice(priceList) {
  const isOverList = priceList.filter(isOverOneThousand);
  const sortList = isOverList.sort(ascendingList);

  return sortList.map(suffixWon);
}

const result = getWonPrice(price);

console.log(result); // [ '2000원', '3000원', '4000원', '5000원' ]
```

Good:
```javascript
const price = ["2000", "1000", "3000", "5000", "4000"];

const suffixWon = (price) => price + "원";
const isOverOneThousand = (price) => Number(price) > "1000";
const ascendingList = (a, b) => a - b;

function getWonPrice(priceList) {
  return priceList
  .filter(isOverOneThousand)
  .sort(ascendingList)
  .map(suffixWon);
}

const result = getWonPrice(price);

console.log(result); // [ '2000원', '3000원', '4000원', '5000원' ]

```

## 27. 배열 반복의 흐름 제어하고 싶다면
- 배열 고차함수 또는 forEach문을 활용하면 반복을 중간에 멈추는 등의 제어가 어렵다.
- 그럴 때는 아래와 같은 방법을 참고한다.

        for...of, for...in 반복문
        Array.prototype.every()
        Array.prototype.some()
        Array.prototype.find()
        Array.prototype.findIndex()

## 28. 프로퍼티와 메서드의 축약 표현을 활용할 것.

Before:
```javascript
const firstName = "Ha-il";
const lastName = "Kim";

const person = {
  firstName: firstName,
  lastName: lastName,
  getFullName: function () {
    return this.firstName + " " + this.lastName;
  },
};
```

After:
```javascript
const firstName = "Ha-il";
const lastName = "Kim";

const person = {
  firstName,
  lastName,
  getFullName() {
    return this.firstName + " " + this.lastName;
  },
};
```

## 29. 계산된 프로퍼티 이름을 활용할 것
- 객체의 프로퍼티를 작성할 때 `[]`를 활용하면 계산된 프로퍼티 이름을 사용할 수 있다.

```javascript
const prefix = "prop";

let i = 0;

const obj = {
  [`${prefix}-${++i}`]: i,
  [`${prefix}-${++i}`]: i,
  [`${prefix}-${++i}`]: i,
};

console.log(obj); // { 'prop-1': 1, 'prop-2': 2, 'prop-3': 3 }
```

## 30. lookup(검색)을 위한 객체를 사용할 것
- 아래와 같이 switch문을 사용해야하는 경우, 객체를 활용하면 더욱 깔끔한 코드를 작성할 수 있다.

- Before:
```javascript
function getUserType(type) {
  switch (key) {
    case "ADMIN":
      return "관리자";
    case "INSTRUCTOR":
      return "강사";
    case "STUDENT":
      return "수강생";
    default:
      return "해당 없음";
  }
}
```

- After: 
```javascript
function getUserType(type) {
  const USER_TYPE = {
    ADMIN: "관리자",
    INSTRUCTOR: "강사",
    STUDENT: "수강생",
    UNDEFINED: "해당 없음" 
  };
  return USER_TYPE[type] || USER_TYPE.UNDEFINED;
}

console.log(getUserType("ADMIN")); // 관리자
```

- More:
```javascript
function getUserType(type) {
  return (
    {
      ADMIN: "관리자",
      INSTRUCTOR: "강사",
      STUDENT: "수강생",
    }[type] ?? "해당 없음"
  );
}

console.log(getUserType("ADMIN")); // 관리자
```

## 31. Object.freeze는 중첩 객체까지 동결할 수 없음을 알 것.
해결책:
- lodash 같은 대중적인 유틸 라이브러리 사용하기
- 스택 오버플로우 확인하기
- 타입스크립트에서 readonly 사용하기
- 직접 유틸 함수 생성하기

```javascript
// 중첩 객체까지 동결할 수 있는 유틸 함수 deepFreeze
function deepFreeze(target) {
  if (target && typeof target === "object" && !Object.isFrozen(target)) {
    Object.freeze(target);
    Object.keys(target).forEach((key) => deepFreeze(target[key]));
  }
  return target;
}
```

## 32. Object.prototype.hasOwnProperty.call()을 사용을 고려할 것.
- hasOwnProperty는 다른 키워드처럼 자바스크립트의 보호를 받지 못하기 때문.
- 프로토타입에 접근하는 것은 권하지 않지만, call()을 사용하면 그나마 안전하다.

```javascript
const foo = {
  hasOwnProperty: function () {
    return "hasOwnProperty";
  },
  bar: "Here be dragons",
};

console.log(foo.hasOwnProperty("bar")); // hasOwnProperty

console.log(Object.prototype.hasOwnProperty.call(foo, "bar")); // true
```

## 33. 객체에 직접 접근하는 것은 피할 것.
- 객체에 직접 접근하는 액션을 다른 함수에 위임하여 추상화할 것
- 접근자를 사용하는 방법도 있다.

Before:
```javascript
const model = {
  isLogin: false,
  isValidToken: false,
};

// model에 직접 접근하고 있음
function login() {
  model.isLogin = true;
  model.isValidToken = true;
}

function logout() {
  model.isLogin = false;
  model.isValidToken = false;
}

someElement.addEventListener("click", login);
```

After: 
```javascript
// 직접 접근 피하기
const model = {
  isLogin: false,
  isValidToken: false,
};

// model에 대신 접근
function setLogin(bool) {
  model.isLogin = bool;
}

// model에 대신 접근
function setValidToken(bool) {
  model.isLogin = bool;
}

// model에 직접 접근 X
function login() {
  setLogin(true);
  setValidToken(true);
}

// model에 직접 접근 X
function logout() {
  setLogin(false);
  setValidToken(false);
}

someElement.addEventListener("click", login);
```

## 34. 함수에서 기본값을 활용해보자.
```javascript
const required = (argName) => {
  throw new Error("required is " + argName);
};
function createCarousel({
  margin = required("margin"),
  center = false,
  navElement = "div",
} = {}) {
  return {
    margin,
    center,
    navElement,
  };
}

console.log(createCarousel()); // Error: required is margin
console.log(createCarousel({ margin: 10 })); // { margin: 10, center: false, navElement: 'div' }
```

## 35. void 함수를 굳이 반환하지 말자.
- 자신이 사용하는 API가 반환이 있는지 없는지 확인하자.
```javascript
function showAlert(message) {
  return alert(message)
}
```
```javascript
function showAlert(message) {
  alert(message)
}
```

## 36. 화살표 함수
- 화살표 함수를 메서드 작성에 사용할 경우
- 화살표 함수는 렉시컬 스코프를 가진다.
- 화살표 함수로 작성한 메서드를 호출한 객체를 바라보지 않는다.
- arguments를 사용할 수 없음 => rest 파라미터 사용하면 됨
- call, aplly, bind를 사용할 수 없음
- 화살표 함수로 만든 함수는 생성자로 사용할 수 없다.
- 클래스에서 메서드를 화살표 함수로 만드는 경우
  - 생성자 함수 내부에서 초기화되어 버린다.
  - 자식 클래스에서 오버라이딩 되지 않는다.