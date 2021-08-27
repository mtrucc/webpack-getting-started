import test from './test';

// 这一行会引发bug，知道为什么吗？
console.log(bug(123));

const a = {
  test,
};

export function bug(params) {
  console.log(`params`, params);
  console.log(`a`, a);
  return params;
}

console.log(bug(456));

export default bug;
