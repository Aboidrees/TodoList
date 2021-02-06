exports.getDate = function () {
  // const today = new Date();

  return new Date().toLocaleDateString('en-us', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
};

exports.getDay = function () {
  // const today = new Date();

  return new Date().toLocaleDateString('en-us', {
    weekday: 'long',
  });
};
