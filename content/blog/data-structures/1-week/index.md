---
title: "자료구조와 연결 리스트"
date: "2023-06-20T10:13:00.000Z"
description: "자료 구조는 왜 배우나요?"
category: "algorithm"
featuredImage: "../../../../src/images/algorithm-256x256.png"
mobileImage: "../../../../src/images/algorithm-512x256x2.png"
---

## 자료구조는 무엇이고 왜 배우나요?

[자료 구조](https://ko.wikipedia.org/wiki/%EC%9E%90%EB%A3%8C_%EA%B5%AC%EC%A1%B0)는 데이터 값의 모임, 또 데이터 간의 관계, 그리고 데이터에 적용할 수 있는 함수나 명령을 의미합니다.

자료구조는 데이터를 특정 방식으로 구성하고 저장함으로써 더 효율적으로 접근하고 수정할 수 있게 해줍니다. 즉, 특정 유형의 문제에 있어서 특정한 자료구조가 효율적이기 때문에 자료구조를 정의하고 사용합니다.

따라서, 자료구조를 학습할 때는 해당 자료구조가 **어떤 상황에서 사용되는지**, **그 상황에서 사용되는 이유는 무엇인지**를 파악하는 것이 중요할 것 같습니다.

이번 글에서는 `연결 리스트`라는 자료구조에 대해서 다뤄보겠습니다.

## 연결 리스트

[연결 리스트, 링크드 리스트(linked list)](https://ko.wikipedia.org/wiki/%EC%97%B0%EA%B2%B0_%EB%A6%AC%EC%8A%A4%ED%8A%B8#%EC%9B%90%ED%98%95_%EC%97%B0%EA%B2%B0_%EB%A6%AC%EC%8A%A4%ED%8A%B8)는 각 `노드`가 `데이터와 포인터`를 가지고 한 줄로 연결되어 있는 방식으로 데이터를 저장하는 자료 구조입니다. 이름에서 말하듯이 데이터를 담고 있는 노드들이 연결되어 있는데, 노드의 포인터가 다음이나 이전의 노드와의 연결을 담당하게 됩니다.

이때 연결리스트에서 각 노드의 **포인터가 하나**이고 그 포인터가 **다음 노드**를 카리킬 때, 이것을 `단일 연결 리스트`라 부릅니다.

각 노드의 **포인터가 둘**이고 그 포인터들이 각각 **이전 노드**와 **다음 노드**를 가키릴 때, 이것을 `이중 연결 리스트`라 부릅니다.

## 단일 연결 리스트

단일 연결 리스트는 각 노드에 자료 공간과 한 개의 포인터가 있고, 각 노드의 포인터는 다음 노드를 가리킵니다.

### 단일 연결 리스트의 빅 오 복잡도

- 시간 복잡도
  - **삽입: O(1)** - 리스트의 머리나 꼬리에 삽입하는 경우, 노드의 개수에 상관없이 연산의 개수는 일정하기 때문에 O(1)입니다.
  - **중간 삽입: O(n)** - 리스트의 중간에 삽입하는 경우, 삽입할 위치에 있는 노드를 검색해야 하기 때문에 O(n)입니다.
  - **삭제: O(n)** - 삭제할 노드가 꼬리에 있다면, 그 앞의 노드까지 검색을 해야하기 때문에 O(n)입니다.
  - **탐색: O(n)**
  - **접근: O(n)**
- 공간 복잡도: **O(n)**


연결 리스트눈 배열과 비교했을 때 **삽입과 삭제가 효율적**입니다. 하지만 **탐색과 접근의 경우 배열이 더 효율적**입니다. 배열은 인덱스를 기반으로 빠르게 탐색하고 접근할 수 있지만, 연결 리스트는 인덱스가 없기 때문에 노드의 갯수에 따라 검색 시간이 늘어납니다.

데이터의 삽입과 삭제가 빈번하게 일어나지만, 데이터에 대한 탐색과 접근은 자주 일어나지 않는 경우 고려할 수 있는 자료구조입니다.


### 단일 연결리스트의 구현

```javascript
class Node {
  constructor(value) {
    this.value = value
    this.next = null
  }
}

class SinglyLinkedList {
  constructor() {
    this.head = null
    this.tail = null
    this.length = 0
  }
  push(value) {
    let newNode = new Node(value)
    if (!this.head) {
      this.head = newNode
      this.tail = this.head
    } else {
      this.tail.next = newNode
      this.tail = newNode
    }
    this.length++
    return this
  }
  pop() {
    if (!this.head) return undefined
    let currentNode = this.head
    let previousNode = currentNode
    while (currentNode.next) {
      previousNode = currentNode
      currentNode = currentNode.next
    }
    this.tail = previousNode
    this.tail.next = null
    this.length--
    if (this.length === 0) {
      this.head = null
      this.tail = null
    }
    return currentNode
  }
  shift() {
    if (!this.head) return undefined
    let currentHead = this.head
    this.head = currentHead.next
    this.length--
    if (this.length === 0) {
      this.head = null
      this.tail = null
    }
    return currentHead
  }
  unshift(value) {
    let newNode = new Node(value)
    if (!this.head) {
      this.head = newNode
      this.tail = this.head
    } else {
      newNode.next = this.head
      this.head = newNode
    }
    this.length++
    return this
  }
  get(index) {
    if (index < 0 || index >= this.length) return null
    let currentNode = this.head
    let count = 0
    while (count !== index) {
      currentNode = currentNode.next
      count++
    }
    return currentNode
  }
  set(index, value) {
    let foundNode = this.get(index)
    if (!foundNode) return false
    foundNode.value = value
    return true
  }
  insert(index, value) {
    if (index < 0 || index > this.length) return false
    if (index === this.length) return !!this.push(value)
    if (index === 0) !!this.unshift(value)

    let newNode = new Node(value)
    let previousNode = this.get(index - 1)
    newNode.next = previousNode.next
    previousNode.next = newNode
    this.length++
    return true
  }
  remove(index) {
    if (index < 0 || index >= this.length) return undefined
    if (index === this.length - 1) return this.pop()
    if (index === 0) return this.shift()
    let previousNode = this.get(index - 1)
    let removedNode = this.get(index)
    previousNode.next = removedNode.next
    this.length--
    return removedNode
  }
  reverse() {
    let currentNode = this.head
    this.head = this.tail
    this.tail = currentNode
    let nextNode
    let previousNode = null
    for (let i = 0; i < this.length; i++) {
      nextNode = currentNode.next
      currentNode.next = previousNode
      previousNode = currentNode
      currentNode = nextNode
    }
    return this
  }
}
```

## 이중 연결 리스트

이중 연결 리스트의 구조는 단일 연결 리스트와 비슷하지만, 포인터가 두 개 있고 각각의 포인터는 이전 노드와 다음 노드를 가리킵니다.

### 이중 연결 리스트의 빅 오 복잡도
- 시간 복잡도
  - **삽입: O(1)**
  - **삭제: O(1)** - 삭제할 노드가 꼬리에 있어도, 이전 노드에 대한 정보가 있기 때문에 리스트의 끝까지 검색할 필요가 없습니다.
  - **탐색: O(n)** - 어느 방향으로든 리스트를 탐색할 수 있어서 단일 연결리스트 보다 탐색이 효율적이지만 평균적으로는 O(n)입니다.
  - **접근: O(n)**
- 공간 복잡도: **O(n)**

전반적으로 단일 연결리스트와 비슷하지만, 탐색과 접근은 이중 연결 리스트가 조금 더 효율적입니다. 이중 연결 리스트의 노드는 자신의 앞과 뒤의 노드를 기억하고 있기 때문에 탐색 방향이 양방향이기 때문입니다. 같은 이유로 리스트의 꼬리 노드를 제거하는 경우도 이중 연결리스트가 더 유리합니다. 다만 단일 포인터의 개수가 두 개라서, 단일 연결 리스트에 비해 메모리를 더 사용한다는 단점도 있습니다.

### 이중 연결리스트는 어떤 상황에서 사용할 수 있을까?

웹 사이트의 방문기록을 저장하는 경우에 사용할 수 있을 것 같습니다. 각 페이지는 이전 페이지와 다음 페이지를 기억하고 있어야 하기 때문에 이중 연결리스트의 특징과 잘 맞아 떨어집니다..

### 이중 연결 리스트의 구현
```javascript
class Node {
  constructor(value) {
    this.value = value
    this.prev = null
    this.next = null
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null
    this.tail = null
    this.length = 0
  }
  push(value) {
    let newNode = new Node(value)
    if (this.length === 0) {
      this.head = newNode
      this.tail = newNode
    } else {
      this.tail.next = newNode
      newNode.prev = this.tail
      this.tail = newNode
    }
    this.length++
    return this
  }
  pop() {
    if (this.length === 0) return undefined
    let oldTail = this.tail
    if (this.length === 1) {
      this.head = null
      this.tail = null
    } else {
      this.tail = oldTail.prev
      this.tail.next = null
      oldTail.prev = null
    }
    this.length--
    return oldTail
  }
  shift() {
    if (this.length === 0) return undefined
    let oldHead = this.head
    if (this.length === 1) {
      this.head = null
      this.tail = null
    } else {
      this.head = oldHead.next
      this.head.prev = null
      oldHead.next = null
    }
    this.length--
    return oldHead
  }
  unshift(value) {
    let newNode = new Node(value)
    if (this.length === 0) {
      this.head = newNode
      this.tail = newNode
    } else {
      this.head.prev = newNode
      newNode.next = this.head
      this.head = newNode
    }
    this.length++
    return this
  }
  get(index) {
    if (index < 0 || index >= this.length) return null
    if (this.length === 1) return this.head

    let middle = this.length / 2

    if (index <= middle) {
      let currentNode = this.head
      let counter = 0
      while (counter < index) {
        currentNode = currentNode.next
        counter++
      }
      return currentNode
    } else {
      let currentNode = this.tail
      let counter = this.length - 1
      while (counter > index) {
        currentNode = currentNode.prev
        counter--
      }
      return currentNode
    }
  }
  set(index, value) {
    let foundNode = this.get(index)
    if (!foundNode) return false
    foundNode.value = value
    return true
  }
  insert(index, value) {
    if (index < 0 || index > this.length) return false
    if (index === 0) return !!this.unshift(value)
    if (index === this.length) return !!this.push(value)

    let newNode = new Node(value)
    let prevNode = this.get(index - 1)
    let nextNode = prevNode.next

    prevNode.next = newNode
    nextNode.prev = newNode
    newNode.prev = prevNode
    newNode.next = nextNode
    this.length++
    return true
  }
  remove(index) {
    if (index < 0 || index >= this.length) return false
    if (index === 0) return this.shift()
    if (index === this.length - 1) return this.pop()

    let targetNode = this.get(index)
    let prevNode = targetNode.prev
    let nextNode = targetNode.next

    prevNode.next = nextNode
    nextNode.prev = prevNode

    targetNode.next = null
    targetNode.prev = null

    this.length--
    return targetNode
  }
}

const list = new DoublyLinkedList()

list.push(100)
list.push(200)
list.push(300)

console.log(list.remove(1))
```


## 마치며

이번에 자료구조를 공부 하면서 [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms)
이라는 깃허브 저장소를 많이 참고했는데, 이 저장소는 아주 예전에 제가 처음 자료구조를 공부하려고 할 때 참고했던 저장소입니다. 사실 그때는 저장소에 적혀있는 모든 것을 이해할 수가 없었습니다. '그림이랑 의사코드는 있는데, 그래서 이걸로 대체 뭘 어쩌라는 거지?'라는 생각을 했었습니다. 그래도 지금은 저장소에 적힌 내용들을 이해할 수 있고, 또 어떻게 활용할 수 있을지에 대한 감이 잡히는 것을 보면 뭔가 성장은 하고 있구나라는 생각이 들기도 합니다. 다음 글부터는 유명한 자료구조인 스택과 큐에 대해서 다뤄보겠습니다. 감사합니다.

## 참고자료

- Best JavaScript Data Structures & Algorithms Course by Udemy, last updated January 2022, accessed April 5, 2023
강의 링크: [https://www.udemy.com/course/best-javascript-data-structures/](https://www.udemy.com/course/best-javascript-data-structures/)

- javascript-algorithms by trekhleb accessed June 20, 2023
저장소 링크: [https://github.com/trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms)