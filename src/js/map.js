import { CenterRops } from "../utils/apiOptions";
import { MarkerClustering } from "./MarkerClustering";
import markerURI from "../images/marker.png";
import { readCenterInfo } from "./search";

// 지도에서 처음에 보여질 구역 선언
export const map = new naver.maps.Map("map", {
  center: new naver.maps.LatLng(37.541, 126.986),
  zoom: 10,
});

let markers = new Array(); // 마커 정보를 담는 배열
let infoWindows = new Array(); // 정보창을 담는 배열
let infoArray = new Array();

Promise.all([getCenterData()]).then(result => {
  // 데이터를 받아온 후 마커를 그려줌
  result[0].data.forEach(element => {
    makeMarker(element);
  });
  addMarkerEvent();
  startClustering(markers);
});

// 다중마커 이벤트 리스너 등록하기
naver.maps.Event.addListener(map, "idle", function () {
  updateMarkers(map, markers);
});

function addMarkerEvent() {
  for (let index = 0; index < markers.length; index++) {
    naver.maps.Event.addListener(
      markers[index],
      "click",
      getClickHandler(index)
    );
  }
}

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

// 마커를 받아서 맵에 넣고 클릭리스너 등록
function makeMarker(item) {
  const x = parseFloat(item.lat);
  const y = parseFloat(item.lng);

  // 마커 포지션 지정
  const position = new naver.maps.LatLng(x, y);

  // 마커 생성
  const marker = new naver.maps.Marker({
    map: map,
    position: position,
    icon: {
      content: [
        "<div>",
        `       <img src="${markerURI}" width="27" height="40" alt="병원위치"/>`,
        "</div>",
      ].join(""),
      size: new naver.maps.Size(50, 52),
      origin: new naver.maps.Point(0, 0),
      anchor: new naver.maps.Point(25, 26),
    },
  });

  /* 정보창 */
  let infoWindow = new naver.maps.InfoWindow({
    content:
      '<div style="width:200px;text-align:center;padding:10px;border-radius:20px"><b>' +
      `</b><br/> 주소 : ${item.address}` +
      `<br/> 기관 명 : ${item.centerName}` +
      `<br/> 전화번호 : ${item.phoneNumber}` +
      `<br/> 수정일 :  ${item.phoneNumber}` +
      "</div>",
  });
  markers.push(marker);
  infoWindows.push(infoWindow);
  infoArray.push(item);
}

function updateMarkers(map, markers) {
  var mapBounds = map.getBounds();
  var marker, position;

  for (var i = 0; i < markers.length; i++) {
    marker = markers[i];
    position = marker.getPosition();

    if (mapBounds.hasLatLng(position)) {
      showMarker(map, marker);
    } else {
      hideMarker(map, marker);
    }
  }
}

function showMarker(map, marker) {
  if (marker.setMap()) return;
  marker.setMap(map);
}

function hideMarker(map, marker) {
  if (!marker.setMap()) return;
  marker.setMap(null);
}

// 다수의 마커에 클릭 이벤트 지정하기
// 해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
function getClickHandler(index) {
  return function (e) {
    const marker = markers[index],
      infoWindow = infoWindows[index],
      info = infoArray[index];
    if (infoWindow.getMap()) {
      infoWindow.close();
    } else {
      infoWindow.open(map, marker);
    }
    const point = new naver.maps.LatLng(
      marker.position._lat,
      marker.position._lng
    );
    map.panTo(point);
    readCenterInfo(info, infoArray);
  };
}

// 마커 클러스터링
function startClustering(markerArray) {
  const htmlMarker1 = {
      content:
        '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:20px;color:white;text-align:center;font-weight:bold;' +
        'background:linear-gradient(to bottom right, skyblue, blue);background-size:cover;border-radius:50%;"></div>',
      size: N.Size(40, 40),
      anchor: N.Point(20, 20),
    },
    htmlMarker2 = {
      content:
        '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:20px;color:white;text-align:center;font-weight:bold;' +
        'background:linear-gradient(to bottom right, skyblue, green);background-size:cover;border-radius:50%;"></div>',
      size: N.Size(40, 40),
      anchor: N.Point(20, 20),
    },
    htmlMarker3 = {
      content:
        '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:20px;color:white;text-align:center;font-weight:bold;' +
        'background:linear-gradient(to bottom right, yellowgreen, yellow);background-size:cover;border-radius:50%;"></div>',
      size: N.Size(40, 40),
      anchor: N.Point(20, 20),
    },
    htmlMarker4 = {
      content:
        '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:20px;color:white;text-align:center;font-weight:bold;' +
        'background:linear-gradient(to bottom right, orange, red);background-size:cover;border-radius:50%;"></div>',
      size: N.Size(40, 40),
      anchor: N.Point(20, 20),
    },
    htmlMarker5 = {
      content:
        '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:20px;color:white;text-align:center;font-weight:bold;' +
        'background:linear-gradient(to bottom right, red, black);background-size:cover;border-radius:50%"></div>',
      size: N.Size(40, 40),
      anchor: N.Point(20, 20),
    };
  const markerClustering = new MarkerClustering({
    minClusterSize: 2,
    maxZoom: 12,
    map: map,
    markers: markerArray,
    disableClickZoom: false,
    gridSize: 120,
    icons: [htmlMarker1, htmlMarker2, htmlMarker3, htmlMarker4, htmlMarker5],
    indexGenerator: [10, 30, 50, 70, 90],
    stylingFunction: function (clusterMarker, count) {
      $(clusterMarker.getElement()).find("div:first-child").text(count);
    },
  });
}

// 검색주소를 좌표로 변환 후 맵 이동
export const searchAddressToCoordinate = address => {
  naver.maps.Service.geocode(
    {
      query: address,
    },
    function (status, response) {
      if (status === naver.maps.Service.Status.ERROR) {
        if (!address) {
          return alert("Geocode Error, Please check address");
        }
        return alert("Geocode Error, address:" + address);
      }
      if (response.v2.meta.totalCount === 0) {
        return;
      }
      // 아이템의 x, y 값으로 마커를 그려준다.
      const item = response.v2.addresses[0];
      const lat = parseFloat(item.y);
      const lng = parseFloat(item.x);
      const point = new naver.maps.LatLng(lat, lng);
      map.panTo(point);
    }
  );
};

// Promise.all([searchAddressToCoordinate("불당동")]).then(result => {
//   // 데이터로 맵 초기화
//   console.log(result);
// });

export function moveMap(lat, lng) {
  console.log(map);
  const point = new naver.maps.LatLng(lat, lng);
  map.setZoom(15);
  map.panTo(point);
}
