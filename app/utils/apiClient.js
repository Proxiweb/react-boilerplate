import axios from 'axios';


export function get(url, options = { headers: {}, query: {} }) {
  return new Promise((resolve, reject) => axios
    .get(url, { params: options.query, headers: options.headers })
    .then((response) => {
      resolve({ datas: response.data });
    })
    .catch((error) => {
      if (error.response) {
        // try {
        reject({ message: error.response.data });
        // } catch (e) {
        //   reject({ message: error.text });
        // }
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    }));
}

export function post(url, options = { headers: {}, query: {}, datas: {} }) {
  return new Promise((resolve, reject) => axios
    .post(url, options.datas, { headers: options.headers, params: options.query })
    .then((response) => {
      resolve({ datas: response.data });
    })
    .catch((error) => {
      if (error.response) {
        // try {
        reject({ message: error.response.data });
        // } catch (e) {
        //   reject({ message: error.text });
        // }
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    }));
    //
    // .end((err, res) => {
    //   if (err) {
    //     try {
    //       reject({ message: JSON.parse(res.text) });
    //     } catch (e) {
    //       reject({ message: res.text });
    //     }
    //   }
    //   resolve({ datas: res.body });
    // }));
}

export function put(url, options = { headers: {}, query: {}, datas: {} }) {
  return new Promise((resolve, reject) => axios
    .put(url, options.datas, { headers: options.headers, params: options.query })
    .then((response) => {
      resolve({ datas: response.data });
    })
    .catch((error) => {
      if (error.response) {
        // try {
        reject({ message: error.response.data });
        // } catch (e) {
        //   reject({ message: error.text });
        // }
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    }));
    // .end((err, res) => {
    //   if (err) {
    //     try {
    //       reject({ message: JSON.parse(res.text) });
    //     } catch (e) {
    //       reject({ message: res.text });
    //     }
    //   }
    //   resolve({ datas: res.body });
    // }));
}

export function patch(url, options = { headers: {}, query: {}, datas: {} }) {
  return new Promise((resolve, reject) => axios
    .patch(url, options.datas, { headers: options.headers, params: options.query })
    .then((response) => {
      resolve({ datas: response.data });
    })
    .catch((error) => {
      if (error.response) {
        // try {
        reject({ message: error.response.data });
        // } catch (e) {
        //   reject({ message: error.text });
        // }
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    }));
    // .end((err, res) => {
    //   if (err) {
    //     try {
    //       reject({ message: JSON.parse(res.text) });
    //     } catch (e) {
    //       reject({ message: res.text });
    //     }
    //   }
    //   resolve({ datas: res.body });
    // }));
}

export default {
  post,
  get,
  put,
  patch,
};
