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
        localStorage.setItem("toDoList", JSON.stringify(list));
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

    $: getTodosToShow = toDos.filter(value => value.active === showActiveTodos);

</script>

<header role="banner" class="container page-header text-center">
    <h1>
        Pretty Easy To-Do<br><small>Locally Saved</small>
    </h1>
</header>
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
                            {todo.timestamp}
                        </h3>
                    </div>
                    <div class="panel-body">
                        {todo.text}
                        <button class="btn btn-default block">
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
<footer>
    <p>
        Find <a href="https://github.com/dayvidwhy/local-to-do/">source</a> and me on <a href="https://github.com/dayvidwhy">Github</a>.
    </p>
</footer>

<style>
</style>