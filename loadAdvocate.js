var csvjson = require('csvjson');
var fs=require("fs");
//var Converter = require("csvtojson").Converter;
		
const { createApolloFetch } = require('apollo-fetch');
const apolloFetch = createApolloFetch({ uri:'https://api.graph.cool/simple/v1/cjaxht0s52dbg01421uxhdzxv' });

apolloFetch.use(({ request, options }, next) => {
  if (!options.headers) {
    options.headers = {};  // Create the headers object if needed. 
  }
  options.headers['authorization'] = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MTIwMzYyNTYsImNsaWVudElkIjoiY2o2dTg3eGo4MG11ajAxMTB6Y3Zud3V5ciJ9.e-64yVqF2D5M6BNujT2Ci9c4gocnLE2xibqMAk1IFCc';
 
  next();
});

var getAdvocateData=()=>{
	return new Promise((resolve,reject) => {
		var options = {
			delimiter : ',' , // optional
			quote     : '"' // optional
		};
		var file_data = fs.readFileSync('./Advocates.csv', { encoding : 'utf8'});
		var result = csvjson.toObject(file_data, options);
		//console.log(result);
		resolve(result);
	})
}


var addAdvocateData=(advocateData)=>{
	return new Promise((resolve, reject) => {
		apolloFetch({
		  query: `mutation createAdvocateData ($name:String!,$enrollmentNumber:String!,$homeAddress:String!,$officeAddress:String!,$email:String!,$phone:String!) {
				    createAdvocateData (name:$name,enrollmentNumber:$enrollmentNumber,homeAddress:$homeAddress,officeAddress:$officeAddress,email:$email,phone:$phone ) {
				      id,
                      name,
                      enrollmentNumber,
                      homeAddress,
                      officeAddress,
                      email,
                      phone
				    }
				  }`,
		  variables: { name:advocateData.Name, enrollmentNumber:advocateData.EnrollmentNumber, homeAddress:advocateData.HomeAddress, officeAddress:advocateData.OfficeAddress, email:advocateData.Email, phone:advocateData.Phone},
		}).then(res => {
		  resolve(res.data.createAdvocateData.id)
		})
		.catch((err)=>{
			reject(err);
		});
	})
}

getAdvocateData()
.then((advocates)=>{
	var addAdvocatePromises=[]
	advocates.forEach((advocateData)=>{
		var addAdvocatePromise=new Promise((resolve, reject) => {
																apolloFetch({
																	query: `mutation createAdvocateData ($name:String!,$enrollmentNumber:String!,$homeAddress:String!,$officeAddress:String!,$email:String!,$phone:String!) {
																				createAdvocateData (name:$name,enrollmentNumber:$enrollmentNumber,homeAddress:$homeAddress,officeAddress:$officeAddress,email:$email,phone:$phone ) {
																					id,
																									name,
																									enrollmentNumber,
																									homeAddress,
																									officeAddress,
																									email,
																									phone
																				}
																			}`,
																	variables: { name:advocateData.Name, enrollmentNumber:advocateData.EnrollmentNumber, homeAddress:advocateData.HomeAddress, officeAddress:advocateData.OfficeAddress, email:advocateData.Email, phone:advocateData.Phone},
																}).then(res => {
																	resolve(res.data.createAdvocateData.id)
																})
																.catch((err)=>{
																	reject(err);
																});
															})
		addAdvocatePromises.push(addAdvocatePromise)
	})

	Promise.all(addAdvocatePromises)
	.then(()=>{
		console.log("Done")
	})
	.catch((err)=>{
		console.log(JSON.stringify(err));
	})
// 		addAdvocateData(advocates[0])
// 		.then(()=>{
// 			console.log('Advocate is added')
// 		})
// 		.catch((err)=>{
// 			console.log(JSON.stringify(err));
// 		})
 })