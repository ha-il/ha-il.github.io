---
title: "[당신의 작업실] 2. SPA 프로토타입 제작과 프로젝트로의 적용"
date: "2023-06-13T12:20:02.000Z"
description: "예광탄 장전 완료"
category: "Project"
featuredImage: "../../../../../src/images/sideProject-256x256.png"
mobileImage: "../../../../../src/images/sideProject-512x256x2.png"
---
- **당신의 작업실 프로젝트 링크**: https://pixel-workroom.herokuapp.com/
- **프로젝트 깃허브 저장소 링크** : https://github.com/ha-il/project-pixel

## 프로젝트 본격 시작! 그런데 뭐부터..?

일단 기획을 해야겠다는 생각이 들었지만, 제 개발 능력에 대한 걱정이 많이 들었습니다. Express와 Pug를 이용해서 서버 측에서 렌더링되는 웹 사이트를 만들어본 적은 있었지만, 바닐라 자바스크립트만으로 클라이언트 측에서 모두 렌더링되도록, 게다가 SPA 로 구현해본적은 없었기 때문입니다. 이런 **프로젝트 개발 전반에 대한 노하우**는 대체 어디서 얻을 수 있을까 고민하다가 발견한 책이 '**실용주의 프로그래머**'였습니다. 책 내용 중에 "**목표물을 찾기 위해 예광탄을 써라.**"라는 팁이 있습니다. 


> 이런 상황에서의 **전형적인 반응**은 **시스템을 극도로 세세히 명세화**하는 것이다. 모든 불확실한 점을 잡아매고, 환경 조건을 제약하고, 모든 요구사항을 일일이 항목으로 만들어서 몇 상자나 되는 명세서를 만든다. 그리고 목표물의 위치를 추측해서 총을 쏜다. 상당한 양의 계산을 우선 하고 나서, 그다음엔 발사하고, 맞기를 바라는 것이다.
> 
> **하지만 실용주의 프로그래머는 소프트웨어판 예광탄을 선호한다.** 
> 
> 예광탄이 효과적인 까닭은 일반 탄환과 동일한 환경 및 제약 조건에서 발사되기 때문이다. 탄환이 순식간에 목표물에 도달하기 때문에 기관총 사수는 **즉각적인 피드백**을 얻을 수 있다. 실용적인 관점에서 봐도 **예광탄은 상대적으로 비용이 적게 드는 방법**이다.
> 
> **코딩에서 동일한 효과를 얻으려면 우리를 요구 사항으로부터 최종 시스템의 일부 측면까지 빨리, 눈에 보이게, 반복적으로 도달하게 해 줄 무언가를 찾아야 한다.**
> 
> 시스템을 정의하는 **중요한 요구 사항**을 찾아라. 의문이 드는 부분이나 **가장 위험이 커 보이는 곳**을 찾아라. **이런 부분의 코드를 가장 먼저 작성하도록 개발 우선순위를 정하라.**
>
> <실용주의 프로그래머 72p-73p>

책에서 언급하는 '**전형적인 반응**'을 저도 보일 뻔 했습니다. 일단 기획을 하고, 요구사항을 최대한 자세히 명세한 다음, 명세에 맞게 순서대로 작업을 하면 될 것이라는 낙관적인 생각을 했었습니다. 하지만 실용주의 프로그래머를 읽고 저도 저만의 **예광탄**을 쏴보기로 했습니다.

이 프로젝트에 가장 중요한 요구사항은 당연히 **뮤직 플레이어**고, 사용자가 웹 사이트 내에서 **페이지를 전환하더라도 음악이 끊기지 않는 것**이 가장 중요했습니다. 그것을 위해서는 페이지 전환 간의 새로고침이 발생하지 않는 **SPA 구현**이 너무나 중요했습니다. 바닐라 자바스크립트로 SPA를 구현하는 것은 개인 능력 향상의 주요 목표이기도 했지만, 프로젝트의 중요 요구사항이기도 했습니다.

다른 기능은 다 제쳐두고 일단 작은 프로토타입을 만들어서 페이지 이동 간에 새로고침이 발생하지 않도록 구현할 수 있는지 확인해보고, 프로토타입을 성공적으로 만들었다면 프로토타입의 코드를 저만의 예광탄으로 만들어서 제 프로젝트에 던져보기로 했습니다.


## 1. 바닐라 자바스크립트로 SPA를 구현하기 위한 프로토타입 제작

프로토타입을 제작할 당시 제가 정했던 세 가지 목표가 있습니다.

1. 핵심이 되는 **컴포넌트 클래스**를 만들고, 그것을 기반으로 다른 컴포넌트를 확장시킬 것.

2. 화면 전환시에 **새로고침이 발생하지 않도록** 구현할 것.

3. 새로고침 없이 전환되더라도 **경로는 바뀌도록** 구현할 것.


### 1.1 프로토타입에서 컴포넌트 클래스 만들기

첫번째 목표인 **컴포넌트 클래스 생성**은 개발자 황준일님이 블로그에 작성하신 [Vanilla Javascript로 웹 컴포넌트 만들기](https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Component/)에 나온 코드를 참고했습니다.

```javascript
class Component {
  state;
  router;
  constructor($target) {
    this.$target = $target;
    this.init();
    this.render();
    this.setEvent();
  }
  init() {}
  template() {
    return "";
  }
  addComponent() {}
  setEvent() {}
  render() {
    this.$target.innerHTML = this.template();
    this.addComponent();
  }
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }
}

export default Component;
```

## 1.2 화면 전환 시 새로고침 없이 경로 변경하기

두번째 세번째 목표인 '**화면 전환 시 새로고침 없이 경로 변경하기**'를 구현한 코드는 아래와 같습니다.

```javascript
import About from "./components/About.js";
import Contact from "./components/Contact.js";
import Home from "./components/Home.js";
import Navigation from "./components/Navigation.js";
import Component from "./core/Component.js";
import { $ } from "./utils/dom.js";

// Component 클래스를 기반으로 확장
class App extends Component {
  init() {
    // 각 라우터에 컴포넌트를 할당
    this.router = {
      "/": Home,
      "/about": About,
      "/contact": Contact,
    };
  }
  template() {
    return `
      <header>헤더</header>
      <main>메인</main>
      <footer>2023 하일</footer>
    `;
  }
  addComponent() {
    // App 컴포넌트 하위에 Navigation과 Home 컴포넌트 렌더링
    new Navigation($("header"));
    new Home($("main"));
  }
  setEvent() {
    // 새로고침이 발생할 경우 새로고침이 발생한 경로에 맞는 컴포넌트를 렌더링
    window.addEventListener("popstate", () => {
      const path = window.location.pathname;
      const pageComponent = this.router[path];
      this.render();
      new pageComponent($("main"));
    });

    // a태그를 클릭하면 새로고침 없이 경로를 변경하고 경로에 맞는 컴포넌트를 렌더링
    const links = document.querySelectorAll("a[href]");
    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const path = link.pathname;
        window.history.pushState(null, "", path);
        const pageComponent = this.router[path];
        new pageComponent($("main"));
      });
    });
  }
}

new App($("#app"));

```
위 코드를 실행시키면 아래 이미지처럼 동작합니다.

![proto-spa](https://github.com/ha-il/project-pixel/assets/108077643/389f1b91-bb9f-4fc6-bdf3-90ce5ecbc1c8)

a 태그를 클릭하는데 **새로고침이 발생하지 않고**, 각 링크에 맞게 **경로도 확실히 변경**되는 것을 확인할 수 있습니다.

### 1.3 프로토타입을 프로젝트에 적용하기

이렇게 프로토타입을 만들어보니 자바스크립트로 SPA를 구현할 수 있겠다는 확신이 들었습니다. 프로토타입에서 만들어 본 **클래스 컴포넌트를 수정하여 프로젝트에 도입**하고, 프로토타입의 폴더 구조를 **프로젝트의 폴더 구조에 반영**했습니다.

- **프로젝트**에 사용한 클래스 컴포넌트
```javascript
class Component {
  state;
  router;
  props;
  constructor($target, props) {
    this.$target = $target;
    this.props = props;
    this.init();
  }
  init() {
    this.state = this.initState();
    this.initRouter();
    this.fetchData();
    this.render();
    this.setEvent();
  }
  initRouter() {}
  initState() {
    return {};
  }
  template() {
    return "";
  }
  addComponent() {}
  fetchData() {}
  setEvent() {}
  render() {
    this.$target.innerHTML = this.template();
    this.addComponent();
  }
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
    this.setEvent();
  }
}

export default Component;
```

- **프로토타입**의 디렉터리 구조
```
├─ index.html
├─ index.md
├─ src
│  ├─ components
│  │  ├─ About.js
│  │  ├─ Contact.js
│  │  ├─ Home.js
│  │  └─ Navigation.js
│  ├─ core
│  │  └─ Component.js
│  ├─ index.js
│  └─ utils
│     └─ dom.js
└─ style.css
```

- **프로젝트**의 디렉터리 구조(프로토타입의 디렉터리 구조를 반영)
```
├─ src
│  ├─ client
│  │  ├─ js
│  │  │   ├── components # Component Class를 확장시킨 컴포넌트 파일
│  │  │   ├── core 
│  │  │   │    └─ Component.js # Component Class 파일
│  │  │   ├── utils # 유틸 함수
│  │  │   └── main.js
│  │  └─ scss
│  │     ├─ _variables.scss
│  │     └─ styles.scss
│  ├─ server.js
│  └─ views
│     └─ layout.pug
├─ node_modules
├─ package-lock.json
├─ package.json
├─ README.md
└─ .gitignore

```
프로토타입을 통해 프로젝트의 초기 보일러 플레이트 세팅을 시작할 수 있었고, 이것은 이 프로젝트에 **예광탄**을 일단 쐈다는 의미였습니다. SPA구현 다음으로 걱정했던 부분은 Babel이나 Webpack과 같은 **개발 환경** 설정이었습니다. 그래서 다음으로는 개발 환경 설정 과정으로 예광탄을 쏴봤습니다. 이에 대해서는 [다음 글](https://ha-il.github.io/side-project/project-pixel/3-boiler-plate)에서 이어가겠습니다.

## 참고 자료
- Vanilla Javascript로 웹 컴포넌트 만들기 by 황준일 Last Updated: 2023. 2. 14.
  - 문서 링크: [https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Component/](https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Component/)