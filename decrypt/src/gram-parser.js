exports.countGrams = function (text) {
  var histogram = {};
  var arr = text.split("");

  //handles case where there are no bigrams
  if (arr.length < 1) {
    return 'Are you sure that that is an text?';
  }

  for (var i = 0; i < arr.length - 1; i++) {
    if (i + 1 <= arr.length) {

      var key = arr[i];
      if (key != '\n' && key != ' ') {
        //if the gram already exists as a histogram key, iterate the value to count the additional occurence.
        if (histogram[key]) {
          histogram[key] += 1;
        }

        //if the gram does not already exist as a histogram key, add it as a histogram key and initialize it with value 1.
        else {
          histogram[key] = 1;
        }
      }
    }
  }

  return histogram;
}