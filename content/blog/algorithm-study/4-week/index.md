---
title: "다중 포인터(Multiple pointers) 패턴"
date: "2023-04-24T17:06:00.000Z"
description: "다중 포인터 패턴을 학습하고 문제를 풀어봤습니다."
category: "Algorithm"
featuredImage: "../../../../src/images/algorithm-256x256.png"
mobileImage: "../../../../src/images/algorithm-512x256x2.png"
---
## 문제 해결 패턴 - 다중 포인터(Multiple pointers)

이번에는 [지난 포스팅](https://ha-il.github.io/algorithm-study/3-week/)에 이어서 또다른 문제 해결 패턴을 소개하겠습니다.

이번에 소개할 패턴은 다중 포인터 패턴입니다.

인덱스나 위치에 해당하는 포인터를 여러 개 만들어서 조건에 따라 포인터를 이동하여 문제를 해결하는 패턴입니다.

배열을 예로 들면, 배열 인덱스의 시작과 끝을 포인터로 설정하고 서로를 향해 이동하는 방식으로 포인터를 이동하는 것입니다.

또는 배열의 첫번째와 두번째 인덱스를 포인터로 설정할 수도 있습니다.

이처럼 포인터의 개수나 이동 방향은 조건에 따라 달라질 수 있기 때문에 다중 포인터 패턴은 다양하게 작성될 수 있지만,

다중포인터 패턴을 적용할 수 있는 대표적인 상황 두 가지를 아래에 예시와 함께 소개해볼까 합니다.

- 예시

  - 서로 더하면 0이 되는 쌍을 찾는 경우 
    
    배열 인덱스의 시작과 끝을 포인터로 설정하여 문제를 해결할 수 있습니다.

    [ `-3`, -2, -1, 0, 1, 2, `3` ]

  - 고유한 숫자의 개수를 찾는 경우

    배열의 첫번째와 두번째 인덱스를 포인터로 설정하여 문제를 해결할 수 있습니다.
    
    (이 경우는 [지난 포스팅](https://ha-il.github.io/algorithm-study/3-week/)에서 다뤘던 빈도수 세기 패턴을 사용할 수도 있습니다.)

    [ `1`, `2`, 2, 3, 3, 3 ]

위 예시들을 기반으로 다중 포인터 패턴의 일반적인 형태를 알아봅시다.


### 다중 포인터 패턴의 일반적인 형태

위에서 예시로 살펴본 두 가지 경우를 다중 포인터 패턴으로 어떻게 풀어내는지 소개하겠습니다.

아래 소개하는 형태는 어디까지나 뼈대일 뿐, 주어진 상황에 따라 달라질 수 있습니다.

참고로, 다중 포인터 패턴은 패턴을 사용할 배열이나 문자열이 어떤 규칙으로 `정렬`되어있는 상태일 때 유효합니다.

정렬되어 있지 않다면 포인터의 이동이 큰 의미를 가지지 못하기 때문입니다.


#### 배열 인덱스의 시작과 끝을 포인터로 설정하는 경우

```javascript

function multiplePointer(arr){
  // 1. 배열 인덱스의 시작과 끝을 값으로 갖는 변수 start와 end를 선언하고 값을 할당합니다.
  let start = 0
  let end = arr.length-1;

  // 2. 반복문을 작성합니다.
  //    반복문 종료 조건은 보통 start 인덱스와 end 인덱스가 만나는 경우가 됩니다.
  while(반복문 종료 조건){
    // 3. 조건문을 작성합니다. 보통 3가지 조건이 포함됩니다.
    //    - 조건 1: 값 또는 true를 반환
    //    - 조건 2: start값 증가
    //    - 조건 3: end값 감소
  }

  // 4. 반복문을 시행했음에도 값이 반환되지 않은 경우 최종적으로 false를 반환합니다.
  return false;
}
```

#### 배열의 첫번째와 두번째 인덱스를 포인터로 설정하는 경우

```javascript
function countUniqueValues(arr){
    // 1. 배열 첫번째 요소와 두번째 요소의 인덱스 값을 갖는 변수 start와 next를 선언하고 값을 할당합니다.
    let start = 0;
    let next = 1
    // 2. 반복문을 작성합니다.
    //    반복문의 종료 조건은 보통 두번째 요소가 배열의 끝에 도달하는 경우가 됩니다.
    while (반복문 종료 조건) {
      // 3. 조건문을 작성합니다. 보통 3가지 조건이 포함됩니다.
      //    - 조건 1: 값 또는 true를 반환
      //    - 조건 2: next값 증가
      //    - 조건 3: start값 증가
    }

    // 4. 반복문을 시행했음에도 값이 반환되지 않은 경우 최종적으로 false를 반환합니다.
    return false
}
```

### 다중 포인터 패턴의 적용

패턴을 배웠으니 실전에 적용해보려고 합니다.

이번에도 프로그래머스에서 문제를 하나 가져왔습니다.

이번에 준비한 문제는, 프로그래머스 코딩테스트 연습 Lv.1 문제 ['제일 작은 수 제거하기'](https://school.programmers.co.kr/learn/courses/30/lessons/12935)입니다.

이번에도 역시 [저번 포스팅](https://ha-il.github.io/algorithm-study/2-week/)에서 배웠던 것처럼 문제 해결 접근법을 적용해서 풀어봤습니다.

참고로, 이 문제는 다중 포인터 패턴을 사용하는 것이 최적의 풀이는 아닌 것으로 판단됩니다.

이번에 학습한 패턴을 코딩테스트에 적용해보는 것에 의의를 두고 풀이를 작성해봤습니다.

상세한 풀이는 아래 코드에서 설명드리겠습니다.

#### '제일 작은 수 제거하기'의 문제 해결 접근법 적용

```javascript
/*
정수를 저장한 배열, arr 에서 가장 작은 수를 제거한 배열을 리턴하는 함수, solution을 완성해주세요. 
단, 리턴하려는 배열이 빈 배열인 경우엔 배열에 -1을 채워 리턴하세요. 
예를들어 arr이 [4,3,2,1]인 경우는 [4,3,2]를 리턴 하고, [10]면 [-1]을 리턴 합니다.
*/

/* 문제 이해하기
- 이해
  - 주어진 배열에서 가장 작은 수를 먼저 찾는다.
  - 작은 수를 찾을 때 다중 포인터 패턴을 사용한다.
  - 찾아서 배열에서 제거후 해당 배열을 다시 반환한다.
- 인풋: 길이 1 이상인 배열 
- 아웃풋: 최솟값인 원소를 제외한 배열 또는 [-1]
- 예외 상황
  - 빈 배열 일때는 [-1]을 반환한다.
  - 만약에 최솟값을 갖는 요소가 여러개면 로직이 바뀔까?
- 네이밍
  - arr: 인풋 배열
  - sortedArr: 인풋 배열을 정렬한 배열
  - start: 배열의 첫 인덱스
  - end: 배열의 마지막 인덱스 
  - minValue: 배열의 최솟값
  - minValueIndex: 최솟값의 인덱스로 배열 복사본에서 최솟값의 인덱스를 저장하기 위해 사용한다.
*/

/* 예시
[4,3,2,1] // [4,3,2] (프로그래머스 예시)
[10] // [-1] (프로그래머스 예시)
*/

function solution(arr) {
  // 배열의 길이가 1이라면 최솟값을 구할 필요가 없으므로 [-1]을 리턴한다.
  // 원본 배열을 복사한다.
  // 다중 포인터 패턴을 사용할 것이기 때문에 배열을 정렬한다.
  // 배열의 처음과 마지막 인덱스 값을 할당할 변수 start와 end를 선언한다.
  // 값의 최솟값을 저장할 변수 minValue를 선언하고 0을 할당한다.
  // 반복문을 작성한다.
  
    // 반복문은 start값과 end값이 같아지면 중단한다.
    // start와 end의 값을 비교한다.
      // 조건 1: start 값과 end 값이 같다면
        // minValue에 arr[start] 값을 대입한다.
        // 반복문을 종료하기 위해 start 값을 1 증가시킨다.
      // 조건 2: start값이 end값보다 더 작다.
        // end 값을 1 감소시킨다.
      // 조건 3: end값이 start값보다 더 작다.
        // start 값을 1 증가시킨다.
      
  // 원본 배열의 복사본에서 minValue의 인덱스를 구해서 minValueIndex 변수에 초기화한다.
  // minValueIndex를 이용해서 원본 배열 복사본에서 최소값을 삭제한다. 
  }
```

#### '제일 작은 수 제거하기'의 다중 포인터 패턴 적용

다중 포인터 패턴을 적용해서 코드를 작성했습니다.

```javascript
function solution(arr) {
  if (arr.length === 1) {
    return [-1];
  }
  
  const originalArray = [...arr];
  
  arr.sort((a, b) => a - b);
  
  let start = 0;
  let end = arr.length - 1;
  let minValue = 0;
  
  while (start <= end) {
    if (start === end) {
      minValue = arr[start];
      start++;
    } else if (arr[start] < arr[end]) {
      end--;
    } else {
      start++;
    }
    
  }

  const minValueIndex = originalArray.indexOf(minValue);
  originalArray.splice(minValueIndex, 1);

  return originalArray;
}
```
위와 같이 제출했더니 무사히 통과할 수 있었습니다.

### 회고

이번 다중 포인터 패턴의 경우 생각보다 해당 패턴을 적용할만한 코딩테스트 문제를 찾는데에 애를 많이 먹었습니다.

다중 포인터 패턴 하나만으로 풀 수 있는 문제보다는, 다중 포인터 패턴이 다른 문제 해결 패턴의 구성요소가 되는 경우가 많았던 것 같습니다.

다중 포인터 패턴을 사용하면서 한 가지 고민이 있다면, 다중 포인터 패턴으로 코드를 작성하는 경우 명령형으로 코딩이 되기 쉬워서, 

조금 더 선언형으로 코딩을 할 수 있게 방법을 강구해봐야할 것 같습니다.


### 참고자료

- 프로그래머스 코딩 테스트 연습 - 제일 작은 수 제거하기

문제 링크: [https://school.programmers.co.kr/learn/courses/30/lessons/12935](https://school.programmers.co.kr/learn/courses/30/lessons/12935)

- Best JavaScript Data Structures & Algorithms Course by Udemy, last updated January 2022, accessed April 5, 2023
강의 링크: [https://www.udemy.com/course/best-javascript-data-structures/](https://www.udemy.com/course/best-javascript-data-structures/)