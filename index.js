const { remote } = require('electron');
const ipc = require('electron').ipcRenderer;
// get grocery list UL from DOM
let groceryLists = document.getElementById('lists')
// Connect to database
let MongoClient = require('mongodb').MongoClient, assert = require('assert');
let uri = "mongodb://" + process.env.USER + ":" + process.env.PASS + process.env.DB

MongoClient.connect(uri, (err, db) => {
  assert.equal(null, err);
  console.log('database connected')
  let lists = db.collection('Lists')

  lists.find().sort({name: 1}).forEach((doc, err) => {
    console.log(doc)
    if(!doc) {
      console.log("no docs")
      return
    } else {
      console.log(doc)
      displayList(doc)
    }
  })
})

displayList = (list) => {
  let listItem = document.createElement("LI")
  listItem.setAttribute('class', 'list-group-item')
  listItem.onclick = () => { ipc.send('load-page', {
    "link": 'file://' + __dirname + '/list.html',
    "name": list.name,
    "items": list.items
    })
  }

  let listItemText = document.createTextNode(list.name)
  listItem.appendChild(listItemText)
  groceryLists.appendChild(listItem)
}

addItemModal = () => {
  let win = new remote.BrowserWindow({
    parent: remote.getCurrentWindow(),
    modal: true
  })

  let url = 'file://' + __dirname + '/newList.html'

  win.loadURL(url)
}
