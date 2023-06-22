---
title: "[당신의 작업실] 번외. 리팩터링과 기능 추가"
date: "2023-06-22T22:50:00.000Z"
description: "플레이리스트 페이지를 리팩터링한 과정을 공유합니다."
category: "project"
featuredImage: "../../../../../src/images/sideProject-256x256.png"
mobileImage: "../../../../../src/images/sideProject-512x256x2.png"
---
- 당신의 작업실 프로젝트 링크: https://pixel-workroom.herokuapp.com/
- 프로젝트 깃허브 저장소 링크 : https://github.com/ha-il/project-pixel

## 들어가기 전에 

[지난 글](https://ha-il.github.io/side-project/project-pixel/10-ending/)에서 "앞으로 하고 싶은 일"의 첫 번째로 **프로젝트 리팩터링**을 꼽기도 했고, 배포 후에도 "당신의 작업실"을 개인적으로 이용해보면서 여러 불편한 점을 발견했기 때문에, "당신의 작업실"의 기능 추가와 리팩터링을 진행했습니다.

이번 글은 그 리팩터링 과정과 새롭게 추가한 기능을 소개하도록 하겠습니다.


## 1. 플레이리스트 페이지 리팩터링

먼저, 저의 플레이리스트 페이지는 `Playlist` 컴포넌트를 렌더링한 것입니다. 리팩터링 전에 `Playlist` 컴포넌트는 여기에 소개하기도 부끄러울 정도로 지저분한 상태였습니다. 하지만, 보여드리지 않고서는 리팩터링 과정을 보여드릴 설명하기가 어려우니 아래 코드로 공개하겠습니다. (매우 깁니다! 빠르게 넘기셔도 됩니다!)

```javascript
class Playlist extends Component {
  template() {
    return `
      <div class="playlist-container">
        <button type="button" class="back-button">↩</button>
        <div class="info-container">
          ${
            this.state.playlist
              ? this.state.playlist.musics[0]
                ? `<img class="image" src="${this.state.playlist.musics[0].imageUrl}"/>`
                : '<div class="image"><i class="fa-solid fa-music"></i></div>'
              : '<div class="image"><i class="fa-solid fa-music"></i></div>'
          }
          <div class="info">
            <div class="name">${
              this.state.playlist
                ? this.state.playlist.name
                : "플레이리스트를 불러오고 있습니다..."
            }</div>
            <div class="profileName">${
              this.state.playlist
                ? this.state.playlist.owner.profileName
                : "..."
            }</div>
            <div class="duration">${
              this.state.playlist ? this.state.playlist.musics.length : "0"
            }곡</div>
            <div class="description">${
              this.state.playlist ? this.state.playlist.description : "..."
            }</div>
            <button type="button" class="play-button">재생</button>
          </div>
        </div>
        <div class="current-music-list music-list-container">
          ${
            this.state.playlist
              ? this.state.playlist.musics.length === 0
                ? "<div>음악을 추가해보세요!</div>"
                : this.state.playlist.musics
                    .map((music) => {
                      return `
                      <div class="music-container">
                        <img class="image" src="${music.imageUrl}"/>
                        <div class="title">${music.title}</div>
                        <div class="artist">${music.artist}</div>
                        <div class="duration">${convertMillisecondsToTime(
                          convertTimeToMilliseconds(music.duration)
                        )}</div>
                      </div>
                    `;
                    })
                    .join("")
              : "플레이리스트의 음악을 불러오는 중입니다..."
          }
        </div>
        <div class="search-container">
          <form method="get" id="music-search-form">
            <div class="form-input">
              <label for="searchWord">검색하기: </label>
              <input
                id="searchWord"
                name="searchWord"
                type="text"
                placeholder="검색하고 싶은 곡의 제목을 입력해주세요"
                maxlength="30"
                required
              />
            </div>
            <input type="submit" value="검색" />
          </form>
        </div>
        <div class="music-list-title">${
          this.state.listTitle ? this.state.listTitle : "인기차트 곡 추가하기"
        }</div>
        <div class="recommended-music-list music-list-container">
          ${
            this.state.chartMusics
              ? this.state.chartMusics
                  .map((music) => {
                    return `
                      <div class="music-container">
                        <img class="image" src="${music.imageUrl}"/>
                        <div class="title">${music.title}</div>
                        <div class="artist">${music.artist}</div>
                        <button type="button" class="add-music-button" data-musicid=${
                          music._id
                        }>+</button>
                        <div class="duration">${convertMillisecondsToTime(
                          convertTimeToMilliseconds(music.duration)
                        )}</div>
                      </div>
                    `;
                  })
                  .join("")
              : "인기 차트 음악을 불러오는 중입니다..."
          }
        </div>
      </div>
    `;
  }

}
```
매우 길죠? 부끄럽습니다. 심지어 이것은 플레이리스트 페이지의 뼈대만 보여드리기 위해서 `template()`만 가져온 것이기 때문에 데이터를 가져오거나 이벤트를 추가하는 메서드의 코드는 빠진 상태입니다. 누가봐도 리팩터링이 필요해보입니다.

위의 코드가 렌더링되면 아래와 같은 상세 페이지가 나오는데, 상세 페이지는 아래 이미지와 같이 크게 **네 영역**으로 나뉘어집니다.

<img src="https://github.com/ha-il/project-pixel/assets/108077643/5c70ca9d-2278-4c6a-84a0-87757d9d6373" width="100%" alt="playlist-area"/>

이 네 가지 영역을 각각의 컴포넌트로 만드는 것이 좋을 것 같았습니다.

1. 현재 플레이리스트 정보: `CurrentPlaylist`
2. 플레이리스트 곡 목록: `CurrentMusicList`
3. 곡 검색 영역: `SearchArea`
4. 인기차트 OR 검색 곡 목록: `RecommendedMusicList`

### 1.1 각각의 컴포넌트 만들기

1. 현재 플레이리스트 정보: `CurrentPlaylist`
```javascript
class CurrentPlaylist extends Component {
  template() {
    const { playlist } = this.props;
    return `
      ${
        playlist
          ? playlist.musics[0]
            ? `<img class="image" src="${playlist.musics[0].imageUrl}"/>`
            : '<div class="image"><i class="fa-solid fa-music"></i></div>'
          : '<div class="image"><i class="fa-solid fa-music"></i></div>'
      }
      <div class="info">
        <div class="name">${
          playlist ? playlist.name : "플레이리스트를 불러오고 있습니다..."
        }</div>
        <div class="profileName">${
          playlist ? playlist.owner.profileName : "..."
        }</div>
        <div class="duration">${playlist ? playlist.musics.length : "0"}곡</div>
        <div class="description">${
          playlist ? playlist.description : "..."
        }</div>
        <div class="playlist-buttons">
          <button type="button" class="play-button">재생</button>
          <button type="button" class="edit-button">편집</button>
        </div>
      </div>
    `;
  }
}

export default CurrentPlaylist;
```

2. 플레이리스트 곡 목록: `CurrentMusicList`
```javascript
class CurrentMusicList extends Component {
  template() {
    const { playlist } = this.props;
    return `
      ${
        playlist
          ? playlist.musics.length === 0
            ? "<div>음악을 추가해보세요!</div>"
            : playlist.musics
                .map((music) => {
                  return `
                  <div class="music-container">
                    <img class="image" src="${music.imageUrl}"/>
                    <div class="title">${music.title}</div>
                    <div class="artist">${music.artist}</div>
                    <button type="button" class="remove-music-button" data-musicid=${
                      music._id
                    }>-</button>
                    <div class="duration">${convertMillisecondsToTime(
                      convertTimeToMilliseconds(music.duration)
                    )}</div>
                  </div>
                `;
                })
                .join("")
          : "플레이리스트의 음악을 불러오는 중입니다..."
      }
    `;
  }
}

export default CurrentMusicList;
```

3. 곡 검색 영역: `SearchArea`
```javascript
class SearchArea extends Component {
  template() {
    const { isSearched, listTitle } = this.props;
    return `
      <div class="search-container">
      <form method="get" id="music-search-form">
        <div class="form-input">
          <label for="searchWord">검색하기: </label>
          <input
            id="searchWord"
            name="searchWord"
            type="text"
            placeholder="검색하고 싶은 곡의 제목을 입력해주세요"
            maxlength="30"
            required
          />
        </div>
        <input type="submit" value="검색" />
        <input type="button" id="backChartBtn" value="인기차트" class=${
          isSearched ? "" : "hidden"
        } />
      </form>
      </div>
      <div class="music-list-title">${
        listTitle ? listTitle : "인기차트 곡 추가하기"
      }</div>
    `;
  }
}

export default SearchArea;
```

4. 인기차트 OR 검색 곡 목록: `RecommendedMusicList`
```javascript
class RecommendedMusicList extends Component {
  template() {
    const { recommendMusics } = this.props;
    return `
      ${
        recommendMusics
          ? recommendMusics
              .map((music) => {
                return `
                  <div class="music-container">
                    <img class="image" src="${music.imageUrl}"/>
                    <div class="title">${music.title}</div>
                    <div class="artist">${music.artist}</div>
                    <button type="button" class="add-music-button" data-musicid=${
                      music._id
                    }>+</button>
                    <div class="duration">${convertMillisecondsToTime(
                      convertTimeToMilliseconds(music.duration)
                    )}</div>
                  </div>
                `;
              })
              .join("")
          : "인기 차트 음악을 불러오는 중입니다..."
      }
    `;
  }
}

export default RecommendedMusicList;
```

### 1.2 Playlist 컴포넌트에 각각의 컴포넌트 추가하기

생성한 컴포넌트를 Playlist 컴포넌트에 추가하기 위해서, 먼저 각 컴포넌트가 추가될 영역을 `template()`에 작성합니다.
```javascript
class Playlist extends Component {
  template() {
    return `
      <div class="playlist-container">
        <button type="button" class="back-button">↩</button>
        <div id="info-container" class="info-container"></div>
        <div id="current-music-list" class="current-music-list music-list-container"></div>
        <div id="search-area"></div>
        <div id="recommended-music-list" class="recommended-music-list music-list-container"></div>
      </div>
    `;
  }
}
```
그 다음은, `addComponent()`에 각 컴포넌트를 생성하는데, 이 때 각 컴포넌트가 추가될 영역을 타겟으로 전달합니다.

그리고 각 컴포넌트에서 필요로하는 `prop`도 빠짐없이 전달합니다.
```javascript
class Playlist extends Component {
  template() {
    return `
      <div class="playlist-container">
        <button type="button" class="back-button">↩</button>
        <div id="info-container" class="info-container"></div>
        <div id="current-music-list" class="current-music-list music-list-container"></div>
        <div id="search-area"></div>
        <div id="recommended-music-list" class="recommended-music-list music-list-container"></div>
      </div>
    `;
  }
  addComponent() {
    const { playerSetState } = this.props;

    new CurrentPlaylist($("#info-container"), {
      playlist: this.state.playlist,
      playerSetState,
    });

    new CurrentMusicList($("#current-music-list"), {
      playlist: this.state.playlist,
      playlistSetState: this.setState.bind(this),
    });

    new RecommendedMusicList($("#recommended-music-list"), {
      playlist: this.state.playlist,
      recommendMusics: this.state.recommendMusics,
      playlistSetState: this.setState.bind(this),
    });

    new SearchArea($("#search-area"), {
      isSearched: this.state.isSearched,
      listTitle: this.state.listTitle,
      chartMusics: this.state.chartMusics,
      playlistSetState: this.setState.bind(this),
    });
  }
}

export default Playlist;
```

최종적으로 정리된 코드를 보면, 처음에 소개드렸던 아주 긴 코드에 비해서 상당히 간결해진 것을 확인할 수 있습니다.

이렇게 작성했을 때의 장점은 코드가 깔끔해진 것도 있지만, 플레이리스트 페이지에서 발생하는 많은 이벤트를 각 컴포넌트에 따로 작성할 수 있어서, 코드를 수정할 때 빠르게 해당 코드를 찾아갈 수 있었습니다. 

## 2. 추가 기능

코드를 정리하는 리팩터링 작업 외에도, 구현하지 못 해서 아쉬웠던 기능들을 추가해봤습니다. 특히, 음악이나 플레이리스트를 **추가**하는 것만 생각해서 제대로된 CRUD 기능을 구현하지 못 했던 것이 마음에 많이 걸렸는데 이번 기회에 플레이리스트의 **CRUD**를 중점적으로 구현해봤습니다.

### 2.1 플레이리스트 편집

플레이리스트의 제목과 설명을 편집할 수 있습니다. 편집을 완료해도 새로고침은 발생하지 않기 때문에 음악도 끊기지 않습니다.

<img src="https://github.com/ha-il/project-pixel/assets/108077643/71fde65b-21c4-4309-a211-3185ce78ae50" width="100%" alt="edit-playlist"/>

### 2.2 플레이리스트 삭제

플레이리스트 전체를 삭제할 수 있습니다. 플레이리스트를 삭제하면 홈 화면으로 이동합니다.

<img src="https://github.com/ha-il/project-pixel/assets/108077643/fa300550-c953-4bd4-b59c-7aefb1ac0328" width="100%" alt="remove-playlist"/>

### 2.3 플레이리스트의 곡 삭제

현재 플레이리스트에 들어있는 곡을 삭제할 수 있습니다.

<img src="https://github.com/ha-il/project-pixel/assets/108077643/9dd9c8fd-8766-4868-9171-6202940cf6f7" width="100%" alt="remove-music"/>

### 2.4 플레이리스트에서 음악 검색 후 인기차트 곡 다시 띄우기

플레이리스트 페이지 하단에서는 인기차트 곡을 띄워서 유저에게 곡을 추천합니다. 

검색을 할 경우 인기차트 곡들이 사라지고 검색어와 관련된 곡들이 뜨는데, 다시 인기차트를 확인하고 싶은 경우가 있어서 추가했습니다.

<img src="https://github.com/ha-il/project-pixel/assets/108077643/13cb86bd-50ce-49f1-8378-0ca9aa29d505" width="100%" alt="back-to-chart"/>

### 2.5 스마트폰 오브젝트 앱 설명 추가

기존 앱 아이콘만으로는 기능을 제대로 안내하지 못 하는 것 같아 메시지와 애니메이션을 추가했습니다.

<img src="https://github.com/ha-il/project-pixel/assets/108077643/372ead3a-ab9c-49b2-9455-9a40d1b65f78" width="100%" alt="phone-animation"/>

## 마치며

사실 이번 리팩터링과 추가 기능 작업을 마지막으로 이 프로젝트는 완전히 종료하려고 했습니다. "당신의 작업실"이라는 정체성을 계속 가져가려면 홈 화면에 있는 가구 오브젝트들을 유저가 원하는 디자인으로 바꿀 수 있어야 한다고 생각합니다. 그러나 그 작업에는 프로그래밍 작업이 필요한 것이 아니라 픽셀아트 작업이 필요한데, 요즘은 개발 공부에 많은 시간을 할애하고 있어서 픽셀아트 작업을 따로 시간내서 하기가 너무 어려웠습니다.

하지만 이번에 추가 기능 작업을 하면서 뭔가 계속 추가되고 발전되가는 모습이 이 프로젝트에서 보여지니까 재미도 있고, 더 완성시키고 싶다는 생각도 들었습니다. 무엇보다 여태껏 학습을 목적으로 만들었던 개인 프로젝트는 학습이 끝남과 동시에 거의 들어가보지도 않았는데, 이번에 제작한 "당신의 작업실"은 지금 이 시점까지도 종종 들어가서 음악을 듣기도 하는 걸 보니, 이 프로젝트에 꽤 애착이 생긴 것 같습니다.

당장 업데이트를 하기는 어렵겠지만, 픽셀아트를 다시 할 수 있게되거나, "당신의 작업실"을 이용하면서 아이디어가 또 생기면 기능을 추가해볼 생각입니다. 지금 운영하고 있는 이 블로그처럼 "당신의 작업실" 또한 긴 호흡으로 운영해볼 생각입니다.

이것으로 "당신의 작업실" 프로젝트 관련 포스팅은 정말 마지막입니다.

지금까지 읽어주셔서 정말 감사합니다!