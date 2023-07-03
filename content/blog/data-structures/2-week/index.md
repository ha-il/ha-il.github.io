---
title: "스택과 큐"
date: "2023-06-20T10:13:00.000Z"
description: "자료 구조는 왜 배우나요?"
category: "algorithm"
featuredImage: "../../../../src/images/algorithm-256x256.png"
mobileImage: "../../../../src/images/algorithm-512x256x2.png"
---

## 스택

[스택(stack)](https://ko.wikipedia.org/wiki/%EC%8A%A4%ED%83%9D)은 제한적으로 접근할 수 있는 나열 구조이다. 그 접근 방법은 언제나 목록의 끝에서만 일어난다.

스택은 한 쪽 끝에서만 자료를 넣거나 뺄 수 있는 선형 구조(LIFO - Last In First Out)으로 되어 있다. 

자료를 넣는 것을 '밀어넣는다' 하여 푸쉬(push)라고 하고 반대로 넣어둔 자료를 꺼내는 것을 팝(pop)이라고 하는데, 이때 꺼내지는 자료는 가장 최근에 푸쉬한 자료부터 나오게 된다. 이처럼 나중에 넣은 값이 먼저 나오는 것을 LIFO 구조라고 한다.


### 스택 빅 오 복잡도

- 시간 복잡도
  - **삽입: O(1)** 
  - **삭제: O(1)**
  - **탐색: O(n)**
  - **접근: O(n)** 
- 공간 복잡도: **O(n)**

### 스택의 활용
- 함수 호출 관리
- 실행취소, Undo Redo
- 방문 기록

### 스택의 구현

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
class Stack {
  constructor() {
    this.first = null;
    this.last = null;
    this.size = 0;
  }
  push(val) {
    let newNode = new Node(val);
    if (!this.first) {
      this.first = newNode;
      this.last = newNode;
    } else {
      let temp = this.first;
      this.first = newNode;
      this.first.next = temp;
    }
    return ++this.size;
  }
  pop() {
    if (!this.first) return null;
    let temp = this.first;
    if (this.first === this.last) {
      this.last = null;
    }
    this.first = this.first.next;
    this.size--;
    return temp.value;
  }
}

/* 이 부분 구현하기
S.top(): 스택의 가장 윗 데이터를 반환한다. 만약 스택이 비었다면 이 연산은 정의불가 상태이다.
S.pop(): 스택의 가장 윗 데이터를 삭제한다. 스택이 비었다면 연산 정의불가 상태.
S.push(): 스택의 가장 윗 데이터로 top이 가리키는 자리 위에(top = top + 1) 메모리를 생성, 데이터 x를 넣는다.
S.empty(): 스택이 비었다면 1을 반환하고,그렇지 않다면 0을 반환한다.
*/

```


## 마치며



## 참고자료

- Best JavaScript Data Structures & Algorithms Course by Udemy, last updated January 2022, accessed April 5, 2023
강의 링크: [https://www.udemy.com/course/best-javascript-data-structures/](https://www.udemy.com/course/best-javascript-data-structures/)

- javascript-algorithms by trekhleb accessed June 20, 2023
저장소 링크: [https://github.com/trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms)