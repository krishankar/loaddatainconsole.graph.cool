var csvjson = require('csvjson');
var fs = require('fs');

var options = {
    delimiter : ',' , // optional
    quote     : '"' // optional
};
var file_data = fs.readFileSync('./LibraryBooksData.csv', { encoding : 'utf8'});
var result = csvjson.toObject(file_data, options);
console.log(result);