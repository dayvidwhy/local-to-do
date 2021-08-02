<script>
    import { onMount } from 'svelte';
    import Panel from "../components/Panel.svelte";
    import Button from "../components/Button.svelte";

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
    function createToDo () {
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
    
    function toggleToDo (event) {
        const todo = event.detail;
        todo.active = !todo.active;
        // quirk with svelte, see https://svelte.dev/tutorial/updating-arrays-and-objects
        toDos = toDos;
    }

    const deleteToDo = (event) => {
        const deletedTodo = event.detail;
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
                <button
                    type="submit"
                    value="+"
                    class="btn btn-default input-button">+</button>
            </form>
        </div>
    </div>
    <div class="row">
        <div class="col-8 offset-2">
            <div
                class="btn-group"
                role="group"
                aria-label="Active and Done">
                <Button
                    on:click={viewActiveTodos}
                    active={showActiveTodos}
                    type={"default"}
                    aria={"Active Items"}>
                    Active
                </Button>
                <Button
                    on:click={viewDoneTodos}
                    active={!showActiveTodos}
                    type={"default"}
                    aria={"Done Items"}>
                    Done
                </Button>
                <Button
                    on:click={clearToDo}
                    type={"danger"}
                    aria={"Active Items"}>
                    Clear All
                </Button>
            </div>
        </div>
    </div>
    <div class="row top-margin">
        <div class="col-8 offset-2">
            {#each getTodosToShow as todo}
                <Panel
                    todo={todo}
                    on:deleteToDo={deleteToDo}
                    on:toggleToDo={toggleToDo} />
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
    .btn-group {
        text-align: center;
        width: 100%;
        display: block;
        margin: 10px 0;
    }

    .input-button {
        line-height: 1.42857143;
        white-space: nowrap;
        cursor: pointer;
        border: 1px solid transparent;
        color: #333;
        background-color: #fff;
        border-color: #ccc;
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
</style>