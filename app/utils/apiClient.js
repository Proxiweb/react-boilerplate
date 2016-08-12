import request from 'superagent';


export function get(url, headers = {}, query = {}) {
  return new Promise((resolve, reject) => request
    .get(url)
    .query(query)
    .type('application/json')
    .set(headers)
    .end((err, res) => {
      if (err) {
        reject({ message: JSON.parse(res.text) });
      }
      resolve({ datas: res.body });
    }));
}
