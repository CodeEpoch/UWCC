import {uw_api} from './uw_api';

uwurl = "https://api.uwaterloo.ca/v2/"

// const app = document.getElementById('root')
// const container = document.createElement('div')
// container.setAttribute('class', 'container')
// app.appendChild(container)


uw_api.get('/foodservices/menu', function(err, res) {
    console.log(res); 
  }); 

// Begin accessing JSON data here
// if (1) {
//     const msg = document.createElement('h1')
//     msg.textContent = `working!`
//     app.appendChild(msg)
// } else {
//     const errorMessage = document.createElement('h1')
//     errorMessage.textContent = `not working!`
//     app.appendChild(errorMessage)
// }


