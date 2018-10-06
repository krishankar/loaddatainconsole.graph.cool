var csvjson = require('csvjson');
var fs=require("fs");

// var db=require("./db.js");

const { createApolloFetch } = require('apollo-fetch');
const apolloFetch = createApolloFetch({ uri:'https://api.graph.cool/simple/v1/cjaxht0s52dbg01421uxhdzxv' });

apolloFetch.use(({ request, options }, next) => {
  if (!options.headers) {
    options.headers = {};  // Create the headers object if needed. 
  }
  options.headers['authorization'] = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MTIwMzYyNTYsImNsaWVudElkIjoiY2o2dTg3eGo4MG11ajAxMTB6Y3Zud3V5ciJ9.e-64yVqF2D5M6BNujT2Ci9c4gocnLE2xibqMAk1IFCc';
 
  next();
});


var getLibraryBooks=()=>{
	return new Promise((resolve,reject) => {
		var options = {
			delimiter : ',' , // optional
			quote     : '"' // optional
		};
		var file_data = fs.readFileSync('./PolicestationData.csv', { encoding : 'utf8'});
		var result = csvjson.toObject(file_data, options);
		//console.log(result);
		resolve(result);
	})
}

getLibraryBooks()
.then((librarybooks)=>{
	var addLibraryBookdata=[]
	librarybooks.forEach((librarybook)=>{
		var addLibraryBooks=(librarybook)= new Promise((resolve, reject) => {
				apolloFetch({
					query: `mutation createLibraryBook ($bookName: String!) 
                    {
                      createLibraryBook (bookName: $bookName) {
                          bookName
                        }
                    } `,
					variables: { 
                        bookName:librarybook.BookName
					},
				}).then(res => {
					resolve(res.data.createLibraryBook.id)
				})
				.catch((err)=>{
					reject(err);
				});
		})
		addLibraryBookdata.push(addLibraryBooks)
	})
    Promise.all(addLibraryBookdata)
	.then(()=>{
		console.log("Done")
	})
	.catch((err)=>{
		console.log(JSON.stringify(err));
	})
})



