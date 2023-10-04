---
title: "[타입스크립트] 타입 조작"
date: "2023-09-21T23:11:00.000Z"
description: "타입스크립트의 유틸리티 타입, 맵드 타입을 다룹니다."
category: "typescript"
featuredImage: "../../../../src/images/ts-256x256.png"
mobileImage: "../../../../src/images/ts-512x256x2.png"
---

## 1. 유틸리티 타입(utility type)

유틸리티 타입은 이미 정의되어 있는 타입 구조를 변경하여 재사용하고 싶을 때 사용하는 타입이다. 타입스크립트에서 미리 정의해 놓은 내장 타입이다. 따라서 아래와 같이 타입스크립트 설정 파일의 lib 속성을 변경해주면 사용할 수 있다.

```ts
{
  "compilerOptions": {
    "lib": ["ESNext"], // ESNext: 최신 자바스크립트 문법을 의미
  },
}
```
아래에서 다룰 유틸리티 타입을 포함한 타입스크립트의 모든 유틸리티 타입은 [TypeScript-Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)에서 확인할 수 있다.

### 1.1 Pick 유틸리티 타입

Pick 유틸리티 타입은 특정 타입의 속성을 뽑아서 새로운 타입을 만들어 낼 때 사용한다. 객체 형태의 타입반 대상 타입으로 취급할 수 있다.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}
// Pick으로 속성을 추출하여 타입 정의
type UserName = Pick<User, 'name'>;
// 여러개 추출하여 타입 정의도 가능
type UserInfo = Pick<User, 'name' | 'email'>;

const hail: UserName = {
  name: '하일',
};
const taesan: UserInfo = {
  name: '태산',
  email: 'taesan@gmail.com',
};
```

### 1.2 Omit 유틸리티 타입

Omit 타입은 특정 타입에서 속성 몇 개를 제외한 나머지 속성으로 새로운 타입을 생성할 때 사용하는 유틸리티 타입이다. 객체 형태의 타입반 대상 타입으로 취급할 수 있다. Pick 타입과 정확히 반대의 역할을 한다.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}
// Omit으로 특정 속성을 제외하여 타입 정의
type UserProfile = Omit<User, 'id'>;
// 여러개를 제외하여 타입 정의도 가능
type UserId = Omit<User, 'name' | 'email'>;

const hail: UserProfile = {
  name: '하일',
  email: 'hail@gmail.com',
};

const myId: UserId = {
  id: 1,
};
```
### 1.3 Partial 유틸리티 타입

Partial 타입은 특정 타입의 모든 속성을 모두 옵션 속성으로 변환한 타입을 생성해준다. 객체 형태의 타입반 대상 타입으로 취급할 수 있다.

```ts
interface User {
  id: number;
  name: string;
}

type PartialUser = Partial<User>;

const emptyUser: PartialUser = {};
const onlyIdUser: PartialUser = { id: 1 };
const onlyNameUser: PartialUser = { name: '하일' };
const fullUser: PartialUser = { id: 1, name: '하일' };
```

주로 HTTP PUT처럼 데이터를 수정하는 REST API를 전송할 때 종종 사용된다. 예를 들어 유저의 프로필을 업데이트하는 `updateUserProfile`이라는 함수가 있다고 가정해보자. 이 함수는 유저 프로필에서 업데이트할 정보를 파라미터로 받는다. 유저의 프로필에는 유저네임, 이메일 등 다양한 속성이 있다. 프로필을 업데이트할 때 반드시 모든 속성을 변경하는 것은 아니다. 때로는 유저네임만, 때로는 유저네임과 이메일을 같이 수정할 수도 있다. 이런 모든 경우의 수에 맞춰서 함수의 파라미터 타입을 지정해주는 일은 번거로운 일이다. 이 때 아래와 같이 Partial 타입을 사용하면 속성을 선택적으로 재사용할 수 있다. 

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

function updateUserProfile(user: Partial<User>) {
  // ...
}

```

### 1.4 Exclude 유틸리티 타입

Exclude 타입은 유니언 타입을 구성하는 특정 타입을 제외할 때 사용한다.

```ts
type BaseballPosition = 'Pitcher' | 'Catcher' | 'Batter';
type OnlyBattery = Exclude<BaseballPosition, 'Batter'>;
// type OnlyBattery = "Pitcher" | "Catcher"
type OnlyPitcher = Exclude<BaseballPosition, 'Catcher' | 'Batter'>;
// type OnlyPitcher = "Pitcher"
```

### 1.5 Record 유틸리티 타입

Record 타입은 타입 1개를 속성의 키로 받고 다른 타입 1개를 속성 값으로 받아 객체 타입으로 변환해준다. 속성의 키로 받을 타입에는 string, number, string 유니언, number 유니언 타입 등이 들어갈 수 있다. 값으로 받을 타입은 아무 타입이나 들어갈 수 있다.

```ts
type BaseballPosition = 'Pitcher' | 'Catcher' | 'Batter';
type BaseballPlayer = {
  name: string;
  backNumber: number;
};

type Monsters = Record<BaseballPosition, BaseballPlayer>;

const monsters: Monsters = {
  Pitcher: {
    name: '정현수',
    backNumber: 57,
  },
  Catcher: {
    name: '윤준호',
    backNumber: 22,
  },
  Batter: {
    name: '원성준',
    backNumber: 7,
  },
};
```
유니언 타입과 객체 타입보다 더 단순한 형태의 데이터 타입을 활용하는 것도 가능하다.

```ts
type Menu = Record<string, number>

const coffeMenu:Menu = {
  americano: 4500,
  latte: 5000
}
```

## 2. 맵드 타입(mapped type)

이미 정의된 타입을 가지고 새로운 타입을 생성할 때 사용하는 타입 문법을 의미한다. 유틸리티 타입은 맵드 타입을 이용해서 구현되었다.

맵드 타입은 주로 `in`과 `keyof`를 조합해서 사용한다. 

- P `in` A: A 객체의 속성을 순회한다. (자바스크립트의 for in 반복문과 유사하다.)
- `keyof` A: A 타입의 키 값을 추출해서 문자열 유니언 타입으로 변환해준다.

두 키워드를 사용한 맵드 타입 예시는 아래와 같다. 

```ts
// 이미 정의된 BaseballPlayer 타입
type BaseballPlayer = {
  id: number;
  backNumber: number;
};

// 맵드 타입을 활용해서 새로운 Player 타입 생성
type Player = {
  [B in keyof BaseballPlayer]: string;
};

// 새로운 Player 타입 적용
const hail: Player = {
  id: '1',
  backNumber: '99',
};
```

### 2.1 매핑 수정자(mapping mnodifier)

매핑 수정자는 맵드 타입을 변환할 때 속성 성질을 변환할 수 있도록 도와주는 문법이다.

수정자: `?`, `readonly`
접두사: `+`, `-` (수정자를 추가 제거하는 데 사용. 접두사 추가 안 할시 +로 간주)

맵드 타입에 `?` 수정자를 추가하여 새로운 타입을 만드는 예시를 살펴보자.

```ts
type BaseballPlayer = {
  id: number;
  backNumber: number;
};

// '?' 수정자 추가
// 접두사 없을 시 '+'로 간주
type Player = {
  [B in keyof BaseballPlayer]?: string;
};
/* 현재 Player 타입 상황
  type Player = {
    id?: string | undefined;
    backNumber?: string | undefined;
}
*/

// 아무 속성이 없어도 에러가 발생하지 않음
const hail: Player = {};
```

이번에는 `-?`로 기존의 옵셔널 속성을 필수 속성으로 바꿔보자.

```ts
// BaseballPlayer의 모든 속성은 옵셔널 속성이다.
type BaseballPlayer = {
  id?: number;
  backNumber?: number;
};

// '-' 접두사와 '?' 수정자를 추가했다. 
type Player = {
  [B in keyof BaseballPlayer]-?: string;
};

/* 현재 Player 타입 상황
  type Player = {
    id: string;
    backNumber: string;
}
*/

// 에러 발생: Type '{}' is missing the following properties from type 'Player': id, backNumber
const hail: Player = {};
```