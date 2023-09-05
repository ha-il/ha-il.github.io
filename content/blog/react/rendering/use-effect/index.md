---
title: "[리액트 렌더링] 리액트의 useEffect 이해하기"
date: "2023-09-05T13:00:00.000Z"
description: "useEffect의 의존성 배열 다루기"
category: "react"
featuredImage: "../../../../../src/images/react-256x256.png"
mobileImage: "../../../../../src/images/react-512x256x2.png"
---

이전 글 ["[리액트 렌더링] 리액트의 렌더링 이해하기"](https://ha-il.github.io/react/rendering/state/)에서 이어지는 글입니다.


## 1. 리액트 렌더링에서 useEffect가 중요한 이유.

지난 글에서 확인했듯이, useEffect의 의존성 배열에 값을 잘 못 전달할 경우 무한 렌더링에 빠질 수도 있다. 이처럼 의존성 배열을 제대로 다루지 못 하면 버그가 발생할 확률이 높아지기 때문에, 의존성 배열에 대해서 제대로 이해하고 있어야 한다.

## 2. useEffect 돌아보기

그동안 자주 써왔던 useEffect를 다시 한번 살펴보자.

- [**useEffect**](https://react.dev/reference/react/useEffect)

컴포넌트를 외부 시스템과 동기화할 수 있는 React Hook이다. 코딩을 하다보면 서버와 통신을 하는 것처럼 외부 시스템의 정보를 받아와 컴포넌트를 동기화해야 하는 경우가 생긴다. 이런 로직은 jsx같은 렌더링도 아니고 마우스 클릭 같은 이벤트도 아니다. 외부 시스템과 동기화하는 로직는 렌더링이나 이벤트와 관계없이 이뤄진다. 이런 로직을 이펙트라고 하며, 이런 이펙트를 다루는 리액트 훅이 useEffect이다. [참고자료:React-Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)

```js
useEffect(setup, dependencies?)
```

- **setup**

이펙트의 로직이 포함된 함수이다. setup 함수의 반환 값은 cleanup 함수다. setup 함수는 컴포넌트가 렌더링되고 나면 실행되고, 종속성 배열의 요소가 변경되면 리렌더링 된다. 이때 cleanup 함수를 반환했다면, 다음 렌더링 시 cleanup 함수를 실행한 다음 setup 함수를 실행한다.

- **dependencies**

setup 함수 내부에서 참조된 모든 값의 목록이다. props, state, 컴포넌트 내부에서 선언된 변수와 정의된 함수가 포함될 수 있다. React는 Object.is 비교를 사용하여 각 의존성을 이전 값과 비교한다. 이 말은, 얕은 비교를 하기 때문에 의존성 배열에 객체를 전달할 경우 예상치 못한 동작이 일어날 수 있다는 의미다. 의존성 배열을 생략하면 컴포넌트를 다시 렌더링할 때마다 setup 함수가 다시 실행된다. 의존성 배열에 빈 배열을 전달하면 컴포넌트의 첫번째 렌더링 이후에만 실행된다.

## 3. useEffect의 의존성 배열을 잘 설정하는 법

useEffect의 의존성 배열을 설정할 때 고려하면 좋은 두 가지 원칙이 있다.

**“가능하다면 의존성을 적게 만들어라”**

**"모든 의존성을 빼먹지 말고 의존성 배열에 명시해라"**


## 3.1 가능하다면 의존성을 적게 만들어라

만일, useEffect의 의존성 배열에 의존성이 너무 많다면, useEffect의 effect 안에서 참조하는 값들이 많다는 의미일 수 있다. 이는 하나의 useEffect가 많은 관심사를 가지고 있다는 것과 같은 의미다. 그럴 때는 관심사를 분리해서, 하나의 관심사를 하나의 useEffect로 처리하는 것이 좋을 수 있다.

### 3.2 모든 의존성을 빼먹지 말고 의존성 배열에 명시해라

사실, props나 state를 의존성 배열에 넣는 것은 어렵지 않은 일이다. 문제는 의존성 배열에 함수나 객체를 전달할 때 발생한다. 

아래 예시는 [지난 포스팅](https://ha-il.github.io/react/rendering/state/)의 useCallback 부분에서 사용했던 예시이다. 아래 코드는 무한 렌더링을 발생시킨다.

```tsx
function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  const getPosts = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    getPosts();
    // 모든 의존성을 빼먹지 말고 의존성 배열에 명시하라며...
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
이런 경우 어떻게 문제를 해결할 수 있을까? 방법은 세 가지가 있다.

1. **getPosts 함수를 useEffect 안에 정의한다.**

```tsx
  useEffect(() => {
    const getPosts = async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts',
      );
      const data = await response.json();
      setPosts(data);
    };
    getPosts();
  }, []);

```
getPosts 자체가 useEffect 안에 있으니 의존성 배열에 추가해줄 필요가 없고, 빈 배열을 전달하고 있기 때문에 useEffect는 컴포넌트가 렌더링될 때 한 번만 실행된다.

2. **getPosts 함수를 컴포넌트 바깥으로 이동시킨다.**
```tsx
const getPosts = async (fn: React.Dispatch<React.SetStateAction<Post[]>>) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();
  fn(data);
};

function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts(setPosts);
  }, []);
}
```
다만, App 컴포넌트 내에서 선언된 setPosts를 컴포넌트 밖의 함수로 보내서 사용하는 방식은 좋은 사용방식은 아닌 것 같다. getPosts가 인수로 받을 setState 함수의 타입을 지정하는 일도 번거롭고, 컴포넌트의 렌더링을 책임지는 setState 함수를 외부 함수에 담아서 사용하는 것은 코드를 해석하기 어렵게 만드는 것 같다. 이 예시는 함수를 컴포넌트 바깥으로 이동시키는 방법도 있다는 것을 보여주기 위함이지 지금 상황에서 최선의 방식은 아니다.

3. **useCallback으로 Memoization한다.**
```tsx
const getPosts = useCallback(async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();
  setPosts(data);
}, []);

useEffect(() => {
  getPosts();
}, [getPosts]);
```
이 또한 좋은 방법이지만, Memoization은 비용이 들어가는 작업이기 때문에 늘 최후의 수단으로 생각하자. 만약 Memoization한 함수를 다른 컴포넌트에 prop으로 보내야 한다면 함수 동일성 보장이 중요하기 때문에 Memoization을 더 긍정적으로 고려해볼 수 있다.