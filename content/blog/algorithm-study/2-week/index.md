---
title: "문제 해결 접근법"
date: "2023-04-12T17:20:00.000Z"
description: "문제 해결 접근법 5단계를 문제 풀이에 적용해봤습니다."
category: "algorithm"
featuredImage: "../../../../src/images/algorithm-256x256.png"
mobileImage: "../../../../src/images/algorithm-512x256x2.png"
---
## 문제 해결 접근법

이번 글에서는 문제 해결 접근법에 대해서 다뤄보겠습니다.

문제 해결 접근법이란 무엇일까요?

코딩 테스트 문제가 하나 있다고 가정해봅시다.

문제를 읽자마자 바로 풀이에 들어갈 수도 있겠지만,

이 문제를 해결해기 위해서 문제에 어떻게 접근할 것인지 나름의 계획이나 전략을 세워볼 수도 있을 것입니다.

이번 글에서는 이러한 행위를 '문제 해결 접근법'이라 정의하고, 실제 코딩테스트 문제를 풀어보면서 문제 해결 접근법을 적용해보겠습니다.

### 문제 해결 접근법의 5단계

코딩테스트 문제를 살펴보기 전에, 문제 해결 접근법과 각 단계를 간단히 소개하고 가겠습니다.

문제 해결 접근법은 총 5단계로 이뤄져 있습니다.
```
1. Understand the Problem: 문제 이해

2. Explore Examples: 예시 탐구

3. Break It Down: 분석

4. Solve or Simplify: 해결/단순화

5. Look Back & Refactor: 회고와 리팩터링
```

각 단계의 세부사항을 알아보겠습니다.

#### 1. Understand the Problem: 문제 이해

1. `내 방식으로 이해하기`: 그 문제를 내 방식대로 다시 생각할 수 있는가? 
2. `입력값 파악하기`: 문제에 들어있는 입력 정보는 무엇인가?
3. `출력값 파악하기`: 문제 해결에서 도출해야 할 결과는 무엇인가?
4. `예외상황 파악하기`: 입력값이 출력값을 결정할 수 있는가? 즉, 문제를 해결할 수 있는 충분한 정보를 가지고 있는가?
5. `네이밍 파악하기`: 문제의 일부인 중요한 데이터에 어떻게 레이블(이름)을 지정해야 하는가?

#### 2. Explore Examples: 예시 탐구
1. `간단한 예시 만들기`: 입력값과 출력값의 순서대로 예시를 작성해보기
2. `더 복잡한 예시 만들기`: (예: 문자열을 입력받는 상황이라면, 공백이나 기호는 어떻게 처리할 것인가?)
3. `예외 상황을 고려한 예시 만들기` : (예: 빈 입력값, 유효하지 않은 입력값은 어떻게 처리할 것인가?)

#### 3. Break It Down: 문제 세분화하기
- 문제를 세분화하고, 문제 해결의 뼈대를 잡는 과정.
- 문제 해결에 필요한 요소와 과정을 적어본다.

#### 4. Solve or Simplify: 해결하거나 단순화하기
- 문제 세분화 단계에서 적었던 문제 해결 과정대로 문제를 해결한다.
- 어려운 부분에 막혀서 문제가 해결되지 않는다면?
  - 일단 그 부분을 무시하고, 풀 수 있는 단순한 부분을 먼저 작성한다.
  - 그런 다음 어려운 부분을 다시 해결해보고, 해결됐다면 기존 코드와 통합한다.

#### 5. Look Back & Refactor: 회고와 리팩터링
 - 문제 해결 후, 다음과 같은 질문을 해본다.
    - 결과를 다르게 도출할 수 있는가?
    - 해결책이 직관적인가?
    - 결과나 방법을 다른 문제에 사용할 수 있는가?
    - 해결책의 성능을 개선할 수 있는가?
    - 다른 리팩터링 방법을 생각해 낼 수 있는가?
    - 다른 사람들은 이 문제를 어떻게 해결했는가?

### 문제 해결 접근법으로 코딩 테스트 문제를 풀어보자

이제 본격적으로 문제 해결 접근법을 적용하여 코딩 테스트 문제를 풀어보겠습니다.

문제 해결보다도 문제 해결 접근법을 적용하는 것에 목적이 있기 때문에, 쉬운 난이도의 문제를 준비했습니다.

이번에 준비한 문제는, 프로그래머스 코딩테스트 연습 Lv.0 문제 '연속된 수의 합'입니다.

```
문제:

연속된 세 개의 정수를 더해 12가 되는 경우는 3, 4, 5입니다. 
두 정수 num과 total이 주어집니다. 
연속된 수 num개를 더한 값이 total이 될 때, 
정수 배열을 오름차순으로 담아 return하도록 solution함수를 완성해보세요.
```


#### 문제 이해
```javascript
/*
1. 문제 이해
    - 내 방식으로 이해하기
      - 합한 값이 total과 같은 연속된 정수 num개를 오름차순으로 정렬하여 배열로 반환하라.
      - 중간 값을 구한 다음에 중간 값 앞 뒤로 +1, -1을 값을 추가하면 되지 않을까?
    - 입력값 파악하기:
        - 1 ≤ num ≤ 100
        - 0 ≤ total ≤ 1000
    - 출력값 파악하기
        - result: [Number:정수]
    - 예외상황 파악하기
        - 입력값인 num과 total의 타입과 범위가 한정되어있기 때문에 다른 타입에 대해서는 고려하지 않음.
    - 네이밍 파악하기
        - num: 연속된 정수의 갯수
        - total: 연속된 정수의 num개를 더한 값
        - middleValue: total을 num으로 나눈 값으로 소숫점 밑 부분은 버린다.
        - result: 연속된 정수 num개를 오름차순 정렬한 배열
*/

function solution(num, total) {
    var answer = [];
    return answer;
}
```
#### 예시 탐구
```javascript
/*
2. 예시 탐구
    - 간단한 예시 만들기
        - 입력값과 출력값의 배열 요소가 전부 양수인 경우
            - solution(3, 12) // [3, 4, 5]
    - 복잡한 예시 만들기
        - 출력 값의 배열 요소에 음수가 포함되는 경우
            - solution(5, 5) // [-1, 0, 1, 2, 3]
*/

function solution(num, total) {
}
```
#### 문제 세분화 하기
```javascript
function solution(num, total) {
    // result를 빈 배열로 초기화합니다.
    // 변수 middleValue를 선언합니다.
    // middleValue에 다음 값을 할당합니다
        // total을 num으로 나누고, 소숫점 밑 부분은 버림
    // result에 middleValue를 push합니다.
    // result의 length가 num과 같아질 때까지 아래 코드를 반복합니다.
        // 홀수 번째: middleValue + i을 push 합니다.
        // 짝수 번째: middleValue - i을 unshift 합니다.
    // result를 반환합니다.
}
```
#### 해결 or 단순화
```javascript
function solution(num, total) {
  // result를 빈 배열로 초기화합니다.
  let result = [];
  // 변수 middleValue를 선언합니다.
  // middleValue에 다음 값을 할당합니다
      // total을 num으로 나누고 소숫점 밑 부분은 버림
  let middleValue = Math.floor(total / num);

  // result에 middleValue를 push합니다.
  result.push(middleValue);

  // result의 length가 num과 같아질 때까지 아래 코드를 반복합니다
  for (let i = 1; i < num; i++) {
    // 홀수 번째: middleValue + i을 push 합니다.
    if (i % 2 !== 0) {
      middleValue = middleValue + i;
      result.push(middleValue);
    } else {
      // 짝수 번째: middleValue - i을 unshift 합니다.
      middleValue = middleValue - i;
      result.unshift(middleValue);
    }
  }
  // result를 반환합니다.
  return result;
}
```
제출후 채점까지 통과했으나, 여전히 아쉬운 점이 많은 코드입니다.

#### 회고

제출 후 아쉬웠던 점 세 가지를 꼽아봤습니다.
```
내 풀이에서 아쉬웠던 점

1. 등차수열과 관련된 문제라서, 이 문제에 적용할 수 있는 수학 공식이 있을 것이다. 검색해서 찾아보자.
  - 공식을 적용하면 코드를 더 단순화시킬 수 있을 것 같다.

2. result와 middleValue라는 임시변수 없이 작성해보자.
  - 임시 변수가 많으면 명령형 프로그래밍이 될 가능성이 높고, 
    임시 변수의 조작으로 부수효과가 발생해 함수 동작의 예측이 어려워진다.

3. 명령형으로 작성이 되었는데, 선언형으로 다시 작성해보자.
  - 명령형으로 작성된 코드는 값을 예측하기가 어렵다.
```

#### 리팩터링

제가 꼽았던 세 가지 아쉬웠던 점을 바탕으로 코드를 리팩터링 해보겠습니다.

```javascript
/*
1. 등차수열과 관련된 문제라서, 이 문제에 적용할 수 있는 수학 공식이 있을 것이다. 검색해서 찾아보자.
  - 등차수열의 합을 구하는 공식이 있다.
  - 초항부터 n번째 항까지의 합을 S𝗇이라고 할 때.
  - S𝗇 = n(a₁ + a𝗇) / 2
       = n{2a₁ + (n-1)d} / 2 
*/

function solution(num, total) {
  // result를 빈 배열로 초기화합니다.
  const result = [];
  // 반환될 배열의 첫번째 숫자를 구합니다.
    // 첫 번째 숫자(x) 구하는 방법
      // x + (x + 1) + ... + (x + num - 1) = total
      // (num * x) + (1 + 2 + ... + (num - 1)) = total
      // (num * x) + {(num - 1) * num} / 2 = total
      // x = (2 * total / num - num + 1) / 2
  // 첫 번째 숫자를 firstNumber에 위 공식을 넣어서 초기화합니다.
  const firstNumber = ((2 * total) / num - num + 1) / 2;
  // 첫 번째 숫자부터 num - 1 번째 숫자까지 배열에 추가합니다.
  for (let i = 0; i < num; i++) {
    result.push(firstNumber + i);
  }
  console.log(result);
  // result를 반환합니다.
  return result;
}
```
등차수열의 합을 구하는 공식을 이용해 코드가 조금 더 단순해졌습니다.

다음은 임시변수를 최대한 없애고 선언형에 가깝게 작성해보겠습니다.

```javascript
/*
2. result와 middleValue라는 임시변수 없이 작성해보자.
3. 명령형으로 작성이 되었는데, 선언형으로 다시 작성해보자.
*/
function solution(num, total) {
  let firstNumber = ((2 * total) / num - num + 1) / 2;
  return new Array(num).fill(firstNumber).map((_, i) => firstNumber + i);
}
```

result 임시변수를 없애고, 반환해야할 값을 바로 반환하도록 작성했습니다.

배열 고차함수를 활용하여 선언형에 조금 더 가깝게 작성해봤습니다.

### 문제 해결 접근법 적용 회고

예전에는 이렇게 계획을 세우기보다는, 문제를 해결할 수 있는 핵심 로직이 떠오르면 일단 그것부터 작성했었습니다.

제가 이번에 풀었던 문제를 예로 들면, 바로 middleValue를 구하는 로직을 작성하고, 나머지 코드를 붙여가는 식으로 작성했다는 뜻입니다.

그렇게 문제가 풀리면 다행이지만, 그 로직으로 문제가 풀리지 않을 때는 어디서부터 손을 대야할지 모른 채 로직을 갈아엎으면서 시간을 허비했던 것 같습니다.

하지만, 이렇게 문제 해결 접근법을 적용해보니, 내가 정확히 절차를 밟아가면서 문제를 해결하고 있다는 느낌도 들었고,

계획과 절차가 있기 때문에 내가 막히는 부분이 정확히 어디인지, 내가 작성하고 있는 코드가 이 해결책의 어떤 절차에 속하는지를 알 수 있어서, 전반적으로 시간 낭비가 많이 줄었다는 느낌을 받았습니다.

문제에 접근하고 해결하는 과정이 정돈되어가는 느낌을 받아서 기뻤습니다.


### 참고자료
- 프로그래머스 코딩 테스트 연습 - 연속된 수의 합
문제 링크: [https://school.programmers.co.kr/learn/courses/30/lessons/120923](https://school.programmers.co.kr/learn/courses/30/lessons/120923)

- Best JavaScript Data Structures & Algorithms Course by Udemy, last updated January 2022, accessed April 5, 2023
강의 링크: [https://www.udemy.com/course/best-javascript-data-structures/](https://www.udemy.com/course/best-javascript-data-structures/)