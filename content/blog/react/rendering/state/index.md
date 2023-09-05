---
title: "[리액트 렌더링] 리액트의 렌더링 이해하기"
date: "2023-09-04T15:58:00.000Z"
description: "VirtualDOM, memo, useMemo, useCallback"
category: "react"
featuredImage: "../../../../../src/images/react-256x256.png"
mobileImage: "../../../../../src/images/react-512x256x2.png"
---

이전 글 ["[리액트 렌더링] 브라우저의 렌더링 이해하기"](https://ha-il.github.io/react/rendering/browser-rendering)에서 이어지는 글입니다.

## 들어가기 전에

지난 글에서는 브라우저의 렌더링 과정을 살펴보고 리액트가 왜 등장하게 되었는지 간략하게 설명했다. 이번 글에서는 리액트의 렌더링 과정을 살펴보고 어떻게 하면 리액트 렌더링을 최적화 할 수 있는지 알아보자.

## 1. 리액트에서 리렌더링은 언제 일어나더라?

리액트에서 리렌더링은 state가 변할 때 일어난다. 어쩌면 당연한 것이, 리액트에서 state를 사용하는 이유는 state 값에 따라서 UI를 다르게 표현하기 위해서다. 리액트에서 UI는 state 값의 영향을 받기 때문에, 리액트에서는 state 값을 변경시키는 방법을 setState 함수 호출로 제한 시키고, setState 함수가 호출 될 때마다 리렌더링이 되도록 설계했다.

## 2. 리엑트에서 렌더링은 어떻게 이뤄지는데?

리액트에서 렌더링은 아래의 과정을 거친다.

1. **기존 컴포넌트의 UI를 재사용할 지 확인한다.**
2. **컴포넌트 함수를 호출한다.**
3. **호출 결과를 통해서 새로운 VirtualDOM을 생성한다.**
4. **이전의 VirtualDOM과 새로운 VirtualDOM을 비교해서 실제 변경된 부분만 DOM에 적용한다.**

VirtualDOM이라는 개념이 새로 나왔는데 이건 뭘까? [**VirtualDOM**](https://ko.legacy.reactjs.org/docs/faq-internals.html)은 적용할 UI를 메모리에 저장하고 ReactDOM과 같은 라이브러리에 의해 실제 DOM과 동기화하는 프로그래밍 개념이다.

쉽게 말하면, React로 원하는 UI를 코딩하면 VirtualDOM이 생성되고, 생성된 VirtualDOM을 ReactDOM이 확인하고 실제 DOM에 적용시켜주는 것이다.

아니 바로 DOM에 적용하면 되지 왜 이런 과정을 굳이 거치는 것일까? 


### 2.1 VirtualDOM의 사용 이유
지난 글에서 봤던 브라우저의 렌더링 과정은 아래와 같았다.

1. **HTML 파싱과 DOM 생성**
2. **CSS 파싱과 CSSOM 생성**
3. **렌더 트리 생성과 브라우저의 출력**
4. **자바스크립트 파싱과 실행**
5. **리렌더링**

이 과정을 [Critical Rendering Path](https://developer.mozilla.org/ko/docs/Web/Performance/Critical_rendering_path) 줄여서 CRP라고 부른다.

CRP 과정은 DOM 또는 CSSOM이 수정 될 때마다 반복된다. 특히 리렌더링에서 이뤄지는 리플로우, 리페인트 과정은 많은 계산을 필요로 하기 때문에 퍼포먼스에 직접적인 영향을 준다. CRP가 반복되는 횟수를 최적화한다면 퍼포먼스 향상을 기대할 수 있을 것이다.

VirtualDOM은 CRP가 반복되는 횟수를 최적화하기 위해 사용된다. 어떤 식으로 횟수를 최적화 한다는 것일까? 원래 CRP는 DOM 조작이 발생할 때마다 수행되었다. 하지만 리액트에서는 DOM 조작이 발생할 때마다 실제 DOM에 바로 적용하지 않는다. VirtualDOM이라는 실제 DOM과 유사한 가상의 DOM을 만들고, 조작 이전의 VirtualDOM과 새로운 VirtualDOM을 비교해서 실제로 변화가 필요한 DOM 요소를 찾아낸다. 그 다음에 **한번에 해당 DOM 요소들을 조작한다.** 

이렇게 리액트에서는 VirtualDOM을 이용해서 CRP 수행 빈도를 최적화한다. VirtualDOM이 뭔지 알았으니 리엑트의 렌더링 과정을 다시 한 번 살펴보자.

1. **기존 컴포넌트의 UI를 재사용할 지 확인한다.**
2. **컴포넌트 함수를 호출한다.**
3. **호출 결과를 통해서 새로운 VirtualDOM을 생성한다.**
4. **이전의 VirtualDOM과 새로운 VirtualDOM을 비교해서 실제 변경된 부분만 DOM에 적용한다.**

위의 과정에서 4번 과정은 리액트 내부에서 이뤄지고 있기 때문에 개발자가 개입할 여지가 없다. 결국 개발자가 최적화에 개입할 수 있는 부분은 두 가지이다.

- **1번: 기존 컴포넌트 UI를 재사용할 것인지 결정하는 것**
- **3번: 컴포넌트를 호출 했을 때 이전 VirtualDOM과 차이가 적게 만드는 것**

이번 글에서는 리액트에서 기존 컴포넌트 UI를 재사용할 것인지 결정하는 방법에 대해서 중점적으로 다뤄보려고 한다.

## 3. React.memo

리액트는 state가 변할 경우 해당 컴포넌트를 리렌더링하는데, 해당 컴포넌트의 하위 컴포넌트들 또한 모두 리렌더링한다. 상위 컴포넌트에서 상태가 변하면 그 상태를 하위 컴포넌트에도 적용을 해야 하니 당연한 동작이지만, 가끔은 상위 컴포넌트의 UI가 바뀌었어도 하위 컴포넌트의 UI는 바뀌지 않는 경우도 있다. 이럴 경우 하위 컴포넌트의 리렌더링은 불필요하다. 이런 경우에는 리렌더링하기 전에 UI의 변경이 있었는지 확인해보고 변경이 있는 컴포넌트는 리렌더링을, 변경이 없는 컴포넌트는 이전의 결과를 그대로 사용하는 것이 효율적일 것이다.

하지만, 렌더링 과정마다 모든 컴포넌트에 대해서 UI 변경 여부를 판단하는 것은 비효율적이다. 그래서 기본적으로 리액트의 모든 컴포넌트는 상태에 따라 리렌더링되지만, 특정 컴포넌트의 리렌더링 여부를 결정할 수 있도록 개발자에게 `React.memo`라는 함수를 제공한다. 이를 통해 개발자는 **기존 컴포넌트 UI를 재사용할 것인지 결정**하여 리액트에서 렌더링을 최적화할 수 있다.

### 3.1 React.memo 활용 예시

- [**memo**](https://react.dev/reference/react/memo)

특정 컴포넌트를 memo하면 해당 컴포넌트의 prop이 변하지 않았을 경우 리렌더링을 생략할 수 있다.

```js
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

memo는 컴포넌트를 받아서 컴포넌트를 리턴하는 HOC(Higher Order Component)이다. memo 하고 싶은 컴포넌트를 첫 번째 인자로 주고, 반환되는 컴포넌트를 사용하면 된다. 간단한 예시를 보자. 버튼을 누르면 count가 증가하는 간단한 앱이다.

```tsx
// Counter의 하위 컴포넌트 Hello
function Hello() {
  console.log('Hello 렌더!');
  return <h1>안녕!</h1>;
}

// Hello의 상위 컴포넌트 Counter
function Counter() {
  const [count, setCount] = useState(0);

  const addCount = () => {
    setCount((prev) => prev + 1);
  };

  console.log('Counter 렌더!');

  return (
    <div>
      <Hello />
      {count}
      <button type="button" onClick={addCount}>
        증가
      </button>
    </div>
  );
}
```

<img width="174" alt="memo-hello" src="https://github.com/ha-il/ha-il.github.io/assets/108077643/8aa97b3c-9e67-4685-afb7-a28a0e5d08e4" >

지금 상황에서는 버튼을 눌러 count가 변할 때마다 Counter와 Hello 컴포넌트가 둘 다 렌더링 된다.

```
# 버튼을 3번 눌렀을 때 console창
Counter 렌더!
Hello 렌더!
Counter 렌더!
Hello 렌더!
Counter 렌더!
Hello 렌더!
```
이 상황에서 아래와 같이 Hello 컴포넌트만 memo하고 버튼을 3번 누르면 어떻게 될까?

```tsx
const Hello = memo(() => {
  console.log('Hello 렌더!');
  return <h1>안녕!</h1>;
});
```

```
# Hello 컴포넌트를 memo하고 버튼을 3번 눌렀을 때 console창
Counter 렌더!
Counter 렌더!
Counter 렌더!
```
Hello 컴포넌트를 memo 했더니, 상위 컴포넌트인 Counter가 렌더링되어도 하위 컴포넌트인 Hello 컴포넌트는 리렌더링되지 않는 것을 확인했다. 이번에는 prop을 한 번 전달해보자. 버튼을 누르면 변하는 count 상태를 prop으로 전달하면 어떨까? memo한 컴포넌트는 전달 받은 prop이 변하면 리렌더링을 수행한다. 따라서 Hello 컴포넌트에 memo를 했어도 이번에는 prop으로 count를 전달받았기 때문에 리렌더링이 될 것으로 예상할 수 있다.

```tsx
const Hello = memo((props: { count: number }) => {
  console.log('Hello 렌더!');
  return <h1>안녕! {props.count}</h1>;
});
```
```
# prop으로 count를 전달받은 Hello 컴포넌트를 memo하고 버튼을 3번 눌렀을 때 console창
Counter 렌더!
Hello 렌더!
Counter 렌더!
Hello 렌더!
Counter 렌더!
Hello 렌더!
```
memo한 컴포넌트라도 전달 받은 prop이 변하면 리렌더링을 수행한다는 것을 예시를 통해 확인해봤다.

### 3.2 memo의 두 번째 인자 arePropsEqual

```js
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```
memo의 두 번째 인자 arePropsEqual에 함수를 전달할 경우 해당 함수는 인자로 이전의 props와 새로운 props를 순서대로 전달받는다. 이 함수의 반환 값이 true면 이전 결과를 재사용하고 false면 리렌더링을 수행한다.

자, 그러면 방금 위에서 count를 prop으로 전달받은 Hello 컴포넌트는 memo를 했지만 prop의 변화로 인해 리렌더링이 되고 있는 상황이다. 만약 memo의 두 번째 인자로 true를 반환하는 함수를 주면, count가 변해도 Hello는 리렌더링되지 않을까?

```tsx
const Hello = memo(
  (props: { count: number }) => {
    console.log('Hello 렌더!');
    return <h1>안녕! {props.count}</h1>;
  },
  // 두 번째 인자로 항상 true를 반환하는 함수를 준다.
  () => true,
);
```
```
# memo의 두 번째 인자로 true를 반환하는 함수를 주고 버튼을 3번 눌렀을 때 console창
Counter 렌더!
Counter 렌더!
Counter 렌더!
```
이렇게 arePropsEqual 인자를 사용하면 내가 원하는 조건에 따라서 리렌더링을 결정할 수 있다.

그런데 여기서 의문이 있다. arePropsEqual이라는 인자는 왜 제공한 것일까? [React-memo-Minimizing props changes](https://react.dev/reference/react/memo#minimizing-props-changes)를 확인해보면 memo를 통한 prop의 비교는 **shallow equality**을 기준으로 이뤄진다는 것을 알 수 있다. 즉, **얕은 비교**를 한다는 의미다. 예를 들자면 `Object.is(3, 3)`는 **true**지만 `Object.is({}, {})`는 **false**라는 의미다. 즉, **내가 예상한대로 memo되지 않을 가능성이 있다는 뜻이다.** 이렇게 얕은 비교 방식이 맘에 들지 않을 경우, 자신이 원하는 비교 방식을 함수를 인자로 넣을 수 있도록 memo에는 arePropsEqual라는 두 번째 인자가 존재하는 것이다. 다르게 말하면, **자바스크립트의 데이터 타입에 대해서 제대로 이해하고 있지 않으면 memo를 잘 못 활용할 수도 있다는 것이다.**

## 4. Memoization

React.memo를 통해 특정 컴포넌트의 리렌더링을 생략하면서 렌더링 최적화를 해봤는데, 이번에는 **Memoization**이라는 기법에 대해서 알아보자.

[**Memoization**](https://ko.wikipedia.org/wiki/%EB%A9%94%EB%AA%A8%EC%9D%B4%EC%A0%9C%EC%9D%B4%EC%85%98)은 컴퓨터 프로그램이 동일한 계산을 반복해야 할 때, 이전에 계산한 값을 메모리에 저장함으로써 동일한 계산의 반복 수행을 제거하여 프로그램 실행 속도를 빠르게 하는 기술이다. 쉽게 말하면, 특정한 값을 저장해뒀다가 이후에 해당 값이 필요할 때 새롭게 계산해서 사용하는 게 아니라 저장해둔 값을 활용하는 테크닉을 의미한다. 

그런데 이게 리액트의 함수 컴포넌트 안에서 가능할까? 함수 컴포넌트는 기본적으로 함수라서 리렌더링이 되면 다시 호출된다. 일반적으로 함수 안에서 초기화된 변수는 재호출 시 다시 초기화된다. 즉, 재호출된 함수 내의 변수는 유지되지 않는다는 것이다.

늘 그렇듯 리액트에는 이런 문제를 해결할 수 있는 훅이 존재한다. 바로 `useMemo`라는 훅이다.

## 4.1 useMemo

- [**useMemo**](https://react.dev/reference/react/useMemo)

리렌더링 사이에 계산 결과를 저장할 수 있는 리액트 훅이다.

```js
const cachedValue = useMemo(calculateValue, dependencies)
```
인자를 한 번 살펴보자.

- **calculateValue**

저장하려는 값을 계산하는 함수다. 순수해야 하며 인수를 받지 않고 모든 타입의 값을 반환할 수 있다. React는 초기 렌더링 중에 이 함수를 호출한다. 다음 렌더링에서 React는 마지막 렌더링 이후 종속성(dependencies)이 변경되지 않은 경우 동일한 값을 다시 반환한다. 그렇지 않으면 계산값을 호출하고 결과를 반환한 후 나중에 재사용할 수 있도록 저장한다.

- **dependencies**

calculateValue 내에서 참조된 모든 값의 목록이다. 값에는 props, state, 컴포넌트 내부에서 직접 선언된 모든 변수와 함수가 포함된다. React는 Object.is 비교를 사용하여 각 의존성을 이전 값과 비교한다.

자, 그러면 useMemo를 활용해서 간단한 예제를 만들어보자. 아래 예시는 버튼을 누르면 숫자가 증가하는 카운터와, 블로그 포스트 제목 목록을 렌더링하는 앱이다. (처참한 예시에 사과를...)


<img src="https://github.com/ha-il/ha-il.github.io/assets/108077643/00865bc4-23a5-4646-941d-3d8755708446" width="350" alt="use-memo"/>

```tsx
import React, { useEffect, useState } from 'react';
import './App.css';

interface Post {
  id: number;
  title: string;
}

// App의 하위 컴포넌트 PostList: posts와 counter를 props로 받는다
function PostList({ posts, counter }: { posts: Post[]; counter: number }) {

  // 나름 힘든 연산인 필터링을 진행하는 함수 filterPosts
  const filterPosts = (enterdPosts: Post[]) => {
    console.log('나 너무 힘들어...');
    return enterdPosts.filter((post) => post.id % 2);
  };

  // filterPosts의 결과괎인 visiblePosts
  const visiblePosts = filterPosts(posts);

  // App에서 받은 counter와 필터링된 visiblePosts에 따라 렌더링한다.
  return (
    <>
      <h1>{counter}</h1>
      <ul>
        {visiblePosts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </>
  );
}

function App() {
  const [posts, setPosts] = useState([]);
  const [counter, setCounter] = useState(0);

  // API 요청 코드는 생략...

  const increaseCount = () => setCounter((prev) => prev + 1);

  return (
    <div className="App">
      <button onClick={increaseCount} type="button">
        증가
      </button>
      <PostList posts={posts} counter={counter} />
    </div>
  );
}

export default App;
```
자, 코드를 잠깐 보면, APP 컴포넌트에서 선언된 상태인 posts와 counter를 하위 컴포넌트의 PostList로 보내는 상황이다.

이 상황에서 버튼을 눌러서 counter 값을 증가시키면 App이 렌더링되면서 PostList도 렌더링된다. 따라서 PostList에서 힘든 연산을 수행하고 있는 filterPosts도 버튼을 누를 때마다 호출된다.

```
# App 컴포넌트의 버튼을 3번 눌렀을 때의 콘솔창.
# PostList의 filterPosts 함수도 3번 호출된다.
나 너무 힘들어...
나 너무 힘들어...
나 너무 힘들어...
```
사실 counter만 변할 뿐 posts에는 아무런 변화가 없는데 filterPosts라는 무거운 연산이 계속 돌아가는 것은 비효율적인 일이다. 혹시 위에서 배웠던 것처럼 PostList 컴포넌트를 React.memo로 렌더링되지 않게 하고 App의 버튼을 세 번 누르면 어떨까?

```tsx
const PostList = memo(
  ({ posts, counter }: { posts: Post[]; counter: number }) => {
    const filterPosts = (enterdPosts: Post[]) => {
      console.log('나 너무 힘들어...');
      return enterdPosts.filter((post) => post.id % 2);
    };

    const visiblePosts = filterPosts(posts);
  },
);
```
```
# PostList를 memo하고 App 컴포넌트의 버튼을 3번 눌렀을 때의 콘솔창
나 너무 힘들어...
나 너무 힘들어...
나 너무 힘들어...
```
결과는 같았다. memo를 해줬는데 왜 그럴까? memo를 해줬지만, App에서 counter 상태 값은 버튼을 누를 때마다 바뀌는데, 그 값을 PostList가 porps로 받고 있다. 아무리 memo를 해줬어도 전달받고 있는 props의 값이 바뀌면 다시 렌더링 된다.

버튼을 누르면 counter 값만 변해서 하위 컴포넌트인 PostList까지 리렌더링되는 상황에서, 혹시 filterPosts()의 결과 값을 따로 저장해서 재사용할 수는 없을까? 그렇게하면 무거운 연산을 반복하지 않을 수 있을 텐데 말이다.

이 때 바로 useMemo 훅을 사용할 수 있다. useMemo는 리렌더링 사이에 계산 결과를 저장할 수 있다. 코드를 보자.

```tsx
function PostList({ posts, counter }: { posts: Post[]; counter: number }) {
  const filterPosts = (enterdPosts: Post[]) => {
    console.log('나 너무 힘들어...');
    return enterdPosts.filter((post) => post.id % 2);
  };

  // useMemo를 사용하여 filterPosts() 값을 저장
  // post가 바뀌면 그 때는 filterPosts()를 다시 실행해야 하므로, 의존성 배열에 posts 전달
  const visiblePosts = useMemo(() => filterPosts(posts), [posts]);
}
```

```
# PostList에서 useMemo에 filterPosts(posts)를 넘기고 App 컴포넌트의 버튼을 3번 누르면?
# filterPosts는 한 번만 실행된다!
나 너무 힘들어...
```

이렇게, **useMemo는 컴포넌트 내에서 특정 값을 Memoization해야 할 때 사용할 수 있다.** 

물론 위의 예시에서는 counter를 props로 보내지 않고 App 컴포넌트에서 렌더링하고, PostList를 memo 처리하는 것이 더 좋았을지도 모르겠다. 여러 state가 혼재되어 있어서 컴포넌트 단위의 렌더링 최적화가 어려울 때 useMemo를 사용해서 해결할 수 있다는 작은 예시 정도로 생각해줬으면 좋겠다.

## 4.2 useCallback

- [**useCallback**](https://react.dev/reference/react/useCallback)

useCallback은 리렌더링 사이에 함수 정의를 저장할 수 있는 리액트 훅이다.

```js
const cachedFn = useCallback(fn, dependencies)
```
사실 동작원리는 useMemo와 거의 똑같다. 단지, useMemo는 함수를 포함하여 다른 값들을 저장할 때 사용하고, useCallback은 함수 저장에 좀 더 특화되어 있다. 아래 두 개의 코드는 동일하게 동작한다.

```js
const cachedFn = useMemo(() => (posts) => posts.filter((post) => post.id % 2), [posts]);
const cachedFn = useCallback((posts) => posts.filter((post) => post.id % 2), [posts]);
```
자, 그렇다면 useCallback은 언제 어떻게 쓸 수 있을까? 예시를 한 번 보자.

아래 코드는 App 컴포넌트 내에서 API 요청 함수를 정의하고, useEffect로 해당 함수를 호출하는 코드이다. useEffect의 의존성 배열에는 getPosts 함수를 넣어줬다. 

```tsx
function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  const getPosts = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    console.log('살려줘!');
    getPosts();
  }, [getPosts]);

  return (
    <div className="App">
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </div>
  );
}

export default App;
```
혹시 위의 코드를 실행시키면 어떤 결과가 나오는지 예상이 되는가? 무한 루프로 인해 콘솔창에 '살려줘!'가 계속 뜬다. 대체 이유가 뭘까? 코드를 천천히 따라가보자.

1. App 컴포넌트가 호출된다.
2. useState로 상태가 선언된다.
3. getPosts 함수가 정의된다.
4. useEffect가 실행된다.
5. getPosts가 실행된다.
6. setPosts가 실행되면서 App 컴포넌트가 리렌더링된다.
7. 다시 getPosts 함수가 정의된다.
8. getPosts 함수가 변했으므로 useEffect가 다시 실행된다.
9. 4번부터 8번을 계속 반복한다.

8번을 보면 getPosts 함수가 변해서 useEffect가 다시 실행된다고 하는데, 리렌더링될 때 getPosts의 코드는 바뀐 적이 없다. 그런데 왜 getPosts 함수가 변했다는 것일까? 그 이유는 **자바스크립트에서 함수는 객체이기 때문이다.** 함수가 다시 정의 될 때마다 다른 메모리 주소에 새롭게 저장되고 있기 때문에, useEffect가 의존하고 있는 getPosts에는 늘 다른 함수가 들어오는 것이다. 그래서 useEffect가 무한히 실행되는 것이다.

실은, 위의 예시처럼 코드를 작성하면 똑똑한 리액트가 경고를 띄워준다.

```
The 'getPosts' function makes the dependencies of useEffect Hook (at line 22) 
change on every render. Move it inside the useEffect callback. 
Alternatively, wrap the definition of 'getPosts' in its own useCallback() Hook.
eslintreact-hooks/exhaustive-deps
```
리액트는 getPosts 함수를 useEffect의 콜백 함수 안으로 옮거나, useCallback 훅을 사용할 것을 권장한다. 이번에는 useCallback을 사용하는 것으로 문제를 해결해보자.

```tsx
function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  const getPosts = useCallback(async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    setPosts(data);
  }, []);

  useEffect(() => {
    console.log('살려줘!');
    getPosts();
  }, [getPosts]);
}
```
위와 같이 코드를 작성하면 무한 렌더링을 발생하지 않는다.

위와 같이 함수를 의존성 배열에 넘겨줘야 하거나 props로 전달해야 하는 상황에서는 동일한 함수가 보장되어야 한다. 이런 경우에는 함수의 정의를 저장할 수 있는 useCallback 훅의 사용을 고려해볼 수 있다.

## 4.3 그냥 다 Memoization하면 안 되나요?

당연히 언제나 Memoization을 하는 게 좋은 선택지는 아니다. Memoization은 특정한 값을 저장해두기 때문에 비용이 드는 작업이다. 어쩌면 Memoization하는 것보다 리렌더링 될 때마다 새롭게 만드는 게 비용이 적게 들 수도 있다. 이는 상황에 따라 다르다.

다만 아래의 두 가지 경우에는 Memoization 사용을 고려해볼 수 있다.

1. 새로운 값을 만드는 연산이 복잡하다.
2. 함수 컴포넌트의 이전 호출과, 다음 호출 간 사용하는 값의 동일성을 보장하고 싶다.

1번의 경우는 위에서 설명했던 useMemo 예시를 떠올려보자. 예시에서는 길이 100의 배열을 사용했지만, 만약 그 배열의 길이가 10000이라면 어떨까? 길이가 10000이나 배열을 필터링하는 작업은 꽤 무거운 작업이라 볼 수 있다. 그런 작업을 렌더링될 때마다 수행하는 것은 비효율적이고 렌더링 성능도 떨어질 것이다. 이럴 때는 Memoization을 쓰는 것이 효과적이다.

2번의 경우는 useEffect의 의존성 배열을 떠올려보자. 의존성 배열로 컴포넌트 내에서 정의한 함수를 전달해줬는데, 무한 렌더링이 발생했다. 컴포넌트 내에서 정의한 함수는 렌더링 될 때마다 다른 메모리에 저장되기 때문에 같은 코드의 함수가 다시 정의된다고 해도 함수의 동일성을 보장할 수 없다. 이럴 때는 Memoization을 쓰는 것이 효과적이다.