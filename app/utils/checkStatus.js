/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  return new Promise(resolve => {
    if (response.status >= 200 && response.status < 300) {
      resolve(response);
    }

    response.json().then((res) => {
      const error = new Error(res);
      error.response = response;
      throw error;
    });
  });
}

export default checkStatus;
