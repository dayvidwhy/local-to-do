/*
    To Do List using Local Storage
    Stores a stringified version of the object we keep track of.
*/

// methods
var toDo = {
    // check if storage available.
    available: function() {
        if (!this.supported) {
            if (typeof(Storage) !== "undefined") {
                this.supported = true;
            } else {
                this.supported = false;
            }
            return this.supported;
        }
        return this.supported; // we already checked before
    },

    // gets list of To-Do's from local storage
    fetch: function() {
        var retrievedObject = localStorage.getItem('toDoList');
        if (retrievedObject === null) {
            this.list = [];
        } else {
            this.list = JSON.parse(retrievedObject);
        }
    },

    // saves list of to-do's to local storage
    save: function() {
        localStorage.setItem('toDoList', JSON.stringify(this.list));
    },

    // removes an item from local storage
    remove: function(date, text) {
        var length = this.list.length;
        for (var i = 0; i < length; i++) {
            if (this.list[i].date === date
                    && this.list[i].text === text) {
                this.list.splice(i, 1);
            }
        }
        this.save();
    },

    // toggles an items active state
    toggle: function(date, text) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].date === date
                    && this.list[i].text === text) {
                this.list[i].active = !this.list[i].active;
            }
        }
        this.save();
    },

    // Prints out a Todo on the page.
    printToDo: function(date, text, active) {
        var content = document.createElement('div');
        if (active) {
            content.className = "panel panel-to-do show";
        } else {
            content.className = "panel panel-done hide";
        }
        var heading = document.createElement('div');
        heading.className = "panel-heading";
        var title = document.createElement('h3');
        title.className = "panel-title";
        title.innerHTML = date;

        var body = document.createElement('div');
        body.className = "panel-body";
        body.innerHTML = text;

        // create button that lets the panel be toggled
        var toggled = document.createElement('button');
        toggled.className = "btn btn-default block";
        toggled.innerHTML = 'Toggle';
        toggled.addEventListener('click', function() {
            var panelOwner = this.parentElement.parentElement;
            panelOwner.classList.remove('show');
            panelOwner.classList.add('hide');
            toggleActiveClass(this);
            toDo.toggle(date, text);
        });

        // create button that lets the panel be deleted
        var delButton = document.createElement('button');
        delButton.className = "btn btn-default block";
        delButton.innerHTML = 'Delete';
        delButton.addEventListener('click', function() {
            this.parentElement.parentElement.outerHTML = "";
            toDo.remove(date, text);
        });

        // Add to the DOM
        body.appendChild(delButton);
        body.appendChild(toggled);
        heading.appendChild(title);
        content.appendChild(heading);
        content.appendChild(body);
        $('#output').appendChild(content);
    },

    clickHandlers: function() {
        // Add click handlers
        var states = $('.state-buttons');
        for (var i = 0; i < states.length; i++) {
            states[i].addEventListener('click', function() {
                if (this.classList.contains('active')) {
                    return;
                }
                var active, inactive;
                this.classList.add('active');
                if (this.innerHTML === "Active") { //pretty poor check
                    // they clicked the active button
                    $("#done").classList.remove('active');
                    inactive = $(".panel-to-do");
                    active = $(".panel-done");
                } else {
                    // they clicked the done button
                    $("#active").classList.remove('active');
                    inactive = $(".panel-done");
                    active = $(".panel-to-do");
                }
                for (var i = 0; i < active.length; i++) {
                    active[i].classList.add('hide');
                    active[i].classList.remove('show');
                }
                for (var i = 0; i < inactive.length; i++) {
                    inactive[i].classList.add('show');
                    inactive[i].classList.remove('hide');
                }
            });
        }
        // Add a to-do panel to the page
        $('#submit').addEventListener('click', function() {
            var text = document.getElementsByName('input')[0].value;
            if (text.length === 0) {
                return;
            }
            var date = new Date();
            var titleDate = date.toDateString() + ' ' + toRelativeTime(date.getHours());
            toDo.printToDo(titleDate, text, true);
            document.getElementsByName('input')[0].value = "";
            toDo.list.push({
                'date'  : titleDate,
                'text'  : text,
                'active': true
            });
            toDo.save();
        });
    },

    // todo- clear button
    clear: function() {
        this.list = [];
        this.save();
    },

    // setup list
    init: function() {
        this.fetch();
        var length = this.list.length;
        if (length > 0) {
            for (var i = 0; i < length; i++) {
                this.printToDo(this.list[i].date, this.list[i].text,
                        this.list[i].active);
            }
        }
        this.clickHandlers();
    }
}

toDo.init(); // Start

/*
    cheesy selector
    works for #id, .class and <tag>
*/
function $(element) {
    if (element[0] === '#') {
        return document.getElementById(element.slice(1, element.length));
    }
    return document.querySelectorAll(element);
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
    if (panelElement.classList.contains('panel-to-do')) {
        panelElement.classList.add('panel-done');
        panelElement.classList.remove('panel-to-do');
    } else {
        panelElement.classList.add('panel-to-do');
        panelElement.classList.remove('panel-done');
    }
}