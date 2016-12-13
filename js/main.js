// Does the browser support storage?
var storageSupported;

if (typeof(Storage) !== "undefined") {
    storageSupported = true;
} else {
    storageSupported = false;
}

// Will either return object or new empty obejct
var toDoList = getToDos();

if (toDoList.length > 0) {
    for (var i = 0; i < toDoList.length; i++) {
        printToDo(toDoList[i].date, toDoList[i].text, toDoList[i].active);
    }
}

$("#done").addEventListener('click', function() {
    if (this.classList.contains('active')) {
        return;
    }
    this.classList.add('active');
    $("#active").classList.remove('active');

    var active = $(".panel-info");
    var inactive = $(".panel-danger");
    for (var i = 0; i < active.length; i++) {
        active[i].classList.add('hide');
        active[i].classList.remove('show');
    }
    for (var i = 0; i < inactive.length; i++) {
        inactive[i].classList.add('show');
        inactive[i].classList.remove('hide');
    }
});

$("#active").addEventListener('click', function() {
    if (this.classList.contains('active')) {
        return;
    }
    this.classList.add('active');
    $("#done").classList.remove('active');

    var active = $(".panel-info");
    var inactive = $(".panel-danger");
    for (var i = 0; i < active.length; i++) {
        active[i].classList.add('show');
        active[i].classList.remove('hide');
    }
    for (var i = 0; i < inactive.length; i++) {
        inactive[i].classList.add('hide');
        inactive[i].classList.remove('show');
    }
});

/*
    Selector.
    Works for #id, .class and <tag>
*/
function $(element) {
    if (element[0] === '#') {
        return document.querySelector(element);
    } else if (element[0] === '.') {
        return document.getElementsByClassName(element.slice(1, element.length));
    } else {
        return getElementsByTagName(element);
    }
}

/*
    Delete a todo from our object.
    Matches date and text
*/
function removeToDo(date, text) {
    for (var i = 0; i < toDoList.length; i++) {
        if (toDoList[i].date === date && toDoList[i].text === text) {
            toDoList.splice(i, 1);
        }
    }
    saveToDos();
}

/*
    Flip active status, no -> yes || yes -> no
*/
function toggleToDo(date, text) {
    for (var i = 0; i < toDoList.length; i++) {
        if (toDoList[i].date === date && toDoList[i].text === text) {
            if (toDoList[i].active === "yes") {
                toDoList[i].active = "no";
            } else if (toDoList[i].active === "no") {
                toDoList[i].active = "yes";
            }
        }
    }
    saveToDos();
}

/*
    Turns 24 hour time into 12 hour time.
*/
function toRelativeTime(time) {
    if (time >= 12) {
        time -= 12;
        return time + 'pm'
    }
    if (time === 0) {
        return '12am';
    }
    return time + 'am';
}

function toggleActiveClass(panel) {
    var panelElement = panel.parentElement.parentElement;
    var classes = panelElement.classList;
    console.log(classes);
    if (panelElement.classList.contains('info-panel')) {
        panelElement.classList.add('panel-danger');
        panelElement.classList.remove('info-panel');
    } else {
        panelElement.classList.add('info-panel');
        panelElement.classList.remove('panel-danger');
    }
}

/*
    Prints out a Todo on the page.
*/
function printToDo(date, text, active) {
    var content = document.createElement('div');
    if (active === "yes") {
        content.className = "panel panel-info panel-info show";
    } else {
        content.className = "panel panel-info panel-danger hide";
    }
    var heading = document.createElement('div');
    heading.className = "panel-heading";
    var title = document.createElement('h3');
    title.className = "panel-title";
    title.innerHTML = date;

    var body = document.createElement('div');
    body.className = "panel-body";
    body.innerHTML = text;

    // create button that lets the panel be archives
    var archive = document.createElement('button');
    archive.className = "btn btn-default block";
    archive.innerHTML = 'Toggle';
    archive.addEventListener('click', function() {
        console.log(date + text);
        console.log(this.parentElement.parentElement.classList);
        this.parentElement.parentElement.classList.remove('show');
        this.parentElement.parentElement.classList.add('hide');
        toggleActiveClass(this);
        toggleToDo(date, text);
    });

    // create button that lets the panel be deleted
    var delButton = document.createElement('button');
    delButton.className = "btn btn-default block";
    delButton.innerHTML = 'Delete';
    delButton.addEventListener('click', function() {
        this.parentElement.parentElement.outerHTML = "";
        console.log(date + text);
        removeToDo(date, text);
    });

    body.appendChild(delButton);
    body.appendChild(archive);
    heading.appendChild(title);
    content.appendChild(heading);
    content.appendChild(body);
    $('#output').appendChild(content);
}

// Add a to-do panel to the page
$('#submit').addEventListener('click', function() {
    var text = document.getElementsByName('input')[0].value;
    if (text.length === 0) {
        return;
    }
    var date = new Date();
    var titleDate = date.toDateString() + ' ' + toRelativeTime(date.getHours());
    console.log(text);
    printToDo(titleDate, text, 'yes');
    document.getElementsByName('input')[0].value = "";
    toDoList.push({
        'date'  : titleDate,
        'text'  : text,
        'active': 'yes'
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