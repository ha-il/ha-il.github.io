---
title: "[CRA 환경설정] AWS S3로 배포한 사이트의 CI/CD 환경 구축하기 with GitHub Actions"
date: "2023-08-28T15:46:00.000Z"
description: "GitHub Actions로 CI/CD 환경을 구축해보자."
category: "typescript"
featuredImage: "../../../../../src/images/ts-256x256.png"
mobileImage: "../../../../../src/images/ts-512x256x2.png"
---

이전 글 ["[CRA 환경설정] Husky 환경 설정"](https://ha-il.github.io/configure/cra-configure/husky-config/)에서 이어지는 글입니다.

## 들어가기 전에

지난 글에서는 Husky 설정을 끝으로, 개발 환경에서의 환경설정을 완료했다. 이번 글에서는 AWS S3로 배포한 정적 사이트의 CI/CD 환경 설정 과정을 다뤄보려고 한다. 배포를 자동화하는 과정을 중점적으로 정리하고 싶기 때문에, AWS S3에 정적 사이트를 배포하는 방법은 다루지 않는다. 

## 1. 배포를 자동화해야하는 이유는?

AWS S3로 배포할 경우 아래와 같은 순서대로 배포가 진행된다. 

변경사항 푸쉬 → 빌드 → S3 버킷 비우기 → 빌드 파일 업로드 → 배포

푸쉬와 빌드는 명령어만 입력하면 되니까 참고 넘어갈 수 있지만, 푸시하고 빌드할 때마다 S3 버킷을 비우러 AWS 웹사이트에 접속해야 한다면 정말 귀찮을 것이다. 일단 빌드와 동시에 배포가 이뤄질 수 있도록 빌드와 배포 과정을 자동화해야할 필요가 있다. 


## 2. 배포를 자동화해보자.

배포 자동화 과정이 잘 이뤄지고 있는지 확인하기 위해, 먼저 현재 S3에 배포되고 있는 내 웹 사이트를 공개한다!

![deploy-one](https://github.com/ha-il/ha-il.github.io/assets/108077643/6c66af96-5d33-4f97-8820-6d5089905ea5)

(~짜잔!~...)


... 여기에 문장을 하나씩 추가해보면서 배포가 잘 진행되고 있는지 확인해보자.



**1. 먼저, aws-cli를 설치하자.**

AWS CLI는 [AWS-Install or update the latest version of the AWS CLI](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions)에서 자신의 운영체제에 맞는 방법으로 설치하면 된다.

설치가 잘 진행 됐다면, `aws --version` 명령어를 터미널에 입력했을 때 aws-cli 버전이 뜰 것이다.

</br>

**2. aws에서 엑세스 키를 만든다.**

aws-cli으로 자신의 인증 정보를 입력하기 위해 필요하다. 엑세스 키는 AWS 웹사이트에 접속하고 로그인을 하면 만들 수 있다. 자세한 과정은 [AWS 계정 및 액세스 키](https://docs.aws.amazon.com/ko_kr/powershell/latest/userguide/pstools-appendix-sign-up.html)를 참고하면 된다.

</br>

**3. `aws configure` 명령어를 입력하여 보안 인증 정보, 리전 및 출력 형식을 빠르게 설정한다.**

명령어를 입력하고 나면 아래 항목이 순서대로 등장하는데, 자신의 상황에 맞게 입력하면 된다.

```
AWS Access Key ID [None]: # 자신의 액세스 키
AWS Secret Access Key [None]: # 자신의 시크릿 액세스 키
Default region name [None]: ap-northeast-2 # 내 기준으로 가장 가까운 리전 선택
Default output format [None]: # 생략해도 됨, 예시에는 json을 사용
```

</br>

**4. `aws s3 ls` 명령어를 입력한다.**

인증이 잘 진행됐다면, 명령어를 입력했을 때 인증 정보를 등록한 계정의 버킷 리스트가 나온다. 나의 경우 버킷의 이름인 cra-config가 나왔다. 

```
2023-08-28 17:59:40 cra-config
```

</br>

**5. aws-cli로 내 빌드 폴더를 버킷에 업로드한다.**

버킷에 폴더를 업로드하는 명령어는 아래와 같다.
```
aws s3 sync 업로드할폴더/ 버킷이름 --delete
```
업로드할 폴더는 자신이 버킷에 업로드할 폴더 이름을 입력하면 된다. 버킷 이름은 `s3://버킷이름`의 형식으로 입력하면 된다. `--delete`는 기존 버킷의 내용을 삭제하고 업로드하는 것이다. 

명령어를 입력하기 전에! 배포가 잘 되고 있는지 확인하기 위해, 변경사항을 추가하고 다시 빌드를 진행했다. 

그리고 아래와 같이 명령어를 작성해서 실행했다.

```
aws s3 sync build/ s3://cra-config --delete
```
그리고 배포 사이트를 다시 가보니 아래와 같이 변경사항이 잘 적용되었다.

![deploy-two](https://github.com/ha-il/ha-il.github.io/assets/108077643/18174595-edc8-4804-bfc3-1410339f1fc2)

(~짜잔2~...)

</br>

**6. 빌드와 동시에 배포가 될 수 있도록 package.json 파일에 deploy라는 스크립트를 만든다.**

aws-cli로 배포하는 방법을 알았으니, 이번에는 빌드와 배포가 동시에 진행될 수 있도록 스크립트를 작성해보자.

```json
{
  "scripts": {
    "build": "react-scripts build",
    "lint": "eslint . --cache",
    "format": "prettier . --write --cache",
    "prepare": "husky install",
    // deploy 추가!
    "deploy": "npm run build && aws s3 sync build/ s3://cra-config --delete",
  },
}
```
변경 사항을 만들고 `npm run deploy`를 실행했더니, 아래와 같이 변경 사항이 잘 적용되었다.

![deploy-three](https://github.com/ha-il/ha-il.github.io/assets/108077643/ed0017fa-1444-4439-b21c-1e339379e032)

(~이쯤 되니 정든다~)

변경사항 푸쉬 → 빌드 → S3 버킷 비우기 → 빌드 파일 업로드 → 배포. 이렇게 총 5단계로 이뤄지던 배포 과정이 변경사항 푸쉬 → 빌드 → 배포, 이렇게 3단계로 줄었고 심지어 빌드 명령어 하나만 입력하면 배포까지 되도록 설정했다. 너무 좋다. 하지만 뭔가 부족한 점이 있다. 이 과정은 오직 내 컴퓨터에서만 실행된다는 점이다. 만약 이것이 팀 프로젝트라면 어떨까? 빌드와 배포가 동시에 진행되도록 만들기 위해 건너온 지난한 과정을 다른 팀원들도 그대로 겪어야 한다. 이런 과정을 팀원들이 겪지 않게 자동화하는 방법은 없을까? 이때 사용되는 개념이 CI/CD이다.


## 3. CI/CD 

- **CI**: Continuous Integration
  - 코드를 테스트해서 유효한지 검증하고 통합하는 과정을 자동화하는 것

- **CD**: Continuous Delivery/Deployment
  - CI를 통해 통합된 코드들을 Production 환경에 배포하는 과정을 자동화하는 것
  - Delivery: 개발환경까지의 배포를 자동화 된 것
  - Deployment: Production 환경의까지의 배포를 자동화 한 것

즉, **CI/CD**는 CI/CD 파이프라인을 구축해서 **빌드, 테스트, 배포 등의 과정을 자동화하는 것**을 의미한다.

### 3.1 CI/CD 플랫폼

CI/CD 플랫폼은 **설치형**과 **클라우드형**으로 나뉜다.

**설치형**은 CI/CD 파이프라인을 구축하는 개발자가 직접 특정 컴퓨터에 CI/CD 플랫폼을 설치해서 활용한다. 대표적인 설치형 CI/CD 플랫폼으로는 Jenkins가 있다.

**클라우드형**은 서비스 제공자가 클라우드에서 CI/CD 플랫폼을 운영해주는 형태이다. 별도의 컴퓨팅 자원에 대한 관리 없이 CI/CD 파이프라인 구축에만 신경 쓸 수 있다. 대표적인 클라우드형 CI/CD 플랫폼으로는 GitHub Actions, Travis CI가 있다.

이번 프로젝트에서는 **GitHub Actions**를 사용해보려고 한다. 깃헙 저장소와의 연동이 간편하고 레퍼지토리 안에서 CI/CD를 함께 구축할 수 있다. 무엇보다 퍼블릭 레퍼지토리는 공짜다.

### 3.2 CI/CD 플랫폼을 사용하기 전에

CI/CD 플랫폼을 사용하기 전에 우선 무엇을 자동화할 것인지 생각해봐야 파이프라인을 구축할 수 있다. 

일단, 나의 경우 이번에는 배포의 자동화를 중점적으로 다루고 싶다. 그래서 deploy 스크립트로 빌드와 배포과정을 통합했다. 하지만 그 조차도 입력하지 않고, **main 브랜치에 푸쉬하기만 하면 빌드와 배포가 자동으로 진행**되었으면 좋겠다. 이 과정을 CI/CD 파이프라인으로 GitHub Actions을 통해 구축해보자.

## 4. GitHub Actions

GitHub Actions를 사용하기 전에 기본적인 용어를 알고가면 이해하기 쉽다. 아래 이미지는 [GitHub Docs-Understanding GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#the-components-of-github-actions)에서 가져왔다.

<img src="https://docs.github.com/assets/cb-25535/mw-1440/images/help/actions/overview-actions-simple.webp" width="100%" alt="The components of GitHub Actions"/>

- **Workflow**
  - GitHun Actions상에서 실행될 자동화된 일련의 작업 흐름을 의미
  - YAML 형식의 파일을 통해서 Workflow를 설정

- **Event**
  - 레파지토리에서 발생하는 push, pull request open, issue open등의 특정한 활동을 의미

- **Runner**
  - workflow를 실행할 서버를 의미

- **Jobs**
  - 하나의 runner에서 실행될 여러 step의 모음을 의미 
  - job안의 step들은 순차적으로 실행 
  - workflow의 job들은 기본적으로 병렬로 실행

- **step**
  - 실행가능한 하나의 shell script 또는 action을 의미

### 4.1 GitHub Actions 초기 설정

본격적으로 GitHub Actions를 이용해 CI/CD 파이프라인을 구축해보자. 참고로 이 과정은 [GitHun Docs-GitHub Actions-Quickstart](https://docs.github.com/en/actions/quickstart)를 참고했다.


**1. 먼저, 루트 디렉터리에 .github/workflows 폴더를 생성한다.**

<br/>

**2. .github/workflows 폴더에 github-actions-demo.yml 파일을 만든다.**

yml 파일의 이름은 마음대로 지어도 된다.

<br/>

**3. github-actions-demo.yml 파일에 아래와 같이 작성한다.**
```yaml
name: GitHub Actions Demo
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
on: [push]
jobs:
  Explore-GitHub-Actions:
    runs-on: ubuntu-latest
    steps:
      - run: echo "🎉 The job was automatically triggered by a ${{ github.event_name }} event."
      - run: echo "🐧 This job is now running on a ${{ runner.os }} server hosted by GitHub!"
      - run: echo "🔎 The name of your branch is ${{ github.ref }} and your repository is ${{ github.repository }}."
      - name: Check out repository code
        uses: actions/checkout@v3
      - run: echo "💡 The ${{ github.repository }} repository has been cloned to the runner."
      - run: echo "🖥️ The workflow is now ready to test your code on the runner."
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}
      - run: echo "🍏 This job's status is ${{ job.status }}."
```

<br/>

**4. git push 이벤트를 발생시키고 깃헙 저장소의 actions 탭에서 action 실행 결과를 확인한다.**

아래 링크에는 깃헙 저장소에서 GitHub Actions의 워크플로우 결과를 확인하는 방법이 나와있다. 아래 링크를 참고하길 바란다.

[GitHub Actions-QuickStart-Viewing your workflow results](https://docs.github.com/en/actions/quickstart#viewing-your-workflow-results)

### 4.2 워크플로우 문법 살펴보기

위에서 다룬 워크플로우 파일은 어디까지나 작동이 되나 확인하는 용도이다. 프로젝트의 배포를 위해서는 조금 더 세부적인 설정이 필요하다. 워크플로우 파일을 세부적으로 설정하려면 문법을 알아야 하는데, 문법의 양도 방대하고 실제로 다 쓰일지도 잘 모르기 때문에, 일단 내가 실제 프로젝트에서 사용해봤던 문법 위주로 정리하려고 한다. 만약 모든 문법 사항이 궁금하다면 [GitHub Actions-Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#about-yaml-syntax-for-workflows)를 참고하기를 바란다.

```yaml
name: GitHub Actions Demo # 워크 플로우 이름
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
# run-name: 깃헙 저장소 actions 탭을 클릭하면 나오는 리스트에 표시되는 이름

on: # 워크플로우를 실행할 이벤트를 정의
  push: # push 이벤트 감지
    branches: # 특정 branch만 지정할 수도 있음
      - main
jobs:
  Explore-GitHub-Actions: # job 이름
    runs-on: ubuntu-latest # runner의 운영체제
    steps:
      - name: Check out repository code  # name: 깃헙에 표시되는 step의 이름
        uses: actions/checkout@v3 # uses: job에 사용할 actions를 step으로 추가
      - run: npm install # run: 운영체제의 셸을 사용하여 명령어를 실행
      - run: npm run test
      - run: npm run build
```
참고로 `uses: actions/checkout@v3`에서 의미하는 **action**은 워크플로우에서 자주 사용되는 기능들을 모아둔 일종의 커스텀 애플리케이션이다. [GitHub Marketplace](https://github.com/marketplace?type=)에서 action을 검색하고 워크플로우에서 활용할 수 있다.

### 4.3 GitHub Actions로 CI/CD 파이프라인 구축하기

Github Actions로 워크플로우를 작성하고 실행하는 방법을 알아봤으니, 본격적으로 CI/CD 파이프라인을 구축해보려 한다. 파이프라인은 아래와 같은 순서로 구성하려 한다.

1. main 브랜치에 푸쉬 하면
2. 의존성을 설치하고(내 깃헙 저장소에는 node-modules가 없으니까)
3. 테스트를 실행하고(아직 기본 테스트 코드지만 CI 과정에 필수적이므로)
4. 빌드하고
5. S3로 배포한다


사실 내가 위에서 문법을 살펴보는 용도로 작성했던 워크플로우 파일은 이미 네번쩨 순서인 빌드 과정까지 설정된 것이다.

```yaml
name: GitHub Actions Demo 
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀

on: 
  push:
    branches: 
      - main # 1. main 브랜치에 푸쉬하면
jobs:
  Explore-GitHub-Actions: 
    runs-on: ubuntu-latest 
    steps:
      - name: Check out repository code  
        uses: actions/checkout@v3 
      - run: npm install # 2. 의존성을 설치하고
      - run: npm run test # 3. 테스트를 실행하고
      - run: npm run build # 4. 빌드하고
      # 5. S3로 배포한다... 는 어딨어?
```
어려운 부분은 배포 과정에 대한 워크플로우 설정이다. 왜냐면 이 부분에는 aws의 엑세스 키가 필요하기 때문이다. aws s3처럼 자주 사용되는 서비스에 대한 step을 정의해야 할 때는 이미 만들어진 action이 있는지 확인해보면 좋다. 

[GitHub Marketplace](https://github.com/marketplace?type=)에서 s3 관련 action을 검색해보니 [S3 Sync](https://github.com/marketplace/actions/s3-sync)라는 action이 나왔다. 사용법을 잘 읽어보고 워크플로우 파일에 적용해보자.

```yaml
name: GitHub Actions Demo 
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀

on: 
  push:
    branches: 
      - main # 1. main 브랜치에 푸쉬하면
jobs:
  Explore-GitHub-Actions: 
    runs-on: ubuntu-latest 
    steps:
      - name: Check out repository code  
        uses: actions/checkout@v3 
      - run: npm install # 2. 의존성을 설치하고
      - run: npm run test # 3. 테스트를 실행하고
      - run: npm run build # 4. 빌드하고
      - uses: jakejarvis/s3-sync-action@master # 5. S3로 배포한다.
        with:
          args: --delete # aws s3 cli에 넘겨줄 옵션
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }} # s3 버킷 이름
          # 절대 여기에 aws 엑세스 키를 직접 입력하면 안 된다!!!!!!!!!!!!!!!!!!!
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }} # aws 액세스 키
          # 절대 여기에 aws 시크릿 엑세스 키를 직접 입력하면 안 된다!!!!!!!!!!!!!!!!!!!
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # aws 시크릿 액세스 키 
          AWS_REGION: 'ap-northeast-2' # aws 리전
          SOURCE_DIR: 'public' # 업로드할 폴더
      
```

**🚨 절대 워크플로우 파일에 직접 aws 엑세스 키와 시크릿 엑세스 키를 입력하면 안 된다! 🚨** 

`${{ secrets. }}`형식의 값들은 워크플로우 파일이 아니라 깃헙 저장소 페이지의 `settings`탭에서 설정해줘야 한다. 설정하는 방법은 [GitHub Actions - Creating encrypted secrets for a repository](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository)를 따라하면 된다.

위와 같이 설정했으면 내가 의도했던 CI/CD 파이프라인 구축은 완성이다. 실제로 테스트를 해보자.

## 4.5 GitHub Actions로 구축한 CI/CD 파이프라인 테스트

현재 aws s3를 통해 배포되고 있는 내 웹사이트는 아래와 같은 상태이다.

![deploy-three](https://github.com/ha-il/ha-il.github.io/assets/108077643/ed0017fa-1444-4439-b21c-1e339379e032)

(~또 너냐~...)

여기에 4번째 문장을 추가하고 커밋한 다음 깃헙 저장소에 푸쉬하면, GitHub Actions가 내 워크플로우 파일을 실행시켜서 자동으로 테스트, 빌드, 배포가 이뤄져야 한다. 확인을 위해서 아래와 같은 과정을 거쳤다.

**1. 변경 사항을 저장하고 깃헙 저장소에 푸쉬한다.**

**2. 깃헙 저장소 페이지의 actions 탭을 확인한다.**

![github-actions](https://github.com/ha-il/cra-config/assets/108077643/775ac44f-ce46-43bb-b6b8-d0b6e7860886)

actions 탭을 보니 사전에 정의한 워크플로우가 잘 진행되었음을 확인할 수 있었다.

**3. AWS S3로 배포되고 있는 정적 사이트에 접속해본다.**

과연 내가 입력한 네번째 문장은 잘 배포되었을까...?

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

![deploy-four](https://github.com/ha-il/cra-config/assets/108077643/1c1d1b2d-9d84-4694-acf5-f35013bdc4a0)

(~짜잔!~...)

이렇게 깃 푸쉬만으로 테스트, 빌드, 배포를 자동으로 진행할 수 있는 CI/CD 파이프라인을 Github Actions로 구축해봤다.

## 마치며

글 제목은 "CI/CD 환경 구축하기"라고 했지만 사실 절반 정도만 구축한 것이다. 왜냐면 CI에 해당하는 테스트 과정이 너무 간소화된 상태로 파이프라인을 구축했기 때문이다. 아직 테스트 코드를 작성해 본 경험이 없기 때문에 이번에는 제대로 다루지 못 했지만, 테스트 코드를 학습하게 되면 CI 과정을 중점으로 새로운 글을 다시 올리겠다.

그동안 타입스크립트, ESLint, Prettier, Husky, AWS, Github Actions 등 생각보다 많은 것을 다뤘다. 이번 시리즈를 작성하면서 느낀 점은 환경 설정이 꽤 재미있다는 것이다. 파고들면 파고들수록 내가 커스텀할 수 있는 요소들이 나오고, 또 그것을 바로 설정해서 프로젝트에 적용시켜 볼 수 있으니 꽤 재미있게 느껴졌다. 그리고 늘 지나가듯이 들어봤던 용어와 기술들을 이번 기회에 제대로 다뤄봐서 속이 좀 시원하다.

아무튼 CRA 환경설정 시리즈는 여기서 마무리 짓겠다.

그럼, 안녕히~👋