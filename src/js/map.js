/**
 * 작성자 : 오황석
 * 이 파일의 역할 : 네이버 지도 초기화 및 마커등록 및 클러스터를 등록한다.
 * 작성 일 : 2022. 10. 5
 * 수정 일 : 2023. 8. 8
 */

import { CenterRops } from "../utils/apiOptions";
import { MarkerClustering } from "./MarkerClustering";
import markerURI from "../images/marker.png";
import { readCenterInfo } from "./search";

/**
 * 맵을 초기화 합니다.
 */
export const map = new naver.maps.Map("map", {
  center: new naver.maps.LatLng(37.541, 126.986),
  zoom: 10,
});

let markers = new Array();
let infoWindows = new Array();
let infoArray = new Array();

/**
 * 센터 데이터를 불러오고 마커이벤트를 등록 후 클러스터링 작업
 */
Promise.all([getCenterData()]).then((result) => {
  result[0].data.forEach((element) => {
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

/**
 * 공공 API에서 코로나 예방접종 센터를 불러온다.
 */
async function getCenterData() {
  return fetch(`${process.env.CENTER_API_URL}`, CenterRops)
    .then((response) => response.json())
    .then((result) => Promise.resolve(result))
    .catch((error) => console.log("error", error));
}

/**
 * 마커를 받아서 맵에 넣고 클릭리스너를 등록합니다.
 * @param {object} item
 */
function makeMarker(item) {
  const x = parseFloat(item.lat);
  const y = parseFloat(item.lng);

  const position = new naver.maps.LatLng(x, y);
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

/**
 * 마커들을 업데이트 합니다.
 * @param {*} map
 * @param {*} marker
 */
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

/**
 * 마커를 보여줍니다.
 * @param {*} map
 * @param {*} marker
 * @returns undifined
 */
function showMarker(map, marker) {
  if (marker.setMap()) return;
  marker.setMap(map);
}

/**
 * 마커를 숨깁니다.
 * @param {*} map
 * @param {*} marker
 * @returns undifined
 */
function hideMarker(map, marker) {
  if (!marker.setMap()) return;
  marker.setMap(null);
}

/**
 * 다수의 마커에 클릭 이벤트 지정하기
 * 해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
 * @param {number} index
 * @returns
 */
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

/**
 * 마커 클러스터링
 * @param {array} markerArray
 */
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

/**
 * 검색주소를 좌표로 변환 후 맵 이동
 * @param {string} address
 */
export const searchAddressToCoordinate = (address) => {
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

/**
 * 위도와 경도를 받아서 맵을 이동시킨다.
 * @param {number} lat
 * @param {number} lng
 */
export function moveMap(lat, lng) {
  const point = new naver.maps.LatLng(lat, lng);
  map.setZoom(15);
  map.panTo(point);
}
