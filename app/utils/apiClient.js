import request from 'superagent';


export function get(url, options = { headers: {}, query: {} }) {
  return new Promise((resolve, reject) => request
    .get(url)
    .query(options.query)
    .type('application/json')
    .set(options.headers)
    .end((err, res) => {
      if (err) {
        try {
          reject({ message: JSON.parse(res.text) });
        } catch (e) {
          reject({ message: res.text });
        }
      }
      resolve({ datas: res.body });
    }));
}

export function post(url, options = { headers: {}, query: {}, datas: {} }) {
  return new Promise((resolve, reject) => request
    .post(url)
    .type('application/json')
    .set(options.headers)
    .send(options.datas)
    .end((err, res) => {
      if (err) {
        try {
          reject({ message: JSON.parse(res.text) });
        } catch (e) {
          reject({ message: res.text });
        }
      }
      resolve({ datas: res.body });
    }));
}

export function put(url, options = { headers: {}, query: {}, datas: {} }) {
  return new Promise((resolve, reject) => request
    .put(url)
    .type('application/json')
    .set(options.headers)
    .send(options.datas)
    .end((err, res) => {
      if (err) {
        try {
          reject({ message: JSON.parse(res.text) });
        } catch (e) {
          reject({ message: res.text });
        }
      }
      resolve({ datas: res.body });
    }));
}

export default {
  post,
  get,
  put,
};
