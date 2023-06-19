---
title: "[당신의 작업실] 6. 요구사항 명세 과정"
date: "2023-06-13T12:20:06.000Z"
description: "사용자의 행동 흐름에 따른 요구사항 명세하기"
category: "project"
featuredImage: "../../../../../src/images/sideProject-256x256.png"
mobileImage: "../../../../../src/images/sideProject-512x256x2.png"
---
- 당신의 작업실 프로젝트 링크: https://pixel-workroom.herokuapp.com/
- 프로젝트 깃허브 저장소 링크 : https://github.com/ha-il/project-pixel

## 요구사항 명세는 왜 했는가?

지금까지 프로젝트 [개발 환경 설정](https://ha-il.github.io/side-project/project-pixel/3-boiler-plate/)과 [기획/디자인 과정](https://ha-il.github.io/side-project/project-pixel/5-plan-and-design/)을 거치고 이제 본격적인 개발을 앞둔 상황이었습니다. 하지만, 대체 무엇을 어디서부터 시작해야 할 지 감이 잡히지 않았습니다. "웹 뮤직플레이어니까 일단 뮤직플레이어부터 만들까?"라는 생각도 했지만, '그 뮤직플레이어에 어떤 기능이 있어야 하고', '어떤 버튼을 눌렀을 때 어떤 화면을 보여줄 것인지'에 대해서 전혀 모른채로 개발을 할 수 없겠다는 생각이 들었습니다. 개발에 들어가기 전에 요구사항을 명세하고 가야겠다는 판단을 내렸습니다.

## 모델의 스키마 정의

먼저, 이번 프로젝트에서 모델이 될 수 있는 요소들을 생각해봤습니다. '사용자'에게 작업실을 주고 싶다는 마음으로 시작했으니 '`User`'모델은 반드시 필요했고, 웹 뮤직 플레이어를 만들 것이기 때문에 '`Music`'과 '`Playlist`' 모델도 필요했습니다. 

아래의 예시는 각 모델의 스키마를 정의한 것인데요, 처음부터 아래와 같은 모습은 아니었습니다. **일단 필요하다고 여겨지는 속성들을 먼저 작성**해두고, 요구사항을 명세하는 과정에서 '이 속성도 필요하겠는데?'라는 생각이 들면 **그때마다 추가**해줬습니다.

```javascript
Music = {
  youtubeId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  imageUrl: { type: String },
  duration: { type: String },
  createdAt: { type: Date, required: true, default: Date.now },
};

User = {
  username: { type: String, required: true, unique: true },
  profileName: { type: String, required: true },
  password: { type: String },
  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }],
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
  createdAt: { type: Date, required: true, default: Date.now },
}

Playlist = {
  name: { type: String, required: true, minLength: 1, maxLength: 50 },
  description: { type: String, maxLength: 100 },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  tracks: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Track" },
  ],
  createdAt: { type: Date, required: true, default: Date.now },
}
```

## Router와 API 정의

그 다음으로, 클라이언트에서 유저가 접근할 수 있는 모든 **경로**와, 요청을 보낼 **API**를 정의했습니다. 이 역시 모델과 마찬가지로, 일단 반드시 필요하다고 생각되는 경로 먼저 적어주고, 요구사항을 명세해가면서 경로를 추가해줬습니다.

### Router
```
"/" : 홈페이지
"/login" : 모달창의 로그인 페이지
"/signup": 모달창의 회원가입 페이지
"/playlists/:playlist_id": 플레이리스트 상세 페이지
"/chart": 인기차트 페이지
```
### API
```
post /users/signup   # 회원가입
post /users/login   # 로그인
post /users/logout   # 로그아웃
get /users/playlists/:userId   # 유저의 플레이리스트 불러오기

get /youtube/musics/:musicId   # 유튜브URL로 음악 정보 가져오기

post /musics   # 음악 등록하기
post /musics/:musicId/playcounts   # 재생 수 1 증가
get /musics/chart   # 인기차트 곡 불러오기
get /musics/search/:searchWord   # 음악 검색하기

post /playlists   # 플레이리스트 만들기
get /playlists/:playlistId   # 플레이리스트 불러오기
post /playlists/:playlistId   # 플레이리스트에 음악 추가하기
```

## 요구사항은 사용자의 행동 흐름에 맞춰서 작성

이어서 각 페이지별로 필요한 기능들을 적고 기능들의 요구사항을 적으려고 했습니다. 하지만 '홈페이지에 필요한 기능은 많은데, 그 기능들이 동시에 필요한 것은 아니니까 어떤 기능의 요구사항을 먼저 정의해야 할지 모르겠다.'라는 문제가 생겼습니다. 그래서 생각해낸 방법은 "**페이지별로 요구사항을 적지말고, 사용자의 행동 흐름에 맞게 요구사항을 작성해보자.**"였습니다.

- 페이지 별로 요구사항을 작성하는 방법
```
"/": 홈페이지
- 로그인
  - 사용자가 'PC 모니터'를 클릭하면 '/login'으로 경로를 변경하고 로그인 창 렌더링합니다.
- 인기차트 
  - 사용자가 'TV'를 클릭하면 '/chart'로 경로를 변경하고 로그인 창 렌더링합니다.
- 장식장의 플레이리스트 렌더링하기
  - 사이트에서 추천하는 플레이리스트 3개를 맨 꼭대기에 노출시킵니다.

"/chart": 인기차트 페이지
- ...
- ...
```

- 사용자의 행동 흐름에 따라 요구사항을 작성하는 방법
```
1. 첫 진입
- '/': 홈페이지
  - 사용자가 'PC 모니터'를 클릭하면 '/login'으로 경로를 변경하고 로그인 창 렌더링합니다.

2. 로그인 or 회원가입
- '/login'
  - 로그인 창은 username과 password를 받을 수 있는 인풋이 필요합니다.
  - '로그인하기' 버튼이 필요합니다.
  - '로그인' 버튼 아래 '회원가입' 버튼이 필요합니다.
    - '회원가입' 버튼을 누르면 '/signup'으로 경로를 변경하고 회원가입 창을 렌더링합니다.
  - '로그인' 버튼 또는 엔터를 누르면 `POST /api/users/login` 요청을 보냅니다.
  - 응답이 완료되었다면 '/'으로 렌더링합니다.

- '/sinup'
  - ...
  - ...

3. 로그인 후 홈화면
- '/': 홈페이지
  - 티비 화면에 인기차트와 연결되는 뮤직뱅크 이미지를 띄웁니다.
  - '장식장'
    - '장식장'에는 사이트에서 추천하는 플레이리스트 3개를 맨 꼭대기에 노출시킵니다.
    - 플레이리스트를 클릭하면
      - GET /api/playlists/:playlist_id 요청을 보냅니다.
      - 응답이 완료되었다면 '/playlists/:playlist_id'로 경로를 변경하고 해당 플레이리스트의 상세 페이지를 렌더링합니다.

4. ...
5. ...
```

## 프로젝트가 끝나고 느껴지는 아쉬운 점

일단 요구사항을 명세하는 과정이 **기획 단계**에서 들어갔으면 좋았겠다는 생각을 했습니다. 프로젝트의 전반적인 디자인도 없이 그냥 텍스트만으로 요구사항을 정의하는 것에 어려움을 느껴서 **디자인 작업 후에 요구사항을 명세**했었는데요. 생각해보니 혼자서 작업했으니 이런 흐름이 가능했던 것이지 **실제 디자이너분이 요구사항 명세서도 없이 다지인을 하진 않을텐데**, 제가 디자인 과정을 너무 대충 넘겼다는 생각이 들었습니다. 만약 다음에 또 개인 프로젝트를 진행하게 되면, 먼저 텍스트로(그리고 마크다운 말고 좀 더 정돈된 시트로) **요구사항을 먼저 정의하고**, 그 요구사항을 바탕으로 디자인 작업을 하다가, 정의가 되지 않거나 모호한 요구사항이 있다면 **요구사항을 수정하면서 디자인 작업을 해야겠다**는 생각이 들었습니다.

**사용자의 행동 흐름과 요구사항 명세가 분리될 필요가 있다**고 느꼈습니다. 사용자의 행동의 흐름을 파악하는 것은 도움이 되었지만, 그것을 요구사항 명세와 섞으니 **페이지별로 필요한 기능이 흐름에따라 분산**되어 있어서, **하나의 페이지가 어떤 기능을 가지고 있는지 파악하기가 어려웠습니다**. 개발을 할 때에는 문제가 없고 오히려 편하다는 느낌도 받았지만, 프로젝트 종료 후 다시 살펴보니 읽기가 불편했습니다.

## 요구사항 명세를 마치고

요구사항 명세를 마치고나서는 본격적으로 개발 작업에 돌입했습니다. [다음 글](https://ha-il.github.io/side-project/project-pixel/7-develop)에서는 **개발 과정에서 만난 문제와 해결 과정**에 대한 내용을 다루겠습니다.