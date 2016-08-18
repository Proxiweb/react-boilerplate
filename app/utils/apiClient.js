import request from 'superagent';


export function get(url, headers = {}, query = {}) {
  return new Promise((resolve, reject) => request
    .get(url)
    .query(query)
    .type('application/json')
    .set(headers)
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

export function post(url, datas, headers = {}) {
  return new Promise((resolve, reject) => request
    .post(url)
    .type('application/json')
    .set(headers)
    .send(datas)
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
