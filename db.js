var mongoose = require("mongoose");
//mongoose.connect('mongodb://localhost:27017/mla',  { useMongoClient: true });
mongoose.connect('mongodb://localhost:27017/mla', { useMongoClient: true }, function(error){
    if(error) 
    {   
        console.log(error);
    }
    else{
      console.log("connection successful");
    }
        
});
mongoose.Promise=Promise;

exports.mongoose = mongoose;

var policeStationsSchema = mongoose.Schema({   
 
  policeStationName: String,
  contactNumber: String,
  email: String
});

exports.PoliceStations = mongoose.model("PoliceStations", policeStationsSchema, "policestations");

