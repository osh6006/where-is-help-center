import { AddressRops, CenterRops } from "../utils/apiOptions";

// 지도에서 처음에 보여질 구역 선언
const map = new naver.maps.Map("map", {
  center: new naver.maps.LatLng(37.3595704, 127.105399),
  zoom: 15,
});

const markers = new Array(); // 마커 정보를 담는 배열
const infoWindows = new Array(); // 정보창을 담는 배열

Promise.all([getCenterData()]).then(result => {
  // 데이터로 맵 초기화
  console.log(result[0].data);
});

Promise.all([addressToCoordinate("불당동")]).then(result => {
  // 데이터로 맵 초기화
  console.log(result);
});

// for (let i = 0; i < 2; i++) {
//   console.log("start");
//   console.log(markers[i], getClickHandler(i));
//   naver.maps.Event.addListener(markers[i], "click", getClickHandler(i));
// }

// 공공 API에서 코로나 예방접종 센터를 불러온다.
function getCenterData() {
  return fetch(
    `https://api.odcloud.kr/api/15077586/v1/centers?page=1&perPage=285&serviceKey=${process.env.CENTER_API_KEY}`,
    CenterRops
  )
    .then(response => response.json())
    .then(result => Promise.resolve(result))
    .catch(error => console.log("error", error));
}

// 주소를 좌표로 변환하는 함수
function addressToCoordinate(address) {
  return fetch(
    `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${address}`,
    AddressRops
  )
    .then(response => response.json())
    .then(result => Promise.resolve(result))
    .catch(error => console.log("error", error));
}

function makeMarker(item) {
  const x = parseFloat(item.y);
  const y = parseFloat(item.x);

  // 마커 포지션 지정
  const position = new naver.maps.LatLng(x, y);

  // 마커 생성
  const marker = new naver.maps.Marker({
    map: map,
    position: position,
  });

  /* 정보창 */
  let infoWindow = new naver.maps.InfoWindow({
    content:
      '<div style="width:200px;text-align:center;padding:10px;"><b>' +
      "</b><br> - 네이버 지도 - </div>",
  });
  //   console.log(item);
  //   markers.push(marker);
  //   infoWindows.push(infoWindow);
}

// // 주소를 좌표로 변환해서 네이버 맵에 표시하는 함수
// function searchAddressToCoordinate(address) {
//   return naver.maps.Service.geocode(
//     {
//       query: address,
//     },
//     function (status, response) {
//       if (status === naver.maps.Service.Status.ERROR) {
//         if (!address) {
//           return alert("Geocode Error, Please check address");
//         }
//         return alert("Geocode Error, address:" + address);
//       }
//       if (response.v2.meta.totalCount === 0) {
//         return;
//       }
//       // 아이템의 x, y 값으로 마커를 그려준다.
//       const item = response.v2.addresses[0];
//       const x = parseFloat(item.x);
//       const y = parseFloat(item.y);
//       //  makeMarker(item);
//       Promise.resolve(response);
//     }
//   );
// }

function getClickHandler(seq) {
  return function (e) {
    // 마커를 클릭하는 부분
    var marker = markers[seq], // 클릭한 마커의 시퀀스로 찾는다.
      infoWindow = infoWindows[seq]; // 클릭한 마커의 시퀀스로 찾는다

    if (infoWindow.getMap()) {
      infoWindow.close();
    } else {
      infoWindow.open(map, marker); // 표출
    }
  };
}

// inintMap();
