var fileReader = require("./src/file-reader");
var gramParser = require("./src/gram-parser");
var brutus = require("./src/brutus");
var sys = require('sys')
var child;

function main() {
  var fileName = process.argv[2];
  text = fileReader.readFile(fileName);
  console.log(brutus.crackCaesar(text));


var exec = require('child_process').exec;
// executes `pwd`
child = exec("pwd", function (error, stdout, stderr) {
  sys.print('stdout: ' + stdout);
  sys.print('stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});
// or more concisely
var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }
exec("ls -la", puts);

  var result;
  if (text) {
    var histogram = gramParser.countGrams(text);
    var sortable = [];
    for (var litteris in histogram) {
      sortable.push([litteris, histogram[litteris]]);
    }

    sortable.sort(function (a, b) {
      return a[1] - b[1];
    });
  }

  sortable = sortable.reverse()

  result = text;

  var mapObj = {};

  var frequence = ["A", "E", "O", "S", "R", "I", "N", "D", "M", "U", "T", "C", "L", "P", "V", "G", "H", "Q", "B", "F", "Z", "J", "X", "K", "W", "Y"]
  sortable.forEach(function (element, i) {
    if (frequence[i] != undefined)
      mapObj[element[0]] = frequence[i];

  });

  // new RegExp(Object.keys(mapObj).join("|"), "gi");
  // to generate the regex.So then it would look like this

  // var mapObj = { cat: "dog", dog: "goat", goat: "cat" };

  var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
  result = result.replace(re, function (matched) {
    if (mapObj[matched] != undefined)
      return mapObj[matched];
  });


  result.split("undefined").join(" ")
  console.log(result.replace(/undefined/g, " "))
  console.log(frequence)
  console.log(sortable)
}

main();
