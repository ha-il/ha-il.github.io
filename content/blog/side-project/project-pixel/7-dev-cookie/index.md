---
title: "[당신의 작업실] 7. 프로젝트 개발 과정 - 쿠키 설정"
date: "2023-06-20T05:20:07.000Z"
description: "Express로 쿠키를 설정하고, 클라이언트에 전달했던 경험을 공유합니다."
category: "project"
featuredImage: "../../../../../src/images/sideProject-256x256.png"
mobileImage: "../../../../../src/images/sideProject-512x256x2.png"
---
- 당신의 작업실 프로젝트 링크: https://pixel-workroom.herokuapp.com/
- 프로젝트 깃허브 저장소 링크 : https://github.com/ha-il/project-pixel

## 들어가기 전에 

이번 글부터는 개발 과정에서 맞닥뜨렸던 문제들과 그 해결 과정에 대해서 다뤄보겠습니다. 맞닥뜨렸던 문제들이야 어마어마하게 많았지만 그 중에 기억에 남는 것은 **지식 또는 경험의 부족**으로 인해 발생했던 문제들인 것 같습니다. 원인이 오타나 문법 실수가 아니기 때문에 더 답답했던 문제들이 있었는데요. 바로 아래와 같은 문제들이었습니다.

- **쿠키 설정 문제**: express에서 res.local 없이 쿠키 정보를 어떻게 넘기지?
- **컴포넌트간 prop(속성) 전달 문제**: 플레이리스트의 곡들을 뮤직플레이어로 어떻게 넘겨서 재생시키지?
- **검색 기능의 정규 표현식 사용 문제**: 검색 기능을 더 편리하게 개선할 수는 없을까?

이번 글에서는 **쿠키 설정 문제**를 어떻게 해결했는지를 중점적으로 다루겠습니다.

## 1. 쿠키 설정 문제

쿠키에 대한 문제가 발생한 이유는 저의 경험 부족 때문이었습니다. 예전에 **express**와 **pug**로 개인 프로젝트를 만들 때, '**로그인 유지**' 기능을 구현하고 '**로그인한 유저의 정보**'를 띄우기 위해 세션을 사용한 적이 있었습니다. 그때는 `req.session`에 로그인한 유저의 정보를 저장하고 `res.locals`에 세션 정보를 저장하여 pug에서 로그인한 유저의 정보를 활용하여 렌더링할 수 있었습니다. 

하지만 이번에는 pug로 서버 측에서 렌더링하는 것이 아니라, **바닐라 자바스크립트로 클라이언트 측에서 렌더링**하기 때문에 `res.locals`를 활용할 수 없었습니다. 난감했지만 해결 방법은 간단했습니다. 서버에서 클라이언트 측으로 로그인한 유저의 정보를 보내는 방법만 알아내면 됐습니다. 서버에서 클라이언트로 뭔가 전송하는 방법 중 가장 먼저 떠오른 것은 **쿠키**였습니다.

### 1.1 res.cookie: Express 서버에서 쿠키 설정하기
[Express](https://expressjs.com/ko/4x/api.html) 공식문서에서 쿠키를 설정할 수 있는 방법을 검색해보니 [res.cookie](https://expressjs.com/ko/api.html#res.cookie)를 사용하면 쿠키를 설정할 수 있었습니다. 바로 프로젝트에 적용했습니다. 

```javascript
export const login = async (req, res) => {

  // 클라이언트에서 입력 받은 유저네임과 비밀번호
  const { username, password } = req.body;

  // 유저네임에 해당하는 유저 검색
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).send({
      errorMessage: `${username}로 가입한 유저가 존재하지 않습니다.`,
    });
  }

  // 입력받은 비밀번호와 데이터베이스에 암호화되어 저장된 비밀번호를 비교
  const hashedPassword = user.password;
  const isValidPassword = await bcrypt.compare(password, hashedPassword);
  if (!isValidPassword) {
    return res.status(400).send({
      errorMessage: `비밀번호가 일치하지 않습니다.`,
    });
  }

  // 클라이언트로 공개되도 괜찮은 유저 정보만 loggedInUser 객체에 할당.
  const loggedInUser = {
    _id: user._id,
    username: user.username,
    profileName: user.profileName,
  };

  // 세션에 로그인 여부와 로그인한 유저 정보를 저장
  req.session.isLoggedIn = true;
  req.session.loggedInUser = loggedInUser;

  // 쿠키에 로그인 여부와 로그인한 유저 정보를 저장
  res.cookie("isLoggedIn", true);
  res.cookie("loggedInUser", loggedInUser);

  return res.sendStatus(200);
};
```

### 1.2 document.cookie: 클라이언트에서 쿠키 데이터 참조하기
이렇게 서버에서 쿠키를 설정했다면, 클라이언트 측에서 `document.cookie`를 사용하여 쿠키에 있는 데이터를 확인할 수 있습니다. 

그런데 데이터를 확인하니 조금 당황스러웠습니다.

```
// document.cookie

isLoggedIn=true; loggedInUser=j%3A%7B%22_id%22%3A%22646f1a16e5e2041b6bac11d2%22%2C%22username%22%3A%22q%22%2C%22profileName%22%3A%22%ED%95%98%EC%9D%BC%22%7D
```
쿠키의 데이터가 위와 같이 나온 이유는 `퍼센트 인코딩`이 되었기 때문인데요. 위키백과의 [퍼센트 인코딩](https://ko.wikipedia.org/wiki/%ED%8D%BC%EC%84%BC%ED%8A%B8_%EC%9D%B8%EC%BD%94%EB%94%A9) 문서에 따르면 **URL**에서 중요하게 사용되는 **예약 문자**가 있고 이들 중 일부는 **URI에서 중요한 문법적 의미**를 가지고 있기 때문에, 그 의미로 사용할 것이 아니라면 **반드시 인코딩**을 해야 한다고 합니다. 

**쿠키값에 포함된 특수문자나 공백**과 같은 문자들이 URL에서 사용되는 **구분 기호나 예약 문자로 해석되지 않도록 하기 위해** 퍼센트 인코딩되었음을 짐작할 수 있었습니다.

자바스크립트에서는 [decodeURIComponent()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent) 함수를 사용해서 퍼센트 인코딩된 데이터를 디코딩할 수 있습니다.

```
// document.cookie
isLoggedIn=true; loggedInUser=j%3A%7B%22_id%22%3A%22646f1a16e5e2041b6bac11d2%22%2C%22username%22%3A%22q%22%2C%22profileName%22%3A%22%ED%95%98%EC%9D%BC%22%7D


// decodeURIComponent(document.cookie);
isLoggedIn=true; loggedInUser=j:{"_id":"646f1a16e5e2041b6bac11d2","username":"q","profileName":"하일"}
```
(**참고**: 퍼센트 인코딩된 데이터를 디코딩하는 또다른 함수로 [decodeURI()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/decodeURI)가 있지만, encodeURI에서 도입할 수 없었던 [이스케이프 시퀀스](https://ko.wikipedia.org/wiki/%EC%9D%B4%EC%8A%A4%EC%BC%80%EC%9D%B4%ED%94%84_%EC%8B%9C%ED%80%80%EC%8A%A4)는 해독하지 않아서 '#' 문자는 이스케이프 시퀀스에서 디코딩되지 않는다고 합니다.)

### 1.3 쿠키에서 데이터를 추출하는 유틸함수 getCookie 만들기
쿠키의 데이터를 이대로 사용할 수 없기 때문에, `decodeURIComponent()`를 활용해서 쿠키를 디코딩하고 내가 원하는 데이터를 추출하기 위해 `getCookie`라는 유틸 함수를 만들었습니다.

```javascript
export const getCookie = (key) => {
  if (document.cookie === "") return null;
  const decodedCookie = decodeURIComponent(document.cookie);
  // "isLoggedIn=true; loggedInUser=j:{"_id":"12345", ... }"
  const splitCookie = decodedCookie.split("; ");
  // ['isLoggedIn=true', 'loggedInUser=j:{"_id": "12345", ... }']
  const foundKey = splitCookie.find((item) => item.includes(key));
  // key가 isLoggedIn일때 foundKey => 'isLoggedIn=true'
  // key가 loggedInUser일때 foundKey => 'loggedInUser=j:{"_id": "12345", ... }'

  if (!foundKey) {
    return null;
  }

  const gettingValue = foundKey.slice(key.length + 1);
  // gettingValue: foundKey에서 key를 제거하고 남은 value
  
  if (gettingValue === "true" || gettingValue === "false") {
    return Boolean(gettingValue);
  }

  if (gettingValue.includes("j:")) {
    // 'j:{"_id": "12345", ... }' => {id: 12345, ...}
    return JSON.parse(gettingValue.slice(2));
  }
};
```
### 1.4 유틸함수 getCookie 활용 예

#### 1.4.1 로그인 여부에 따른 이미지 렌더링
'당신의 작업실' 프로젝트는, 사용자의 로그인 여부에 따라서 다른 이미지를 렌더링합니다. 

예를 들어서 사용자가 **로그아웃 상태**라면 '전원이 꺼져있는 티비' 이미지를 보여주고, **로그인 상태**라면 '뮤직뱅크가 나오는 티비' 이미지를 보여줍니다. 

프로젝트에 사용된 이미지가 많기 때문에 `getCookie` 함수를 여러 곳에서 사용했습니다.
```javascript
class Home extends Component {
  initState() {
    return {
      // 키를 문자열로 전달하기 때문에, 오타로 인한 에러 위험이 있어서 state에 저장해두고 사용.
      isLoggedIn: getCookie("isLoggedIn"),
    };
  }
  template() {
    return `
      <div class="home-container">
        <img id="tv" class="object" src=${
          this.state.isLoggedIn
            ? "../../../../images/tv-on.gif"
            : "../../../../images/tv.png"
        } />
        <div class="floor ${this.state.isLoggedIn ? "" : "floor-dark"}">
      </div>
    `;
  }
}
```
- 유저가 로그인하지 않은 상태
![tv](https://github.com/ha-il/project-pixel/assets/108077643/46070a15-2868-4976-8d4f-93ddbfb88f38)
- 유저가 로그인한 상태
![tv-on](https://github.com/ha-il/project-pixel/assets/108077643/1529f865-d4c8-4a5c-a8ba-3e8f8827c277)

#### 1.4.2 로그인한 유저의 프로필 이름 띄우기

프로젝트에 사용된 스마트폰 오브젝트의 홈 화면에는 **유저의 프로필 이름**을 띄우기로 했습니다. 이때도 `getCookie` 함수를 사용해 로그인한 유저의 프로필 이름을 띄울 수 있었습니다.

```javascript
class PhoneHome extends Component {
  initState() {
    return {
      loggedInUser: getCookie("loggedInUser"),
    };
  }
  template() {
    return `
      <div class="time-container">
        <div class="date">${getCurrentDate()}</div>
        <div class="time">${getCurrentTime()}</div>
        <div class="greeting">Hello, ${
          this.state.loggedInUser.profileName
        } !</div>
      </div>
    `;
  }
}
```

- 스마트폰 오브젝트의 홈 화면
![cookie-ex](https://github.com/ha-il/project-pixel/assets/108077643/b00034b9-db5d-49d0-bae6-de0f8c42c519)

## 마치며

이번 글에서는 **쿠키 설정**에 대해서 다뤄봤습니다. [다음 글](https://ha-il.github.io/side-project/project-pixel/8-dev-prop-this)에서는 **컴포넌트간 props 전달 문제**를 해결한 과정에 대해서 다뤄보겠습니다.

## 참고자료

- Express API 
  - by © StrongLoop, Inc., and other expressjs.com contributors
  - accessed June 20
  - [문서 링크](https://expressjs.com/ko/4x/api.html)

- Express API: Response: res.cookie
  - by © StrongLoop, Inc., and other expressjs.com contributors
  - accessed June 20
  - [문서 링크](https://expressjs.com/ko/api.html#res.cookie)

- 위키백과: 이스케이프 시퀀스
  - by Wikipedia®
  - accessed June 20
  - [문서 링크](https://ko.wikipedia.org/wiki/%EC%9D%B4%EC%8A%A4%EC%BC%80%EC%9D%B4%ED%94%84_%EC%8B%9C%ED%80%80%EC%8A%A4)

- 위키백과: 퍼센트 인코딩
  - by Wikipedia®
  - accessed June 20
  - [문서 링크](https://ko.wikipedia.org/wiki/%ED%8D%BC%EC%84%BC%ED%8A%B8_%EC%9D%B8%EC%BD%94%EB%94%A9)

- MDN Web Docs: decodeURIComponent()
  - by [MDN contributors.](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent/contributors.txt)
  - accessed June 20
  - [문서 링크](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent) 

- MDN Web Docs: decodeURI()
  - by [MDN contributors.](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/decodeURI/contributors.txt)
  - accessed June 20
  - [문서 링크](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/decodeURI) 