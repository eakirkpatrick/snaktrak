// Demo function to show how card items will be added into the main area
function addItem()
{
    // Create a temporary <div> to load into
  var div = document.createElement('div');
  div.setAttribute('class', 'someClass');
  div.innerHTML = document.getElementById('blockOfStuff').innerHTML;

  // Write the <div> to the HTML container
  document.getElementById('addItem').appendChild(div);
}