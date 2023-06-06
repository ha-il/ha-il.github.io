---
title: 알고리즘 & 자료구조 스터디 1주차
date: "2023-04-04T22:15:00.000Z"
description: "스터디 1주차 내용 정리와 회고입니다."
category: "Algorithm"
featuredImage: "../../../../src/images/algorithm-256x256.png"
mobileImage: "../../../../src/images/algorithm-512x256x2.png"
---

## Big O notation(빅 오 표기법)

### 빅 오 표기법은 왜 배우는 거죠?
알고리즘을 배우기 전에 [빅 오 표기법](https://ko.wikipedia.org/wiki/%EC%A0%90%EA%B7%BC_%ED%91%9C%EA%B8%B0%EB%B2%95)을 알아둬야 하는 이유가 뭘까요?

그것은 바로, 빅 오 표기법이 알고리즘의 성능을 구할 수 있는 하나의 지표가 되기 때문입니다.

어떤 문제를 해결하기 위한 알고리즘이라는 것은 사실 굉장히 다양합니다.

그런 다양한 알고리즘 중에서는 분명 성능이 좋은 것도 있고, 나쁜 것도 있을 것입니다.

우리는 그런 다양한 알고리즘 중에서 성능이 좋은 알고리즘을 구별할 수 있어야 합니다.

빅 오 표기법은, 알고리즘의 복잡도를 나타내어 알고리즘의 성능을 분석하고 비교할 수 있게 해줍니다.

내가 작성한 알고리즘의 성능을 빅 오 표기법으로 나타낼 수 없다면, 내 알고리즘이 다른 알고리즘에 비해 좋은 성능을 가지고 있는지 아닌지 알 수가 없습니다.

따라서, 알고리즘을 배우기 전에 빅 오 표기법에 대해서 알아두는 것은 중요합니다.


### 빅 오 표기법은 뭔가요?

빅 오 표기법은 알고리즘의 성능을 분석하기 위해서 사용한다고 했습니다.

그러면 좋은 성능을 가졌다는 것은 무슨 의미일까요?

일반적으로는 빠른 알고리즘이 좋은 알고리즘이라고 할 수 있을 것입니다.

그리고, 그 빠름이라는 것은 알고리즘이 실행되고 완료되기까지의 시간을 통해서 알 수 있을 것입니다.

하지만, 시간은 알고리즘 측정의 기준이 되기 어렵습니다.

왜 그럴까요?

알고리즘의 수행 시간이라는 것은 사실 환경에 영향을 많이 받습니다.

동일한 알고리즘이라고 해도, 알고리즘이 실행되는 환경(컴퓨터의 사양 등)에 따라서 수행 시간이 달라진다는 의미입니다.

그리고 알고리즘의 수행시간이 측정이 어려울 정도로 짧은 경우, 정확한 시간을 측정하기가 어렵습니다.

이런 이유로 시간이라는 기준은 알고리즘의 성능을 분석하기에는 적합하지 않습니다.

그래서, 알고리즘의 성능을 분석할 때는 **연산의 갯수** 가 기준이 됩니다.

그리고 빅 오 표기법은 연산의 갯수를 **대략적**으로 파악하여 공식화한 것입니다.

아니, 성능을 분석한다면서 왜 **연산의 갯수**로, 심지어 **대략적**으로 파악해서 알고리즘의 성능을 표기하는 것일까요?

성능을 제대로 분석할 수나 있는 걸까요?

그 이유에 대해서는 빅 오 표기법이 어떻게 표기되는지 설명한 다음 말씀드리겠습니다.

### 빅 오 표기법은 어떻게 표기하나요?

빅 오 표기법을 알아보기 전에, 먼저 예시를 보고 **연산의 갯수**를 **대략적**으로 구해봅시다.

```javascript
// getAverage의 연산 갯수는 더하기 한 번, 나눗셈 한 번으로 총 2 개 입니다.
// a, b로 어떤 숫자가 들어와도 연산 갯수는 늘 2개로 일정할 것입니다.
// 대략적으로 연산의 갯수 * 1 이라고 볼 수 있겠습니다.
const getAverage = (a, b) => (a + b) / 2

// addUpTo의 연산 갯수는 얼마일까요?
// 연산 갯수가 얼마든 n이 5라면 addUpTo의 연산 갯수는 5배입니다.
// 반복문이 n만큼 반복되기 떄문입니다.
// 대략적으로 연산의 갯수 * n 이라고 볼 수 있겠습니다.
const addUpTo = n => {
  let total = 0
  for (let i = 1; i <= n; i++) {
    total += i
  }
  return total
}

// printAllPairs의 연산 갯수는 얼마일까요?
// 연산 갯수가 얼마든 n이 3라면 printAllPairs의 연산 갯수는 9배입니다.
// n만큼 반복되는 반복문이 중첩되어 있기 때문입니다.
// 대략적으로 연산의 갯수 * n² 이라고 볼 수 있겠습니다.
const printAllPairs = n => {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      console.log(i, j)
    }
  }
}
```
위의 예시의 경우 비교적 단순한 코드임에도, 정확한 연산 갯수를 세는 것은 쉽지 않은 일이었습니다.

하물며 복잡한 코드라면 더욱 어렵겠지요?

예시의 주석을 통해서 이미 보셨듯이, 빅 오 표기법에서 연산의 갯수를 구할 때는 정확한 갯수가 중요하지 않습니다.

빅 오 표기법에서는 해당 코드가 매우 여러번 반복한다는 것을 가정하고, 연산 갯수의 추세를 구하는 것이 중요합니다.

그래서 빅 오 표기법이 **연산의 갯수**를 **대략적으로** 파악하여 공식화한 것이라고 말씀드린 것입니다.

위에서 살펴본 예시를 각각 빅오 표기법으로 표기하면 아래와 같이 표기할 수 있습니다.

getAverage : `O(1)` (여기서 숫자 1은, 연산의 갯수가 1개라는 의미가 아니라 연산의 갯수가 변함없이 일정함을 의미합니다.)

addUpTo : `O(n)` 

printAllPairs : `O(n²)`


### 빅오 표기법은 어떻게 해석하나요?

빅오 표기법을 **시간 복잡도** 관점에서 해석하면 아래와 같습니다.

- `O(1)` : n이 어떤 값을 가져도 연산 갯수는 일정함
  - 연산의 갯수가 2 개, 10 개, 100 개 상관없이 갯수가 일정하다면 `O(1)`으로 표기합니다.
- `O(n)` : n의 값이 커질수록 연산의 갯수가 n에 비례해서 늘어난다.
  - 연산의 갯수가 2n 개, 5n 개, 10n+50 개 상관없이, 전반적인 추세가 n 개라면 `O(n)`으로 표기합니다.
  - 무한히 반복하면 결국 n개 로 수렴하기 때문입니다.
- `O(n²)` : n의 값이 커질 수록 연산의 갯수가 n제곱의 값으로 늘어난다.
   - 연산의 갯수가 2n² 개, 5n²+10 개, 10n²+5n+8 개 상관없이, 전반적인 추세가 n² 개라면 `O(n²)`로 표기합니다.
   - 무한히 반복하면 결국 n² 개로 수렴하기 때문입니다.

이 외에도 `O(log n)` 과 `O(nlog n)`이 있습니다. 

(참고: 빅 오 표기법에서 log는 보통 log₂를 의미합니다.)

앞서 언급한 빅 오 표기법을 성능에 따라 나열 아래와 같습니다.

    O(1), O(log n), O(n), O(nlog n), O(n²) 순으로 성능이 좋습니다.

### 빅오 표기법을 정리하면
- 빅 오 표기법은 연산의 갯수를 대략적으로 파악하여 공식화한 것입니다.
- 연산 갯수의 세부 사항보다는 전반적인 추세에 주목합니다.
- 빅 오 표기법은 실행시간이 가질 수 있는 최대치를 표기합니다.


### 우리가 쓰는 자바스크립트 객체와 배열 메서드의 성능은 어떨까?

빅 오 표기법이 무엇인지 알아봤으니, 우리에게 익숙한 자바스크립트 객체와 배열 메서드의 성능을 빅 오 표기법으로 표현해봅시다.

#### 객체 메서드의 빅 오 표기법과 이유

- [Object.keys](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) : `O(N)`
  - key의 갯수에 비례해서 연산이 증가하기 때문입니다.
- [Object.values](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/values) : `O(N)`
  - value의 갯수에 비례해서 연산이 증가하기 때문입니다.
- [Object.entries](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) : `O(N)`
  - [key, value] 쌍의 배열의 갯수에 비례해서 연산이 증가하기 때문입니다.
- [hasOwnProperty](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty) : `O(1)`
  - 객체에서 프로퍼티에 접근할 때는 O(1)이므로, hasOwnProperty도 같은 이유로 O(1)입니다.

#### 배열 메서드의 빅 오 표기법과 이유

- [Array.push](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/push) - `O(1)`
  - 요소의 갯수에 상관없이 배열의 끝에 요소를 추가하기 때문입니다.
- [Array.unshift](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift) - `O(N)` 
  - 기존 요소들의 인덱스를 증가시킨 다음 맨 앞에 요소를 추가하기 때문에, 기존 요소 갯수에 비례해서 연산의 갯수가 증가합니다.
- [Array.pop](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/pop) - `O(1)`
  - 요소의 갯수에 상관없이 배열의 마지막 요소를 삭제하기 때문입니다.
- [Array.shift](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/shift) - `O(N)`
  - 첫 번째 요소를 제거하면 나머지 요소들의 인덱스가 전부 변하기 때문에, 요소의 갯수에 비례해서 연산이 증가합니다.
- [Array.concat](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) - `O(N)`
  - 뒤에 추가되는 배열의 요소가 많아질수록 연산의 갯수도 증가하기 때문입니다.
- [Array.slice](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) - `O(N)`
  - 복사하는 요소의 개수에 따라 연산의 갯수도 증가하기 때문입니다.
- [Array.splice](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) - `O(N)`
  - 배열의 위치에 따라 다르지만, 배열의 중간에 사용할 경우 기존 요소들의 인덱스가 바뀌기 때문에, 기존 요소의 갯수에 따라 연산의 갯수가 증가합니다.
- [Array.sort](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) - `O(N*log N)`
  - 추후 정렬 알고리즘 포스팅에서 더 자세히 알아보겠습니다.
- [Array.forEach/map/filter/reduce](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array) - `O(N)`
  - 배열 요소 갯수만큼 연산의 갯수가 늘어나기 때문입니다.

## 회고

빅 오 표기법은 앞으로 배울 알고리즘들의 성능을 분석하고 비교하기 위해서 반드시 알아둬야 할 개념임에는 분명하지만, 제가 빅 오 표기법을 알고 있다고 해서 저의 알고리즘 작성 능력이 비약적으로 상승하는 일은 없을 것입니다.

하지만 앞으로 코드를 작성하거나 코딩 테스트를 풀 때, 내가 작성하고 있는 코드의 성능을 염두해두면서 코드를 작성할 수 있지 않을까 싶습니다.

예를 들어, 중첩된 반복문을 최대한 피해서 코드를 작성하거나, 늘 배열로 해결하던 문제를 객체로 접근해서 복잡도를 낮춰본다거나, 빌트인 메서드를 사용할 때도 해당 메서드의 성능을 고민해보거나 하는 식으로 말이죠.

무작정 빅 오 표기법이라는 지식만 습득한 것이 아니라, 내가 이것을 배워서 어디다 써먹을 수 있을지 고민하며 학습하는 것은 재미도 있고 기억에도 오래 남는 것 같습니다.

## 참고 자료

- Best JavaScript Data Structures & Algorithms Course by Udemy, last updated January 2022, accessed April 5, 2023
강의 링크: [https://www.udemy.com/course/best-javascript-data-structures/](https://www.udemy.com/course/best-javascript-data-structures/)