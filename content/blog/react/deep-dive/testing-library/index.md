---
title: '[리액트 딥 다이브] 리액트에서 소프트웨어 테스트하기'
date: '2023-09-18T15:14:00.000Z'
description: ''
category: 'react'
featuredImage: '../../../../../src/images/react-256x256.png'
mobileImage: '../../../../../src/images/react-512x256x2.png'
---

## 1. 소프트웨어 테스트란?

소프트웨어 테스트란 소프트웨어가 의도한대로 동작하는지 확인하는 것을 말한다. 최근에는 개발 과정에서 소프트웨어 테스트를 구현하고 실행하는 것이 보편적이다. 테스트 라이브러리를 사용하면 사람이 직접 테스트하는 것이 아니라, 컴퓨터가 자동으로 테스트를 할 수 있게 테스트를 구현할 수 있다. 컴퓨터를 통해서 테스트가 이뤄지기 때문에, 사람이 테스트를 진행하는 것보다 빠르고, 좀 더 일관적인 테스트를 진행할 수 있다. 테스트가 자동으로 이뤄지기 때문에 거의 실시간으로 테스트가 이뤄져서 개발자가 빠른 피드백을 받을 수 있다는 장점이 있다.

## 2. Jest와 React-Testing-Library

자바스크립트에서 가장 유명한 테스트 라이브러리는 Jest이다. CRA에도 기본적으로 포함되어 있을 정도로, 사실상 표준으로 자리 잡았다. Jest를 사용하면 순수한 자바스크립트 코드를 테스트할 수 있지만, UI를 렌더링하는 리액트의 동작을 테스트하기에는 한계가 있다. 컴포넌트의 UI와 동작을 테스트할 때 많이 사용되는 라이브러리로는 RTL(React-Testing-Library)이 있다. RTL 역시 Jest처럼 CRA에 기본적으로 포함되어 있다. 

## 3. Jest 맛보기

https://testing-library.com/docs/react-testing-library/intro

https://www.robinwieruch.de/react-testing-library/

```ts
// App.test.tsx
// test 명령을 실행하면 Jest의 테스트 러너는 기본적으로 모든 test.js 파일에 대해 테스트를 실행한다.

// describe: 테스트 묶음(test suite)
describe('true is truthy and false is falsy', () => {
  // it: 테스트 케이스
  it('true is truthy', () => {
    // expect: 주장(assertions)
    expect(true).toBe(true);
  });

  it('false is falsy', () => {
    expect(false).toBe(false);
  });
});
```
## 4. RTL 맛보기

### 4.1 RTL의 기본적인 사용법

```tsx
import React, { ChangeEventHandler, ReactNode } from 'react';

function App() {
  const [search, setSearch] = React.useState('');

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => setSearch(currentTarget.value);

  return (
    <div>
      <Search value={search} onChange={handleChange}>
        Search:
      </Search>
      <p>Searches for {search || '...'}</p>
    </div>
  );
}

export default App;

type SearchProps = {
  value: string;
  onChange: ChangeEventHandler<HTMLDivElement>;
  children: ReactNode;
};

function Search({ value, onChange, children }: SearchProps) {
  return (
    <div>
      <label htmlFor="search">{children}</label>
      <input id="search" type="text" value={value} onChange={onChange} />
    </div>
  );
}
```
```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';

import App from './App';

describe('App', () => {
  it('renders App component', () => {
    // render: JSX를 인자로 받아 출력으로 렌더링한다.
    render(<App />);
    // screen.debug: 컴포넌트가 있는지 확인하기 위해 사용. 콘솔 로그처럼 브라우저의 출력을 오염시기키 때문에 몇몇 eslint 룰에서는 허용하지 않는 경우도 있다.
    screen.debug();
  });
});

```
```html
<body>
  <div>
    <div>
      <div>
        <label
          for="search"
        >
          Search:
        </label>
        <input
          id="search"
          type="text"
          value=""
        />
      </div>
      <p>
        Searches for 
        ...
      </p>
    </div>
  </div>
</body>
```

### 4.2 RTL로 요소 검색하기

인자로 받은 JSX에서 특정 요소를 검색해야 하는 경우가 있다. 특정 요소를 가져오기 위해 RTL에서 가장 많이 사용되는 함수는 getByText와 getByRole이다.

getByText는 렌더링된 JSX에서 인자로 받은 문자열 또는 정규표현식으로 요소를 찾는 함수다. 검색에 성공할 경우 해당 요소를 반환하고, 실패할 경우 에러를 발생시킨다. 아래 코드를 보자.

```html
<!--현재 App 컴포넌트 렌더링 결과-->
<body>
  <div>
    <div>
      <div>
        <label
          for="search"
        >
          Search:
        </label>
        <input
          id="search"
          type="text"
          value=""
        />
      </div>
      <p>
        Searches for 
        ...
      </p>
    </div>
  </div>
</body>
```

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';


describe('App', () => {
  it('renders App component', () => {
    render(<App />);
    // getByText 함수를 사용해 요소를 검색

    // 실패: 실패시 에러를 발생시킨다.
    expect(screen.getByText('Search')).toBeInTheDocument();

    // 성공: 해당 요소를 반환한다.
    expect(screen.getByText('Search:')).toBeInTheDocument();
    
    // 성공: getByText 함수는 정규식도 받을 수 있다.
    expect(screen.getByText(/Searches/)).toBeInTheDocument();
  });
});

```

getByRole은 [aria-label](https://developer.mozilla.org/ko/docs/Web/Accessibility/ARIA/Attributes/aria-label) 속성으로 접근성 역할에 따라 요소를 검색하는 함수다. aria-label이란 뭘까? 버튼이나 SVG처럼 특정한 텍스트를 포함하고 있지 않아서 스크린리더기 등으로 접근하기 어려운 요소가 존재한다. 그런 요소들에 접근할 수 있는 이름을 부여해주는 html 속성이 바로 aria-label 속성이다. getByRole을 사용하고 싶은데 내가 찾고자하는 요소의 접근성 역할을 모른다면 어떻게 해야 할까? getByRole은 사용할 수 없는 역할을 인자로 받으면 선택 가능한 모든 역할을 제안해준다. 아래 코드를 보자.

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';

describe('App', () => {
  it('renders App component', () => {
    render(<App />);
    // getByRole에 인자로 빈 문자열을 전달했다.
    expect(screen.getByRole('')).toBeInTheDocument();
  });
});
```
```shell
TestingLibraryElementError: Unable to find an accessible element with the role ""

# 아래와 같이 접근성 역할을 제안해준다.
Here are the accessible roles:

textbox:

Name "Search:":
<input
  id="search"
  type="text"
  value=""
/>

--------------------------------------------------
```
출력 결과를 보니 textbox라는 역할을 제안해주고 있는 것을 확인할 수 있다. textbox라는 역할은 HTML 요소에 부여된 암시적 역할이다. DOM에는 이미 HTML 요소에 암시적 역할이 부여되어 있기 때문에 테스트를 위해 명시적으로 HTML 요소에 아리아 역할을 할당할 필요가 없는 경우가 많다. RTL의 getByRole 함수는 암시적 역할로도 검색이 가능하기 때문에 암시적 역할을 제안해주기도 한다.

### 4.3 RTL 요소 검색 변형

getByText와 getByRole은 queryBy, findBy 등으로도 검색할 수 있다. 그렇다면 getBy 대신 queryBy, findBy를 사용해야하는 경우는 언제일까?

- **queryBy를 사용하는 경우**

getByText를 예로 들면, getByText의 경우 요소를 찾지 못하면 에러를 발생시킨다. 이는, 존재해야 하는 요소를 찾는 것에는 적합하지만, **존재하면 안 되는 요소**를 확인하기에는 어렵다. 확인하기도 전에 getByText에서 에러를 발생시키기 때문이다.

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';

import App from './App';

describe('App', () => {
  it('renders App component', () => {
    render(<App />);

    // 실패: getByText로 요소를 찾을 수 없어서 expect를 실행하기도 전에 에러가 발생한다.
    expect(screen.getByText(/Searches for JavaScript/)).toBeNull();
  });
});
```
이 때, getByText를 queryByText로 바꾸면 문제를 해결할 수 있다.

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';

import App from './App';

describe('App', () => {
  it('renders App component', () => {
    render(<App />);
    // 성공
    expect(screen.queryByText(/Searches for JavaScript/)).toBeNull();
  });
});
```

`presenteslinttesting-library/prefer-presence-queries`라는 eslint 설정이 되어있다면, 존재하지 않는 요소를 getBy로 검색할 경우 아래와 같은 에러 메시지를 띄워준다.

```
Use `queryBy*` queries rather than `getBy*` for checking element is NOT presenteslinttesting-library/prefer-presence-queries
```

이처럼 존재하지 않아야 하는 요소에 대한 확인을 할 때는, queryBy를 사용하면 되겠다.

- **findBy를 사용하는 경우**

findBy는 비동기 요소 검색에 사용된다. 아래 코드는 프로미스를 사용하여 비동기적으로 사용자의 정보를 받아오는 코드이다.

```tsx
import React, { ChangeEventHandler, ReactNode } from 'react';

import './App.css';

const getUser = () => Promise.resolve({ id: '1', name: 'Robin' });

function App() {
  const [search, setSearch] = React.useState('');
  const [user, setUser] = React.useState({ name: '' });

  React.useEffect(() => {
    const loadUser = async () => {
      const loadedUser = await getUser();
      setUser(loadedUser);
    };

    loadUser();
  }, []);

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => setSearch(currentTarget.value);

  return (
    <div>
      {user ? <p>Signed in as {user.name}</p> : null}
      <Search value={search} onChange={handleChange}>
        Search:
      </Search>
      <p>Searches for {search || '...'}</p>
    </div>
  );
}

export default App;
```
프로미스가 해결(resolve)되고 두 번째 렌더링으로 넘어가는 동안 컴포넌트를 테스트하려면, 프로미스가 해결될 때까지 기다려야 한다. 따라서 테스트 역시 비동기적인 코드로 작성해야 한다.

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';

import App from './App';

describe('App', () => {
  it('renders App component', async () => {
    render(<App />);

    expect(await screen.findByText(/Signed in as/)).toBeInTheDocument();
  });
});
```

**여러 요소를 검색해야 하는 경우**
getBy, queryBy, findBy는 All이라는 단어로 확장시킬 수 있다.

- getAllBy
- queryAllBy
- findAllBy

**정리하면**

- JSX에서 요소를 검색할 때는 기본적으로 getBy를 사용한다.

- 존재하지 않는 요소를 확인하기 위해 검색할 때는 queryBy를 사용한다.

- 아직 존재하지 않지만 언젠가는 존재할, 비동기적 요소를 검색할 때는 findBy를 사용한다.

- 여러 요소를 검색할 때는 getAllBy, queryAllBy, findAllBy를 사용한다.

### 4.4 Assertive Functions

Jest에서 expect에 해당하는 부분을 어설션(Assertions)이라고 부른다. 

(사전에는 '주장', '단언' 등으로 나오지만, 검색해보니 프로그래밍에서는 어설션이라는 단어 그대로 사용하는 경우가 많은 것 같다.)

```tsx
describe('App', () => {
  it('renders App component', () => {
    render(<App />);
    expect(screen.getByText(/Searches/)).toBeInTheDocument();
  });
});
```
expect의 메서드 toBeInTheDocument와 같은 함수를 '어설티브 함수'(Assertive Functions)라고 부른다. 추후 테스트 코드를 작성할 때 필요한 어설티브 함수를 더 빠르게 찾기 위해 RTL에서 사용할 수 있는 어설티브 함수와 그 역할을 하는지 간략하게 정리했다. 각 함수의 자세한 내용과 예시는 [jest-dom 깃허브 저장소](https://github.com/testing-library/jest-dom#jest-dom)에서 확인할 수 있다.

```js
toBeDisabled() // 사용자 관점에서 요소가 비활성화되었는지 확인할 수 있다.
toBeEnabled() // 사용자 관점에서 요소가 활성화되었는지 확인할 수 있다. 
toBeEmptyDOMElement() // 요소에 사용자에게 표시되는 콘텐츠가 없는지 확인할 수 있다. 
toBeInTheDocument() // document에 해당 요소가 있는지 여부를 확인할 수 있다. 
toBeInvalid() // 요소가 현재 유효하지 않은지 확인할 수 있다. 
toBeRequired() // form 요소의 required 여부를 확인할 수 있다. 
toBeValid() // 요소의 값이 현재 유요한지 확인할 수 있다. 
toBeVisible() // 요소가 현재 사용자에게 표시되는지 확인할 수 있다.

toContainElement(element: HTMLElement | SVGElement | null) 
// 요소에의 하위 요소로 포함 여부를 확인할 수 있다.

toContainHTML(htmlText: string)
// 인자로 받은 HTML 텍스트가 다른 요소에 포함되어 있는지 확인할 수 있다.

toHaveAttribute(attr: string, value?: any)
// 요소에 속성이 있는지 여부를 확인할 수 있다. 
// 선택적으로 expect.stringContaining/expect.stringMatching을 사용하여 속성이 특정 예상 값 또는 부분적으로 일치하는지 확인할 수도 있다.

toHaveClass(...classNames: string[], options?: {exact: boolean})
// 요소에 클래스 속성 내에 특정 클래스가 있는지 확인할 수 있습니다.

toHaveFocus() // 요소에 focus가 발생하고 있는지 확인할 수 있다. 

toHaveFormValues(expectedValues: { [name: string]: any })
// form 또는 fieldset이 포함하고 있는 form controls들의 각 이름과 지정된 값을 확인할 수 있다.

toHaveStyle(css: string | object)
// 요소에 특정 값이 적용된 특정 CSS 속성이 있는지 확인할 수 있다.
// 요소에 일부가 아닌 예상되는 모든 속성이 적용된 경우에만 일치한다.

toHaveTextContent(text: string | RegExp, options?: {normalizeWhitespace: boolean})
// 노드에 텍스트 콘텐츠가 있는지 여부를 확인할 수 있다.

toHaveValue(value: string | string[] | number)
// form 요소가 지정된 값을 가지고 있는지 확인할 수 있다. 

toHaveDisplayValue(value: string | RegExp | (string|RegExp)[])
// form 요소가 사용자에게 최종으로 표시되는 값을 가지고 있는지 확인할 수 있다. 

toBeChecked() // 요소가 checked 되었는지 확인할 수 있다. 
toBePartiallyChecked() // 요소가 부분적으로 체크되었는지 확인할 수 있다. 
```

## 4.5 RTL에서 이벤트 검사하기

지금까지는 컴포넌트 렌더링에 대해서만 테스트를 진행했다. 하지만 렌더링은 유저와의 상호작용인 이벤트를 통해서 얼마든지 바뀔 수 있다. 이벤트를 테스트할 수 있는 방법을 알아보자.

- **UserEvent**
UserEvent 함수는 요소와 이벤트를 인자로 받는다. 

```tsx
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import App from './App';

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('renders App component', async () => {
    render(<App />);

    // wait for the user to resolve
    await screen.findByText(/Signed in as/);

    expect(screen.queryByText(/Searches for JavaScript/)).toBeNull();

    userEvent.type(screen.getByRole('textbox'), 'JavaScript');

    expect(screen.getByText(/Searches for JavaScript/)).toBeInTheDocument();
  });
});
```

userEvent는 fireEvent API를 기반으로 확장된 API이다. 여전히 fireEvent도 사용할 수 있지만, userEvent가 실제 브라우저 동작을 더 가깝게 모방하기 때문에 userEvent를 사용하는 것을 추천한다.