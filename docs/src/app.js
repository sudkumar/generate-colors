const getColorForString = require('./../../lib/getColorForString')

const input = document.getElementById('input')
const text = document.getElementById('text')

input.addEventListener('input', function (e) {
  const value = e.target.value
  document.body.style.background = 'rgb('+getColorForString(value).join(',') + ')';
  text.innerText = value
})

