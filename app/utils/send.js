import 'whatwg-fetch';
import checkStatus from './checkStatus';
import parseJSON from './parse';

export default function send(options, method = 'POST') {
  const { url, datas } = options;
  return fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datas),
  })
  .then(checkStatus)
  .then(parseJSON)
  .then((data) => ({ data }))
  .catch((err) => ({ err }));
}
