---
title: "[당신의 작업실] 5. 프로젝트 기획과 디자인"
date: "2023-06-13T12:20:05.000Z"
description: "왜 당신의 작업실이죠?"
category: "project"
featuredImage: "../../../../../src/images/sideProject-256x256.png"
mobileImage: "../../../../../src/images/sideProject-512x256x2.png"
---
- 당신의 작업실 프로젝트 링크: https://pixel-workroom.herokuapp.com/
- 프로젝트 깃허브 저장소 링크 : https://github.com/ha-il/project-pixel

## 기획을 시작하기 전에

[이전 글](https://ha-il.github.io/side-project/project-pixel/4-dataBase)까지는 "내가 바닐라 자바스크립트만으로 웹 뮤직 플레이어를 구현할 수 있을까?"라는 질문에 답을 하는 과정이었다면, 이번 기획 과정은 "**나는 사용자에게 어떤 웹 뮤직 플레이어를 제공하고 싶은가?**"라는 질문에 답을 하는 과정이었습니다. 처음부터 이 질문에 답을하기는 어려웠기에 질문을 나누어서 하나씩 답을 해보려 했습니다. 그때 제 스스로에게 던졌던 질문은 아래 세 가지였습니다.

1. 나는 언제 음악을 듣는가?

2. 나는 무엇으로 음악을 듣는가?

3. 내가 만들 뮤직 플레이어는 무엇이 다른가?

## 나는 언제 음악을 듣는가?

저는 주로 아래와 같은 상황일 때 음악을 듣는 편입니다.

- 달리기를 할 때
- 이동할 때(지하철, 버스, 보도)
- 작업이나 공부를 할 때
- 카페나 식당에서 그냥 틀어줄 때
- 집안일 할 때

위의 경우들로 미루어보아, 음악 자체를 감상하는 경우보다도, 필요에 따라서 음악을 **배경음악**처럼 활용하는 경우가 많다는 것을 알게 되었습니다. 위의 다섯가지 경우 중에서도 저에게 있어서 음악을 가장 많이 듣는 경우는 단연 **작업이나 공부를 할 때**였습니다. 작업이나 공부를 할 때 나는 보통 어떤 방식으로 음악을 듣는지 생각해보게 되었습니다.

## 나는 무엇으로 음악을 재생하는가?

저는 작업이나 공부를 하면서 음악을 들을 때는 스마트폰보다는 **맥북**으로 음악을 많이 들었습니다. 제가 하는 작업이나 공부라는 것이 결국 **개발**에 관련된 것들이라 맥북을 사용하지 않을 수가 없기에, 음악도 굳이 스마트폰으로 따로 틀 필요가 없었습니다. 음악은 보통 유튜브로 재생했습니다. 유튜브로 여러 곡을 재생목록에 담는 경우도 있었지만, 여러 곡을 모아서 2시간 또는 4시간짜리로 만든 영상을 주로 들었습니다. 작업을 하다보면 브라우저 창은 거의 항시 열려있으므로 **유튜브 창 역시 브라우저 창의 여러 탭 중 하나로 같이 띄워두는 경우**가 많았고, 눈에 거슬린다면 유튜브 탭만 따로 창으로 분리하고 최소화시키도 했습니다.

이렇게 제가 음악을 감상하는 방식을 점검해보니, **작업이나 공부할 때 음악을 듣는 유저층**을 고려해서 웹으로 뮤직 플레이어를 만들면, 만드는 나도 공감할 수 있는 프로젝트를 만들 수 있겠다는 생각이 들었습니다.

## 내가 만들 뮤직 플레이어는 무엇이 다른가?

물론 이런 작은 프로젝트로 유튜브나 스포티파이와 경쟁할 수 있다는 생각은 할 수 없겠지만, **아무리 작은 프로젝트라도 해도 하나쯤의 차별성은 반드시 필요**하다고 생각했습니다. 이런 작은 웹 뮤직플레이어가 대형 뮤직 앱과 차별화 될 수 있는 부분은 **타겟 유저층**이라고 생각했습니다. 대형 뮤직 앱은 사용자 수도 많고 범위도 넓기 때문에 특정 타겟층만 노리지는 않는 것 같았습니다. 저의 경우 작업이나 공부를 하면서 음악을 듣는 사람을 타겟으로 노려서, 집중력 향상에 도움이 되는 음악들 위주로 음악을 추천해줄 수도 있고, 음악의 가사가 없는 lo-fi, 재즈, 클래식을 중점적으로 배치할 수 있을 것이고, 멜로디조차 없는 빗소리같은 자연의 소리를 배치할 수도 있을 것입니다. 

하지만, 이런 특정 장르의 음악을 추천해주는 것은 이미 유튜브의 많은 채널에서 하고 있습니다. 그럼 그 채널들에 비해서 내 웹 뮤직 플레이어가 가질 수 있는 차별성에는 뭐가 있을까 생각해보니, 웹 페이지이기 때문에 **유저가 상호작용을 할 수 있는 가상의 공간**을 제시할 수 있겠다는 생각이 들었습니다. 마치 **싸이월드 미니홈피의 미니룸**처럼, 유저에게 **자신만의 작은 작업실**을 제공하는 것입니다. 작업실을 웹페이지로 제공하고, 웹의 작은 작업실에 존재하는 스피커를 클릭하면 뮤직 플레이어가 재생된다거나 하는 방식으로 **유저가 상호작용할 수 있는 요소들을 만들어 재미를 줄 수 있다면**, 차별성을 가져갈 수 있을 것이라 생각했습니다.

## 유저에게 전달하고 싶은 메시지

단순히 음악과 작업실을 전달하는 것에 그치지 않고, 유저들이 이 프로젝트에 공감할 수 있는 메시지를 전달하고 싶었습니다. 마침 이 프로젝트의 디자인 컨셉을 **픽셀아트**로 잡으려던 참이었습니다. 평소에 픽셀아트에 관심이 있어서 조금씩 만들어보고 있었고[(작업물 인스타그램)](https://www.instagram.com/hail.pixel/), **픽셀 아트 특유의 그리운 감성**을 제가 좋아하기 때문입니다. 디자인은 픽셀아트로 해야겠다는 생각에 도달했을 때 갑자기 이런 생각이 들었습니다.

'lo-fi도 그렇고 픽셀아트도 그렇고, 저음질에 저해상도로 만들어진 작품인데 난 왜 이걸 좋아할까?'

저음질에 저해상도로 만들어진 작품들이지만 특유의 편안함과 따뜻한 감성을 지니고 있다는 공통점을 lofi와 픽셀아트 사이에서 발견하게 되었습니다. 나아가 이런 생각이 들었습니다.

'내가 유저에게 제공한다고 하는 가상 공간도 lo-fi나 픽셀아트와 비슷한 것 같다. 메타버스나 3D 공간에 비해서는 볼품없는 작은 공간이지만, 유저들이 좋아하는 음악과 오브젝트를 배치할 수 있게 제작해서 특유의 편안함과 따뜻한 느낌을 줄 수 있는 공간을 제공하고 싶다.'

이렇게 '**유저에게 자신만의 취향이 담긴 음악과 오브젝트로 꾸밀 수 있는 작업실을 제공하고 싶다**'라는 메세지가 생겼고, 그리하여 프로젝트 이름을 "**당신의 작업실**"로 짓게 되었습니다.

## 디자인 작업

'**작업실**'이란 공간이고, 작업실의 모든 사물들은 저마다 **용도**가 있습니다. 이번 프로젝트의 테마를 작업실로 설정했으니, **작업실의 구성할 가구들에게도 저마다의 용도를 부여**하는 것이 좋을 것이라 생각했습니다. 그냥 이미지의 가구로 존재하는 것이 아니라 클릭했을 때 로그인을 할 수 있다든지, 클릭을 하면 어떤 화면을 보여준다든지, 그렇게 유저와 상호작용할 수 있도록 **가구에게 사이트의 주요 메뉴를 부여**했습니다. 그리고 처음에는 다른 웹 뮤직 플레이어가 그렇듯 일반적인 사이드바와 헤더를 넣으려고 했습니다.

- 헤더와 사이드바가 포함된 초기 디자인
![haeder](https://github.com/ha-il/project-pixel/assets/108077643/d8f8698c-bd2a-4b63-ae62-85a4fb03d940)

하지만 그렇게 디자인하니 작업실 공간이 굉장히 답답해보였습니다. 작업실 공간 자체도 오브젝트가 많은데 사이드바와 헤더까지 들어가니 복잡해보였습니다. "**공간이나 이미지 그리고 UI까지 한꺼번에 보여주되 깔끔하게 디자인 하는 방법 뭐 없을까?**"라는 고민을 하던 도중 **아이패드**가 떠올랐습니다. 아이패드의 UI를 자세히 살펴보니 하단의 앱 독(dock)으로 UI를 최소화하고, 상단에는 시간이나 베터리 같은 최소한의 정보만 표시하니까 아이패드의 배경화면이 시원하게 보여졌습니다. 보여지는 화면 외의 기능들은 양 옆으로 숨겨두기도 했습니다. 이렇게 아이패드의 화면 디자인은 제가 고민하던 문제를 해결해주기도 했지만, **사람들에게도 이미 익숙한 디자인**이기 때문에 유저들의 거부감이 적을 것 같았습니다. 그렇게 1차적으로 디자인한 작업물은 아래와 같습니다.

- 헤더와 사이드바를 삭제하고, 삭제된 메뉴를 스마트폰 창과 모니터 창에 부여한 디자인
<img src="https://github.com/ha-il/project-pixel/assets/108077643/88779778-7caf-4ef0-8ff7-c11e1a11e017" width="100%" alt="design"/>

- 스마트폰 아이콘을 클릭하고 모니터를 클릭했을 때 디자인
<img src="https://github.com/ha-il/project-pixel/assets/108077643/86790fe7-bcf2-4917-a558-3945c18f31f6" width="100%" alt="after"/>

주요 메뉴는 가구에 부여하고, 그밖의 메뉴는 스마트폰과 모니터창이라는 모달창에 부여하고 숨겨둬서 헤더와 사이드바를 제거할 수 있었습니다. 그러고나니 제가 표현하고자했던 작업실은 더욱 눈에 잘 들어오고 전반적으로 UI가 깔끔해졌습니다.

## 픽셀아트 작업

그 다음으로는 가구 오브젝트를 채울 픽셀아트 작업을 진행했습니다. 픽셀 아트 툴은 **Aseprite**를 사용했습니다. 

- 이번 프로젝트에 사용한 픽셀아트 작업물
<img src="https://github.com/ha-il/project-pixel/assets/108077643/7eafeb2b-9e8c-40e5-99ee-e9f995b68815" width="100%" alt="pixel"/>

평소에 픽셀아트 툴을 다뤄봤다고해도 사실 애니메이션까지 넣어본 것은 이번이 처음이었습니다. 개발에 투입해야 할 시간이 디자인과 픽셀아트 작업에 소비되는 것에 초조함도 들었지만, 그럼에도 이 또한 프로젝트를 개발하는 과정이라 생각하고 즐겁게 임했습니다.


- 픽셀아트 작업에서 가장 공들였던 두 친구

![tv-on](https://github.com/ha-il/project-pixel/assets/108077643/2ee30f4a-b74a-4771-9f50-7b17a0804cb4)
![monitor](https://github.com/ha-il/project-pixel/assets/108077643/ce04ae81-bdc9-4c2f-9337-0fef09abd956)

- 프로젝트에 적용해보니 애니메이션이 너무 정신없어서 아쉽게 뺐던 vscode 픽셀 아트

![monitor-on](https://github.com/ha-il/project-pixel/assets/108077643/8584a3dd-0aac-4f84-98b3-db2194b379f0)


## 프로젝트가 끝난 시점에서 느껴지는 아쉬운 점

이번 프로젝트를 하고나서 **디자인 시스템**의 필요성과 **디자이너**의 필요성을 새삼 느꼈습니다. 이번에 디자인 시스템을 적극 도입하지 않은 이유는 픽셀아트의 특성 때문인데요. 픽셀아트 작업은 **16px** 단위로 작업하는 것이 깔끔하게 제작되고, **팔레트(색상 모음)에 존재하는 색상만을 사용하는 것**이 픽셀아트의 특성을 살리기 때문에, 웹 페이지에서 사용할 단위나 색상도 픽셀아트에 맞게 제한이 된 상태였습니다. **CSS 작업을 할 때도 16px 단위로만 설정하면 될 것이고, 색상도 제한된 64개의 색상에서 고르면 될 것**이라는 생각을 했습니다. 하지만 막상 CSS 작업을 할 때, 그 제한된 팔레트 안에서도 어떤 색상을 프로젝트의 하이라이트 색상으로 사용할 것인지, 어떤 색상을 에러 메시지 색상으로 할 것인지 등에 대해서 고민하게 되었고 그 과정에서 시간이 적지않게 소요되었습니다. '이래서 디자인 시스템이 필요하구나' 라는 생각이 들었습니다. 다른 프로젝트의 디자이너가 작업한 디자인 시안을 볼 수 있었는데, 디자인 시스템은 물론이고 앱에서 발생할 수 있는 모든 상황에 대해서 페이지 디자인이 되어있었습니다. 디자인 감각은 없더라도 **내 앱에서 발생할 수 있는 모든 상황에 대해서 파악하고 그 상황에 맞는 최소한의 디자인** 정도는 미리 계획해둬야겠다는 생각을 하게 되었습니다.

## 기획과 디자인 작업을 마치고

픽셀아트 작업을 마지막으로 기획과 디자인 작업을 마무리 짓고, 본격적으로 기능을 개발해야하는 시기가 다가왔습니다. 하지만, 무엇을 먼저 개발할 것인지, 어떤 기능이 필요한지에 대한 구체적인 내용이 없었습니다. 그래서 내 앱에 필요한 기능을 적어볼 필요가 있었습니다. 따라서 [다음 글](https://ha-il.github.io/side-project/project-pixel/6-domain)에서는 **프로젝트의 요구사항을 정리**했던 내용을 다루겠습니다.