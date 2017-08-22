const ipc = require('electron').ipcRenderer;

// function for going back to the index
index = () => {
  ipc.send('load-page', {"link":'file://' + __dirname + '/index.html'})
}

ipc.on('list-view', (header, list) => {
  console.log("list: ", list)
  let itemList = document.getElementById('items')
  // clear the currently display list and reload using new data
  itemList.innerHTML = ''
  // loop through the items and create a list item element for each
  addItems(itemList, list.items)

})

// Functions
addItems = (itemList, items) => {
  items.forEach((item) => {
    // Add name
    let listItem = document.createElement('LI')
    listItem.setAttribute('class', 'list-group-item')
    listItemText = document.createTextNode(item.name)
    listItem.appendChild(listItemText)
    // Check if crossed off
    if (item.checked == true) {
      listItem.className.add('checked')
    }
    // Add buttons
    let deleteButton = document.createElement('BUTTON')
    deleteButton.setAttribute('class', 'btn btn-default')
    let deleteIcon = document.createElement('SPAN')
    deleteIcon.setAttribute('class', 'icon icon-cancel')
    deleteButton.appendChild(deleteIcon)
    listItem.appendChild(deleteButton)

    // Append list item
    itemList.appendChild(listItem)
  })
}
