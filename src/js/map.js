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
    content: `
    <div style="display:flex;flex-direction:column;max-width:400px;padding:10px;border-radius:20px;gap:8px">
      <h2 style="font-size:1.2rem;font-weight:800;margin-top:8px">${item.centerName}</h2>
      <p style="display:flex;align-items:center;gap:8px;margin-top:10px">
      <svg style="width:20px;color:#f59f00" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        ${item.facilityName}
      </p>
      <p style="display:flex;align-items:center;gap:8px">
      <svg style="width:18px;color:red" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clip-rule="evenodd" />
      </svg>
      ${item.phoneNumber}
      </p>

      <p style="display:flex;align-items:center;gap:8px">
      <svg style="width:18px;color:#40c057" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
      ${item.address} | ${item.zipCode}</p>
      <p style="display:flex;align-items:center;gap:8px">
        <svg style="width:18px;color:#5c7cfa"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ${item.updatedAt}</p>
    </div>
    `,
  });

  // '<div style="max-width:400px;text-align:center;padding:10px;border-radius:20px"><b>' +
  // `</b><br/> 주소 : ${item.address}` +
  // `<br/> 기관 명 : ${item.centerName}` +
  // `<br/> 전화번호 : ${item.phoneNumber}` +
  // `<br/> 수정일 :  ${item.updatedAt}` +
  // "</div>"

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

/**
 * 근처에 있는 다른 예방센터를 클릭 한 경우 그 곳으로 맵을 이동시킨다.
 */
const anotherCardEl = document.querySelector(".another-wrapper");
anotherCardEl.addEventListener("click", (e) => {
  let card = e.target.closest(".another-card");

  if (card.dataset?.lat && card.dataset?.lng) {
    const { lat, lng } = card.dataset;
    const point = new naver.maps.LatLng(lat, lng);
    map.setZoom(13);
    map.panTo(point);
  }
});
