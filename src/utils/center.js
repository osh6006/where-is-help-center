class CenterData {
  constructor(key) {
    this.key = key;
    this.requestOptions = {
      method: "GET",
      redirect: "follow",
    };
  }

  getAllData() {
    return fetch(
      `https://api.odcloud.kr/api/15077586/v1/centers?page=1&perPage=284&serviceKey=${this.key}`,
      this.requestOptions
    )
      .then(response => response.json())
      .then(result => result.data)
      .catch(error => console.log("error", error));
  }
}

export default CenterData;
