var db=require("./db.js");

const { createApolloFetch } = require('apollo-fetch');
const apolloFetch = createApolloFetch({ uri:'https://api.graph.cool/simple/v1/cjaxht0s52dbg01421uxhdzxv' });

apolloFetch.use(({ request, options }, next) => {
  if (!options.headers) {
    options.headers = {};  // Create the headers object if needed. 
  }
  options.headers['authorization'] = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MTIwMzYyNTYsImNsaWVudElkIjoiY2o2dTg3eGo4MG11ajAxMTB6Y3Zud3V5ciJ9.e-64yVqF2D5M6BNujT2Ci9c4gocnLE2xibqMAk1IFCc';
 
  next();
});

var getStates=()=>{
	return new Promise((resolve, reject) => {
		db.State.find({}).distinct('state',(err,states)=>{
			if(err) reject(err);
			resolve(states);
		})
	})
}

var getDistricts=(state)=>{
	return new Promise((resolve, reject) => {
		db.State.find({state:state}).distinct('district',(err,districts)=>{
			if(err) reject(err);
			resolve(districts);
		})
	})
}

var getCourts=(district)=>{
	return new Promise((resolve, reject) => {
		db.State.find({district:district}).distinct('court',(err,courts)=>{
			if(err) reject(err);
			resolve(courts);
		})
	})
}

var addState=(state)=>{
	return new Promise((resolve, reject) => {
		apolloFetch({
		  query: `mutation createState ($state: String!) {
				    createState (name: $state) {
				      id,
				      name,
				    }
				  }`,
		  variables: { state: state },
		}).then(res => {
		  resolve(res.data.createState.id)
		})
		.catch((err)=>{
			reject(err);
		});
	})
}

var addDistrict=(stateId,district)=>{
	return new Promise((resolve, reject) => {
		apolloFetch({
		  query: `mutation createDistrict ($stateId: ID,$name: String!) {
				    createDistrict (name: $name,stateId:$stateId) {
	 			      id,
	 			      name,
	 			    }
	 			  }`,
		  variables: { stateId: stateId, name:district },
		}).then(res => {
		  console.log(JSON.stringify(res))
		  resolve(res.data.createDistrict.id)
		})
		.catch((err)=>{
			reject(err);
		});
	})
}

var addCourt=(stateId,districtId,court)=>{
	return new Promise((resolve, reject) => {
		apolloFetch({
		  query: `mutation createCourt ($stateId: ID,$districtId:ID,$name: String!) {
				    createCourt (name: $name,stateId:$stateId, districtId:$districtId) {
	 			      id,
	 			      name,
	 			    }
	 			  }`,
		  variables: { stateId: stateId, districtId: districtId,name:court },
		}).then(res => {
		  console.log(JSON.stringify(res))
		  resolve(res.data.createCourt.id)
		})
		.catch((err)=>{
			reject(err);
		});
	})
}


getStates()
.then((states)=>{
	states.forEach((state)=>{
		addState(state)
		.then((stateId)=>{
			getDistricts(state)
			.then((districts)=>{
				districts.forEach((district)=>{
					addDistrict(stateId,district)
					.then((districtId)=>{
						getCourts(district)
						.then((courts)=>{
							courts.forEach((court)=>{
								addCourt(stateId,districtId,court)
								.then((courtId)=>{
									console.log("Court ID:" + courtId)
								})
							})
						})
					})
				})
			})
		})
		
	})
})
.catch((err)=>{
	console.log(JSON.stringify(err))
})





