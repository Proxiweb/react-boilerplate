import { SubmissionError } from 'redux-form';
// import { get } from 'utils/apiClient';

// function submit(values, token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZnJlZS5mciIsImlkIjoxLCJyb2xlcyI6WyJVU0VSIiwiQURNSU4iXSwiaWF0IjoxNDcxMTYzNzAyLCJleHAiOjE0NzEyNTAxMDJ9.UjbypP-NOYRN8M5KSfO3KQh7q7s7oIryuCJvl4DQK4U') {
//   return post('/api/utilisateurs', values, { Authorisation: `Bearer ${token}` });
// }

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZnJlZS5mciIsImlkIjoxLCJyb2xlcyI6WyJVU0VSIiwiQURNSU4iXSwiaWF0IjoxNDcxMTYzNzAyLCJleHAiOjE0NzEyNTAxMDJ9.UjbypP-NOYRN8M5KSfO3KQh7q7s7oIryuCJvl4DQK4U'
function submit() { // values
  // return new Promise((resolve) => {
  //   console.log('ici', SubmissionError);
  //   get('/api/utilisateurs', values, { Authorisation: `Bearer ${token}` })
  //     .then(() => {
  //       throw new SubmissionError({ nom: 'User does not exist', _error: 'Login failed!' });
  //     });
  // });
  return sleep(1000) // simulate server latency
    .then(() => {
      throw new SubmissionError({ nomi: 'User does not exist', _error: 'Login failed!' });
    });
}

export default submit;
