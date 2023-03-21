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
  
  Better:
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
  
  Better:
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

Better:
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

Better:
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

Better:
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

Bad:
```javascript
const MIN_NUMBER = 1;
const MAX_NUMBER = 20;
```

Better:
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
  - 매개변수는 2개까지가 적당하고, 그 이상 늘어나면 유추가 어렵다.
Bad:
```javascript
// 매개변수가 3개이고, 매개변수 순서에 일관성이 없어서 함수의 역할을 유추하기 어렵다.

getDates('2021-10-31', '2021-10-01', '2021-10-15', )
getRandomNumber(1, 50, 3)
```

Better:
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

- 이미 존재하는 함수의 매개변수가 너무 많은데, 함수를 고칠 수 없다면.
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
  - 둘. 매개변수를 객체로 만들어 넘긴다.
    ```javascript
    function someFunc({someArg1, someArg2, someArg3, someArg4}){
    }
    ```

## 14. 삼항연산자를 일관성있게 활용할 것.

- 모든 상황에서 삼항연산자를 사용하지 말고, 일관된 상황에서 삼항연산자를 활용하는 것이 좋음.
  - 예: 삼항연산자를 사용해서 변수에 값을 할당하는 경우만 사용하겠다고 정했다면.
  
  Bad:
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

Bad:
```javascript
const printName = function (name) {
  if (name === undefined || name === null) {
    // ...
  }
};
```

Better: 
```javascript
const printName = function (name) {
  if (!name) {
    // ...
  }
};
```

## 16. 단축 평가를 활용할 것.

Bad:

```javascript
const fetchData = function () {
  return state.data ? state.data : "Fetching...";
};
```

Better: 

```javascript
const fetchData = function () {
  return state.data || "Fetching...";
};
```

Bad:

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

Better: 

```javascript
const getActiveUserName = function (user, isLogin) {
  if (isLogin && user) {
    return user.name || "이름 없음";
  }
};
```

## 17. else if, else 피하기
- if 문의 범위를 늘리는 것보다는, 명확하게 조건을 분리하는 것이 낫다.
  - 어쩔 수 없이 else if를 많이 사용해야 한다면, switch case를 고려해라.
- else를 굳이 쓰지 않아도 되는 경우라면 사용하지 마라.
  - else를 쓰면 함수에 다른 조건이 추가되었을 때 대처하기가 어렵다.

Bad:

```javascript
const getHelloCustomer = function (user) {
  if (user.name) {
    return user.name
  } else {
    return "이름없음";
  }
};
```

Better: 

```javascript
const getHelloCustomer = function (user) {
  if (user.name) {
    return user.name
  } 
  
  return "이름없음";
};
```
