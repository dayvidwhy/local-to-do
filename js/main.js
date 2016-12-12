// Does the browser support storage?
var storageSupported;

var toDoList = getToDos();

if (toDoList.length > 0) {
    for (var i = 0; i < toDoList.length; i++) {
        printToDo(toDoList[i].date, toDoList[i].text);
    }
}

if (typeof(Storage) !== "undefined") {
    storageSupported = true;
} else {
    storageSupported = false;
}

// It's as if jquery was here all along
function $(ele) {
    if (ele[0] === '#') {
        return document.querySelector(ele);
    } else if (ele[0] === '.') {
        return document.getElementsByClassName(ele.slice(1, ele.length));
    }
}

function removeToDo(date, text) {
    for (var i = 0; i < toDoList.length; i++) {
        if (toDoList[i].date === date && toDoList[i].text === text) {
            toDoList.splice(i, 1);
        }
    }
    saveToDos();
}

function printToDo(date, text) {
    var content = document.createElement('div');
    content.className = "panel panel-default";
    var heading = document.createElement('div');
    heading.className = "panel-heading";
    var title = document.createElement('h3');
    title.className = "panel-title";
    title.innerHTML = date;

    var body = document.createElement('div');
    body.className = "panel-body";

    // create button that lets the panel be deleted
    var button = document.createElement('button');
    button.className = "btn btn-default block task-done";
    button.innerHTML = '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>';
    button.addEventListener('click', function() {
        this.parentElement.parentElement.outerHTML = "";
        console.log(date + text);
        removeToDo(date, text);
    });

    // Add in the user text
    body.innerHTML = text;

    body.appendChild(button);
    heading.appendChild(title);
    content.appendChild(heading);
    content.appendChild(body);
    $('#output').appendChild(content);
}

// Add a to-do panel to the page
$('#submit').addEventListener('click', function() {
    var date = new Date();
    var text = document.getElementsByName('input')[0].value;
    var titleDate = date.toLocaleTimeString() + ' ' + date.toDateString();
    console.log(text);
    printToDo(titleDate, text);
    document.getElementsByName('input')[0].value = "";
    toDoList.push({
        'date' : date.toLocaleTimeString() + ' ' + date.toDateString(),
        'text' : text
    });
    console.log(toDoList);
    saveToDos();
});

/* Credit to http://stackoverflow.com/a/2010948/7265789 for saving object. */
function saveToDos() {
    localStorage.setItem('toDoList', JSON.stringify(toDoList));
}

function getToDos() {
    var retrievedObject = localStorage.getItem('toDoList');
    if (retrievedObject === null) {
        return [];
    }
    return JSON.parse(retrievedObject);
}