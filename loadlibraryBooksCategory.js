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


var getLibraryBooksCategory=()=>{
	return new Promise((resolve,reject) => {
		var options = {
			delimiter : ',' , // optional
			quote     : '"' // optional
		};
		var file_data = fs.readFileSync('./LibraryBookscategory.csv', { encoding : 'utf8'});
		var result = csvjson.toObject(file_data, options);
		//console.log(result);
		resolve(result);
	})
}

getLibraryBooksCategory()
.then((librarybookscategories)=>{
	var addLibraryBookCategorydata=[]
	librarybookscategories.forEach((librarybookcategory)=>{
		var addLibraryBookscategory=(librarybookcategory)= new Promise((resolve, reject) => {
				apolloFetch({
					query: `mutation createLibraryBookCategory ($title: String!) 
					{
					  createLibraryBookCategory (title: $title) {
						  title
						}
					}  `,
					variables: { 
                        title:librarybookcategory.Title
					},
				}).then(res => {
					resolve(res.data.createLibraryBookCategory.id)
				})
				.catch((err)=>{
					reject(err);
				});
		})
		addLibraryBookCategorydata.push(addLibraryBookscategory)
	})
    Promise.all(addLibraryBookCategorydata)
	.then(()=>{
		console.log("Done")
	})
	.catch((err)=>{
		console.log(JSON.stringify(err));
	})
})



