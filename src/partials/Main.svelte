<script>
    import { onMount } from 'svelte';

    let toDos = [];

    onMount(fetch);
    let currentEntry = "";
    let showActiveTodos = true; // or "done"

    // Gets list of To-Do's from local storage
    function fetch () {
        var retrievedObject = localStorage.getItem("toDoList");
        if (retrievedObject === null) {
            toDos = [];
        } else {
            toDos = JSON.parse(retrievedObject);
        }
    }

    /*
    * Saves list of to-do's to local storage
    */
    function save () {
        localStorage.setItem("toDoList", JSON.stringify(toDos));
    }

    // We want to add a new ToDo.
    function createToDo (event) {
        var text = currentEntry;
        var date = new Date();
        var titleDate = date.toDateString() + " " + date.toTimeString();
        toDos = [{
            "date"  : titleDate,
            "text"  : text,
            "timestamp": +date,
            "active": true
        }, ...toDos];
        currentEntry = "";
        save();
    };

    // Clear To-Do's
    function clearToDo () {
        toDos = [];
        save();
    }

    function viewActiveTodos () {
        showActiveTodos = true;
    }
    
    function viewDoneTodos () {
        showActiveTodos = false;
    }
    
    function toggleTodo (todo) {
        todo.active = !todo.active;
        // quirk with svelte, see https://svelte.dev/tutorial/updating-arrays-and-objects
        toDos = toDos;
    }

    const deleteToDo = (deletedTodo) => {
        for (let i = 0; i < toDos.length; i++) {
            if (deletedTodo.timestamp === toDos[i].timestamp) {
                toDos.splice(i, 1);
                break;
            }
        }
        toDos = toDos;
        save();
    }

    $: getTodosToShow = toDos.filter(value => value.active === showActiveTodos);
</script>

<main class="container">
    <div class="row">
        <div class="col-8 offset-2">
            <h2>
                What's this?
            </h2>
            <p>
                I wanted to test out the abilities of local storage to keep track of some items.
                Things you enter in the box below will get kept on record in your browser.
            </p>
            <form on:submit|preventDefault={createToDo}>
                <input
                    type="text"
                    class="form-control"
                    placeholder="I want to..."
                    bind:value={currentEntry} />
                <input
                    type="submit"
                    value="+"
                    class="btn btn-default input-button" />
            </form>
        </div>
    </div>
    <div class="row">
        <div class="col-8 offset-2">
            <div
                class="btn-group"
                role="group"
                aria-label="Active and Done">
                <button
                    on:click={viewActiveTodos}
                    class:active="{showActiveTodos}"
                    class="btn btn-default state-buttons"
                    aria-label="Active Items">
                    Active
                </button>
                <button
                    on:click={viewDoneTodos}
                    class:active="{!showActiveTodos}"
                    class="btn btn-default state-buttons"
                    aria-label="Done Items">
                    Done
                </button>
                <button
                    on:click={clearToDo}
                    type="button"
                    class="btn btn-danger"
                    aria-label="Active Items">
                    Clear All
                </button>
            </div>
        </div>
    </div>
    <div class="row top-margin">
        <div id="output" class="col-8 offset-2">
            {#each getTodosToShow as todo}
                <div class:panel-to-do="{todo.active}" class:panel-done="{!todo.active}" class="panel show">
                    <div class="panel-heading">
                        <h3 class="panel-title">
                            {new Date(todo.timestamp).toUTCString()}
                        </h3>
                    </div>
                    <div class="panel-body">
                        {todo.text}
                        <button
                            on:click={() => deleteToDo(todo)}
                            class="btn btn-default block">
                            Delete
                        </button>
                        <button
                            on:click={() => toggleTodo(todo)}
                            class="btn btn-default block">
                            {todo.active ? "Done" : "Revert"}
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</main>

<style>
    main {
        display: block;
    }

    .top-margin {
        margin-top: 10px;
    }

    .block {
        display: block;
        float: right;
        margin-left: 10px;
    }

    /* buttons */
    .btn {
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        white-space: nowrap;
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid transparent;
    }

    .btn-default {
        color: #333;
        background-color: #fff;
        border-color: #ccc;
    }

    .btn-danger {
        color: #a94442;
        background-color: #f2dede;
        border-color: #ebccd1;
    }

    .active {
        color: #FFF;
        background-color: #2980b9;
        border-color: #adadad;
    }

    .btn-group {
        text-align: center;
        width: 100%;
        display: block;
        margin: 10px 0;
    }

    .btn-group > .btn {
        width: 20%;
        display: inline-block;
    }
    .btn-group > .btn:first-child {
        margin-right: 1%;
    }
    .btn-group > .btn:last-child {
        margin-left: 1%;
    }
    /* end buttons */
    .input-button {
        width: 9%;
        display: inline-block;
        font-size: 24px;
        padding: 10px;
        border-radius: 0;
        transition: all 0.1s ease-in-out;
    }

    .input-button:hover {
        color: #FFF;
        background-color: #1abc9c; 
    }

    input[type=text] {
        display: inline-block;
        padding: 13px;
        border: 1px solid #ccc;
        outline: none;
        font-size: 24px;
        cursor: inherit;
        width: 90%;
    }

    /* Panels */
    .panel {
        border: 1px solid #7f8c8d;
        margin-bottom: 10px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }

    .panel-to-do {
        border-color: #bce8f1;
    }

    .panel-heading {
        padding: 10px 15px;
    }

    .panel-title {
        font-size: 16px;
        color: inherit;
    }

    .panel-to-do > .panel-heading {
        color: #31708f;
        background-color: #d9edf7;
        border-color: #bce8f1;
    }

    .panel-done {
        border-color: #ebccd1;
    }

    .panel-done > .panel-heading {
        color: #a94442;
        background-color: #f2dede;
        border-color: #ebccd1;
    }

    .panel-body {
        font-size: 1.7em;
        padding: 15px 15px;
        background-color: #FFF;
    }
    /* End panels */
</style>