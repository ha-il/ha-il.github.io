---
title: "빈도수 세기(Frequency counters) 패턴"
date: "2023-04-20T12:53:00.000Z"
description: "빈도수 세기 패턴을 학습하고 문제를 풀어봤습니다."
category: "Algorithm"
featuredImage: "../../../../src/images/algorithm-256x256.png"
mobileImage: "../../../../src/images/algorithm-512x256x2.png"
---
## 문제 해결 패턴 - 빈도수 세기(Frequency counters)

이번 글부터는 문제 해결 패턴을 차례대로 소개해볼까 합니다.

먼저 오늘은 '빈도수 세기'라는 문제 해결 패턴에 대해서 글을 작성해보겠습니다.

### 빈도수 세기 패턴은 무엇인가?

빈도수 세기 패턴은 자바스크립트의 객체를 이용하여 다양한 값과 빈도를 수집해서 문제를 해결하는 패턴입니다.

이 패턴을 언제 어떻게 사용할 수 있을까요?

아래와 같이 두개의 배열이 있다고 생각해봅시다.

```javascript
const arr1 = [1, 2, 3]
const arr2 = [1, 2, 4]
```
저 두 배열이 서로 같은 요소를 가지고 있는지 확인하려면 어떻게 해야할까요?

가장 단순한 방법은 각 배열의 요소를 순회하는 것입니다.

`arr1`의 요소 `1`이 `arr2`에도 있는지 확인하는 것이지요.

하지만 그렇게 문제를 해결할 경우, 그 문제 해결 방법은 중첩된 반복문 사용하게 될 가능성이 높습니다.

중첩된 반복문은 시간 복잡도가 n²이기 때문에 성능이 좋지 않습니다.

중첩된 반복문을 사용하지 않고, 아래와 같이 요소의 종류와 빈도를 셀 수 있다면 어떨까요?

```javascript
const arr1 = [1, 2, 3]
const arr2 = [1, 2, 4]

/*
arr1 = {    arr2 = {
  '1': 1      '1': 1
  '2': 1      '2': 1
  '3': 1      '4': 1
}           }
*/
```

각 배열에 반복문을 시행해서 요소의 종류와 빈도를 센다면, 중첩된 반복문을 피할 수 있을 것입니다.

똑같이 2개의 반복문을 사용하지만, 중첩시키지 않고 독립적으로 사용하면 시간 복잡도를 줄일 수 있습니다.

### 빈도수 세기 패턴의 일반적인 형태

빈도수 세기 패턴은 어떻게 작성할 수 있을까요?

해결해야하는 문제에 따라 다르겠지만, 일반적으로 아래와 같은 형태를 가집니다.

```javascript
function frequencyCounter(arr1, arr2){

  // 두 배열의 길이가 다를 경우 빈도수도 다르기 때문에 빠르게 false를 반환합니다.
  if(arr1.length !== arr2.length){
      return false;
  }
  
  // 각 배열 요소의 빈도수를 저장할 객체를 생성합니다.
  let frequencyCounter1 = {}
  let frequencyCounter2 = {}
  
  // 각 배열 요소를 프로퍼티의 키로 저장하고, 빈도수를 값으로 저장합니다.
  for(let val of arr1){
      frequencyCounter1[val] = (frequencyCounter1[val] || 0) + 1
  }
  for(let val of arr2){
      frequencyCounter2[val] = (frequencyCounter2[val] || 0) + 1        
  }

  // 객체의 프로퍼티를 비교합니다.
  for(let key in frequencyCounter1){

      // 먼저 프로퍼티의 키를 비교하여, 서로의 객체에 같은 키가 있는지 확인합니다. 
      if(!(key in frequencyCounter2)){
          return false
      }
      // 각 프로퍼티의 값을 비교하여, 빈도수가 같은지 확인합니다.
      if(frequencyCounter2[key] !== frequencyCounter1[key]){
          return false
      }
  }

  // 두 배열의 요소들은 그 종류와 빈도수가 같다는 것이 증명되었기 때문에 true를 반환합니다.
  return true
}
```
특히, 객체의 프로퍼티를 비교하는 부분은, 해결해야하는 문제에 따라 if문의 조건을 다르게 설정할 수 있습니다.

적지 않은 반복문을 사용하지만, 반복문을 중첩하지 않았기 때문에, 시간 복잡도는 n이므로 n²에 비하여 성능이 좋습니다.

### 빈도수 세기 패턴의 적용

패턴을 배웠는데 적용하지 못하면 의미가 없겠죠?

이번에도 프로그래머스에서 문제를 하나 가져왔습니다.

이번에 준비한 문제는, 프로그래머스 코딩테스트 연습 Lv.1 문제 ['문자열 내 p와 y의 개수'](https://school.programmers.co.kr/learn/courses/30/lessons/12916)입니다.

이번에도 역시 [저번 포스팅](https://ha-il.github.io/algorithm-study/2-week/)에서 배웠던 것처럼 문제 해결 접근법을 적용해서 풀어봤습니다.

상세한 풀이는 아래 코드에서 설명드리겠습니다.

#### '문자열 내 p와 y의 개수'의 문제 해결 접근법 적용

문제를 풀기 전에, 먼저 문제 해결 접근법을 적용해봤습니다.

```javascript
/* 문제
대문자와 소문자가 섞여있는 문자열 s가 주어집니다. 
s에 'p'의 개수와 'y'의 개수를 비교해 같으면 True, 다르면 False를 return 하는 solution를 완성하세요. 
'p', 'y' 모두 하나도 없는 경우는 항상 True를 리턴합니다. 
단, 개수를 비교할 때 대문자와 소문자는 구별하지 않습니다.
*/

/* 문제 이해하기
- 이해
  - 받은 문자열을 알파벳 소문자로 바꾸고, 
  - p와 y의 개수를 세고,
  - 개수를 비교한 다음 결과를 불리언으로 반환하면 되겠다.
- 인풋: 알파벳으로만 이루어진, 50 이하의 자연수 길이를 가진 문자열
- 아웃풋: 불리언
- 네이밍
  - string 인풋 문자열
  - lowercaseString 인풋 문자열을 소문자로 변환한 값
  - charCounter 문자열의 문자의 개수를 저장할 객체
*/

/* 예시
solution("pPoooyY") // true
solution("Pyy") // false
*/

function solution(string) {
  // string의 알파벳을 모두 소문자로 바꿉니다.
  // charCounter를 선언하고 빈 객체를 할당합니다.
  // 객체 charCounter에 string의 각 문자인 char에 대해 반복문을 실행합니다.
    // charCounter[char]가 존재하지 않으면 charCounter[char]에 0을, 존재하면 +1 값을 할당합니다.
  // charCounter['p']와  charCounter['y']의 값을 비교합니다.
    // 거짓이면 false를 반환합니다.
  // 위의 과정을 모두 통과했다면 true를 반환합니다.
}
```

#### '문자열 내 p와 y의 개수'의 빈도수 세기 패턴 적용

빈도수 세기 패턴을 적용해서 코드를 작성했습니다.

```javascript
function solution(string) {
 
  const lowercaseString = string.toLowerCase();
    
  const charCounter = {};
  
  for (let char of lowercaseString) {
    charCounter[char] = (charCounter[char] || 0) + 1;
  }
  
  if (charCounter["p"] !== charCounter["y"]) {  
    return false;
  }
  
  return true;
}
```
위와 같이 제출했더니 무사히 통과할 수 있었습니다.

### 회고

빈도수 세기 패턴을 배우기 전에 나라면 이 문제를 어떻게 풀었을지 생각해봤습니다.

한번의 순회로 끝나면 될 것을 p의 개수를 찾기 위해 한 번, y의 개수를 찾기 위해 한 번, 이렇게 두 번씩이나 순회하는 코드를 짜지 않았을까 싶습니다.

그리고 각각의 값을 할당하기 위해 임시 변수를 또 선언했을지도 모르겠습니다.

그렇게 문제를 풀 수도 있고, 또 그렇게 나쁘지 않을 방법일지도 모르겠습니다만,

그런 코드는 정말 p와 y의 개수만을 구할 수 있는 확장성이 떨어지는 코드일 것입니다.

빈도수 세기 패턴은 대체로 모든 요소의 빈도수를 세기 때문에, p와 y 이외의 문자의 개수도 구할 수 있습니다.

이렇게 구한 값들을 단순 비교할 수도 있고, 조건을 부여해서 비교할 수도 있는 등, 빈도수 세기 패턴은 다양한 상황에서 유용하게 쓰일 수 있을 것 같습니다.

공부한 패턴으로 문제를 풀 수 있게 되니 얼른 다른 문제를 풀어보고 싶기도 하고, 다른 문제 해결 패턴을 공부해보고 싶다는 생각도 들었습니다.

### 참고자료
- 프로그래머스 코딩 테스트 연습 - 문자열 내 p와 y의 개수

문제 링크: [https://school.programmers.co.kr/learn/courses/30/lessons/12916](https://school.programmers.co.kr/learn/courses/30/lessons/12916)

- Best JavaScript Data Structures & Algorithms Course by Udemy, last updated January 2022, accessed April 5, 2023
강의 링크: [https://www.udemy.com/course/best-javascript-data-structures/](https://www.udemy.com/course/best-javascript-data-structures/)