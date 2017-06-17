// const immutable = require('immutable');
// const { fromJS, Map, List } = immutable;
//
// const test = fromJS({
//   a: {
//     b: {
//       c: {
//         a: { id: 1 },
//         b: { id: 2 },
//         c: { id: 3 },
//         d: { id: 4 },
//       },
//     },
//   },
// });
//
// console.log(
//   test.getIn(['a', 'b', 'c']).findKey((item, i) => item.get('id') === 2)
// );
//
// console.log(test.getIn(['a', 'b', 'c']).includes(Map({ id: 9 })));
//
// console.log(test.size);
