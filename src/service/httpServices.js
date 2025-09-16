import axios from "axios";

const instance = axios.create({
  baseURL: "https://book.neotericproperties.in/wp-json/wp/v2",
    timeout: 60000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

const responseBody = (response) => response.data;

const requests = {
  get: (url, config) => instance.get(url, config).then(responseBody),
  post: (url, body, config) => instance.post(url, body, config).then(responseBody),
  put: (url, body) => instance.put(url, body).then(responseBody),
};

export default requests;
