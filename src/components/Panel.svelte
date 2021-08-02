<script>
    import { createEventDispatcher } from "svelte";
    import Button from "./Button.svelte";

    export let todo;

    const dispatch = createEventDispatcher();

    function deleteToDo (deletedToDo) {
        dispatch("deleteToDo", deletedToDo);
    }

    function toggleToDo (toggledToDo) {
        dispatch("toggleToDo", toggledToDo);
    }
</script>

<div
    class:panel-to-do="{todo.active}"
    class:panel-done="{!todo.active}"
    class="panel">
    <div class="panel-heading">
        <h3 class="panel-title">
            {new Date(todo.timestamp).toUTCString()}
        </h3>
    </div>
    <div class="panel-body">
        <span>
            {todo.text}
        </span>
        <span class="float-right">
            <Button
                type={"default"}
                on:click={() => toggleToDo(todo)}>
                {todo.active ? "Done" : "Revert"}
            </Button>
            <Button
                type={"default"}
                on:click={() => deleteToDo(todo)}>
                Delete
            </Button>
        </span>
    </div>
</div>

<style>
    .float-right {
        float: right;
    }
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
</style>