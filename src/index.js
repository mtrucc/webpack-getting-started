import bug from './bug'

function component() {
  const element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  // Lodash, now imported by this script
  element.innerHTML = 'Hello Bug'

  console.log(`bug`, bug(789))
  return element;
}

document.body.appendChild(component());
