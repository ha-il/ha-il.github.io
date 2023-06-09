---
title: 정규 표현식 배워서 프로젝트에 적용하기
date: "2023-06-07T14:13:00.000Z"
description: "정규 표현식 그거 그냥 검색해서 쓰면 되는 거 아닙니까?"
category: "JavaScript"
featuredImage: "../../../src/images/js-256x256.png"
mobileImage: "../../../src/images/js-512x256x2.png"
---
## 정규 표현식 왜 배웁니까?

노마드코더라는 사이트에서 진행하는 콘테스트에 제출할 목적으로 [당신의 작업실](https://pixel-workroom.herokuapp.com/)이라는 웹 뮤직 플레이어를 개인 프로젝트로 제작한 적이 있습니다.

유저가 유튜브 URL을 입력하면 해당 URL의 영상 정보를 유튜브 API를 통해 받아와서 그 정보를 유저에게 보여주고, 

유저가 원한다면 제목을 수정해서 데이터베이스에 음악을 등록할 수 있는 기능이 있습니다.

그렇게 등록한 음악을 유저가 찾으려면 검색 기능이 필요했고, 유저에게 검색어를 받아서 해당 검색어에 부합하는 음악을 제공할 수 있도록 서버 측에서 코드를 작성했습니다.

그 과정 중에서 아래와 같이 정규 표현식을 사용했습니다.

```javascript
// server: Express.js, DB: MongoDB
export const searchMusic = async (req, res) => {
  const { searchWord } = req.params;
  let musics = [];
  if (searchWord) {
    musics = await Music.find({
      title: {
        // 정규 표현식을 사용한 부분
        $regex: new RegExp(`${searchWord}$`, "i"),
      },
    });
  }
  return res.status(200).send(musics);
};
```

당시에는 '플레이리스트 생성', '인기차트', '뮤직플레이어'를 주요 기능으로 삼았었고, 그러다보니 검색 기능 구현이 후순위로 밀렸습니다.

결국 프로젝트 제출 직전 검색 기능을 구현하게 되었고, 최소한의 검색 기능만 구현해서 급하게 제출했습니다. 

항상 문제는 '괜찮을 거야'라고 생각했던 부분에서 발생하는 것 같습니다.

결국 프로젝트에 대한 피드백으로 `추가한 음악이 검색되지 않는다`라는 피드백을 받았습니다.

사실 검색기능은 잘 작동했습니다만, 문제가 있었습니다.

예를 들어, "거리에서"라는 곡이 있다고 가정해보겠습니다.

위와 같은 정규 표현식에서 "거리에서"라고 검색하면 "거리에서"라는 곡을 찾을 수 있습니다.

하지만 " 거리에서" 또는 "거리에서 "와 같이 `공백이 하나라도 들어가면` "거리에서"라는 곡은 찾을 수 없었습니다.

`'정규 표현식을 조금만 더 다듬었다면 좋았겠다'`라는 생각이 들었습니다.

이렇게 `프로젝트에 대한 아쉬움`이 많이 남았고, 언젠간 제대로 한 번 다루고 넘어가야겠다는 생각이 들어서, 이번 글을 통해 자바스크립트에서 정규 표현식을 다루는 방법을 정리해보려고 합니다.

## 자바스크립트에서 정규 표현식 객체 생성하기

정규 표현식 객체를 생성하기 전에, 우선 `정규 표현식 리터럴`에 대해서 알아둘 필요가 있습니다.

정규 표현식 리터럴은 정규 표현식을 `/regexp/i`와 같은 형태로 표기하는 것을 말합니다.

```
/regexp/i

/ : 시작 기호
reqexp : 패턴(pattern)
/ : 종료 기호
i : 플래그(flag)
```

`정규 표현식 리터럴`을 사용하면 자바스크립트에서 `정규 표현식 객체를 생성`할 수 있습니다.

```javascript
// 1. 정규 표현식 리터럴을 사용하여 정규 표현식 객체를 생성
const target = " 거리에서 "
const regexp1 = /거리에서/i
regexp1.test(target) // true
```
정규 표현식 리터럴은 스크립트를 불러올 때 컴파일되므로, 바뀔 일이 없는 패턴의 경우 리터럴을 사용하면 성능이 향상될 수 있습니다. (출처:[MDN 정규_표현식_만들기](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_expressions#%EC%A0%95%EA%B7%9C_%ED%91%9C%ED%98%84%EC%8B%9D_%EB%A7%8C%EB%93%A4%EA%B8%B0))

자바스크립트에서 정규 표현식 객체를 생성할 수 있는 또다른 방법은 `RegExp 생성자 함수`를 사용하는 것입니다.

```javascript
// 2. RegExp 생성자 함수를 사용하여 정규 표현식 객체를 생성
const target = " 거리에서 "

const regexp2 = new RegExp(/거리에서/i) // ES6
regexp2.test(target) // true

const regexp3 = new RegExp(/거리에서/, "i") // ES6
regexp3.test(target) // true

const regexp4 = new RegExp("거리에서", "i")
regexp4.test(target) // true

let string = " 거리에서 "
const regexp5 = new RegExp(string, "i") // 변수를 사용해서 생성 가능
regexp5.test(target) // true
```

생성자 함수를 사용하면 정규 표현식이 런타임에 컴파일됩니다. 

바뀔 수 있는 패턴이나, 사용자 입력 등 외부 출처에서 가져오는 패턴의 경우 생성자 함수를 사용할 것을 권장합니다. (출처:[MDN 정규_표현식_만들기](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_expressions#%EC%A0%95%EA%B7%9C_%ED%91%9C%ED%98%84%EC%8B%9D_%EB%A7%8C%EB%93%A4%EA%B8%B0))

## 정규 표현식 관련 주요 메서드

정규 표현식과 관련 된 주요 메서드로는 아래와 같이 3가지 메서드가 있습니다.

1. RegExp.prototype.test()
2. RegExp.prototype.exec()
3. String.prototype.match()

### RegExp.prototype.test()

[test()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test) 메서드는 주어진 문자열이 정규 표현식을 만족하는지 판별하고, 그 여부를 true 또는 false로 반환합니다.

```javascript
const target = " 거리에서 구리에서 거리에서 고리에서 "
const regExp = /거리에서/

regExp.test(target) // true
```
### RegExp.prototype.exec()

[exec()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec) 메서드는 주어진 문자열에서 일치 탐색을 수행한 결과를 배열 혹은 null로 반환합니다.

```javascript
const target = " 거리에서 구리에서 거리에서 고리에서 "
const regExp = /거리에서/

regExp.exec(target)
// [ '거리에서', index: 1, input: ' 거리에서 구리에서 거리에서 고리에서 ', groups: undefined ]
```
위의 코드를 보시면 target 문자열에 '거리에서'라는 문자열은 `두 번` 등장하지만, `맨 처음 일치한` '거리에서'에 대한 정보만 반환된 것을 확인할 수 있습니다.

두 번째 일치하는 '거리에서'라는 정보까지 반환받기 위해서는 어떻게 해야할까요?

정규 표현식 리터럴을 설명할 때 `플래그`라는 단어가 잠깐 등장했었는데, 플래그를 간단히 설명하면 `탐색 방식`이라고 설명할 수 있습니다.

플래그에는 `g`라는 플래그가 있는데, 이 플래그는 `전역 탐색`을 의미합니다.

그렇다면 `/거리에서/g`로 정규 표현식 리터럴을 표기하면 target 문자열에 존재하는 모든 '거리에서'라는 문자열에 대한 정보가 반환될까요?

```javascript
const target = " 거리에서 구리에서 거리에서 고리에서 "
const regExpGlobal = /거리에서/g

regExpGlobal.exec(target)
// exec 메서드는 g 플래그를 지정해도 첫 번째 매칭 결과만 반환합니다.
// [ '거리에서', index: 1, input: ' 거리에서 구리에서 거리에서 고리에서 ', groups: undefined ]

regExpGlobal.exec(target)
// 단, exec 메서드는 g 플래그를 지정한 경우 이전 매칭 결과의 인덱스를 저장하므로 상태를 가지고 있습니다.
// 따라서 regExpGlobal.exec(target)를 한 번 더 호출하면 두 번째 매칭 결과를 반환한다.
// [ '거리에서', index: 11, input: ' 거리에서 구리에서 거리에서 고리에서 ', groups: undefined ]
```
exec 메서드는 `g` 플래그를 지정해도 `첫 번째 매칭 결과만 반환`하지만, `이전 매칭 결과의 인덱스를 저장`하므로 상태를 가지고 있기 때문에, 한 번 더 호출하면 상태를 기반으로 다음 매칭 결과를 반환합니다.

### String.prototype.match()
[match()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/match) 메서드는 문자열이 정규식과 일치하는 부분을 검색합니다.

문자열이 정규식과 일치하면, 일치하는 전체 문자열을 첫 번째 요소로 포함하는 Array를 반환한 다음 괄호 안에 캡처된 결과가 옵니다. 일치하는 것이 없으면 null이 반환됩니다.

```javascript
const target = " 거리에서 구리에서 거리에서 고리에서 "
const regExp = /거리에서/

target.match(regExp)
// [ '거리에서', index: 1, input: ' 거리에서 구리에서 거리에서 고리에서 ', groups: undefined ]
```
위의 코드를 보면 알 수 있듯이 match 메서드는 `g 플래그가 지정되지 않으면` RegExp.prototype.`exec()`와 같은 결과를 반환합니다.

그렇다면 g 플래그를 지정하면 어떻게 될까요?

```javascript
const target = " 거리에서 구리에서 거리에서 고리에서 "
const regExpGlobal = /거리에서/g

target.match(regExpGlobal)
// [ '거리에서', '거리에서' ]
```
위킈 코드를 보면 알 수 있듯이 match 메서드는 `g 플래그가 지정되면` `모든 매칭 결과를 배열로 반환`합니다.

## 정규 표현식의 주요 플래그

위에서 잠깐 언급했듯이, 플래그는 정규 표현식의 `탐색 방식`이라고 말할 수 있습니다.

[MDN의 정규 표현식-플래그를 활용한 고급 탐색](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_expressions#%ED%94%8C%EB%9E%98%EA%B7%B8%EB%A5%BC_%ED%99%9C%EC%9A%A9%ED%95%9C_%EA%B3%A0%EA%B8%89_%ED%83%90%EC%83%89) 문서를 보면 플래그의 종류는 아래와 같습니다.

- d :	부분 문자열 일치에 대해 인덱스 생성.
- `g` :	전역 탐색.
- `i` :	대소문자를 구분하지 않음.
- m :	여러 줄에 걸쳐 탐색.
- s :	개행 문자가 .과 일치함.
- u :	"unicode", 패턴을 유니코드 코드 포인트의 시퀀스로 간주함.	
- y :	"접착" 탐색, 대상 문자열의 현재 위치에서 탐색을 시작함.

이 중에서 실제로 가장 많이 사용할 것 같은 플래그인 `g`와 `i`만 예시를 통해서 확인해보겠습니다.

```javascript
const target = " Geori guri gori geori"

target.match(/geori/)
// [ 'geori', index: 17, input: ' Geori guri gori geori', groups: undefined ]

target.match(/geori/i)
// i : 대소문자를 구분하지 않음.
// [ 'Geori', index: 1, input: ' Geori guri gori geori', groups: undefined ]

target.match(/geori/g)
// g : 전역 탐색.
// [ 'geori' ]

target.match(/geori/gi)
// 순서에 상관 없이 한꺼번에 여럿을 지정할 수도 있음.
// [ 'Geori', 'geori' ]

```
## 정규 표현식의 패턴

정규 표현식의 패턴은 플래그보다도 종류가 많기 때문에, 모든 패턴의 사용법을 공부하는 것은 어렵습니다.

따라서 `어떤 상황에 어떤 패턴을 사용하는 것이 좋은가`를 중점적으로 다루겠습니다.

패턴은 설명하는 것보다 예시를 보는 것이 이해가 빠르기 때문에, 설명은 생략하고 예시 위주로 다루겠습니다.

자세한 설명이 필요하신 분은 [MDN의 정규 표현식-정규 표현식 패턴 작성하기](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_expressions#%EC%A0%95%EA%B7%9C_%ED%91%9C%ED%98%84%EC%8B%9D_%ED%8C%A8%ED%84%B4_%EC%9E%91%EC%84%B1%ED%95%98%EA%B8%B0)를 참고해주시기 바랍니다.

### 임의의 문자열 검색
```javascript
"사랑은 향기를 남기고".match(/./g)
// .은 임의의 문자 한 개를 의미
// [ '사', '랑', '은', ' ',  '향', '기', '를', ' ',  '남', '기', '고' ]
"사랑은 향기를 남기고".match(/../g)
// [ '사랑', '은 ', '향기', '를 ', '남기' ]
"사랑은 향기를 남기고".match(/.../g)
// [ '사랑은', ' 향기', '를 남' ]
```
### 반복 검색
```javascript
"나 나나나 난난나나나나".match(/나{1,2}/g)
// {m,n} : 앞선 패턴이 최소 m번, 최대 n번 반복
// [ '나', '나나', '나', '나나', '나나' ]

"나 나나나 난난나나나나".match(/나{2}/g)
// {n} : 앞선 패턴이 n번 반복
// [ '나나', '나나', '나나' ]

"나 나나나 난난나나나나".match(/나{2,}/g)
// {n,} : 앞선 패턴이 최소 n번 이상 반복
// [ '나나나', '나나나나' ]

"나 나나나 난난나나나나".match(/나+/g)
// + : 앞선 패턴이 최소 한번 이상 반복, {1,}과 같다
// [ '나', '나나나', '나나나나' ]

"나 나나나 난난나나나나".match(/나*/g)
// * : 앞선 패턴이 0번 이상 반복
// [ '나', '', '나나나', '', '', '', '나나나나', '' ]

"나 나나나 난난나나나나".match(/난나?/g)
// ? : 앞선 패턴이 최대 한 번(0번 포함) 이상 반복, {0, 1}과 같다
// [ '난', '난나' ]
```
### OR 검색
```javascript
"라라라 리 라라 라라라 리 라라".match(/라|리/g)
// /A|B/ : 'A' 또는 'B'
// [ '라', '라', '라', '리', '라', '라', '라', '라', '리', '리', '라', '라' ]

"라라라 리 라라 라라라 리 라라".match(/라+|리+/g)
// /A+|B+/ : 'A' 또는 'B'가 한 번 이상 반복
// [ '라라라', '리', '라라', '라라라', '리', '라라' ]

"라라라 리 라라 라라라 리 라라".match(/[라리]/g)
// /[AB]/ : 'A' 또는 'B', /A|B/와 같다.
// [ '라', '라', '라', '리', '라', '라', '라', '라', '라', '리', '라', '라' ]

"라라라 리 라라 라라라 리 라라".match(/[라리]+/g)
// /[AB]+/ : 'A' 또는 'B'가 한 번 이상 반복, /A+|B+/와 같다.
// [ '라라라', '리', '라라', '라라라', '리', '라라' ]

"I LOVE yoU".match(/[A-Z]+/g)
// [...] 내의 - 는 범위를 의미
// /[A-Z]+/ : 대문자 알파벳 검색
// [ 'I', 'LOVE', 'U' ]

"I LOVE yoU".match(/[A-Za-z]+/g)
// /[A-Za-z]+/ : 대소문자 구별하지 않고 알파벳 검색
// [ 'I', 'LOVE', 'yoU' ]

"내 전화 번호는 010-1234-5678".match(/[0-9]+/g)
// /[0-9]+/ : 숫자 검색
// [ '010', '1234', '5678' ]

"내 전화 번호는 010-1234-5678".match(/[0-9-]+/g)
// /[0-9-]+/ : 숫자 또는 하이픈이 포함된 문자 검색
// [ '010-1234-5678' ]
```
### 정규 표현식의 문자 클래스 활용
```javascript
"내 전화 번호는 010-1234-5678".match(/[\d-]+/g)
// \d : 숫자
//[ '010-1234-5678' ]

"내 전화 번호는 010-1234-5678".match(/[\D-]+/g)
// \D: 숫자가 아닌 문자
//[ '내 전화 번호는 ', '-', '-' ]

"w is Alphabet Number_1234 Underscore_ 한글 !@#$%^&*()-+.,/?".match(/[\w]+/g)
// \w: 알파벳, 숫자, 언더스코어
// [ 'w', 'is', 'Alphabet', 'Number_1234', 'Underscore_' ]

"w is Alphabet Number_1234 Underscore_ 한글 !@#$%^&*()-+.,/?".match(/[\W]+/g)
// \W: 알파벳, 숫자, 언더스코어가 아닌 문자
// [ ' ', ' ', ' ', ' ', ' 한글 !@#$%^&*()-+.,/?' ]

```
### NOT 검색
```javascript
"내 전화 번호는 010-1234-5678".match(/[^0-9]+/g)
// [...] 내의 ^ : not의 의미
// /[^0-9]+/ : 숫자가 아닌 문자 검색, /D와 같다.
//[ '내 전화 번호는 ', '-', '-' ]
```
### 시작 위치로 검색
```javascript
new RegExp(/^https:/).test("https://ha-il.github.io/") // true
new RegExp(/^http:/).test("https://ha-il.github.io/") // false
// [...] 밖의 ^ : 문자열의 시작을 의미
```
### 마지막 위치로 검색
```javascript
new RegExp(/com$/).test("ha-il@gmail.com") // true
new RegExp(/com$/).test("ha-il@gmail.come") // false
// $ : 문자열의 마지막을 의미
```

### 이스케이핑

여태까지 정규 표현식에서 사용되는 다양한 패턴과, 그 패턴에 사용되는 다양한 `특수문자`(/, +, -, ^, $ ...)를 봤습니다.

그런데, 그 특수문자를 있는 그대로 탐색해야 하는 경우는 어떻게 해야할까요?

그럴 때는 [`이스케이핑`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_expressions#%EC%9D%B4%EC%8A%A4%EC%BC%80%EC%9D%B4%ED%95%91)을 해주어야 합니다.

정규 표현식의 특수 문자를 이스케이핑 하는 방법은 특수문자 앞에 역슬래시 `\`를 작성하면 됩니다.

```javascript
/a+b/.test("a+b") // false
/a\+b/.test("a+b") // true
```

## 정규 표현식을 해독(?)해보자

지금까지 살펴본 정규 표현식 관련 내용을 참고하면, 정규 표현식을 자유자재로 읽고 쓸 수 있을 것입니다.

바로 아래 예제를 살펴보겠습니다!

```javascript
// RFC2822 Email Validation
const regExp = 
/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

// 나한테 왜 이러는겨...
```

사실 정규 표현식에 대해서 알고 있어도, 위와 같은 정규 표현식을 아무런 설명없이 보게 된다면 조금 당황스러울 것입니다.

위의 정규 표현식은 이메일을 검증하기 위해 사용되는 정규 표현식으로, [RegExr](https://regexr.com/)과 같은 사이트를 이용하면 쉽게 얻을 수 있습니다.

즉, 웬만한 정규 표현식은 직접 작성할 필요 없이 검색을 통해서 쉽게 구할 수 있다는 것입니다.

하지만 구글 검색 또는 챗 GPT를 통해서 얻은 정규 표현식을 확인도 안 하고 그냥 사용하는 것에서 저는 약간의 찜찜함을 느낍니다.

내가 직접 작성할 필요는 없더라도, 검색해서 얻은 정규 표현식을 해석하고 약간의 수정을 할 수 있는 정도가 되면 좋지 않을까요?

그래서 이번에는 RegExr 사이트의 "Community Patterns"에서 실제로 쓸모가 있을 것 같은 패턴을 뽑아서 해석해보는 연습을 해보겠습니다.

### 패턴1: Password Validation
```javascript
const passwordValidation = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/

passwordValidation.test("Number7") // false
passwordValidation.test("ONLYUPPER123") // false
passwordValidation.test("onlylower123") // false
passwordValidation.test("NotInNumber") // false
passwordValidation.test("C0rrect!@#$") //true

/* 정규 표현식 분석

^ : 시작 위치

(?=.*\d) : 주어진 문자열에 숫자가 포함되어야 함
  x(?=y) : x 뒤에 y가 오는 경우에만 일치하는 것으로 판단
  .*: 임의의 문자가 0번 이상 반복
  \d : 0-9의 숫자

(?=.*[a-z]) : 주어진 문자열에 알파벳 소문자가 포함되어야 함
  [a-z] : 알파벳 소문자

(?=.*[A-Z]) : 주어진 문자열에 알파벳 대문자가 포함되어야 함 
  [A-Z] : 알파벳 대문자

.{8,} : 임의의 문자가 최소 8번 이상 반복(임의의 문자이므로 특수문자도 가능)

$ 종료 위치

해석: 주어진 문자열이 알파벳 대문자, 알파벳 소문자, 숫자를 포함한 8자 이상의 문자열인지 판별하는 정규 표현식
*/
```

### 패턴2: M/D/YYYY or MM/DD/YYYY
```javascript
const dateRegExp =
  /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[12]\d|3[01])[\/](19|20)\d{2}$/

dateRegExp.test("01/01/2023") //true
dateRegExp.test("1/1/2023") //ture
dateRegExp.test("12/31/2023") //true

dateRegExp.test("99/1/2023") // false
dateRegExp.test("1/99/2023") // false
dateRegExp.test("1/1/9999") // false

/* 정규 표현식 분석

^ : 시작 위치

(0?[1-9]|1[0-2])
  () : 그룹 지정
  0? : 숫자 0이 최소 0번 최대 1번 반복된다. (1~9월을 표기할 때 0 포함 여부)
  [1-9] : 1-9 사이의 숫자 하나가 포함된다. (1월 ~ 9월)
  | : 또는
  1[0-2] : 1 뒤에 0-2 사이의 숫자 하나가 포함된다. (10월 ~ 12월)


[\/] : 역슬래시가 포함된다.
  [\/]를 \/로만 표기해도 되지만, 추후 다른 특수 문자(-, .)를 고려하기 위해 넣지 않았나 추정

(0?[1-9]|[12]\d|3[01])
  0? : 숫자 0이 최소 0번 최대 1번 반복된다. (1~9일을 표기할 때 0 포함 여부)
  [1-9] : 1-9 사이의 숫자 하나 포함된다. (1일 ~ 9일)
  | : 또는
  [12]\d : 1 또는 2와 0-9 사이의 숫자 하나 포함된다. (10일~29일)
  | : 또는
  3[01] : 3 뒤에 0 또는 1이 포함 (30, 31일)


[\/] : 역슬래시가 포함된다.

(19|20)\d{2}: 19 또는 20 뒤에 0-9 사이의 숫자가 2 번 반복된다. (1900년~2099년)

$ : 종료 위치

해석: 주어진 문자열의 날짜 형식이 M/D/YYYY 또는 MM/DD/YYYY 형식인지 판별하는 정규 표현식
*/

```

#### M/D/YYYY or MM/DD/YYYY의 수정

저의 경우 M/D/YYYY or MM/DD/YYYY 형식 보다는 YYYY/MM/DD 형식을 사용하는 경우가 많습니다.

그리고 날짜의 경우 슬래시(/)도 사용하지만 하이픈(-)이나 마침표(.)를 사용하기도 하므로 정규 표현식을 수정해보도록 하겠습니다.

```javascript
const dateRegExp =
  /^(19|20)\d{2}[\/\-\.](0?[1-9]|1[0-2])[\/\-\.](0?[1-9]|[12]\d|3[01])$/

dateRegExp.test("2022/06/08") // true
dateRegExp.test("2022-06-08") // true
dateRegExp.test("2022.06.08") // true
```

### 패턴3: RFC2822 Email Validation

#### 잠깐! 패턴 분석 전에 캡처 그룹에 대해서 알아보자

RFC2822 Email Validation을 본격적으로 살펴보기 전에 알고가면 좋은 내용이 있습니다.

날짜 패턴을 분석할 때 소괄호`()`를 `그룹 지정`으로 간단히 소개하고 넘어갔는데요.

사실 정규 표현식에서 소괄호`()`는 `캡처 그룹(Capturing group)`을 의미합니다.

캡처 그룹과 비슷한 개념으로 `비캡처 그룹(Non-capturing group)`도 있는데 이는 `(?:)`로 표기합니다.

둘다 그룹을 지정한다는 점에서는 같지만, 그룹 내의 패턴과 일치하는 부분을 `캡처`하느냐 하지 않느냐에 차이가 있습니다.

예를 들어, 주어진 문자열을 정규 표현식으로 판별할 때, 주어진 문자열의 어떤 부분을 추출하거나 참조해야 한다면 `캡처 그룹`의 사용을 고려할 수 있습니다.

하지만, 무엇인가를 캡처한다는 것은 추가적인 메모리를 사용한다는 의미이므로, 캡처 그룹의 사용은 `성능 저하`를 일으킬 수 있습니다.

따라서, 정규 표현식에 일치하는 부분을 따로 캡처할 필요가 없다면 `비캡처 그룹`을 사용하는 것이 좋습니다. (출처: [MDN의 정규 표현식 - Groups and Ranges](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_expressions/Groups_and_backreferences))

앞으로 살펴 볼 패턴에는 (?:)로 표기하는 비캡처 그룹이 등장하기 때문에 간략히 소개했습니다.

그러면 무시무시한 RFC2822 Email Validation을 분석해보겠습니다.

#### RFC2822 Email Validation 분석

```javascript
// RFC2822 Email Validation
const regExp =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

console.log(regExp.test("hyeongwookim@gmail.com")) // true
console.log(regExp.test("hyeongwookim.dev@gmail.com")) // true (로컬 파트 마침표있는 경우)
console.log(regExp.test("hyeongwookim.dev@g-mail.com")) // true (도메인 파트 앞부분에 하이픈 있는 경우)
console.log(regExp.test("hyeongwookim.dev@gmail.com-")) // true (도메인 파트 뒷부분에 하이픈 있는 경우)

/* 정규 표현식 분석

[a-z0-9!#$%&'*+/=?^_`{|}~-]+ : 알파벳 소문자 또는 숫자 또는 특수문자가 한 번 이상 반복되는 문자열이다.
  예시)
  test("a") // true
  test("4") // true
  test("!") // true
  test("a4!") // true
  test("A") // false
  test("A4!") // true
  test("") // false
  
해석: 이메일의 로컬 파트 부분이다.

(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*
  (?:) : 비캡처그룹, 그룹 지정 역할을 한다.
  \.[a-z0-9!#$%&'*+/=?^_`{|}~-]+ : 마침표(.) 뒤에 알파벳 소문자 또는 숫자 또는 특수문자가 한 번 이상 반복되는 문자열이다.
    예시)
    test("") // false
    test(".") // false
    test("a") // false
    test(".a4!") // true

  (?:...)* : 그룹 내부의 패턴이 0번 이상 반복된다. 

해석: 이메일 로컬파트에 마침표(.)가 포함되는 부분이고 존재하지 않을 수 있다.

@: 특수문자 @가 있어야 한다.

(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+
  [a-z0-9-]*[a-z0-9]
    : 알파벳 소문자 또는 숫자 또는 하이픈(-)이 0번 이상 반복되고
    : 그 뒤에 알파벳 소문자 또는 숫자 중 하나와 일치하는 문자열이 온다.
      예시)
      test("abc123") // true
      test("abc-123") // true
      test("-abc") // true
      test("123-") // true

  (?:...)? : 그룹 내부의 패턴이 최소 0번 최대 1 번 반복된다.

  [a-z0-9](?:...)?\.
    : 알파벳 소문자 또는 숫자로 이루어진 문자열 뒤에 그룹이 최소 0번 최대 1 번 반복되고
    : 그 뒤에 마침표(.)가 온다.

  (?:...(?:...)?\.)+
    : 그룹 내의 패턴이 한 번 이상 반복된다.

해석: 이메일의 도메인파트 부분에서 마침표(.) 앞 부분을 의미한다.

[a-z0-9](?:[a-z0-9-]*[a-z0-9])?
  [a-z0-9]
    : 알파벳 소문자 또는 숫자가 한 번 이상 반복되는 문자열뒤에 그룹 패턴이 온다.
  (?:[a-z0-9-]*[a-z0-9])?
  : 그룹패턴 안에는 알파벳 소문자 또는 숫자 또는 하이픈(-)이 0번 이상 반복되고
  : 그 뒤에 알파벳 소문자 또는 숫자 중 하나와 일치하는 문자열이 온다.
  : 이 그룹 내부의 패턴은 최소 0번 최대 1 번 반복된다.

해석: 이메일의 도메인 파트 부분에서 마침표(.) 뒷 부분을 의미한다.
*/

```
## 정규 표현식 실전 활용: 개인 프로젝트 검색 기능 개선하기

개인 프로젝트에서 음악 검색 기능을 구현하기 위해 정규 표현식을 사용했던 경험을 이 글 초반에 언급했습니다.

그때 사용했던 정규 표현식을 다시 한 번 확인해보겠습니다.

```javascript
export const searchMusic = async (req, res) => {
  const { searchWord } = req.params;
  let musics = [];
  if (searchWord) {
    musics = await Music.find({
      title: {
        $regex: new RegExp(`${searchWord}$`, "i"),
      },
    });
  }
  return res.status(200).send(musics);
};
```
new RegExp(`${searchWord}$`, "i")라는 것은 제목이 searchWord로 끝나는 음악들만 검색하는 것입니다.

예를 들어 '두 사람'이라는 곡을 검색하는 상황을 가정해보면 아래와 같은 결과가 나옵니다.

```javascript
const dbMusic = "두 사람"

/람$/.test(dbMusic) // true
/사람$/.test(dbMusic) // true
/두 사람$/.test(dbMusic) // true
/두사람$/.test(dbMusic) // false (띄어쓰기 안 하면 검색 불가)
/두$/.test(dbMusic) // false (제목 앞부분으로는 검색 불가)
```
차라리 위와 같이 검색이 되면 그나마 다행이지만, 제 개인 프로젝트는 유저가 제목을 설정할 수 있기 때문에 변수가 많습니다.

그 중 하나가 공백입니다. 

예를 들어 "두 사람"이라는 제목이 "두 사람 "으로 제목 뒤에 `공백`이 추가된 상태로 저장되면 아래와 같은 결과가 나옵니다.

```javascript
const dbMusic = "두 사람 " // 공백 하나 추가 되었을 뿐인데...

/람$/.test(dbMusic) // false
/사람$/.test(dbMusic) // false
/두 사람$/.test(dbMusic) // false
/두사람$/.test(dbMusic) // false
/두$/.test(dbMusic) // false

// 유저가 추가한 곡을 검색할 방법이 없다...
```
물론, 정규식을 수정하지 않고, 유저가 입력한 제목의 앞 뒤 공백을 제거하고 데이터베이스에 저장하는 것으로 방식을 바꿀 수도 있습니다.

하지만 그럴 경우에도 문제가 생깁니다.

만약 노래 제목이 '아름다운 구속(With.김종서)'과 같다면 어떨까요?

'아름다운 구속(With.김종서)'이라는 곡을 찾기 위해 유저들은 '아름다운', '구속', '아름다운 구속'과 같은 키워드를 입력할 것이지, (with.김종서)를 입력하지는 않을 것입니다.

하다못해 '김종서'라고 검색해서 나오기라도 하면 다행이지만 그것도 불가능합니다.

```javascript
const dbMusic = "아름다운 구속(With.김종서)"

/아름다운$/.test(dbMusic) // false
/구속$/.test(dbMusic) // false
/아름다운 구속$/.test(dbMusic) // false
/김종서$/.test(dbMusic) // false

// 유저: 내가 추가한 음악 어딨는겨...😭
```

현재 정규 표현식대로면 '김종서)'로 괄호까지 추가해서 검색해야 음악을 찾을 수 있습니다.

그런데 이것이 또 치명적인 문제로 이어집니다.

정규 표현식에서 `)`는 패턴에 사용되는 특수 문자이므로 이스케이핑을 해줘야 합니다.

이스케이핑을 하지 않고 특수 문자를 입력하면, false가 반환되는 정도가 아니라 에러가 발생해서 앱이 멈춥니다...

```javascript
const dbMusic = "아름다운 구속(With.김종서)"

/김종서\)$/.test(dbMusic)
// true (이스케이핑 해줬을 때)
/김종서)$/.test(dbMusic)
// SyntaxError: Invalid regular expression: /김종서)$/: Unmatched ')'
```

따라서 이 기능에서 업데이트를 해야 하는 부분은 다음과 같습니다.

1. 유저가 음악을 등록할 때, 유저가 입력한 음악 제목의 앞 뒤 공백을 제거한 다음 데이터베이스에 저장해야 한다.

2. 정규 표현식으로 음악 제목을 검색할 것이라면, 정규 표현식에 사용되는 특수문자가 포함된 검색어는 입력할 수 없게 하거나, 서버에서 이스케이핑 작업을 거친 다음에 검색해야 한다.

3. 유저가 입력한 검색어로 끝나는 제목들만 검색하는 방식에서, 유저가 입력한 검색어가 포함된 제목들을 검색하는 방식으로 정규 표현식을 수정한다.

정규 표현식에 대해서 다루고 있는 이 글에서 첫번째, 두번째 업데이트를 다루는 것은 주제를 많이 벗어나기 때문에, 

일단 세번째 업데이트 사항인 `정규 표현식 수정`을 해보도록 하겠습니다.

(나머지 업데이트는 개인 프로젝트 리팩터링 글에서 다루고 추후에 이 곳에 링크 남기겠습니다.)

### 정규 표현식 수정
```javascript
// 기존의 정규 표현식
const searchWord = ""
const regex = new RegExp(`${searchWord}$`, "i"),
```

사실 가장 간단하게 수정하는 방법은 `$`기호를 제거하는 것입니다.

```javascript
const searchWord = "두"
const regex = new RegExp(`${searchWord}`, "i")

console.log(regex.test("한 사람")) // false
console.log(regex.test("두 사람")) // true
console.log(regex.test("두사 람")) // true ('두'라는 문자만 포함되면 true를 반환)
console.log(regex.test("세 사람")) // false
```
목적은 달성했지만, 여전히 아쉬운 점이 있습니다.

만약 유저가 "사"를 입력하면 어떻게 될까요?

```javascript
const searchWord = "사"
const regex = new RegExp(`${searchWord}`, "i")

console.log(regex.test("한 사람")) // true
console.log(regex.test("두 사람")) // true
console.log(regex.test("두사 람")) // true
console.log(regex.test("세 사람")) // true ("사"가 포함된 모든 곡을 다 찾는다.)
```

지금의 정규 표현식에서 '사'를 검색하면 데이터베이스에 존재하는 '사'가 들어간 모든 곡들을 검색할 것이고, 이는 비효율적입니다.

제가 원하는 것은 "뜨거운" 또는 "안녕"으로 검색해야 "뜨거운 안녕"이라는 곡을 찾을 수 있게 하는 것입니다.

"뜨", "뜨거"로 검색할 경우 "뜨거운 안녕"이라는 곡이 검색되지 않도록 구현하고 싶습니다.

즉, 유저의 검색어를 완결된 한 단어로 가지고 있는 제목의 곡만 검색하는 것입니다.

#### 경계를 나타내는 특수문자 `\b`

이런 상황에서는 정규 표현식에서 `경계를 나타내는` 특수 문자 `\b`를 사용해주면 좋습니다.

`\b`는 무엇의 경계를 의미하는 것일까요?

위에서 `\w` 라는 특수문자를 살펴봤는데요.

이 특수 문자는 `/[A-Za-z0-9_]/`을 의미하고, 이를 `word character`라 부릅니다.

`\b`는 바로 이 `word character`인 것과 아닌 것의 경계를 의미합니다.

즉, 알파벳, 숫자, 언더스코어인 것과 아닌 다른 문자들간의 경계를 의미합니다.

`\b`를 사용해서 어떻게 정규 표현식을 수정했는지 아래 코드를 통해 보겠습니다.

```javascript
// 유저의 검색어 searchWord의 앞 뒤를 경계로 지정합니다.
const regex = searchWord => new RegExp(`\\b${searchWord}\\b`, "i")

console.log(regex("l").test("LOVE DIVE")) // false
console.log(regex("lo").test("LOVE DIVE")) // false
console.log(regex("lov").test("LOVE DIVE")) // false
console.log(regex("love").test("LOVE DIVE")) // true (i 플래그로 대소문자 구별 안 함)
console.log(regex("DIVE").test("LOVE DIVE")) // true 
console.log(regex(" ").test("LOVE DIVE")) 
// true (공백 앞 뒤로 word character가 있기 때문에 경계로 인식해서 true 반환)
```
위와 같이 수정하면 제가 원하던대로 결과가 나오지만, 약간의 문제가 있습니다.

`공백 하나만 입력할 경우`도 true로 인식하기 때문에 이 부분은 유저가 공백만 입력하는 것을 방지하도록 코드를 수정하면 됩니다.

공백 문제보다 더 심각한 문제는 이 정규 표현식이 `한글에는 적용되지 않는다`는 점입니다.

```javascript
const regex = searchWord => new RegExp(`\\b${searchWord}\\b`, "i")

console.log(regex("뜨").test("뜨거운 안녕")) // false
console.log(regex("뜨거").test("뜨거운 안녕")) // false
console.log(regex("뜨거운").test("뜨거운 안녕")) // false (여기는 true가 나와야 하는데...)
console.log(regex("안녕").test("뜨거운 안녕")) // false (여기는 true가 나와야 하는데...)
```
원인에 대한 힌트는 바로 `\b`에 있습니다.

`\b`는 'word character'인 것과 아닌 것의 경계를 의미하는데, 이 `'word character'에는 한글이 포함되지 않습니다.`

즉, 바로 위 코드의 정규식을 적용했을 때 모두 false가 나오는 이유는, "뜨거운 안녕"이라는 문자열은 'word character'가 아닌 문자들로만 이뤄져있기 때문에, `경계를 나눌 수가 없기 때문`입니다.

한글 검색어를 다룰 때는 아래와 같이 수정해주면 됩니다.

```javascript
const regex = searchWord => new RegExp(`(?<![가-힣])${searchWord}(?![가-힣])`)

console.log(regex("뜨").test("뜨거운 안녕")) // false
console.log(regex("뜨거").test("뜨거운 안녕")) // false
console.log(regex("뜨거운").test("뜨거운 안녕")) // true 
console.log(regex("안녕").test("뜨거운 안녕")) // true 
```
처음 보는 문법이 또 나왔는데 아래에 간략히 설명하겠습니다.

- `(?<!y)x`
  - Negative lookbehind assertion(부정형 전방 탐색)
  - "x" 앞에 "y"가 오지 않는 경우에만 "x"와 일치합니다.
- `x(?!y)`
  - Negative ;ookahead assertion(부정형 후방 탐색)
  - "x" 뒤에 "y"가 오지 않는 경우에만 "x"와 일치합니다.

자 이렇게 검색어가 영어일 때와 한글일 때 사용할 수 있는 정규 표현식을 작성해봤습니다.

검색어를 받고 그 검색어가 한글만으로 또는 영어만으로 이뤄졌는지 확인하고, 그 결과에 따라서 정규 표현식을 다르게 적용하는 것도 방법이 될 수 있겠습니다.

하지만, 하나의 정규 표현식으로 한글과 영어 검색이 가능하도록 구현할 수는 없을까요?

저는 이렇게 수정했습니다.

```javascript
const regex = searchWord =>
  new RegExp(`(?<![A-Za-z0-9_가-힣])${searchWord}(?![A-Za-z0-9_가-힣])`, "i")

console.log(regex("l").test("LOVE DIVE")) // false
console.log(regex("lo").test("LOVE DIVE")) // false
console.log(regex("lov").test("LOVE DIVE")) // false
console.log(regex("love").test("LOVE DIVE")) // true 
console.log(regex("DIVE").test("LOVE DIVE")) // true 

console.log(regex("뜨").test("뜨거운 안녕")) // false
console.log(regex("뜨거").test("뜨거운 안녕")) // false
console.log(regex("뜨거운").test("뜨거운 안녕")) // true
console.log(regex("안녕").test("뜨거운 안녕")) // true
```
이렇게 검색 기능을 업그레이드하기 위한 기나긴 여정이 끝났습니다.

```javascript
   new RegExp(`${searchWord}$`, "i") 
=> new RegExp(`${searchWord}`, "i")
=> new RegExp(`\\b${searchWord}\\b`, "i")
=> new RegExp(`(?<![가-힣])${searchWord}(?![가-힣])`)
=> new RegExp(`(?<![A-Za-z0-9_가-힣])${searchWord}(?![A-Za-z0-9_가-힣])`, "i")
```

## 마치며

"정규 표현식 그거 그냥 검색해서 쓰면 되는 거 아닙니까?"라는 말이 틀린 말은 아닙니다.

괜찮은 정규 표현식을 작성하는 것도 어렵고, 인터넷에 검색하거나 챗 GPT에게 물어보면 좋은 정규 표현식을 제공해주기 때문입니다.

하지만, 그런 정규 표현식을 가져와서 실제로 테스트해보면 제가 예상했던대로 움직이지 않는 경우가 많이 있었습니다.

특히 검색 기능을 업그레이드할 때, 챗 GPT는 한글도 `/b`를 사용해서 경계를 설정해주면 된다고 했지만, 그것은 제가 원하던 답변이 아니었습니다.

`/b`에 대해서 MDN에서 검색해보고 원인을 찾아낸 뒤, 챗 GPT에게 다시 질문했을 때, 챗 GPT는 제가 원하던 답을 제시해줬습니다.

'내가 정규 표현식을 작성할 수는 없더라도, 최소한 해석할 줄 알고, 왜 이렇게 작동하는지는 알고 있어야 정규 표현식을 제대로 사용할 수 있구나'라는 것을 느꼈습니다.

'이게 대체 왜 이렇게 되는거야!!!'라면서 머리도 많이 싸맸지만, 어려운 것이 하나씩 이해가 될 때 오는 즐거움을 정규 표현식 공부를 하면서 느낄 수 있었습니다.

공부는 언제나 즐겁다는 것을 느끼며 오늘 글은 여기서 마치겠습니다.


### 참고자료

- 모던 자바스크립트 Deep Dive: 자바스크립트의 기본 개념과 동작 원리 by 이웅모 (출처: 위키북스, 2020), p. 612-625 “31장 RegExp”

  - 도서 구매 링크: [https://product.kyobobook.co.kr/detail/S000001766445](https://product.kyobobook.co.kr/detail/S000001766445)

- 정규 표현식 by [MDN contributors](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_expressions/contributors.txt), last modified on 2023년 4월 22일

  -  [문서 링크](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_expressions#%EC%A0%95%EA%B7%9C_%ED%91%9C%ED%98%84%EC%8B%9D_%ED%8C%A8%ED%84%B4_%EC%9E%91%EC%84%B1%ED%95%98%EA%B8%B0)