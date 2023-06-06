---
title: 알고리즘 & 자료구조 스터디 7주차
date: "2023-05-16T06:00:00.000Z"
description: "스터디 7주차 내용 정리와 회고입니다."
category: "Algorithm"
featuredImage: "../../../../src/images/algorithm-256x256.png"
mobileImage: "../../../../src/images/algorithm-512x256x2.png"
---
## 탐색 알고리즘

오늘은 탐색 알고리즘에 대해서 공부했습니다.

먼저, 배열을 하나 보고 가겠습니다.

```javascript
['A','B','C','D','E','F','G','H']
```
위 배열에서 `E`를 찾는 방법에는 무엇이 있을까요?

아마, 배열의 처음부터 끝까지 순회해서 찾는 방법도 있을 것이고,

위 배열처럼 정렬되어 있는 경우에는 배열의 중간 값을 기준으로 배열을 나눠가며 찾는 방법도 있을 것입니다.

이렇게 어떤 자료구조에서 내가 원하는 값을 찾는 방법은 여러가지가 있고, 자료구조에 따라서 효율적인 탐색 알고리즘도 달라질 것입니다.

이번 글에서는 다양한 탐색 알고리즘을 알아보고, 각 알고리즘은 어떤 구조를 가지고 있고 어떤 상황에서 효율적으로 사용될 수 있는지 알아보겠습니다.

참고로 이번 글에서 예시로 사용할 자료구조는 배열과 문자열입니다.

### 선형 탐색 (Linear Search)

선형 탐색은 한 번에 하나의 항목을 확인하는 탐색 방식입니다.

선형 탐색을 사용해서 알파벳 'E'를 찾을 경우 아래와 같은 과정을 거칩니다.

- [ `'A'`,'B','C','D','E','F','G','H' ]
- [ 'A',`'B'`,'C','D','E','F','G','H' ]
- [ 'A','B',`'C'`,'D','E','F','G','H' ]
- [ 'A','B','C',`'D'`,'E','F','G','H' ]
- [ 'A','B','C','D',`'E'`,'F','G','H' ]


선형 탐색 알고리즘을 코드로 구현하면 아래와 같이 구현할 수 있습니다.

```javascript
const linearSearch = (arr, value) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value) return i
  }
  return -1
}
```

위 코드를 보면 배열의 길이가 길어질수록 탐색해야하는 대상이 많아지므로 배열의 길이에 따라 시간 복잡도가 증가합니다.

따라서, 선형탐색은 평균적으로 O(n) 시간 복잡도를 가집니다.

찾고자하는 대상이 배열의 첫번째에 있는 경우는 선형 탐색에서 최상의 경우로 O(1) 시간 복잡도를 가집니다.

찾고자하는 대상이 배열의 마지막에 있거나 아예 없는 경우는 선형 탐색에 최악의 경우로 O(n) 시간 복잡도를 가집니다.

배열이 정렬되어있지 않거나, 배열의 요소 간에 특별한 규칙이 없는 경우에 요소를 탐색해야한다면 선형 탐색 알고리즘을 고려할 수 있습니다.

그리고 선형 탐색 알고리즘은 우리가 자주 사용하는 여러 자바스크립트 매서드에서 사용되고 있습니다.

아래의 메서드들은 선형 탐색 알고리즘을 가지고 있습니다.

- [Array.indexOf()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
- [String.indexOf()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf)
- [Array.includes()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)
- [String.includes()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/includes)
- [Array.find()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
- [Array.findIndex()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)

### 이진 탐색(Binary Search)

이진 탐색은 분할과 정복 개념을 사용해서 대상을 탐색하는 방식입니다.

분할과 정복은 [이전 글](https://ha-il.github.io/algorithm-study/5-week/)에서도 다뤘던 적이 있는데요.

배열을 예로 들면, 배열의 중간 지점을 찾아서 두 영역으로 분할하고 원하는 대상을 찾을 때까지 분할을 반복하는 것입니다.

이진 탐색을 사용해서 알파벳 'E'를 찾을 경우 아래와 같은 과정을 거칩니다.

- [ 'A','B','C','D'(중간값),`'E','F','G','H','I'` ]
- [ 'A','B','C','D',`'E','F'`,'G'(중간값),'H','I' ]
- [ 'A','B','C','D',`'E'`(발견!),'F','G','H' ]

위의 경우 배열의 요소들이 알파벳순으로 정렬되어 있기 때문에 중간값이 의미를 가질 수 있었습니다.

즉, 데이터가 정렬되어 있지 않다면 이진 탐색을 사용할 수 없습니다.

이진 탐색 알고리즘을 코드로 구현하면 아래와 같이 구현할 수 있습니다.

```javascript
const binarySearch = (arr, value) => {
  let start = 0
  let end = arr.length - 1

  if (arr[start] === value) return start
  if (arr[end] === value) return end

  while (start <= end) {
    let middle = Math.floor((start + end) / 2)
    if (arr[middle] > value) {
      end = middle - 1
    } else if (arr[middle] < value) {
      start = middle + 1
    } else {
      return middle
    }
  }
  return -1
}
```
이진 탐색의 시간 복잡도는 어떻게 계산할 수 있을까요?

이렇게 생각해보면 쉽게 구할 수 있습니다.

예를 들어 배열의 길이가 8이고, 찾고자 하는 대상이 배열에 없는 최악의 경우를 가정한다면, 이진 탐색의 연산은 총 몇 번 일어날까요?

1회차: [ 1, 2, 3, 4(중간값), `5, 6, 7, 8` ]
2회차: [ 1, 2, 3, 4, 5, 6(중간값), `7, 8` ]
3회차: [ 1, 2, 3, 4, 5, 6, 7(중간값), `8` ]

배열의 길이가 8일 때 3번의 연산이 일어납니다.

배열의 길이가 16일 때는 같은 논리로 4번의 연산이 일어날 것입니다.

배열의 길이와 연산 횟수의 관계를 로그로 표현할 수 있습니다.

log₂8 = 3

log₂16 = 4

이런 관계를 시간 복잡도로 표기하면 `O(log n)`으로 표현할 수 있습니다.

O(log n)이라는 시간 복잡도는 상당히 빠른 편에 속하므로, 선형 탐색에 비해서 이진 탐색이 더 효율적인 알고리즘이라고 할 수 있을 것입니다.

하지만 위에서도 언급했듯, 기준점을 가지고 데이터를 두 영역으로 분할해서 탐색하기 때문에, 데이터가 정렬되어 있어야 이진 탐색을 사용할 수 있습니다.


### 이진 탐색의 적용

이진 탐색을 배웠으니 실전에 적용해보려고 합니다.

이번에도 프로그래머스에서 문제를 하나 가져왔습니다.

이번에 준비한 문제는, 프로그래머스 코딩테스트 연습 Lv.3 문제 [입국심사](https://school.programmers.co.kr/learn/courses/30/lessons/43238)입니다.

이번에도 역시 [지난 포스팅](https://ha-il.github.io/algorithm-study/2-week/)에서 배웠던 것처럼 문제 해결 접근법을 적용해서 풀어봤습니다.

문제는 다음과 같습니다.

```
n명이 입국심사를 위해 줄을 서서 기다리고 있습니다. 각 입국심사대에 있는 심사관마다 심사하는데 걸리는 시간은 다릅니다.

처음에 모든 심사대는 비어있습니다. 한 심사대에서는 동시에 한 명만 심사를 할 수 있습니다. 
가장 앞에 서 있는 사람은 비어 있는 심사대로 가서 심사를 받을 수 있습니다. 
하지만 더 빨리 끝나는 심사대가 있으면 기다렸다가 그곳으로 가서 심사를 받을 수도 있습니다.

모든 사람이 심사를 받는데 걸리는 시간을 최소로 하고 싶습니다.

입국심사를 기다리는 사람 수 n, 각 심사관이 한 명을 심사하는데 걸리는 시간이 담긴 배열 times가 매개변수로 주어질 때, 
모든 사람이 심사를 받는데 걸리는 시간의 최솟값을 return 하도록 solution 함수를 작성해주세요.
```

이 문제는 프로그래머스 사이트에서 [코딩테스트 고득점 Kit](https://school.programmers.co.kr/learn/challenges?tab=algorithm_practice_kit)에 '이분탐색'이라는 카테고리로 분류되어 있어서 가져와봤습니다.

사실 문제만 봤으면, 이걸 이진 탐색으로 풀 수 있을 거라는 생각도 못 했을 것 같습니다.

Lv.3 문제여서 그런지 저에게는 상당히 어려웠습니다만, 이진 탐색을 사용해야 한다는 점이 힌트가 되어서 어떻게든 풀어낸 것 같습니다.

상세한 풀이는 아래에 소개하겠습니다.

#### '입국심사'의 문제 해결 접근법 적용
```javascript
/* 문제 해결 접근법
- 이해: n명을 심사하는데 걸리는 시간의 최소값(left)과 최대값(right)을 양 끝으로 하여, 중간 값(mid)을 구한 다음 이진 탐색으로 최적의 시간(bestTime)을 구하면 되겠다.
- 인풋
  - n: 입국심사를 기다리는 사람 수
  - times: 각 심사관이 한 명을 심사하는데 걸리는 시간이 담긴 배열
- 아웃풋
  - bestTime: 모든 사람이 심사를 받는데 걸리는 시간의 최솟값
- 네이밍
  - left: 심사관이 n명을 심사하는데 걸리는 최소 시간으로 배열 times의 원소 중 가장 작은 값과 같다.
  - right: 심사관이 n명을 심사하는데 걸리는 최대 시간으로 배열 times의 원소 중 가장 큰 값에 n을 곱한 것과 같다.
  - mid: left와 right의 합을 2로 나누고 나머지를 버린 값으로, 비교의기준이 되는 시간이다.
  - totalChecked: mid 시간을 기준으로 심사관들이 심사를 마친 시간을 합한것이다.

- 예시로 이해하기

  ex) solution(6, [7, 10]) // 28

  7(left) - 33(mid) - 60(rigth)
  33분 => 7분: 4명 + 10분: 3명 => 7명 > 6(n)

  7 - 19 - 32
  19분 => 7분: 2명 + 10분: 1명 => 3명 < 6

  20 - 26 - 32
  26분 => 7분: 3명 + 10분: 2명 => 5명 < 6

  27 - 29 - 32
  29분 => 7분: 4명 + 10분 2명 => 6명 <= 6 (현재 베스트: n과 일치한다고 무조건 반환하면 안 됨)

  27 - 27 - 28
  27분 => 7분: 3명 + 10분 2명 => 5명 < 6

  28 - 28 - 28
  28분 => 7분: 4명 + 10분 2명 => 6명 === 6 (최종 베스트)
*/
```

#### '입국심사'의 이진 탐색 적용
```javascript
function solution(n, times) {
  // 심사 시간이 가장 짧은 경우
  let left = Math.min(...times)
  // 심사 시간이 가장 긴 경우
  let right = Math.max(...times) * n 
  // n명을 심사하는데 들어가는 최소 시간
  let bestTime = 0

  while (left <= right) {
    let mid = Math.floor((left + right) / 2)
    // mid분을 기준으로 심사관들이 심사할 수 있는 사람 수
    let totalChecked = 0
    times.forEach(time => {
      totalChecked += Math.floor(mid / time)
    })

    if (totalChecked >= n) {
      // 심사를 완료한 인원수(totalChecked)가 n보다 크거나 같다면
      // mid분은 심사에 걸리는 최소 시간이 아님을 의미한다.
      bestTime = mid
      right = mid - 1
    } else {
      // 심사를 완료한 인원수(totalChecked)가 n보다 작다면
      // mid분 내로는 n명의 심사를 완료할 수 없음을 의미한다.
      left = mid + 1
    }
  }

  return bestTime
}
```
위와 같이 제출했더니 무사히 통과할 수 있었습니다.

### 회고

이진 탐색의 경우 이미 분할과 정복 패턴을 배웠기 때문에 코딩테스트에 적용하는 것도 쉬울 것이라 생각했는데 전혀 그렇지 않았습니다.

나름 충격이었던 점은, 배열을 기준으로 탐색을 공부했기 때문에 배열 없이 그저 Number만으로 답을 찾는 과정이 저에게는 신선했습니다.

심지어 처음에는 left값과 right값을 기준으로 배열을 만들어서 문제를 풀려고 했을 정도입니다.

역시 이론을 알고 있는 것과 실전에 적용하는 것은 별개의 문제라는 것을 새삼 느꼈습니다.

이번 탐색 파트를 공부하면서, 아무리 생각해도 탐색 방식이 이것만 있지는 않을 것 같아서 찾다보니 [javascript-algorithms](https://github.com/trekhleb/javascript-algorithms)라는 좋은 깃 저장소를 발견했습니다.

해당 깃 저장소에서 다루는 탐색 방식도 추후에 추가해보도록 노력하겠습니다.

오늘 글은 여기까지입니다.

읽어주셔서 감사합니다.

### 참고자료

- 프로그래머스 코딩 테스트 연습 - 입국심사

문제 링크: [https://school.programmers.co.kr/learn/courses/30/lessons/43238](https://school.programmers.co.kr/learn/courses/30/lessons/43238)

- Best JavaScript Data Structures & Algorithms Course by Udemy, last updated January 2022, accessed April 5, 2023
강의 링크: [https://www.udemy.com/course/best-javascript-data-structures/](https://www.udemy.com/course/best-javascript-data-structures/)