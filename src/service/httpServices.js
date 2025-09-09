import axios from "axios";

const instance = axios.create({
    baseURL: "https://staging.neotericproperties.in/wp-json/wp/v2",
    timeout: 120000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});
const responseBody = (response) => response.data;

const requests = {
    get: (url, body) => instance.get(url, body).then(responseBody),
    post: (url, body, headers) =>
        instance.post(url, body, headers).then(responseBody),
    put: (url, body) => instance.put(url, body).then(responseBody),
};

export default requests;