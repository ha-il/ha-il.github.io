---
title: "[당신의 작업실] 9. 프로젝트 개발 과정 - 정규 표현식과 검색 기능 개선"
date: "2023-06-20T05:20:09.000Z"
description: "정규 표현식을 활용해서 검색 기능을 개선한 경험을 공유합니다."
category: "project"
featuredImage: "../../../../../src/images/sideProject-256x256.png"
mobileImage: "../../../../../src/images/sideProject-512x256x2.png"
---
- 당신의 작업실 프로젝트 링크: https://pixel-workroom.herokuapp.com/
- 프로젝트 깃허브 저장소 링크 : https://github.com/ha-il/project-pixel

## 들어가기 전에 

[이전 글](https://ha-il.github.io/side-project/project-pixel/8-dev-prop-this/)에서는 개발 과정에서 맞닥뜨렸던 **컴포넌트간 prop(속성) 전달 문제**에 대해서 다뤘습니다. 이번 글에서는 **검색 기능의 정규 표현식 사용 문제**에 대해서 다뤄보겠습니다.

## 1. "당신의 작업실"의 검색 기능 간략 소개

문제 해결 과정을 설명하기 전에, 프로젝트의 음악 추가 기능과 검색 기능을 간략히 소개하겠습니다.

- **"당신의 작업실"의 음악 추가 기능**
<img src="https://github.com/ha-il/project-pixel/assets/108077643/d31f16cb-f9f5-4c6b-8626-6f9802231579" width="100%" alt="music-registration"/>

음악 추가 기능은 사용자가 **유튜브 URL**을 입력하면 해당 영상의 정보를 띄워주고, **영상의 제목과 아티스트의 이름을 수정**하여 데이터베이스에 등록할 수 있는 기능입니다. 이렇게 등록한 음악을 자신의 플레이리스트에 추가하기 위해서는 그 곡을 **검색할 필요가 있었습니다**. 그래서 아래 이미지와 같이 검색 기능을 구현했습니다.

- **"당신의 작업실"의 음악 검색 기능**
<img src="https://github.com/ha-il/project-pixel/assets/108077643/648817ef-814f-4381-a8ff-120cb92a3c08" width="100%" alt="music-searching"/>

<br/>
<br/>


'특별할 것 없는 평범한 검색 기능입니다'라고 생각했습니다만. 사실 문제가 굉장히 많았습니다. 그 이유는 검색 기능을 구현할 때 사용했던 **정규 표현식** 때문인데요. 당시에는 정규 표현식에 대한 지식이 없어서 아래와 같이 간략히 구현했습니다.

```javascript
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
'희재'를 검색하면 '희재'가 나오고, '두 사람'을 검색하면 '두 사람'이 나왔습니다. 아무런 문제가 없다고 생각하고 검색 기능은 이 상태로 마무리 지었습니다. 하지만 프로젝트에 대한 피드백으로 `추가한 음악이 검색되지 않는다`라는 피드백을 받았습니다.

## 2. 기존 검색 기능의 문제점

여러분이 `'너의 모든 순간'`이라는 곡을 검색한다면 어떤 검색어를 입력하시겠습니까? 저라면 `'너의'`까지만 검색할 것 같습니다. 관련된 곡이 너무 많다면 `'너의 모든'`까지 입력할 수도 있을 것입니다. 하지만 제가 구현한 검색 기능에 이 두 가지 검색어를 입력하면 **아무런 곡이 나오지 않았습니다**. `'너의 모든 순간'`을 완벽히 입력했을 때 곡이 검색됐습니다.

<img src="https://github.com/ha-il/ha-il.github.io/assets/108077643/8f07a563-599f-4dd4-bcf6-94794b53bde8" width="100%" alt="fix-search"/>

<br/>
<br/>
<br/>

또 다른 문제점도 있었습니다. 바로 제목 앞뒤로 **공백이 포함되었을 때도 검색이 되지 않았습니다**. 음악을 데이터베이스에 저장할 때 공백을 포함하여 "   미소천사   "와 같이 제목을 저장하면, 해당 곡을 찾을 수 없었습니다.
<br/>

<img src="https://github.com/ha-il/ha-il.github.io/assets/108077643/5b08a35a-5cfd-4b14-b7a0-2434184a98c8" width="100%" alt="trim-error"/>

<br/>
<br/>
<br/>

`"정규 표현식 공부해야겠다."`

사람은 어째서 당해봐야 깨닫는 것일까요? 그 이후로 MDN과 '모던 자바스크립트 딥 다이브'를 참고하여 정규 표현식을 공부하고 블로그에 정리한 다음([해당 글](https://ha-il.github.io/regexp/)), 프로젝트에 사용한 정규 표현식을 수정했습니다.

## 3. 먼저, 공백 입력부터 해결하기

정규 표현식을 수정하기 전에, 우선은 제목과 아티스트를 입력 받을 때 **앞뒤 공백을 제거**하도록 코드를 수정하는 것이 좋겠다는 판단이 들었습니다. [String.prototype.trim()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/trim) 메서드를 사용하여 쉽게 해결할 수 있었습니다. 아래와 같이 코드를 수정했습니다.

```javascript
class MusicRegistrationForm extends Component {
  setEvent() {
    $("#music-registration-form").addEventListener("submit", async (e) => {
      // ...생략..

      const title = $("#title").value.trim(); // trim 메서드를 추가해줬습니다.
      const artist = $("#artist").value.trim();
      const musicData = JSON.stringify({
        youtubeId,
        imageUrl,
        duration,
        title,
        artist,
      });
      
      // ...생략..
    });
  }
}
```

## 4. 기존 검색 기능에 사용한 정규 표현식 분석하기

기존 검색에 사용했던 정규 표현식은 아래와 같습니다.

```javascript
new RegExp(`${searchWord}$`, "i")
```
new RegExp(`${searchWord}$`, "i")라는 것은 제목이 `searchWord`로 끝나는 음악들만 검색하는 것입니다.

예를 들어 '두 사람'이라는 곡을 검색하는 상황을 가정해보면 아래와 같은 결과가 나옵니다.

```javascript
const dbMusic = "두 사람"

/람$/.test(dbMusic) // true
/사람$/.test(dbMusic) // true
/두 사람$/.test(dbMusic) // true
/두사람$/.test(dbMusic) // false (띄어쓰기 안 하면 검색 불가)
/두$/.test(dbMusic) // false (제목 앞부분으로는 검색 불가)
```
공백 문제를 해결하지 않았을 경우에 위의 정규 표현식은 어떻게 작동했을까요?

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

trim 메서드로 공백문제를 해결했어도 정규 표현식을 수정하지 않으면 안 되는 또다른 이유가 있었습니다.

만약 노래 제목이 '아름다운 구속(With.김종서)'과 같다면 어떨까요? 

`'아름다운 구속(With.김종서)'`이라는 곡을 찾기 위해 유저들은 `'아름다운'`, `'구속'`, `'아름다운 구속'`과 같은 키워드를 입력할 것이지, **(with.김종서)를 입력하지는 않을 것**입니다.

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

**그런데 이것이 또 치명적인 문제로 이어집니다.**

정규 표현식에서 `)`는 패턴에 사용되는 특수 문자이므로 이스케이핑을 해줘야 합니다.

이스케이핑을 하지 않고 특수 문자를 입력하면, false가 반환되는 정도가 아니라 **에러가 발생해서 프로젝트가 멈춥니다**.

```javascript
const dbMusic = "아름다운 구속(With.김종서)"

/김종서\)$/.test(dbMusic)
// true (이스케이핑 해줬을 때)
/김종서)$/.test(dbMusic)
// SyntaxError: Invalid regular expression: /김종서)$/: Unmatched ')'
```
정규 표현식을 공부하지 않고 그대로 뒀다면 프로젝트의 실행이 멈춰버리는 경우를 그대로 안고 갈 뻔 했습니다.


따라서 이 기능에서 업데이트를 해야 하는 부분은 다음과 같습니다.

**1. 유저가 입력한 `검색어로 끝나는 제목들만 검색하는 방식`에서, 유저가 입력한 `검색어가 포함된 제목들을 검색하는 방식`으로 정규 표현식을 수정한다.**

**2. 정규 표현식으로 음악 제목을 검색할 것이라면, 정규 표현식에 사용되는 `특수문자가 포함된 검색어는 입력할 수 없게 하거나`, `서버에서 이스케이핑 작업을 거친 다음에 검색`해야 한다.**

## 5. 검색 기능 개선하기
### 5.1 정규 표현식 수정
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

만약 유저가 "`사`"를 입력하면 어떻게 될까요?

```javascript
const searchWord = "사"
const regex = new RegExp(`${searchWord}`, "i")

console.log(regex.test("한 사람")) // true
console.log(regex.test("두 사람")) // true
console.log(regex.test("두사 람")) // true
console.log(regex.test("세 사람")) // true ("사"가 포함된 모든 곡을 다 찾는다.)
```

지금의 정규 표현식에서 '사'를 검색하면 데이터베이스에 존재하는 '사'가 들어간 모든 곡들을 검색할 것이고, 이는 비효율적입니다.

제가 원하는 것은 "`뜨거운`" 또는 "`안녕`"으로 검색해야 "`뜨거운 안녕`"이라는 곡을 찾을 수 있게 하는 것입니다.

"`뜨`", "`뜨거`"로 검색할 경우 **"뜨거운 안녕"이라는 곡이 검색되지 않도록 구현**하고 싶습니다.

즉, 유저의 검색어를 완결된 한 단어로 가지고 있는 제목의 곡만 검색하는 것입니다.

#### 경계를 나타내는 특수문자 `\b`

이런 상황에서는 정규 표현식에서 `경계를 나타내는` 특수 문자 `\b`를 사용해주면 좋습니다. `\b`는 무엇의 경계를 의미하는 것일까요?

정규 표현식에서 `\w` 라는 특수문자가 있습니다. 이 특수 문자는 `/[A-Za-z0-9_]/`을 의미하고, 이를 `word character`라 부릅니다.

`\b`는 바로 이 `word character`인 것과 아닌 것의 경계를 의미합니다. 즉, **알파벳, 숫자, 언더스코어인 문자와 그 밖의 다른 문자들간의 경계를 의미**합니다.

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
원인에 대한 힌트는 바로 `\b`에 있습니다. `\b`는 'word character'인 것과 아닌 것의 경계를 의미하는데, 이 'word character'에는 **한글이 포함되지 않습니다**.

바로 위 코드의 정규식을 적용했을 때 모두 false가 나오는 이유는, "뜨거운 안녕"이라는 문자열은 'word character'가 아닌 문자들로만 이뤄져있기 때문에, **경계를 나눌 수가 없기 때문**입니다.

한글 검색어를 다룰 때는 아래와 같이 수정해주면 됩니다.

```javascript
const regex = searchWord => new RegExp(`(?<![가-힣])${searchWord}(?![가-힣])`)

console.log(regex("뜨").test("뜨거운 안녕")) // false
console.log(regex("뜨거").test("뜨거운 안녕")) // false
console.log(regex("뜨거운").test("뜨거운 안녕")) // true 
console.log(regex("안녕").test("뜨거운 안녕")) // true 
```
- 위 예시에서 사용한 정규 표현식 문법
  - `(?<!y)x`
    - Negative lookbehind assertion(부정형 전방 탐색)
    - "x" 앞에 "y"가 오지 않는 경우에만 "x"와 일치합니다.
  - `x(?!y)`
    - Negative ;ookahead assertion(부정형 후방 탐색)
    - "x" 뒤에 "y"가 오지 않는 경우에만 "x"와 일치합니다.

이렇게 검색어가 **영어**일 때와 **한글**일 때 사용할 수 있는 정규 표현식을 작성해봤습니다. 검색어를 받고 그 검색어가 한글만으로 또는 영어만으로 이뤄졌는지 확인하고, 그 결과에 따라서 정규 표현식을 다르게 적용하는 것도 방법이 될 수 있겠습니다.

하지만, **하나의 정규 표현식으로 한글과 영어 검색이 가능하도록 구현할 수는 없을까요**?

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

### 5.2 특수문자 이스케이핑하기

사실, 특수문자를 이스케이핑하는 것보다 쉬운 방법은 **그냥 유저에게 특수문자를 입력받지 않는 것**입니다. 하지만 프로젝트가 `'나만의 작업실'인데 음악 제목조차 마음대로 짓지 못하게 한다는 것`이 마음에 걸렸습니다. 게다가 실제 발매된 음원 중에서 간혹 `제목에 특수문자를 포함시킨 곡들도 있었기 때문`에 이런 곡들을 특수문자 없이 저장하게 할 수는 없었습니다. 이러한 이유로 **유저에게 특수문자를 입력하지 못 하게 하는 것은 프로젝트 방향성과 맞지 않다**고 생각했습니다.

따라서, **서버에서 검색어의 특수문자를 이스케이핑하는 코드를 추가**하기로 했습니다. 이 때 `String.prototype.replace()` 메서드를 사용했는데요. MDN의 replace() 메서드에 대한 문서에서 [**매개변수가 string으로 지정되었을 때**](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/replace)를 읽고 오시면 이해가 더 쉽습니다.

```javascript
searchWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");


/[.*+?^${}()|[\]\\]/ : 이스케이프 해야 하는 모든 문자를 의미합니다.
g : 문자열의 전체를 탐색하라는 전역 플래그입니다.

"\\$&"
- \\ : 역슬래시 또한 특수 문자기 때문에 이스케이프 처리를 해서 \\가 된 것입니다.
- $& : 매치된 문자열을 삽입하는 특수 교체 패턴입니다.
```
위의 코드를 검색 기능을 담당하는 함수에 추가했습니다.

```javascript
export const searchMusic = async (req, res) => {
  const { searchWord } = req.params;
  let musics = [];

  if (searchWord) {
    const escapedSearchWord = searchWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    musics = await Music.find({
      title: {
        $regex: new RegExp(
          `(?<![A-Za-z0-9_가-힣])${escapedSearchWord}(?![A-Za-z0-9_가-힣])`,
          "i"
        ),
      },
    });
  }
  return res.status(200).send(musics);
};
```

## 마치며

['쿠키 설정'](https://ha-il.github.io/side-project/project-pixel/7-dev-cookie/), ['prop과 this 바인딩'](https://ha-il.github.io/side-project/project-pixel/8-dev-prop-this/), '정규 표현식을 통한 검색 기능 개선'을 중심으로 '당신의 작업실'을 개발했던 과정을 쭉 다뤄봤습니다.

쿠키에 대한 글을 작성할 때 "`가장 기억에 남는 문제들은 지식 또는 경험의 부족으로 인해 발생했던 문제들이었다`"라는 말을 했었는데요. 왜 그럴까 생각해보면, **그 문제를 통해 제 스스로가 많이 성장했다는 것**을 느꼈기 때문인 것 같습니다. MDN이나 '모던 자바스크립트 Deep Dive' 등을 참고하면서 문제의 원인이나 해결 방법에 대한 실마리를 발견했을 때는 정말 짜릿했던 것 같습니다.

저와 같은 초보 개발자는 여전히 배워야할게 산더미지만, 이런 경험을 하고 나니 **배워야 할게 많다는 사실이 부담으로 다가오기 보다는 설렘으로 다가오는 것 같습니다**. 정말 값진 경험이었습니다.

[다음 글](https://ha-il.github.io/side-project/project-pixel/10-ending/)에서는 프로젝트를 통해 얻은 것과 아쉬웠던 점, 그리고 앞으로의 계획에 대해서 이야기해보려합니다. "당신의 작업실"과 관련된 마지막 글이 될 것 같습니다.

## 참고자료

- MDN Web Docs: String.prototype.trim()
  - by [MDN contributors.](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/trim/contributors.txt)
  - accessed June 21
  - [문서 링크](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/trim)

- MDN Web Docs: String.prototype.replace()
  - by [MDN contributors.](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/replace/contributors.txt)
  - accessed June 21
  - [문서 링크](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/replace) 


