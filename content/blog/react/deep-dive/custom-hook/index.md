---
title: "[리액트 딥 다이브] 리액트 커스텀 훅으로 관심사 분리하기"
date: "2023-09-05T21:50:00.000Z"
description: "리액트가 관심사를 분리하는 방법"
category: "react"
featuredImage: "../../../../../src/images/react-256x256.png"
mobileImage: "../../../../../src/images/react-512x256x2.png"
---

## 1. 관심사의 분리(Seperation of Concerns)

일단, '**관심사**'라는 것은 뭘까? 리액트보다 더 넓은 관점에서 보자면, **관심사란 하나의 모듈이 수행하고자 하는 목적을 말한다.** 그렇다면 **'관심사의 분리'란 각 모듈들이 한 번에 하나의 관심사만 처리하도록 분리하는 것을 의미한다.** 관심사의 분리는 좋은 코드를 작성하기 위한 가장 기본적인 원칙으로 꼽힌다. 왜 관심사를 분리하는 것이 좋은 코드 작성의 기초가 되는 것일까?

이건 유지보수 및 확장 때문에 그렇다. 예를 들어 내가 리액트에서 로그인과 관련된 UI나 로직을 수정한다면, `Login.js` 컴포넌트를 찾거나 `useLogin.js` 커스텀 훅을 찾을 것이다. 이렇게 코드를 관심사에 따라 분리하면, 유지보수 하거나 기능을 확장시킬 때 더 해당 코드를 더 빠르게 찾아갈 수 있다. 그리고 하나의 모듈에 하나의 관심사만 처리하도록 구현했다면, 로그인 관련 로직은 해당 컴포넌트에서만 수정하면 될 것이다. 굳이 다른 컴포넌트를 찾아다니면서 로그인 로직을 수정할 필요가 없다는 뜻이다. 

## 2. 그렇다면 리액트의 관심사는 뭘까?

보통 리액트로 프로그래밍을 하면 아래와 같은 패턴으로 코드를 작성하게 된다.

```tsx
function App() {
  /* 로직 부분 */
  return (
    <div className="App">
      { /* UI 부분 */ }
    </div>
  );
}

export default App;

```
이처럼 리액트는 컴포넌트의 **로직**과 **UI**에 관심을 가지고 있다. 만일 위와 같이 작성한다면 로직과 UI라는 두 가지 관심사를 하나의 컴포넌트에서 처리하게 되므로 로직과 UI를 각각 분리하여 관리하는 것이 좋다. 리액트에서 로직을 분리할 수 있는 방법이 바로 **커스텀 훅**이다.

## 3. 커스텀 훅으로 로직을 분리하자

커스텀 훅은 리액트가 기본적으로 제공해주는 훅을 이용해서 만드는 함수다. 커스텀 훅의 조건은 아래와 같다.

1. **React의 Hook(useState, useEffect 등)을 호출하는 함수여야 한다.**

2. **함수의 이름은 `use`로 시작해야 한다.**

리액트로 처음 프로그래밍을 하면 컴포넌트 안이 useState와 useEffect의 로직으로 가득 차게 되는 경우가 많다. 이럴 때 복잡한 로직을 커스텀 훅으로 분리한다면, 컴포넌트는 UI에만 집중할 수 있게 되고, 다른 사람이 코드를 봤을 때도 이해가 쉬워진다.

참고로, use라는 이름을 사용하면 ESLint가 use가 들어간 함수를 커스텀 훅으로 인식하고, 리액트 훅과 동일한 규칙을 적용시켜준다. 

### 3.1 커스텀 훅을 직접 만들어보자!

자, 그러면 예시를 통해서 커스텀 훅을 하나 만들어 보자. 아래 예시는 useState와 useEffect를 사용하는 전형적인 형태의 컴포넌트이다. 아래 코드에서 커스텀 훅으로 로직을 분리해보자.

```tsx
import React, { useEffect, useState } from 'react';
import './App.css';

interface Post {
  id: number;
  title: string;
}

function App() {
  // 로직
  const [posts, setPosts] = useState<Post[]>([]);
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

  // UI
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
1. **인터페이스를 작성한다.**

먼저 가장 처음 해줄 일은 커스텀 훅의 인터페이스를 작성하는 것이다. 인터페이스를 작성한다는 것은 어떤 입력을 받아 무엇을 출력할 것인지 작성한다는 것이다.

```tsx
// 인풋: 일단 지금 상황에서 별도의 인풋은 필요하지 않다.
// 아웃풋: API 요청으로 받은 데이터를 posts에 담아서 반환.

// usePosts: () => posts:Post[]
```

2. **인터페이스대로 커스텀 훅을 작성해본다.**

```tsx
const usePosts = (): Post[] => {

  return posts;
};
```

지금 예시에서는 posts 하나만 반환하면 되므로 post를 그냥 반환하고 있지만 여러 값을 반환해야 하는 경우에는 객체나 배열에 담아서 보내야 한다. 여러 값을 반환해야 할 때 객체로 보낼 것인가, 배열로 보낼 것인가를 선택하는 기준은 철저히 "어떻게 반환해야 커스텀 훅을 사용하는 쪽에서 편할까?"를 고려하면 된다. 나름의 판단 근거는 아래와 같다. 

- 객체: 반환 값의 인덱스는 신경 쓰지 않고 키만 신경써도 되는 경우
    - 객체는 키값이 정해져 있어서 호출할 때 무조건 키값을 기준으로 불러옴
    - 필요없는 값의 경우 생략할 수 있다는 장점이 있음
    - 많은 값을 전달해야 하면 객체 고려
- 배열: 반환 값의 인덱스를 고려해야 하는 경우
    - 첫 번째에 무조건 정해진 값이 오니까, 호출할 때 이름을 신경 쓰지 않아도 된다.
    - 배열에 많은 값 담아서 반환하면, 내가 원하지 않는 것들도 불러와야 하는 경우가 있음
    - 2~3개 정도의 값을 전달 하는 것이 적당함

3. **분리할 로직을 커스텀 훅 안에 작성한다.**
```ts
const usePosts = (): Post[] => {
  const [posts, setPosts] = useState<Post[]>([]);

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
  return posts;
};
```
참고로 지금 예시에서는 함수를 반환해주지 않고 있는데, 만약 커스텀 훅을 통해 함수를 반환해야 한다면 useCallback의 사용을 고려할 필요가 있다. 자바스크립트에서 함수는 객체이기 때문에, 함수를 값으로 전달할 경우 함수의 동등성이 보장되지 않는다. 이럴 때는 useCallback을 사용하여 동등성이 보장된 함수를 반환하는 것이 좋다. useCallback에 대해서는 이전 포스팅 [리액트의 렌더링 이해하기](https://ha-il.github.io/react/rendering/state/)에서 확인할 수 있다.

4. **커스텀 훅을 사용해본다.**
```tsx
function App() {
  const posts = usePosts();
  return (
    <div className="App">
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </div>
  );
}
```
로직이 분리되니까 컴포넌트가 정말 깔끔해졌다. App 컴포넌트는 posts를 어디서 어떻게 가져오는지 관심을 가지지 않아도 된다. 그저 usePosts 훅을 통해서 posts를 받아오고, 그것으로 렌더링하는 것에만 집중하면 된다. 

## 마치며

사실 위에서 만든 커스텀 훅은 아쉬운 부분이 많다. posts 목록이 필요한 곳에서 계속 사용할 수 있지만, 오로지 그 일밖에 할 수 없다. 'usePosts는 posts를 가져오는 것만 잘 하면 되지 않나?'라는 생각도 들지만, API를 요청하고 데이터를 받아오는 로직은 상당히 많이 쓰이는 로직이므로, usePosts 훅은 더 추상화될 수 있다. 추상화에 대한 내용은 추후 다른 포스팅에서 더 자세하게 다루도록 하겠다.