---
title: "재귀 함수"
date: "2023-05-08T20:00:00.000Z"
description: "재귀 함수를 학습하고 문제를 풀어봤습니다."
category: "algorithm"
featuredImage: "../../../../src/images/algorithm-256x256.png"
mobileImage: "../../../../src/images/algorithm-512x256x2.png"
---
## 재귀

이번에는 재귀에 대해서 이야기해보겠습니다.

먼저 재귀란 뭘까요?

[네이버 사전](https://ko.dict.naver.com/#/entry/koko/dd0aa403963a4afdbdbac90862c3f06e)에 검색해보니, 정보 통신 분야에서 재귀란 `주어진 문제를 해결하기 위하여 하나의 함수에서 자신을 다시 호출하여 작업을 수행하는 방식`을 의미합니다.

자기 자신을 반복적으로 호출한다는 개념이 처음에는 꽤 낯설기 때문에, 이걸 굳이 배워야하냐는 생각이 들기도 하는데요.

재귀는 훗날 학습할 자료구조(특히, 트리나 그래프)를 작성할 때도 많이 사용되기 때문에 이해하고 가는 것이 중요합니다.

### 재귀 함수의 형태

재귀 함수에서 반드시 포함되어야 할 요소는 세 가지가 있습니다.

바로 `종료 조건`, `다른 입력값`, `자신을 다시 호출하는 것` 입니다.

만약 종료 조건이 없다면, 재귀 함수는 무한히 호출될 것입니다.

만약 다른 입력값 없이 동일한 입력값으로 재귀 함수를 호출한다면, 그저 여러번 호출한다는 것뿐이니 이점이 없습니다.

만약 자신을 다시 호출하는 코드가 없다면, 그 함수는 재귀 함수라고 정의할 수 없습니다.

재귀 함수에서 반드시 포함되어야 할 세 가지 요소를 코드로 작성하면 아래와 같은 형태가 나옵니다.

```javascript
function recursion1(input){
    // 종료 조건
    if(input <= 0) return;

    console.log(input);
    
    // 다른 입력값
    input--;
    
    // 자신을 다시 호출
    recursion1(input);
}


function recursion2(input){
    // 종료 조건
   if(input === 1) return 1;

   // 다른 입력값으로 자신을 다시 호출
   return input + recursion2(input-1);
}
```

위와 같이 재귀함수를 하나의 함수로 작성하는 방법도 있지만, 다른 함수 안의 헬퍼 함수로 작성하는 방법도 있습니다.

```javascript
function outer(input){
    
    var outerScopedVariable = []

    function helper(helperInput){
        helper(helperInput--)
    }
    
    helper(input)

    return outerScopedVariable;

}
```
헬퍼 함수를 사용하면 `outerScopedVariable`와 같은 외부 변수를 사용하게 되는데,

외부 변수의 사용을 원하지 않는다면, 순수 재귀 함수로 구현하는 방법도 있습니다.

순수 재귀 함수는 필요한 모든 코드가 함수 자체에 포함되어있습니다.

아래 코드는 순수 재귀 함수를 사용해서 배열에서 홀수를 찾는 예제입니다.

```javascript
function collectOddValues(arr){
    let newArr = [];
    
    if(arr.length === 0) {
        return newArr;
    }
        
    if(arr[0] % 2 !== 0){
        newArr.push(arr[0]);
    }
        
    newArr = newArr.concat(collectOddValues(arr.slice(1)));
    return newArr;
}

collectOddValues([1,2,3,4,5])
```

### 재귀 함수의 적용

재귀 함수를 배웠으니 실전에 적용해보려고 합니다.

이번에도 프로그래머스에서 문제를 하나 가져왔습니다.

이번에 준비한 문제는, 프로그래머스 코딩테스트 연습 Lv.1 문제 [자연수 뒤집어 배열로 만들기](https://school.programmers.co.kr/learn/courses/30/lessons/12932)입니다.

이번에도 역시 [지난 포스팅](https://ha-il.github.io/algorithm-study/2-week/)에서 배웠던 것처럼 문제 해결 접근법을 적용해서 풀어봤습니다.

먼저 문제를 잠깐 보실까요?

```
자연수 n을 뒤집어 각 자리 숫자를 원소로 가지는 배열 형태로 리턴해주세요. 
예를들어 n이 12345이면 [5,4,3,2,1]을 리턴합니다.
```

저는 이 문제를 보고 재귀 함수를 사용해서 풀 수 있을 것 같다는 생각이 들었습니다.

n을 문자열로 변환하고, 문자열의 마지막 요소를 배열에 할당하는 것을 재귀 방식으로 반복하면 풀 수 있을 것 같았습니다.

상세한 풀이는 아래 코드에서 설명드리겠습니다.

#### '자연수 뒤집어 배열로 만들기'의 문제 해결 접근법 적용
```javascript
/* 문제 이해하기
  - 이해
    - 주어진 자연수의 1의 자리 숫자부터 순서대로 배열에 삽입해서 반환하기.
  - 인풋: 10,000,000,000이하인 자연수 
  - 아웃풋: 자연수 n을 뒤집어 각 자리 숫자를 원소로 가지는 배열
  - 네이밍
    - result: 최종 반환할 배열
    - str: 자연수 n을 문자열로 바꾼 값을 할당할 변수
    - helper: 재귀 함수로 사용될 헬퍼 함수 
*/

/* 예시
  n: 12345 => [5,4,3,2,1] 
*/

function solution(n) {
  // 최종 반환할 배열 result를 선언하고 빈 배열을 할당합니다.
  // 변수 str을 선언하고 n을 문자열로 바꾼 값을 할당합니다.

  // 재귀함수로 사용할 helper 함수를 정의합니다.
    // 재귀 함수의 종료 조건을 작성합니다.
    // result에 str의 마지막 문자를 push합니다.
    // helper 자기 자신을 호출합니다.
      // 이 때 마지막 문자를 제거한 str을 인수로 전달합니다.

  // helper 함수를 호출합니다.
  // result를 반환합니다.
}
```
#### '자연수 뒤집어 배열로 만들기'의 재귀 함수(헬퍼 함수 패턴) 적용
```javascript
function solution(n) {
  var result = []

  const str = String(n)

  function helper(str) {
    if (str.length === 0) return
    result.push(Number(str.slice(-1)))
    helper(str.slice(0, -1))
  }

  helper(str)

  return result
}
```
위와 같이 제출했더니 무사히 통과할 수 있었습니다.

### 회고

재귀 함수는 처음에 이해하기는 어렵지만, 여태 배웠던 다른 방식들에 비해서 더 재미있는 것 같습니다.

반복한다는 점은 여태 사용해왔던 반복문이나 매서드와 큰 차이는 없지만, 

정의한 함수를 스스로 호출해서 반복한다는 점이 신박한 것 같습니다.

뭔가 다른 반복문은 컵을 뒤집어서 높이 쌓아올리는 느낌이라면, 재귀함수는 컵을 착착착 겹쳐서 정리하는 느낌인 것 같습니다.

오늘 배운 재귀 함수를 활용해서 자료구조를 구현할 날이 어서 오기를 바라는 마음으로 글을 마치겠습니다.



### 참고자료

- 프로그래머스 코딩 테스트 연습 - 자연수 뒤집어 배열로 만들기

문제 링크: [https://school.programmers.co.kr/learn/courses/30/lessons/120956](https://school.programmers.co.kr/learn/courses/30/lessons/120956)

- Best JavaScript Data Structures & Algorithms Course by Udemy, last updated January 2022, accessed April 5, 2023
강의 링크: [https://www.udemy.com/course/best-javascript-data-structures/](https://www.udemy.com/course/best-javascript-data-structures/)