

const app = document.getElementById('root')
const container = document.createElement('div')
container.setAttribute('class', 'container')
app.appendChild(container)


function myJsFunction() {
  var text = document.getElementById('b').value;

  let raw = text.split(' ')
  let final = "["
  for (i = 1; i < raw.length; i++) {
    if (i % 2 == 1) {
      final = final + "\'" + raw[i - 1] + raw[i] + "\'" + ", "
    }
  }

  final += ""

  console.log(final)
}

// // Begin accessing JSON data here
// if (1) {
//     const msg = document.createElement('h1')
//     msg.textContent = `working!`
//     app.appendChild(msg)
// } else {
//     const errorMessage = document.createElement('h1')
//     errorMessage.textContent = `not working!`
//     app.appendChild(errorMessage)
// }


