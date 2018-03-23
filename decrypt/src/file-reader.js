var fs = require('fs');

exports.readFile = function(fileName) {
  var filePeriodSplit = fileName.split('.');;
  var fileExt = filePeriodSplit[filePeriodSplit.length-1];
  
  if (fileExt !== 'txt') {
    console.log('Please provide a .txt file!');
    return false;
  }

  var contents;
  try {
    contents = fs.readFileSync(fileName, 'utf8');
  } catch (err) {
    console.log('There was an error reading the provided file. Please check the file path is correct, and try again!');
  }
  
  return contents;
}
