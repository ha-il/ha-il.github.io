---
title: '[리액트 딥 다이브] 리액트에서 의존성 역전 다루기'
date: '2023-09-09T16:17:00.000Z'
description: 'ContextAPI는 전역 관리 도구가 아니다.'
category: 'react'
featuredImage: '../../../../../src/images/react-256x256.png'
mobileImage: '../../../../../src/images/react-512x256x2.png'
---

## 1. 의존성

의존성이란 특정한 모듈이 동작하기 위해서 다른 모듈을 필요로 하는 것을 의미한다. 아래 코드를 잠깐 확인해보자.

```js
// fetch(path, options):void

fetch("profile", {
	headers:{
		Authorization:localStorage.getItem("ACCESS_TOKEN");
	}
})
```
fetch 함수는 localStorage에서 토큰을 받아오고 path로 api 요청을 보내서 현재 로그인 중인 유저의 프로필을 받아오는 함수다. fetch 함수의 경우 localStorage라는 외부 요소에 의존하고 있다. 이처럼 하나의 모듈이 동작하기 위해서 다른 모듈을 필요로 하는 것을 의존성이라고 하며, fetch 함수는 localStorage에 의존하고 있다고 말할 수 있다.

이 코드에는 문제점이 있다. fetch라는 함수가 localStorage라는 '구체(concretion)'에 의존하고 있다는 점이다.

## 2. 구체에 의존하는 게 뭐가 나쁘죠?

먼저, '구체'라는 개념에 대해서 간략하게 알아보자.

- 구체(concretion): 실질적으로 해당 동작을 하기 위해서 수행해야 하는 구체적인 동작과 흐름을 말한다. 
  
나는 위에서 localStorage가 '구체'라고 말했다. 그 이유는 뭘까? localStorage를 사용하는 코드는 달랑 한 줄이고 그 길이도 길지 않지만 다음과 같은 구체적인 흐름을 가지고 실행된다.  

1. localStorage의 getItem 메서드를 사용한다.
2. getItem 메서드에 "ACCESS_TOKEN"을 인자로 보낸다.
3. localStorage에서 데이터를 받아온다.

이렇게 fetch라는 함수는 localStorage라는 '구체'에 의존하고 있음을 확인할 수 있다. 하지만 이게 뭐가 나쁘다는 것일까?

만약 토큰을 저장하는 방식을 localStorage가 아닌 다른 스토리지를 사용하도록 바꾸면 어떻게 될까? fetch 함수를 사용하는 곳은 물론이고, localStorage를 사용하는 모든 곳에서 코드를 수정해야 한다. 즉, 구체에 의존하면 앱의 유지보수가 어려워진다.

유지보수 외에도 관심사에 대한 문제도 있다. fetch라는 함수의 관심사는 토큰을 가지고 profile 정보를 받아오는 것에 관심을 가지고 있다. 토큰을 어디서 어떻게 가지고 오는 지는 fetch 함수의 관심사가 아니다. fetch 함수 입장에서는 localStorage든 뭐든, getItem 메서드든 뭐든 그런 건 관심없고 그냥 토큰만 있으면 되는 것이다.

그러면 구체에 의존하는 이 상황을 무엇에 의존하도록 수정하면 좋을까? 위에서 잠깐 말 했듯 fetch 함수는 토큰을 받아오는 로직이 궁금한 것이 아니라, 그저 토큰만 필요한 것이다. 즉, 토큰을 받아오는 로직을 다른 함수로 분리하고, 그 함수의 반환 값에만 의존하도록 수정하면 되지 않을까?

이렇게 어떤 모듈의 구체적인 동작이나 흐름에 의존하지 않고, 그저 그 모듈이 해줘야 하는 일과 결과에 의존하는 것을 '추상'에 의존한다고 말한다. 

## 3. 추상에 의존하는 게 뭐가 좋다는 거죠?

먼저, '추상'이라는 개념에 대해서 간략하게 알아보자.

- 추상(concretion): 구현 방법이 포함되어 있지 않고, 해당 모듈이 해줘야 하는 일과 결과에만 신경쓸 수 있게 표현하는 것을 말한다.

모듈을 함수라고 생각하면 추상에 대한 이해가 조금 더 쉬워진다. 쉽게 말하면 어떤 함수 A가 다른 함수 B를 호출할 때, A라는 함수가 B라는 함수의 인자와 반환값에만 관심을 갖는다면, A와 B는 추상에 의존한다고 말할 수 있다. A라는 함수는 B라는 함수가 인자를 어떻게 처리해서 어떻게 반환하는지에 대해서 관심이 없고, B라는 함수는 A라는 함수가 자신을 어떤 맥락에서 호출하는지에 대해서 관심이 없는 것이다.

추상의 대표적인 예시는 API이다. 프론트엔드에서 API 요청을 보낼 때를 생각해보자. 서버에서 API 응답을 어떻게 처리하는지, 어떤 로직을 가지고 있는지에 대해서는 프론트엔드의 관심사가 아니다. 프론트엔드에서는 API 요청을 보내고 받을 응답에 대해서만 관심이 있다. 서버에서 로직을 어떻게 바꾸든, 서버에서 사용하는 프로그래밍 언어나 프레임워크를 바꾸든 말든 프론트엔드에서는 관심이 없다. 그저 요청에 따른 응답만 잘 해주면 좋겠는 것이다. 반대로 서버 입장에서는 요청이 어디서 어떻게 올지 관심이 없다. 어디서 요청이 오든 그저 서버 입장에서는 요청을 잘 처리해서 응답을 잘 보내주기만 하면 된다.

이처럼 서버와 프론트엔드는 서로의 상황에 대해서는 관심을 가질 필요가 없다. 그저 '요청과 응답'이라는 '추상'에 관심을 가지고 있다. 이렇게, 해줘야 하는 일과 결과에만 신경쓰는 것을 '추상'에 의존한다고 말한다. 프로그래밍에서 '추상'은 '인터페이스'라고도 불린다. 그래서인지 보통 프론트엔드와 백엔드가 API 요청과 응답을 맞출 때 '인터페이스를 맞춘다'라는 표현을 사용한다고 한다.

그렇다면 위에서 살펴봤던 fetch 함수를 구체가 아닌 추상에 의존하게 하려면 어떻게 코드를 수정해야 할까? 

1. **먼저, 함수의 인풋과 아웃풋을 추상적으로 정의하는 인터페이스를 작성한다.**

```js
/*
	TokenRepositoryInterface {
	  get():string
	}
*/
```
위에서 작성한 예시는 TokenRepository라는 클래스의 인터페이스다. TokenRepository는 get이라는 메서드를 가져야 하고, 반환값은 문자열을 반환해야 한다. 메서드에 대한 구체적인 로직이나 반환값을 정하지 않고 추상적으로 표현하는 것이다.

2. **인터페이스를 기준으로 구체적인 로직을 작성한다.**

```js
/*
	TokenRepositoryInterface {
	  get():string
	}
*/

class LocalTokenRepository {
  #TOKEN_KEY = "ACCESS_TOKEN";

  get() {
    return localStorage.getItem(this.#TOKEN_KEY);
  }
} 
```
인터페이스를 기준으로 구체적인 로직을 작성한다는 것은, 인터페이스에 작성된 메서드의 인자와 반환값에 의존하여 로직을 작성하는 것을 의미한다. 위에서 만들었던 인터페이스를 보면 get()이라는 메서드를 구현해야 하는데, 해당 메서드의 경우 인자는 필요없고 문자열을 반환하면 된다. 

데이터를 가져오는 로직을 작성하는 쪽에서는 이 인터페이스에 맞춰서 get()이라는 이름을 가진 함수가 문자열을 반환하도록 로직을 작성하면 된다. 어떤 스토리지에서 어떻게 데이터를 가져오든 문자열을 반환하면 되는 것이다. 물론 그 문자열이 토큰이 아니면 안 되지만, 클래스의 이름이 LocalTokenRepository이기 때문에 반환될 문자열은 토큰일 것이라 추측할 수 있다.

이렇게 위의 예시에서는 LocalTokenRepository라는 클래스가 TokenRepositoryInterface에 의존하고 있다고 볼 수 있다. 즉, 추상에 의존하고 있는 것이다.

3. **인터페이스를 기준으로 메서를 호출한다.**
```js
/*
	TokenRepositoryInterface {
	  get():string
	}
*/

const tokenRepository = new LocalTokenRepository();

fetch("profile", {
	headers:{
		Authorization: tokenRepository.get();
	}
})
```
인터페이스를 기준으로 메서드를 호출한다는 것은, 인터페이스에 작성된 메서드의 인자와 반환값에 의존하여 메서드를 호출하는 것을 의미한다. 쉽게 말하면, 인터페이스에 정의된대로 메서드를 사용하면 된다는 것이다.

이번에는 토큰이라는 데이터가 필요한 fetch 함수 입장에서 살펴보자. 인터페이스를 보니 TokenRepository라는 이름을 가진 객체의 get() 메서드를 사용하면 문자열을 반환하고 있는데, 객체의 이름을 보니 그 문자열이 토큰임을 짐작할 수 있다. fetch 함수는 LocalTokenRepository라는 클래스의 인스턴스를 tokenRepository로 만들고, 그 인스턴스의 get() 메서드를 사용하여 토큰을 받아올 수 있다. 

이 경우 fetch 함수 입장에서는 tokenRepository가 어떤 스토리지에서 어떤 방식으로 토큰을 받아오는지 관심을 갖지 않는다. 그저 인터페이스에 정의된대로 함수를 사용할 뿐이다. 즉, fetch 함수는 TokenRepositoryInterface라는 추상에 의존하고 있다.

이렇게 호출하는 모듈인 fetch와 호출 당하는 모듈인 LocalTokenRepository가 TokenRepositoryInterface라는 추상에 의존하고 있음을 확인했다. 그리고 이런 현상을 '의존성 역전'이라고 말한다. 의존의 대상이 구체에서 추상으로 바뀐 것 뿐인데 왜 의존성이 역전됐다고 표현할까?


## 4. 구체에서 추상으로 의존의 대상이 바뀐 것 뿐인데 왜 '역전'이죠?

위에서 살펴봤던 '구체'와 '추상'에 의존했던 예시들의 실행 흐름과 의존성의 방향을 생각해보자.

1. 구체에 의존하는 경우
	```js
	fetch("profile", {
		headers:{
			Authorization:localStorage.getItem("ACCESS_TOKEN");
		}
	})
	```
	- 실행 흐름: fetch → localStorage
	- 의존성의 방향: fetch → localStorage

	구체에 의존하는 경우 실행 흐름과 의존성의 방향이 일치한다.

2. 추상에 의존하는 경우
	```js
	/*
		TokenRepositoryInterface {
			get():string
		}
	*/

	class LocalTokenRepository {
		#TOKEN_KEY = "ACCESS_TOKEN";

		get() {
			return localStorage.getItem(this.#TOKEN_KEY);
		}
	} 

	const tokenRepository = new LocalTokenRepository();

	fetch("profile", {
		headers:{
			Authorization: tokenRepository.get();
		}
	})
	```
	- 실행 흐름: fetch → tokenRepository Interface(추상) **→** tokenRepositry Class(구체) → localStorage
	- 의존성방향: fetch → tokenRepository Interface(추상) **←** tokenRepositry Class(구체) → localStorage

	이렇게 추상에 의존하는 경우 실행 흐름과 의존성의 방향이 반대로 역전되기 때문에, 이런 현상을 '의존성 역전'이라고 부른다.

## 5. 의존성 주입

의존성 주입에 대해서 알아보기 전에, 먼저 예시를 살펴보자. 여태 다뤘던 fetch 함수와 LocalTokenRepository 클래스를 확장한 예시이다.

```js
class LocalTokenRepository {
  #TOKEN_KEY = "ACCESS_TOKEN";
  get() {
    return localStorage.getItem(this.#TOKEN_KEY);
  }
}

class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.tokenRepository = new LocalTokenRepository();
  }

  fetch(url, options = {}) {
    return window.fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: {
        Authorization: this.tokenRepository.get(),
        ...options.headers,
      },
    });
  }
}

const httpClient = new HttpClient(process.env.BASE_URL)
```
fetch 함수를 httpClient라는 클래스 안의 메서드로 사용했다. 그리고 LocalTokenRepository 클래스의 인스턴스를 HttpClient의 constructor 안에서 tokenRepository라는 이름으로 생성했다. 

사실 이대로도 잘 돌아가지만 단점이 하나 있다. 이 코드 그대로 사용한다면 LocalTokenRepository에 대해서만 HttpClient를 사용해야 한다는 것이다. 로컬 스토리지가 아니라 다른 스토리지를 사용할 경우에는 HttpClient를 직접 수정해줘야 한다. 이런 수정을 방지하고, HttpClient를 좀 더 유연하게 사용하게 만들기 위해 '의존성 주입'을 활용할 수 있다. 아래의 예시를 확인해보자.

```js
// 기존의 로컬스토리지 관련 클래스
class LocalTokenRepository {
  #TOKEN_KEY = "ACCESS_TOKEN";
  get() {
    return localStorage.getItem(this.#TOKEN_KEY);
  }
}

// 새롭게 추가된 세션스토리지 관련 클래스
class SessionTokenRepository {
  #TOKEN_KEY = "ACCESS_TOKEN";
  get() {
    return sessionStorage.getItem(this.#TOKEN_KEY);
  }
}

class HttpClient {
	// 내부에서 인스턴스를 만드는 코드를 삭제하고 외부에서 인스턴스를 '주입'받음.
  constructor(baseURL, tokenRepository) {
    this.baseURL = baseURL;
    this.tokenRepository = tokenRepository;
  };

  fetch(url, options = {}) {
    return window.fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: {
        Authorization: this.tokenRepository.get(),
        ...options.headers,
      },
    });
  }
}

// 인스턴스를 외부에 생성하고 httpClient에 인자로 보냄

// LocalTokenRepository의 인스턴스를 보내는 경우
const localTokenRepository = new LocalTokenRepository();
const httpClient = new HttpClient(process.env.BASE_URL, localTokenRepository);

// sessionTokenRepository의 인스턴스를 보내는 경우
const sessionTokenRepository = new SessionTokenRepository()
const httpClient = new HttpClient(process.env.BASE_URL, sessionTokenRepository);
```
HttpClient 클래스에서 필요한 스토리지 관련 의존성을 내부에 가지고 있는 것이 아니라, HttpClient를 호출하는 쪽에서 의존성을 주입해주는 방식으로 코드를 수정했다. 이제 HttpClient는 더 유연하게 사용할 수 있게 되었다.

이렇게 특정한 모듈에 필요한 의존성을 내부에서 가지고 있는 것이 아니라 해당 모듈을 사용하는 입장에서 주입해주는 형태로 설계하는 것을 '의존성 주입'이라고 한다. 예시를 통해 봤듯이 클래스의 경우에는 constructor를 통해서 의존성을 주입한다. 함수의 경우에는 인자를 통해서 의존성을 주입하면 된다. 그런데 만약 리액트 컴포넌트에서 의존성을 주입하려면 어떻게 해야 할까? 당연히 props를 사용하게 되겠지만, props는 데이터 전달이 단방향으로만 이뤄지기 때문에 의존성을 주입하는 것이 어렵다. 그 문제를 해결하기 위해서는 Context API를 사용하면 된다.
## 6. Context API

리액트의 Context API를 이용하면 컴포넌트 단계마다 일일이 props를 넘겨주지 않고도 컴포넌트 트리 전체에 데이터를 전달할 수 있다. 이 설명은 [리액트 공식문서-Context](https://ko.legacy.reactjs.org/docs/context.html#when-to-use-context)에서도 나오는 설명인데, 바로 이 지점에서 Context API를 전역 상태관리 기술로 착각하는 경우가 있다. Context API로 전역에서 데이터를 제공하여 상태 관리를 할 수 있는 것은 사실이지만, 제공 범위는 Context Providr 컴포넌트의 위치에 따라서 달라질 수 있다. 즉, 전역 상태관리를 할 수 있는 것은 사실이지만, 그것만을 위한 기술은 아니라는 의미이다. ContextAPI는 그저 props를 좀 더 쉽게 전달하기 위한 기술이다. 

Context API를 통해 props를 쉽게 전달할 수 있기 때문에 리액트 컴포넌트에서도 의존성 주입을 할 수 있다. 아래 예시를 통해서 확인해보자.
