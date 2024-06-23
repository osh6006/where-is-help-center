<div align="center" id="top"> 
  <img src="./.github/app.gif" alt="Where Is Help Center" />

&#xa0;

  <!-- <a href="https://foodtruckarea.netlify.app">Demo</a> -->
</div>

<h1 align="center">Where Is Help Center</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/osh6006/where-is-help-center?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/osh6006/where-is-help-center?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/osh6006/where-is-help-center?color=56BEB8">

  <img alt="License" src="https://img.shields.io/github/license/osh6006/where-is-help-center?color=56BEB8">

  <!-- <img alt="Github issues" src="https://img.shields.io/github/issues/{{YOUR_GITHUB_USERNAME}}/food-truck-area?color=56BEB8" /> -->

  <!-- <img alt="Github forks" src="https://img.shields.io/github/forks/{{YOUR_GITHUB_USERNAME}}/food-truck-area?color=56BEB8" /> -->

  <!-- <img alt="Github stars" src="https://img.shields.io/github/stars/{{YOUR_GITHUB_USERNAME}}/food-truck-area?color=56BEB8" /> -->
</p>

<!-- Status -->

<!-- <h4 align="center">
	🚧  Food Truck Area 🚀 Under construction...  🚧
</h4>

<hr> -->

<p align="center">
  <a href="#dart-프로젝트-소개">프로젝트 소개</a> &#xa0; | &#xa0; 
  <a href="#rocket-개발-환경">개발 환경</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-필수-사항">필수 사항</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-시작하기">시작하기</a> &#xa0; | &#xa0;
  <a href="#hammer-채택-기술">채택 기술</a> &#xa0; | &#xa0;
  <a href="#sparkles-페이지-별-기능">페이지 별 기능</a> &#xa0; | &#xa0;
  <a href="#:pencil2:-프로젝트를-통해-배운-점">프로젝트를 통해 배운 점</a> &#xa0; | &#xa0;
  <a href="#construction-트러블-슈팅">트러블 슈팅</a> &#xa0; | &#xa0;
  <a href="#roller_coaster-개선해야-할-사항">개선해야 할 사항</a> &#xa0; | &#xa0;
  <a href="#memo-라이센스">라이센스</a> &#xa0; | &#xa0;
  <a href="https://github.com/osh6006" target="_blank">작성자</a>
</p>

<br>

## :dart: 프로젝트 소개

코로나 예방 접종 센터 찾기 사이트는 사용자가 가장 가까운 예방 접종 센터를 쉽게 찾을 수 있도록 도와줍니다. 정확한 위치 정보와 센터 별 운영 시간, 제공되는 서비스 등을 제공하여 안전하고 빠른 예방 접종을 받을 수 있도록 지원합니다. 

[Demo <-여기에서 프로젝트를 확인하세요](https://where-is-center.netlify.app/)

## :rocket: 개발 환경

이 프로젝트에는 다음의 기술 및 도구가 활용 되었습니다.

![Github](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![HTML](https://img.shields.io/badge/HTML-239120?style=for-the-badge&logo=html5&logoColor=white)
![SCSS](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Javascript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white)
![firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
![NaverMap](https://github.com/osh6006/where-is-help-center/assets/56256924/e2aa95e4-c1be-4729-aaec-c4a3922f59e2)

## :white_check_mark: 필수 사항

⭐ 프로젝트를 시작하기 전에 `Git`와 `NodeJS`를 설치해 주세요 ⭐\
⭐ env 파일을 확인해 주세요 ⭐

## :checkered_flag: 시작하기
```bash
# 프로젝트를 복제하세요
$ git clone https://github.com/osh6006/where-is-help-center

# 접근
$ cd where-is-help-center

# dependencies를 다운 받으세요
$ npm i

# 프로젝트를 실행 하세요
$ npm run dev

# The server will initialize in the <http://localhost:1234>
```
## :hammer: 채택 기술

- SCSS
  - 변수, 중첩, 믹스인 등의 기능을 통해 CSS를 효율적이고 재사용 가능하게 작성함으로써 프로젝트의 유지보수성과 관리 효율성을 높힐 수 있기 때문에 채택 하였습니다.
- Firebase
  - 실시간 데이터 동기화, 간편한 사용자 인증, 서버 관리 필요 없는 배포 등 다양한 기능을 통해 개발을 더 빠르고 쉽게 할 수 있기 때문에 채택 하였습니다.

## :sparkles: 페이지 별 기능

메인 페이지

- 공공 데이터 포털로 코로나 예방 접종 센터의 위치 데이터를 받아와 naver map api에 마커 클러스터링 하였습니다.

[녹음-2024-06-23-050142.webm](https://github.com/osh6006/where-is-help-center/assets/56256924/9b52e0ed-12ea-4a04-8197-d35afe359806)


- Firebase를 사용하여 소셜 로그인 구현

[2.webm](https://github.com/osh6006/where-is-help-center/assets/56256924/e044fbdf-3cd7-4a6c-9372-dbd28350cbb0)


- 주소 검색 시 맵 이동

[123.webm](https://github.com/osh6006/where-is-help-center/assets/56256924/4825f5cc-914d-4d40-86a5-6c3624785acf)


- 로그인 시 좋아요 표시 된 센터 목록 저장 및 조회

[ㅋㅋㅋ.webm](https://github.com/osh6006/where-is-help-center/assets/56256924/605da1e0-7e28-4f9c-915a-dceadad450e4)

## :pencil2: 프로젝트를 통해 배운 점

- SCSS 의 변수, 중첩, 믹스인 등의 기능을 통해 CSS를 효율적이고 재사용 가능하게 작성하는 방법을 배울 수 있었습니다.
- 파이어베이스에서 받아온 유저의 데이터를 로컬 스토리지에 저장하여 로그인을 유지하는 법을 알 수 있었습니다.
- naver map api의 맵 마커를 커스텀으로 디자인 하는 방법, 지도에 마커가 많을 시 클러스터링으로 마커를 한 곳으로 모아주는 방법을 배울 수 있었습니다.
- MDN, naver map api, SCSS등의 공식 문서를 보고  프로젝트에 적용하는 법을 배울 수 있었습니다.
- Netrify로 간단하게 내 프로젝트를 배포하는 법을 배울 수 있었습니다.

## :construction: 트러블 슈팅

## :roller_coaster: 개선해야 할 사항

Made with :heart: by <a href="https://github.com/osh6006" target="_blank">osh6006</a>

&#xa0;

<a href="#top">Back to top</a>
