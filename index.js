
uwurl = "https://api.uwaterloo.ca/v2/"
gurl = "https://ghibliapi.herokuapp.com/films"
key = "7a46eb006fffa5b826764c730e17b95c"

const request = require('request');

const options = {
    url: uwurl,
    method: 'GET',
    headers: {
        'key': key
    }
};

request(options, function(err, res, body) {
    let json = JSON.parse(body);
    console.log(json);
});

// // header("Access-Control-Allow-Origin: *")

// const app = document.getElementById('root')
// const container = document.createElement('div')
// container.setAttribute('class', 'container')

// app.appendChild(container)

// var request = new XMLHttpRequest()

// // Open a new connection
// request.open('GET', gurl, true)
// request.onload = function () {
//   // Begin accessing JSON data here
//   var data = JSON.parse(this.response)
  
//   if (request.status >= 200 && request.status < 400) {
    

//   } else {
//     const errorMessage = document.createElement('h1')
//     errorMessage.textContent = `not working!`
//     app.appendChild(errorMessage)
//   }
// }

// request.send()