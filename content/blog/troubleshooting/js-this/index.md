---
title: "This 바인딩은 함수 호출 방식에 따라 결정된다"
date: "2023-03-28T20:47:00.000Z"
description: "Uncaught TypeError: this.render is not a function 해결 과정"
category: "javascript"
featuredImage: "../../../../src/images/js-256x256.png"
mobileImage: "../../../../src/images/js-512x256x2.png"
---

## 1. 문제 발생

바닐라 자바스크립트로 간단한 메뉴 보드를 만들고 있었습니다.

여기서 메뉴 보드란, 각 메뉴의 카테고리가 있고 해당 카테고리에 속한 메뉴를 사용자에게 보여주는 앱입니다.

카테고리마다 버튼이 존재하고, 사용자가 그 버튼을 누르면 카테고리에 속한 메뉴를 보여주는 것입니다.

예를 들어 '커피'라고 적힌 버튼을 누르면 '커피' 카테고리에 속한 메뉴(아메리카노, 카페라떼 등)가 사용자에게 보여지는 것입니다.

아래에 보이는 코드는, 그 메뉴보드 앱의 뼈대입니다.

```jsx
class App {
  constructor() {
    // ...
		this.currentCategory = "coffee";
		this.init();
  }

  init() {
    this.render();
    this.initEventListener();
  }

  async render() {
    // ...
  }

  initEventListener() {
    // 오늘의 주인공
    const changeCategory = () => {
        // ... 
        this.render();
      }
    };

    $("nav").addEventListener("click", changeCategory);
  }
}
```

이 코드는 정상적으로 작동했지만  `changeCategory` 라는 함수를 `initEventListener` 라는 메서드 밖으로 꺼내고 싶었습니다.

`changeCategory`는 이벤트리스너로 사용될 함수니까, `initEventListener` 라는 메서드에 속해있어도 문제는 없지만, 레이어를 분리해서 함수는 함수끼리, 이벤트리스너는 이벤트리스너끼리 모으고 싶었습니다.

그래서 처음에는 아래와 같이 리팩터링했습니다.

```jsx
class App {
  constructor() {
    // ...
		this.currentCategory = "coffee";
		this.init();
  }

  init() {
    this.render(); 
    this.initEventListener();
  }

  async render() {
    // ...
  }

  // changeCategory를 initEventListener에서 분리하여 App 클래스의 매서드로 정의했다.
  changeCategory() {
	  //...
      this.render();
  }

  initEventListener() {
		// changeCategory를 App 클래스의 매서드로 선언했기 때문에, this를 붙여줬다.
    $("nav").addEventListener("click", this.changeCategory);
  }
}
```

그러나 다음과 같은 에러가 발생했습니다.

```
🚫 Uncaught TypeError: this.render is not a function
 at HTMLElement.changeCategory
```

`this.render`가 함수가 아니라는 의미입니다.

`this.render`가 함수가 아니라면 실행될 수 없기 때문에,

카테고리 버튼을 눌렀음에도 해당 카테고리에 속한 아이템들을 화면에 렌더링하지 못 했습니다.

## 2. 원인 분석

저는 정말 의아했습니다.

위의 코드에서 `init`과 `changeCategory`는 모두 `App`이라는 클래스 레벨의 스코프에 속해있는 메서드입니다.

`init`에서 `this.render`를 실행했을 때는 문제가 없는데,

`init`과 같은 스코프에 속한 `changeCategory`에서는 왜 `this.render`를 실행할 수 없는 것일까요?

```jsx
class App {

  init() {
    this.render(); // 이건 되고
		// ...
  }

  changeCategory() {
    //...
    this.render(); // 이건 안 된다고??
  }

}
```

이때 생각했던 원인은 `this` 바인딩이었습니다.

`init` 안에서 실행한 `this.render`는 문제가 없었습니다.

그러면 `changeCategory` 안에서 실행한 `this.render`가 문제라는 것입니다.

철자 하나 틀린 것 없이 똑같은 `this.render`에서 유일하게 차이를 찾는다면,

`this.render`에 바인딩된 `this`가 서로 다르다는 것밖에 없었습니다.

하지만 여전히 의아했습니다.

`init`과 `changeCategory`는 모두 `App`이라는 클래스 레벨의 스코프에 정의되어있는 메서드입니다.


그리고 `App`이라는 클래스 내부의 `this`는 앞으로 생성될 인스턴스를 가리킨다는 사실도 저는 알고 있었습니다.

그러면 `init`과 `changeCategory`의 `this`가 가리키는 대상은 클래스 `App`이 생성할 인스턴스로 동일해야할 터인데, 

어째서 차이가 발생한 것일까요? 

이를 확인하기 위해, 먼저 `init`과 `changeCategory`가 가리키는  `this`가 무엇인지 알아보기 위해 콘솔을 찍어봤습니다.

```jsx
class App {
  init() {
    console.log("init의 this", this);
    // init의 this: App {menu: {…}, currentCategory: 'coffee'}
  }

  changeCategory(e) {
    console.log("changeCategory의 this", this);
    // changeCategory의 this: <nav clss="...">...</nav>
  }
}
```

콘솔을 찍어보니 원인은 분명 `this` 바인딩의 차이였습니다.

`init`의 `this`는 `App` 클래스의 인스턴스를 가리키고 있었고,

`changeCategory`의 `this`는 `nav` 태그를 가리키고 있었습니다.

(`nav` 태그는 각 카테고리의 버튼을 모아둔 내비게이션입니다.)

## 3. 왜 이런 현상이 발생했을까?

이 현상을 이해하기 위해서는 이 사실을 인지하고 가는 것이 중요합니다.

```
this가 가리키는 값은 함수가 어떻게 호출되었는지에 따라 동적으로 결정된다.
```
함수 호출 방식에 따른 `this` 바인딩은 아래와 같은 차이가 있습니다.

```
1. 일반 함수 호출 
   - this에 전역 객체가 바인딩된다.

2. 메서드 호출 
   - 메서드를 호출할 때는 메서드 이름 앞의 마침표(.) 연산자 앞에 기술한 객체가 바인딩된다.

3. 생성자 함수 or 클래스 호출 
   - 생성자 함수 or 클래스 내부의 this에는 (미래에) 생성할 인스턴스가 바인딩된다. 

4. Function.prototype.apply/call/bind 메서드에 의한 간접 호출 
   - this에 인수로 전달한 객체가 바인딩된다.
```

위의 사실을 인지한 상태에서, 에러가 발생했던 코드를 다시 확인해봅시다.

```jsx
class App {
  constructor() {
    // ...
		this.currentCategory = "coffee";

		// ① init()이 호출될 곳은 클래스 App의 인스턴스 내부이다.
		//    따라서 init()의 this에는 App의 인스턴스가 바인딩 된다.
		this.init();
  }

  init() {

    // ② init()의 this에는 App의 인스턴스가 바인딩 되어있다.
    //    따라서 App의 메서드인 this.render()가 정상 작동한다.
    this.render(); 
    this.initEventListener();
  }

  async render() {
    // ...
  }

	
  changeCategory() {
	    //...
      this.render();
  }

  initEventListener() {

    // ③ 그런데 이건 함수호출하는게 아니라 이벤트 핸들러로 전달할 뿐인데...?
    //    이건 무슨 경우지...?
    $("nav").addEventListener("click", this.changeCategory);
  }
}
```

함수 호출 방식에 따라 `this` 바인딩이 어떻게 이뤄지는 지는 위에서 확인했습니다.

하지만 함수를 호출하는 것이 아니라 `addEvnetListener`에 인자로 전달할 뿐인 경우는 어떻게 `this` 바인딩이 이뤄지는 지는 걸까요?

MDN의 [EventTarget.addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#other_notes) 문서에서 그 이유를 알 수 있었습니다.


    When attaching a handler function to an element using `addEventListener()`,
    the value of this inside the handler will be a reference to the element.

    `addEventListener()`를 사용해 요소에 핸들러를 부착하게 되면 핸들러 내부의 `this`
     값은 대상 요소를 가리키게 됩니다.


위의 사실을 인지한 상태에서, 에러가 발생했던 코드를 다시 확인해봅시다.

```jsx
class App {
  constructor() {
    // ...
		this.currentCategory = "coffee";

		// ① init()이 호출될 곳은 클래스 App의 인스턴스 내부이다.
		//    따라서 init()의 this에는 App의 인스턴스가 바인딩 된다.
		this.init();
  }

  init() {

    // ② init()의 this에는 App의 인스턴스가 바인딩 되어있다.
    //    따라서 App의 메서드인 this.render()가 정상 작동한다.
    this.render(); 
    this.initEventListener();
  }

  async render() {
    // ...
  }

	
  changeCategory() {

      // ④ changeCategory()의 this에는 nav요소가 바인딩되어 있다.
      //    nav요소에는 render라는 함수가 정의되어있지 않다.
      //    따라서 this.render()는 작동하지 않는다.
      //
      //    Uncaught TypeError: 
      //    this.render is not a function at HTMLElement.changeCategory 
      this.render();
  }

  initEventListener() {

    // ③ addEventListener()를 사용해 nav 요소에 핸들러를 부착하게 되면
    //    핸들러 내부의 this는 nav 요소를 가리키게 된다.
    //    따라서 this.changeCategory의 this에는 nav 요소가 바인딩 된다.
    $("nav").addEventListener("click", this.changeCategory);
  }
}
```

제가 헷갈렸던 이유가 명확해졌습니다.

저는 `this` 바인딩을 함수 호출 방식이 아니라, 함수를 정의한 스코프에 따라 달라지는 것으로 착각하고 있었습니다.

그래서, " `init`과 `changeCategory`는 둘 다 `App`이라는 클래스 레벨의 스코프에 정의되어 있으니까, 두 메서드의 `this`는 `App`의 인스턴스를 가리켜야 하는 거 아니야?"라는 생각을 가지고 있었습니다.

하지만, `this`가 함수 호출 방식에 따라 달라지거나, `addEventListener`의 핸들러로 사용될 경우 달라진다는 것을 알게 되고, 제가 어느 부분을 착각했는지 명확히 할 수 있었습니다.

## 해결 과정

이 문제를 해결하기 위해서는 결국,

`changeCategory`의 `this`가 가리키는 대상을 `nav` 요소가 아닌, 클래스 `App`의 인스턴스로 바꿔주면 됩니다.

이럴 때 사용할 수 있는 메서드를 아래에 소개합니다.

    Function.prototype.apply 
    - 함수를 호출하면서 첫 번째 인수로 전달한 특정 객체를, 호출한 함수의 this에 바인딩한다. 
    - 호출할 함수의 인수를 배열로 묶어 전달한다.
    - 예시: func.apply(arg, [1, 2, 3])

    Function.prototype.call
    - 함수를 호출하면서 첫 번째 인수로 전달한 특정 객체를, 호출한 함수의 this에 바인딩한다. 
    - 호출할 함수의 인수를 쉼표로 구분한 리스트 형식으로 전달한다.
    - 예시: func.call(arg, 1, 2, 3)

    Function.prototype.bind
    - 함수를 호출하지 않고 첫 번째 인수로 전달한 값으로 this 바인딩이 교체된 함수를 새롭게 생성해 반환한다.



저의 경우 이벤트핸들러로 전달할 함수의 `this` 바인딩을 변경해야 하기 때문에, 함수를 호출할 필요는 없었습니다.

따라서 `bind` 메서드를 사용해서 에러를 해결했습니다.

```jsx
class App {
  constructor() {
    // ...
		this.currentCategory = "coffee";
		this.init();
  }

  init() {
    this.render();

    // ① initEventListener()가 호출될 곳은 클래스 App의 인스턴스 내부이다.
    //    따라서 initEventListener()의 this에는 App의 인스턴스가 바인딩 된다.
    this.initEventListener();
  }

  async render() {
    // ...
  }

	
  changeCategory() {

      // ④ 이제 changeCategory()의 this에는 App의 인스턴스가 바인딩 되어있다.
      //    따라서 App의 메서드인 this.render()가 정상 작동한다.
      //    에러 해결 완료!
      this.render();
  }

  initEventListener() {

      // ② initEventListener()의 this에는 App의 인스턴스가 바인딩 되어있다.
      //    addEventListener() 때문에 this.changeCategory에는 nav 요소가 바인딩 된다.

      //    this.changeCategory.bind(this), 이렇게 작성해주면
      //    this.changeCategory의 this가 nav가 아닌 App의 인스턴스를 가리키게 된다.
      //    .bind(this)에서 this는, initEventListener()의 this이고,
      //    initEventListener()의 this는, App의 인스턴스를 가리키고 있기 때문이다.
	    $("nav").addEventListener("click", this.changeCategory.bind(this));
	}
}
	
```

## 마치며

“모던 자바스크립트 딥 다이브”를 나름 여러번 읽어왔기 때문에, 누군가 this에 대해 묻는다면 그럭저럭 대답할 수 있다고 생각했습니다.

하지만, 실제로 코드를 구현하면서 this를 다루기 시작하니, 제가 정말 애매하게 알고 있었다는 생각이 들었습니다.

책으로 공부했던 경험보다는, 이렇게 뭔가를 구현하면서 발생한 에러를 해결하며 공부한 경험이 더 강하게 머릿속에 남는 것 같습니다.

또 새로운 글로 찾아뵙겠습니다.

## 참고자료

- 모던 자바스크립트 Deep Dive: 자바스크립트의 기본 개념과 동작 원리 by 이웅모 (출처: 위키북스, 2020), p. 342-358 “22장 this”
도서 구매 링크: [https://product.kyobobook.co.kr/detail/S000001766445](https://product.kyobobook.co.kr/detail/S000001766445)


- EventTarget.addEventListener() by MDN Web Docs, accessed March 28, 2023
문서 링크: [https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#other_notes](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#other_notes)