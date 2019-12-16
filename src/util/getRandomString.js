const getRandomString = (length = 10) =>
  [...Array(length)].map(i => (~~(Math.random() * 36)).toString(36)).join("");
export default getRandomString;
