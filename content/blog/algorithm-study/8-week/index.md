---
title: "정렬 알고리즘 - 버블, 선택, 삽입 정렬"
date: "2023-05-24T09:50:00.000Z"
description: "버블, 선택, 삽입 정렬을 공부하고 문제를 풀어봤습니다."
category: "algorithm"
featuredImage: "../../../../src/images/algorithm-256x256.png"
mobileImage: "../../../../src/images/algorithm-512x256x2.png"
---
## 정렬 알고리즘

오늘은 정렬 알고리즘에 대해서 공부했습니다.

먼저 정렬이란 뭘까요?

정렬이란 데이터를 특정한 조건에 따라 일정한 순서가 되도록 다시 배열하는 일을 말합니다.

정렬 알고리즘에는 다양한 종류가 있습니다.

저마다 용도가 다르고 상황에 따른 장단점도 존재하기 때문에, 다양한 정렬 알고리즘에 대해서 공부할 필요가 있습니다.

프로그래밍 언어마다 정렬을 위한 메서드가 존재하지만, 그 메서드가 어떤 정렬 알고리즘으로 구현되었는지 알고 있고, 그 알고리즘의 용도와 장단점을 알고 있다면, 그 메서드를 사용하기 적합한 상황을 이해하고 사용할 수 있을 것입니다.

따라서 이번 글에서는 정렬 알고리즘 중에서도 버블 정렬, 선택 정렬, 삽입 정렬에 대해서 공부한 내용을 소개하고, 이 세 가지 정렬을 비교해보도록 하겠습니다.

본격적으로 정렬에 대해서 알아보기 전에 미리 말씀을 드리자면, 예시로 사용할 대부분의 데이터는 요소로 Number 타입을 갖는 배열이고, 해당 배열을 오름차순으로 정렬한다고 가정했습니다. 

### 버블 정렬(Bubble sort)

[버블 정렬](https://ko.wikipedia.org/wiki/%EB%B2%84%EB%B8%94_%EC%A0%95%EB%A0%AC)은 배열의 두 요소를 선택하고, 두 요소가 정렬되어있다면 놔두고 아니라면 두 요소의 값을 교체하는 방식으로 진행됩니다. 

원소의 이동이 마치 기포가 수면 위로 올라오는 것처럼 보여서 버블 정렬이라 부른다고 합니다.

배열 [ 37, 45, 29, 8 ]이 있다고 가정했을 때, 버블 정렬은 아래와 같은 방식으로 작동합니다.

- 1-1회차: [ `37, 45`, 29, 8 ] => 변화 없음
- 1-2회차: [ 37, `45, 29`, 8 ] => 45와 29의 위치를 바꿈
- 1-3회차: [ 37, 29, `45, 8` ] => 45와 8의 위치를 바꿈
- 2-1회차: [ `37, 29`, 8, 45 ] => 37과 29의 위치를 바꿈
- 2-2회차: [ 29, `37, 8`, 45 ] => 37과 8의 위치를 바꿈
- 3-1회차: [ `29, 8`, 37, 45 ] => 29와 8의 위치를 바꿈
- 정렬 완료: [` 8, 29, 37, 45 `]


#### 버블 정렬의 구현

버블 정렬은 아래와 같이 자바스크립트 코드로 구현할 수 있습니다.
```javascript
const bubbleSort = arr => {
  // 변수 i를 사용하여 배열의 끝부터 시작까지 반복합니다.
  for (let i = arr.length; i > 0; i--) {
    // 변수 j를 사용하여 내부 반복문을 시작하여 i-1까지 반복합니다.
    for (let j = 0; j < i - 1; j++) {
      // 만약 arr[j] 가 arr[j+1]보다 크다면 두 값을 바꿉니다.
      if (arr[j] > arr[j + 1]) {
        // 만약 arr[j] 가 arr[j+1]보다 크다면 두 값을 바꿉니다.
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  // 정렬된 배열을 반환합니다.
  return arr
}

bubbleSort([37, 45, 29, 8]) // [ 8, 29, 37, 45 ]
```

위와 같은 형태는 [37, 45, 29, 8]과 같이 처음부터 끝까지 정렬이 필요한 경우에는 효율적일지 몰라도, 

[1, 2, 4, 3, 5]와 같이 이미 어느정도 정렬이 이루어진 배열에 대해서는 비효율적입니다.

위와 같은 형태로 [1, 2, 4, 3, 5]라는 배열을 버블 정렬할 경우,

4와 3의 위치를 바꾸고 나서 배열의 정렬이 완료되었음에도, 반복문이 끝날 때까지 계속 정렬합니다.

- 1-1회차: [ `1, 2`, 4, 3, 5 ]  
- 1-2회차: [ 1, `2, 4`, 3, 5 ]  
- 1-3회차: [ 1, 2, `4, 3`, 5 ]  
- 1-4회차: [ 1, 2, 3, `4, 5` ] (정렬은 이미 완료 되었으나...)  
- 2-1회차: [ `1, 2`, 3, 4, 5 ]  
- 2-2회차: [ 1, `2, 3`, 4, 5 ]  
- 2-3회차: [ 1, 2, `3, 4`, 5 ]
- ...
- 4-1회차: [ 1, 2, 3, 4, 5 ] (반복문 종료... 너무 비효율적이다.)

코드의 개선이 필요합니다.

### 버블 정렬의 개선

반복문은 끝나지 않았지만, 이미 정렬이 완료되었음을 어떻게 알 수 있을까요?

버블 정렬은 배열의 두 요소 중 첫 번째 요소가 두 번째 요소보다 값이 크면 두 요소의 값을 교체합니다.

그렇다면, 반복문을 시행했을 때 이러한 `교체 과정이 일어나지 않으면`, 해당 배열은 이미 정렬이 완료된 상태라는 것을 알 수 있습니다.

그렇다면 교체 과정의 유무를 체크하는 변수 noSwaps를 이용해서 코드를 개선해보겠습니다.

```javascript
const bubbleSort = arr => {
  // arr[j]과 arr[j + 1]의 값의 교체를 체크하는 변수 noSwaps을 선언합니다.
  let noSwaps
  for (let i = arr.length; i > 0; i--) {
    // 반복 시작시 noSwaps에 true를 할당합니다.
    noSwaps = true
    for (let j = 0; j < i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        // 값의 교체가 일어났을 경우 noSwaps에 false를 할당합니다.
        noSwaps = false
      }
    }
    // 내부 반복문을 실행했음에도 여전히 noSwaps에 true가 할당되어있다면 반복문을 멈춥니다.
    if (noSwaps) break
  }

  return arr
}

bubbleSort([1, 2, 4, 3, 5]) // [ 1, 2, 3, 4, 5 ]
```

개선된 코드로 [1, 2, 4, 3, 5]를 버블 정렬한다면 어떤 과정을 거칠까요?

- 1-1회차: [ `1, 2`, 4, 3, 5 ]  
- 1-2회차: [ 1, `2, 4`, 3, 5 ]  
- 1-3회차: [ 1, 2, `4, 3`, 5 ]  
- 1-4회차: [ 1, 2, 3, `4, 5` ] (정렬 완료!)  
- 2-1회차: [ `1, 2`, 3, 4, 5 ] 
- 2-2회차: [ 1, `2, 3`, 4, 5 ]  
- 2-3회차: [ 1, 2, `3, 4`, 5 ] (교환이 일어나지 않았네? 여기서 반복문 종료!)

### 선택 정렬(Selection sort)

[선택 정렬](https://ko.wikipedia.org/wiki/%EC%84%A0%ED%83%9D_%EC%A0%95%EB%A0%AC)은 주어진 배열에서 최솟값을 찾고, 그 값을 맨 앞에 위치한 값과 교체한 다음, 이 작업을 맨 앞 위치한 값을 뺀 나머지 배열에 대해서 반복하는 정렬 알고리즘입니다.

배열 [ 34, 22, 10, 19 ]이 있다고 가정했을 때, 선택 정렬은 아래와 같은 방식으로 작동합니다.

- 1-1회차: [ `34, 22`, 10, 19 ] => 최솟값: 22
- 1-2회차: [ 34, `22, 10`, 19 ] => 최솟값: 10
- 1-3회차: [ 34, 22, `10, 19` ] => 최솟값: 10
  - 1회차 종료: [ `10`, 22, 34, 19 ] 

- 2-1회차: [ 10, `22, 34`, 19 ] => 최솟값: 22
- 2-2회차: [ 10, `22`, 34, `19` ] => 최솟값: 19 
  - 2회차 종료: [ 10, `19`, 34, 22 ] 

- 3-1회차: [ 10, 19, `34, 22` ] => 최솟값: 22
  - 3회차 종료: [ 10, 19, `22`, 34 ] 

- 4회차: [ 10, 19, 22, `34` ] => 정렬 완료 


#### 선택 정렬의 구현


```javascript
const selectionSort = arr => {
  // 배열이 정렬될 때까지 다음 요소에 대해 이 작업을 반복합니다.
  for (let i = 0; i < arr.length; i++) {
    // 최솟값을 할당할 변수를 선언하고 첫 번째 요소의 인덱스를 할당합니다.
    let min = i
    for (let j = i + 1; j < arr.length; j++) {
      // 더 작은 숫자를 찾을 때까지 이 요소를 배열의 다음 요소와 비교합니다.
      if (arr[j] < arr[min]) {
        // 더 작은 숫자가 발견되면 그 작은 숫자의 인덱스를 새로운 '최소값'으로 할당하고 배열의 끝까지 반복합니다.
        min = j
      }
    }
    // "최소값"이 처음에 시작한 값(인덱스)이 아닌 경우 두 값을 바꿉니다.
    if (i !== min) {
      ;[arr[i], arr[min]] = [arr[min], arr[i]]
    }
  }
  return arr
}

selectionSort([34, 22, 10, 19]) // [ 10, 19, 22, 34 ]
```

### 삽입 정렬(Insertion sort)

[삽입 정렬](https://ko.wikipedia.org/wiki/%EC%82%BD%EC%9E%85_%EC%A0%95%EB%A0%AC)은 자료 배열의 모든 요소를 앞에서부터 차례대로 이미 정렬된 배열 부분과 비교하여, 자신의 위치를 찾아 삽입함으로써 정렬을 완성하는 알고리즘입니다.

배열 [5, 3, 4, 1, 2]가 있다고 가정했을 때, 삽입 정렬은 아래와 같은 방식으로 이뤄집니다.

- 0회차: [<U>5</U>, `3`, 4, 1, 2] = 현재값 3, 정렬완료: [ 5 ]
- 1회차: [ <U>3, 5</U>, `4`, 1, 2 ] = 현재값 4, 정렬완료: [ 3, 5 ]
- 2회차: [ <U>3, 4, 5</U>, `1`, 2 ] = 현재값 1, 정렬완료: [ 3, 4, 5 ]
- 3회차: [ <U>1, 3, 4, 5</U>, `2` ] = 현재값 2, 정렬완료: [ 1, 3, 4, 5 ]
- 4회차: [ <U>1, 2, 3, 4, 5</U> ] => 정렬완료




#### 삽입 정렬의 구현


```javascript
const insertionSort = arr => {
  const copiedArr = [...arr]
  //배열에서 두 번째 요소를 선택하는 것으로 시작합니다.
  for (let i = 1; i < copiedArr.length; i++) {
    //이제 두 번째 요소를 그 앞의 요소와 비교합니다.
    if (copiedArr[i] < copiedArr[i - 1]) {
      // 두 번째 요소가 앞의 요소보다 작다면 두 번째 요소를 이미 정렬된 부분에 삽입합니다.
      for (let j = 0; j < i; j++) {
        // 두 번째 요소가 삽입 될 위치를 찾고 삽입합니다.
        if (copiedArr[i] < copiedArr[j]) {
          const cuttedVal = copiedArr.splice(i, 1)
          copiedArr.splice(j, 0, ...cuttedVal)
        }
      }
    }
    //배열이 정렬될 때까지 이 과정을 반복합니다.
  }
  return copiedArr
}

insertionSort([9, 2, 7, 4, 1, 5, 8, 3, 6]) // [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
```

### 버블, 선택, 삽입 정렬 비교

버블, 선택, 삽입 정렬을 시간 복잡도를 기준으로 비교하면 아래와 같습니다.

- 버블 정렬 - 최상: O(n), 평균: O(n²), 최악: O(n²) 

- 선택 정렬 - 최상: O(n²), 평균: O(n²), 최악: O(n²)

- 삽입 정렬 - 최상: O(n), 평균: O(n²), 최악: O(n²) 


(공간 복잡도는 O(1)으로 모두 동일합니다.)

#### 최상의 경우에서 왜 차이가 날까?

세 정렬의 차이는 최상의 경우에서 발생합니다.

배열이 이미 어느정도 정렬이 완료된 상태라고 가정했을 때,

버블 정렬과 삽입 정렬은, 정렬이 이루어지지 않은 요소들에 대해서만 값을 비교하고 교체합니다.

즉, 정렬이 많이 이루어져 있을수록 연산의 갯수가 줄어듭니다.

하지만 선택 정렬의 경우, 배열의 정렬 정도와 상관없이 매 회차 최소값을 찾아내야 하기 때문에,

배열의 정렬 정도에 따라 연산 갯수가 줄어들지 않습니다.

#### 평균적으로 O(n²) 시간복잡도를 갖는 이 정렬들은 쓸모가 없을까?

버블 정렬, 선택 정렬, 삽입 정렬과 같이 O(n²) 시간복잡도를 갖는 정렬들은 추후에 다룰 알고리즘들에 비해서 시간복잡도는 떨어질지 모르겠으나, 정렬해야 하는 데이터 집합의 크기가 작을 경우에는 효과적으로 사용됩니다.

그리고, 삽입 정렬의 경우 이미 정렬된 데이터에 새로운 데이터를 삽입하고 다시 정렬해야 하는 경우 사용하기 좋습니다.

생각해보면 당연합니다. 

새로운 요소를 이미 정렬된 배열 부분과 비교하여 해당 요소의 위치를 찾아 삽입하는 연산이, 이미 삽입 정렬 알고리즘 자체에 구현되어있기 때문입니다.

### 프로그래머스 문제 적용

정렬 알고리즘을 배웠으니 프로그래머스에서 문제를 하나 가져와서 풀어보려고 합니다.

이번에 가져온 문제는 프로그래머스 코딩테스트 연습 Lv.1 문제 [K번째수](https://school.programmers.co.kr/learn/courses/30/lessons/42748)입니다.

해당 문제는 프로그래머스 사이트의 코딩테스트 고득점 Kit의 [정렬](https://school.programmers.co.kr/learn/courses/30/parts/12198) 항목에 있는 문제입니다.

처음에는 한 문제를 버블 정렬, 삽입 정렬, 선택 정렬 세 가지 방식으로 풀어보려고 했으나,

그것보다는 문제를 읽고 어떤 정렬 방식을 선택할 것인지 고민해보는 것이 더 중요하다고 판단했기 때문에,

문제를 읽고 적합한 정렬 알고리즘을 선택하여 풀어봤습니다.

먼저 문제를 잠깐 보겠습니다.

```javascript
배열 array의 i번째 숫자부터 j번째 숫자까지 자르고 정렬했을 때, k번째에 있는 수를 구하려 합니다.

예를 들어 array가 [1, 5, 2, 6, 3, 7, 4], i = 2, j = 5, k = 3이라면

- array의 2번째부터 5번째까지 자르면 [5, 2, 6, 3]입니다.
- 1에서 나온 배열을 정렬하면 [2, 3, 5, 6]입니다.
- 2에서 나온 배열의 3번째 숫자는 5입니다.

배열 array, [i, j, k]를 원소로 가진 2차원 배열 commands가 매개변수로 주어질 때, 
commands의 모든 원소에 대해 앞서 설명한 연산을 적용했을 때 나온 결과를 
배열에 담아 return 하도록 solution 함수를 작성해주세요.
```

문제 해결 접근법과 상세한 풀이는 아래에서 소개하겠습니다.

#### 문제 해결 접근법과 상세 풀이

```javascript
/* 문제 해결 접근법
- 이해
  - 배열 commands의 각 원소에 대해서 const slicedArr = arr.slice(i-1, j)을 진행하고
  - 잘라낸 배열을 오름차순 정렬하여 slicedArr[k-1]를 반환하고, 그 값들을 모아서 최종 반환하면 되겠다.
  - 잘라낸 배열은 데이터 셋이 작으니까 버블, 선택, 삽입 정렬 중에 고르면 될 것 같다.
  - 새로운 값을 받아 정렬하는 것은 아니니까 삽입 정렬은 제외하고, 
  - 어느정도 정렬이 되어있으면 성능이 더 잘 나오는 버블정렬로 풀어야겠다.
- 인풋
  - array: 1~100 사이의 값의 원소를 갖는 길이 1~100 사이의 배열
  - commands: 길이 3을 갖는 배열을 원소로 갖는 길이 1~50 사이의 배열
- 아웃풋
  - return: 각 커맨드에 대한 반환값을 담은 배열로, commands와 길이가 같아야 한다.
- 예시
  - array: [1, 5, 2, 6, 3, 7, 4]
  - commands: [[2, 5, 3], [4, 4, 1], [1, 7, 3]]
  - return: [5, 6, 3]
*/

function bubbleSort(arr) {
  let noSwaps
  for (let i = arr.length; i > 0; i--) {
    noSwaps = true
    for (let j = 0; j < i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        noSwaps = false
      }
    }
    if (noSwaps) break
  }
  return arr
}

function solution(array, commands) {
    // 최종 반환 값을 할당할 변수 answer를 선언하고 빈 배열을 할당한다.
    var answer = [];
    
    // commands에 각 원소에 대해서 반복문을 실행한다.
    for(let command of commands){
        // 변수 i, j, k을 선언하고 각각 값을 할당한다.
        const i = command[0]
        const j = command[1]
        const k = command[2]
        // 변수 slicedArr를 선언하고 array.slice(i-1, j)를 할당한다.
        const slicedArr = array.slice(i-1, j)
        // slicedArr를 오름차순으로 버블정렬한다.
        bubbleSort(slicedArr)
        // answer에 slicedArr[k-1]을 push한다.
        answer.push(slicedArr[k-1])
    }
    
    // answer를 반환한다.
    return answer;
}
```

### 회고

이제 겨우 세 가지 정렬 알고리즘을 배웠고, 이 알고리즘들이 실제로 많이 쓰이는지 아닌지는 저로서는 알 수가 없습니다.

(시간복잡도가 높은 알고리즘인 만큼 자주 사용하지는 않을 것 같지만...)

하지만 그럼에도 정렬 알고리즘을 배우는 것이 재미있었던 이유는, 하나의 목표를 달성하기 위한 다양한 방법을 생각해볼 수 있었기 때문입니다.

이번 프로그래머스 문제도 쉽고 간단한 문제였지만, 그 안에서도 더 효율적인 정렬 알고리즘이 무엇일지 생각해보는게 즐거웠습니다.

요즘 코딩테스트 문제를 푸는 것이 즐거워졌습니다.

아직 부족하지만 이 스터디를 통해서 다양한 알고리즘을 배우고 있고, 어떤 문제를 만났을 때 '내가 배웠던 알고리즘으로 풀 수 있을까?' 고민해보는 과정이 즐겁습니다.

한 문제에 다양한 솔루션이 떠오를 때는 더 즐겁습니다.

이렇게 즐거운 마음으로 오늘은 여기서 글을 마치겠습니다.

읽어주셔서 감사합니다.

### 참고자료

- 프로그래머스 코딩 테스트 연습 - K번째수

문제 링크: [https://school.programmers.co.kr/learn/courses/30/lessons/42748](https://school.programmers.co.kr/learn/courses/30/lessons/42748)

- Best JavaScript Data Structures & Algorithms Course by Udemy, last updated January 2022, accessed April 5, 2023
강의 링크: [https://www.udemy.com/course/best-javascript-data-structures/](https://www.udemy.com/course/best-javascript-data-structures/)