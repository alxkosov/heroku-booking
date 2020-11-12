let mainServerUrl = "http://localhost:3003";

async function makeRequest(url, options = {}, baseUrl = mainServerUrl) {
  try {
    let response = await fetch(baseUrl + url, options);
    if (response.ok) {
      // response.header({
        // 'Access-Control-Allow-Origin': '*',
      // });
      return response.json();
    } else {
      // console.error("Ошибка http: ", response.status);
      return response.text().then(function (text) {
        throw new Error(text);
      });
    }
  } catch (err) {
    console.error(err);
  }
}
export default makeRequest;
