export const random = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
};

export const wait = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));
