<script>
    import { createEventDispatcher } from "svelte";

    export let aria = "";
    export let type;
    export let active = false;

    const dispatch = createEventDispatcher();

    function clicked () {
        dispatch("click");
    }
</script>

<button
    on:click={clicked}
    class:btn-danger={type === "danger"}
    class:btn-default={type === "default"}
    class:active={active}
    class="btn btn-default"
    aria-label={aria}>
    <slot></slot>
</button>

<style>
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
</style>