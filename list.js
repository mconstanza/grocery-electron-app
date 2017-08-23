const ipc = require('electron').ipcRenderer;
let MongoClient = require('mongodb').MongoClient, assert = require('assert');
let uri = "mongodb://" + process.env.USER + ":" + process.env.PASS + process.env.DB

// function for going back to the index
index = () => {
  ipc.send('load-page', {"link":'file://' + __dirname + '/index.html'})
}

ipc.on('list-view', (header, list) => {
  let itemList = document.getElementById('items')
  // clear the currently display list and reload using new data
  itemList.innerHTML = ''
  // loop through the items and create a list item element for each
  addItems(itemList, list)
})

// Functions
addItems = (itemList, list) => {
  if (list.items){
    list.items.forEach((item) => {
      // Add name
      let listItem = document.createElement('LI')
      listItem.setAttribute('class', 'list-group-item')
      listItem.dataset.list = list.name
      listItem.dataset.name = item.name
      listItem.onclick = (e) => {
        markItemChecked(e.srcElement)
      }
      listItemText = document.createTextNode(item.name)
      listItem.appendChild(listItemText)
      // Check if crossed off
      if (item.checked == true) {
        listItem.classList.add('checked')
      }
      // Add buttons
      let deleteButton = document.createElement('BUTTON')
      deleteButton.setAttribute('class', 'btn btn-default')
      deleteButton.onclick = (e) => {
        deleteItem(e.srcElement.parentNode.parentNode)
      }
      let deleteIcon = document.createElement('SPAN')
      deleteIcon.setAttribute('class', 'icon icon-cancel')
      deleteButton.appendChild(deleteIcon)
      listItem.appendChild(deleteButton)

      // Append list item
      itemList.appendChild(listItem)
    })
  }
}

markItemChecked = (item) => {
  console.log("checkedItem: ", item)
  item.classList.toggle('checked')
  let itemName = item.dataset.name

  // change checked value in database to match checked status
  MongoClient.connect(uri, (err, db) => {
    assert.equal(null, err);
    let lists = db.collection('Lists')
    lists.findOne({name: item.dataset.list}, {items: {$elemMatch: {name: itemName}}}, (err, response) => {
      console.log(response)
      lists.update({name: item.dataset.list, 'items.name': item.dataset.name}, {$set: { "items.$.checked": !response.items[0].checked}}, (err, response) => {
        if (err) {
          console.log(err)
        } else {
          console.log("response: ", response)
        }
      })
    })
  })
}

deleteItem = (item) => {

  let query = {};
  query.name = item.dataset.list

  MongoClient.connect(uri, (err, db) => {
    assert.equal(null, err);
    let lists = db.collection('Lists')
    lists.update(query, {$pull: {items: {name: item.dataset.name} }})
    item.remove()
  })
}
