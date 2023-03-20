---
title: 자바스크립트 코드 작성 요령
date: "2023-03-20T20:36:00.000Z"
description: "실전에서 사용할 수 있는 자바스크립트 코딩 팁을 정리했습니다."
featuredImage: "../../../src/images/js-256x256.png"
mobileImage: "../../../src/images/js-512x256x2.png"
---


## 1. 전역 변수는 가급적 사용하지 말 것.
  - 변수 및 함수 이름이 충돌할 가능성이 상승한다.
  - 어디서든 접근할 수 있어서 유지보수가 어렵다.
  - 변수를 찾기 위해 전역 스코프를 탐색해야 해서 성능이 떨어진다.


## 2. var는 사용하지 말 것.
  - 아래와 같은 특징 때문에, 코드의 예측이 어렵다.
    - 변수 중복 선언 허용
    - 함수 레벨 스코프
      - 함수의 코드 블록만 지역스코프로 인정하는 것.
      - 전역 변수를 남발할 가능성이 높아서 위험하다.
    - 호이스팅
      - 변수 선언문이 코드의 선두로 끌어올려진 것처럼 동작하는 것.


## 3. 임시 변수는 최대한 사용하지 말 것.
  - 함수 내에 임시 변수가 존재할 경우, 함수 내부에서 임시 변수를 조작하게 될 수 있다.
  - 이럴 경우, 하나의 함수에 추가로 역할이 부여될 수도 있고, 사이드 이펙트가 발생하여 함수의 예측을 어렵게 만들기도 한다.
  - 임시 변수를 활용할 경우, 명령형 프로그래밍이 될 가능성이 높아진다.

  Bad:
  ```javascript
  function sum(a, b) {
    const result = 0;
    result = a + b;
    return result;
  }
  ```
  
  Good:
  ```javascript
  function sum(a, b) {
    return a + b;
  }
  ```


## 4. 명령형보다 선언형으로 프로그래밍할 것.
  - 명령형 프로그래밍은 값을 예측하기가 어렵다.

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


## 5. 함수 선언시 함수 표현식을 사용할 것.
  - 함수도 호이스팅되기 때문이다.
  
  Bad:
  ```javascript
  function sum(a, b) {
    return a + b;
  }
  ```
  
  Good:
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

Bad:
```javascript
const value = "1";

value == 1; // true
```

Good:
```javascript
const value = "1";

Number(value) === 1; // true
```

## 9. 암묵적 형변환보다 명시적 형변환을 사용할 것

Bad:
```javascript
const inputValue = 100;
const outoutValue = inputValue + "";

typeof outoutValue; // 'string'
```

Good:
```javascript
const inputValue = 100;
const outoutValue = String(inputValue);

typeof outoutValue // 'string'

```

## 10. parseInt(string, radix)에서 radix를 생략하지 말 것.
- parseInt의 기본 값은 10이 아니다.
- 10진수로 변환되길 바란다면, radix에 10을 명시할 것.

Bad:
```javascript
parseInt("010"); // 8
```

Good:
```javascript
parseInt("010", 10); // 10
```

- 참고: parseInt를 Math.floor()의 대체품으로 사용하지 말 것.
  - 일부 숫자는 6.022e23(6.022 × 10^23)처럼 문자열 표현에 e 문자를 사용하기 때문에, parseInt를 매우 크거나 매우 작은 숫자의 소수점 이하 값을 자르기 위해 사용하면 예기치 못한 결과가 발생할 수 있다. 
  - 참고자료: [parseInt()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/parseInt#%EC%84%A4%EB%AA%85)


## 11. isNaN() 대신 Number.isNaN()을 사용할 것
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