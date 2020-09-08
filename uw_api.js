
var uwaterlooApi = require('uwaterloo-api'); 

// Course obj
const  course = {
  id: 0,
  name: "",
  descr: "",
  prreq: [],
  antireq : [],
}

let uw_course = []

let user_course = ["CS115","CS135","GEOG101","GEOG201","ECON101","AFM101","PSYCH101","GEOG271"]


//Require the module 

export var uw_api = new uwaterlooApi({
  API_KEY : '7a46eb006fffa5b826764c730e17b95c'
});

//Use the API 
uw_api.get('/foodservices/menu', function(err, res) {
  console.log(res); 
}); 


