/*
To-Do using Module Pattern
Version: v0.1.0
Author: David Young
*/

;var SimpleToDo = (function(window, document, $, undefined) {

    // Where we store our To-Do list.
    var list = [];

    /* 
    * Check if storage available.
    */
    function localStorageAvailable() {
        return typeof(Storage) !== 'undefined';
    }

    /*
    * Gets list of To-Do's from local storage
    */
    function fetch() {
        var retrievedObject = localStorage.getItem('toDoList');
        if (retrievedObject === null) {
            list = [];
        } else {
            list = JSON.parse(retrievedObject);
        }
    }

    /*
    * Saves list of to-do's to local storage
    */
    function save() {
        localStorage.setItem('toDoList', JSON.stringify(list));
    }

    /* 
    * Removes an item from local storage
    */
    function removeToDo(date, text) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].date === date &&
                    list[i].text === text) {
                list.splice(i, 1);
            break;
            }
        }
        save();
    }

    /* 
    * Toggles an items active state.
    */
    function toggle(date, text) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].date === date &&
                    list[i].text === text) {
                list[i].active = !list[i].active;
            break;
            }
        }
        save();
    }

    /* 
    * Prints out a Todo on the page.
    */
    function printToDo(date, text, active) {
        var panel = document.createElement('div');
        
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

        // see if the buttons active or not again
        if (active) {
            panel.className = "panel panel-to-do show";
            toggled.innerHTML = 'Done';
        } else {
            panel.className = "panel panel-done hide";
            toggled.innerHTML = 'Revert';
        }

        toggled.addEventListener('click', function() {
            var panelOwner = this.parentElement.parentElement;
            panelOwner.classList.remove('show');
            panelOwner.classList.add('hide');
            toggleActiveClass(this);
            toggle(date, text);
        });

        // create button that lets the panel be deleted
        var delButton = document.createElement('button');
        delButton.className = "btn btn-default block";
        delButton.innerHTML = 'Delete';
        delButton.addEventListener('click', function() {
            this.parentElement.parentElement.outerHTML = "";
            removeToDo(date, text);
        });

        // Add to the DOM
        body.appendChild(delButton);
        body.appendChild(toggled);
        heading.appendChild(title);
        panel.appendChild(heading);
        panel.appendChild(body);
        $('#output').appendChild(panel);
    }

    /*
    * When the user clicks revert or done.
    */
    function stateEvent(e) {
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
        for (var activeIndex = 0; activeIndex < active.length; activeIndex++) {
            active[activeIndex].classList.add('hide');
            active[activeIndex].classList.remove('show');
        }
        for (var inIndex = 0; inIndex < inactive.length; inIndex++) {
            inactive[inIndex].classList.add('show');
            inactive[inIndex].classList.remove('hide');
        }
    }

    /*
    * Apply the click handlers.
    */
    function clickHandlers() {
        var states = $('.state-buttons');
        for (var i = 0; i < states.length; i++) {
            states[i].addEventListener('click', stateEvent);
        }
        // Add a to-do panel to the page
        $('#submit').addEventListener('click', newToDo);

        // bind this context
        $('input')[0].addEventListener('keypress', keyCallback);

        $("#clear").addEventListener('click', function() {
            clearToDo();
            var all = $(".panel");
            for (var i = 0; i < all.length; i++) {
                all[i].outerHTML = ""; // purge panels
            }
        });
    }

    /*
    * Enter key support.
    */
    function keyCallback(e) {
        var key = e.which || e.keyCode;
        if (key === 13) { // listen for enter key
          newToDo();
        }
    }

    /*
    * We want to add a new ToDo.
    */
    function newToDo() {
        var text = $('input')[0].value;
        if (text.length === 0) {
            return;
        }
        var date = new Date();
        var titleDate = date.toDateString() + ' ' + toRelativeTime(date.getHours(), date.getMinutes());
        printToDo(titleDate, text, true);
        $('input')[0].value = "";
        list.push({
            'date'  : titleDate,
            'text'  : text,
            'active': true
        });
        $("#active").click();
        save();
    }

    /*
    * Swap the active class.
    */
    function toggleActiveClass(button) {
        var panelElement = button.parentElement.parentElement;
        var classes = panelElement.classList;
        if (panelElement.classList.contains('panel-to-do')) {
            panelElement.classList.add('panel-done');
            panelElement.classList.remove('panel-to-do');
            button.innerHTML = 'Revert';
        } else {
            panelElement.classList.add('panel-to-do');
            panelElement.classList.remove('panel-done');
            button.innerHTML = 'Done';
        }
    }

    /*
    * Clear To-Do's
    */
    function clearToDo() {
        list = [];
        save();
    }

    /*
    * Return the public API.
    */
    return {
        init: function() {
            if (!localStorageAvailable()) {
                $('#output').innerHTML = 'Please update your browser to use this page.';
                $('#output').style.fontSize = "24px";
                $('#output').style.color = "#a94442";
                return;
            }
            fetch();
            var length = list.length;
            if (length > 0) {
                for (var i = 0; i < length; i++) {
                    
                    // print each to-do
                    printToDo(
                        list[i].date, 
                        list[i].text, 
                        list[i].active
                    );
                }
            }
            clickHandlers();
        }
    };
})(window, document, documentQuery);

SimpleToDo.init(); // Start

/*
* Works for #id, .class and <tag>
*/
function documentQuery(element) {
    if (element[0] === '#') {
        return document.getElementById(element.slice(1, element.length));
    }
    return document.querySelectorAll(element);
}

/*
* Turns 24 hour time into 12 hour time.
*/
function toRelativeTime(hour, minutes) {
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (hour > 12) {
        hour -= 12;
        return hour + ':' + minutes + 'pm';
    }
    if (hour === 0) {
        return '12:' + minutes + 'am';
    }
    return hour + ':' + minutes + 'am';
}