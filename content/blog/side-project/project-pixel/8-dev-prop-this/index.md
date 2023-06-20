---
title: "[당신의 작업실] 8. 프로젝트 개발 과정 - prop과 this 바인딩"
date: "2023-06-20T05:20:08.000Z"
description: "Express로 쿠키를 설정하고, 클라이언트에 전달했던 경험을 공유합니다."
category: "project"
featuredImage: "../../../../../src/images/sideProject-256x256.png"
mobileImage: "../../../../../src/images/sideProject-512x256x2.png"
---
- 당신의 작업실 프로젝트 링크: https://pixel-workroom.herokuapp.com/
- 프로젝트 깃허브 저장소 링크 : https://github.com/ha-il/project-pixel

## 들어가기 전에 

[이전 글](https://ha-il.github.io/side-project/project-pixel/7-dev-cookie)부터 이번 글까지는 개발 과정에서 맞닥뜨렸던 문제들과 그 해결 과정에 대해서 다루고 있습니다. **쿠키 설정에 대한 문제**는 이전 글에서 다뤘으니, 이번 글에서는 **컴포넌트간 prop(속성) 전달 문제**에 대해서 다루고, 그 문제를 해결하기 위한 **this 바인딩**에 대한 내용도 다루겠습니다.

## 1. 컴포넌트간 prop(속성) 전달 문제

이번 프로젝트는 바닐라 자바스크립트로 **웹 컴포넌트**를 구현하여 프로그래밍하는 방식으로 진행했습니다. 그 과정에서 prop을 전달할 일이 많았는데 그 과정에서 문제가 발생했습니다. 문제에 대해서 설명하기 전에, 이 프로젝트가 **어떤 구조로 렌더링되고 있는지** 간략하게 소개하겠습니다.

```html
<div id="app">
  <main>
    // 경로가 "/"인 경우 home-container 렌더링
    <div class="home-container">
      <div id="cabinet" class="object"></div>
      ... 그밖의 많은 가구 오브젝트들 ...
    </div>
    // 경로가 "/playlists/:id"인 경우 playlist-container 렌더링
    <div class="playlist-container"></div>
    // 경로가 "/playlists/chart"인 경우 chart-container 렌더링
    <div class="chart-container"></div>
  </main>
  <div id="music-player"></div>
</div>
```
- **app** 컴포넌트가 **main**과 **musicPlayer**를 렌더링합니다. 
  - **musicPlayer**는 사이트 어디에서나 재생되어야하므로 main 컴포넌트와 분리했습니다. 
- **main** 컴포넌트는 경로에 따라서 다른 컴포넌트를 렌더링합니다.
  - 경로가 "**/**"인 경우 home-container 렌더링 => **홈페이지**
  - 경로가 "**/playlists/:id**"인 경우 playlist-container 렌더링 => **플레이리스트 상세 페이지**
  - 경로가 "**/playlists/chart**"인 경우 chart-container 렌더링 => **인기차트 페이지**

### 1.1 플레이리스트 곡 목록을 뮤직 플레이어에서 재생하기
![props](https://github.com/ha-il/project-pixel/assets/108077643/0969bf6e-0e81-4f96-b016-a3625f761c5b)

이미지를 보시면 '재생'이라고 적힌 노란색 버튼이 있는데요. 이 버튼을 누르면 **플레이리스트의 모든 곡들이 뮤직 플레이어의 재생목록에 추가**되고 **재생목록의 첫 곡부터 재생이 시작**되도록 구현하고 싶었습니다. 이런 플레이리스트 재생 기능은 어느 뮤직 앱에나 있는 기본적인 기능이기 때문에 반드시 추가하고 싶었습니다. 그러나 여기서 문제가 발생했습니다. 

`'플레이리스트 컴포넌트에서 뮤직 플레이어 컴포넌트로 어떻게 곡을 보내야하지?'`

상위 컴포넌트에서 하위 컴포넌트로 속성을 전달하는 것은 어려운 일이 아닙니다. **하지만 하위 컴포넌트에서 상위 컴포넌트로 속성을 전달한다니**, 당시 제 지식으로는 어려운 일이었습니다. 그래서 생각을 바꾸기로 했습니다.

`'플레이리스트 컴포넌트(하위)에서 뮤직 플레이어 컴포넌트(상위)로 곡을 보내는 것이 아니다.'`

`'곡을 받아 재생하는 메서드를 뮤직 플레이어(상위)에서 플레이리스트(하위)로 보내야 한다.'`

생각의 방향을 바꿨습니다. 하위에서 상위로 곡을 전달하고 재생하는게 아니라, **곡을 받아서 재생하는 메서드를 상위 컴포넌트에서 하위 컴포넌트로 보내는 방식**으로 접근했습니다. 

글로만 설명하면 이해가 어려우니 뮤직 플레이어 컴포넌트의 코드를 보면서 재생 기능에 대해서 설명하겠습니다.

### 1.2 뮤직 플레이어 컴포넌트 설명

```javascript
class MusicPlayer extends Component {
  // 컴포넌트 초기 세팅
  init() {
    this.initYoutubeApi();
    this.state = this.initState();
    this.initRouter();
    this.render();
    this.setEvent();
  }

  // initYoutubeApi: 유튜브 Iframe API를 다운로드하는 함수
  initYoutubeApi() {
    // ...생략...
  }
  onYouTubeIframeAPIReady() {
    this.player = new YT.Player("player", {
      // ...생략...
      events: {
        // onReady: 유튜브 Iframe API의 다운로드가 완료되면 발생하는 이벤트
        onReady: this.onPlayerReady.bind(this),
      },
    });
  }

  // onPlayerReady: onReady 이벤트가 발생하면 실행되는 함수
  onPlayerReady(event) {  
    // Iframe이 준비되면 재생을 시작한다.
    event.target.playVideo();
  }
  
  // setState에 인수로 곡 목록을 배열로 전달한다면
  setState(newState) {
    // 뮤직 플레이어의 state에 추가한 곡 목록이 할당되고
    this.state = { ...this.state, ...newState };
    // 뮤직 플레이어는 다시 렌더링 되고, 이벤트를 다시 설정하고
    this.render();
    this.setEvent();
    // onYouTubeIframeAPIReady를 다시 실행시키면
    // onReady이벤트가 실행되어서 음악이 자동으로 재생된다.
    this.onYouTubeIframeAPIReady();
  }
}
```
(**참고**: 간략한 설명을 위해 많은 코드를 생략했습니다. YouTube Iframe API에 대해서 더 자세히 알고 싶은 분은 [링크](https://developers.google.com/youtube/iframe_api_reference?hl=ko)를 참고해주시기 바랍니다.)

위 코드를 보면 뮤직 플레이어에서 곡 목록을 받아서 재생을 시작하는 메서드는 `setState`입니다. 따라서 `setState`를 플레이리스트 컴포넌트로 전달해야 했습니다. 

### 1.3 뮤직 플레이어의 setState를 플레이리스트 컴포넌트로 전달하기
```javascript
class App extends Component {
  addComponent() {
    // ...생략...
    const musicPlayer = new MusicPlayer($("#music-player"));

    // props에 MusicPlayer 컴포넌트의 setState 메서드를 담아서 하위 컴포넌트로 보냅니다.
    return new Playlist($("main"), {
      playerSetState: musicPlayer.setState,
    });
  }
}
```
```javascript
class Playlist extends Component {
  setEvent() {
    $(".play-button").addEventListener("click", (e) => {
      // props로 전달받은 playerSetState에 접근합니다.
      const { playerSetState } = this.props;

      // playerSetState에 플레이리스트 페이지의 곡 목록을 전달합니다.
      return playerSetState({
        musics: this.state.playlist.musics,
        currentMusic: this.state.playlist.musics[0],
      });
    });
  }
}
```
예상대로라면, **플레이리스트의 곡들이 뮤직 플레이어를 통해서 재생**되어야 합니다. 과연 잘 실행되었을까요?

```
MusicPlayer.js

❌ Uncaught TypeError: Cannot read properties of undefined (reading 'state')
```
바로 에러를 만났습니다. 이유가 뭘까요?


### 1.4 bind()를 사용하여 문제 해결
메시지를 읽어보면 **undefined의 속성 state를 읽을 수 없다**고 합니다. MusicPlayer 컴포넌트의 setState 메서드를 보면 this.state 부분에서 **this**를 참조하고 있습니다. 그렇다면 **this가 가리키고 있는 대상이 뮤직플레이어가 아니라 undefined**이기 때문에 에러가 발생했음을 알 수 있습니다. 

```javascript
class MusicPlayer extends Component {
  setState(newState) {
    // 이 부분의 this가 undefined라는 것.
    this.state = { ...this.state, ...newState };
    this.render();
    this.setEvent();
    this.onYouTubeIframeAPIReady();
  }
}
```
이럴 때 사용할 수 있는 메서드가 있습니다. 바로 [bind()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)입니다.

`bind` 메서드는 함수를 호출하지 않고 첫 번째 인수로 전달한 값으로 **this 바인딩이 교체된 함수를 새롭게 생성해서 반환**합니다. bind 메서드는 메서드의 this와 메서드 내부의 중첩 함수 또는 콜백 함수의 **this가 불일치하는 문제를 해결하기 위해 유용하게 사용**됩니다.(출처: 모던 자바스크립트 Deep Dive, 357p)

bind 매서드를 사용해서 코드를 수정하자, 원하던대로 플레이리스트의 곡을 뮤직 플레이어에서 재생할 수 있었습니다. 

```javascript
class App extends Component {
  addComponent() {
    // ...생략...
    const musicPlayer = new MusicPlayer($("#music-player"));

    // props에 MusicPlayer 컴포넌트의 setState 메서드를 담아서 하위 컴포넌트로 보냅니다.
    return new Playlist($("main"), {
      playerSetState: musicPlayer.setState.bind(musicPlayer),
    });
  }
}
```
- 플레이리스트 재생 기능 구현 성공
<img src="https://github.com/ha-il/project-pixel/assets/108077643/dde92e5e-fd1c-4661-9269-6bfd5ffc2e42" width="100%" alt="playing-playlist"/>

### 1.5 문제는 해결했다. 그런데 왜 this가 undefined가 됐을까?

문제는 해결했지만 의문이 남았습니다. 왜 **this**가 `undefined` 였을까요?

예전에 정리했던 글 ["This 바인딩은 함수 호출 방식에 따라 결정된다"](https://ha-il.github.io/troubleshooting/js-this/)를 다시 읽어보며 MusicPlayer 클래스를 호출했던 코드를 다시 확인해봤습니다.

```javascript
class App extends Component {
  addComponent() {
    // 이때 musicPlayer의 this는 MusicPlayer의 인스턴스가 맞다.
    const musicPlayer = new MusicPlayer($("#music-player"));

    // 메서드를 따로 추출하여 playerSetState에 할당했다.
    // playerSetState는 인스턴스와 관계없는 독립적인 일반 함수다.
    return new Playlist($("main"), {
      playerSetState: musicPlayer.setState,
    });
  }
}
```
```javascript
class Playlist extends Component {
  setEvent() {
    $(".play-button").addEventListener("click", (e) => {
      
      // props로 전달받은 playerSetState는 인스턴스와는 관계 없는 독립적인 일반 함수다.
      const { playerSetState } = this.props;

      
      // playerSetState함수는 그저 musicPlayer.setState라는 함수를 실행하는 일반 함수다.
      return playerSetState({
        musics: this.state.playlist.musics,
        currentMusic: this.state.playlist.musics[0],
      });
    });
  }
}
```
```javascript
class MusicPlayer extends Component {
  // setState 메서드가 실행되면 this를 참조한다.
  // this는 클래스가 생성할 인스턴스가 바인딩된다.
  // setState는 본래 '인스턴스.setState()'방식으로 호출되어야 한다.
  // 그런데 playerSetState라는 독립적인 함수가 setState를 호출한다면 어떨까?
  // playerSetState는 일반 함수기 때문에 this에 전역 객체가 바인딩 된다.
  // playerSetState를 실행하면 setState의 this에는 전역 객체가 바인딩되는 것이다...

  // 잠깐만, undefined가 아니라 전역 객체가 바인딩된다고???
  // 그런데 왜 window가 아니라 undefined가 할당되지???
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
    this.setEvent();
    this.onYouTubeIframeAPIReady();
  }
}
```

에러의 원인은 setState에서 this를 참조할 때 발생했습니다. setState 메서드는 MusicPlayer 클래스의 메서드입니다. MusicPlayer 클래스로 생성된 인스턴스 musicPlayer가 있다고 가정할 때, **setState는 본래 musicPlayer.setState() 로 호출되었어야 합니다**.

하지만 musicPlayer.setState를 **playerSetState라는 별개의 함수에 따로 저장**하고, **prop으로 다른 컴포넌트에 보냈습니다**. 해당 컴포넌트에서 실행되는  playerSetState는 musicPlayer.setState와 동일한 함수지만, 인스턴스의 메서드로서 실행되는 것이 아니라 **일반 함수로 실행됩니다**.

**일반 함수는 호출됐을 때 this에 전역 객체가 바인딩**됩니다. **브라우저의 경우 window 객체가 바인딩된다는 의미**입니다. 따라서 playerSetState로 호출한 setState의 this에는 **undefined가 아닌 window가 할당되어야 합니다**.

### 1.6 왜 전역 객체(window)가 아니라 undefined일까?

**전역 객체를 undefined로 변환하는 경우**로는 [strict 모드](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Strict_mode)를 사용하는 경우가 있습니다. **하지만 저는 strict 모드를 설정한 적이 없습니다**. 대체 어떻게 된 일일까요?

새로운 프로젝트를 만들고 html 파일을 만들어서 script 태그에 자바스크립트 코드를 작성해보면서 원인을 찾았습니다. 그 원인은 바로 html의 script 태그의 속성인 `type="module"` 때문이었습니다.

- type="module" 을 설정하지 않은 경우
```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <script>
      function a() {
        console.log(this); // window
      }
      a();
    </script>
  </body>
</html>
```

- type="module" 을 설정한 경우
```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <script type="module">
      function a() {
        console.log(this); // undefined
      }
      a();
    </script>
  </body>
</html>
```
**type=module에는 strict 모드가 적용된다**는 근거를 MDN의 [JavaScript modules](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Modules) 문서에서 찾을 수 있었습니다. 

<br/>

> 표준 스크립트와 달리 모듈 내부에서 정의된 스크립트 섹션과는 다르게 동작할 수 있습니다. 
>
> **이는 모듈이 자동적으로 strict mode를 사용하기 때문입니다.**

<br/>

### 1.7 원인을 알았으니 다른 방법으로도 해결해보자.

원인이 setState가 호출되는 곳에 따른 this 바인딩 때문이라면, **화살표 함수**를 통해서도 문제를 해결할 수 있을 것입니다.

```javascript
class App extends Component {
  addComponent() {
    const musicPlayer = new MusicPlayer($("#music-player"));

    // 이번에는 bind 메서드를 사용하지 않았다.
    return new Playlist($("main"), {
      playerSetState: musicPlayer.setState,
    });
  }
}
```
```javascript
class MusicPlayer extends Component {
  // setState를 화살표 함수로 정의한 것 만으로 에러를 해결했다.
  setState = (newState) => {
    this.state = { ...this.state, ...newState };
    this.render();
    this.setEvent();
    this.onYouTubeIframeAPIReady();
  }
}
```
위와 같이 화살표 함수로 정의했을 뿐인데, 에러없이 플레이리스트 재생 기능이 정상 작동했습니다. 이는 화살표 함수의 특징 때문입니다.

> **화살표 함수는 함수 자체의 this 바인딩을 갖지 않는다. 따라서 화살표 함수 내부에서 this를 참조하면 상위 스코프의 this를 그대로 참조한다. 이를 lexical this라 한다.**
> 
> <모던 자바스크립트 Deep Dive, 480p>

즉 setState를 화살표 함수로 정의하면 setState의 this 바인딩은 상위 스코프인 MusicPlayer 클래스의 this를 그대로 참조할 것이고, MusicPlayer 클래스의 this는 클래스가 생성할 인스턴스이므로, **setState의 this는 클래스가 생성할 인스턴스가 바인딩됩니다.**

## 참고자료

- 모던 자바스크립트 Deep Dive: 자바스크립트의 기본 개념과 동작 원리 
  - by 이웅모 (출처: 위키북스, 2020), p.357 “22장 this”, p.480 “26장 ES6 함수의 추가 기능”
  - [도서 구매 링크(교보문고)](https://product.kyobobook.co.kr/detail/S000001766445)

- MDN Web Docs: bind()
  - by [MDN contributors.](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind/contributors.txt)
  - accessed June 20
  - [문서 링크](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) 

- MDN Web Docs: Strict mode
  - by [MDN contributors.](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Strict_mode/contributors.txt)
  - accessed June 20
  - [문서 링크](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Strict_mode) 

- MDN Web Docs: JavaScript modules
  - by [MDN contributors.](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Modules/contributors.txt)
  - accessed June 20
  - [문서 링크](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Modules)


- iframe 삽입에 대한 YouTube Player API 참조 문서
  - by Google Developers
  - accessed June 20
  - [문서 링크](https://developers.google.com/youtube/iframe_api_reference?hl=ko)



(출처: 모던 자바스크립트 Deep Dive, 357p)
<모던 자바스크립트 Deep Dive, 480p>


