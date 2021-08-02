<script>
    export let size = "small";
</script>

{#if size === "simple"}
    <span>
        <slot></slot>
    </span>
{/if}
{#if size === "small"}
    <p>
        <slot></slot>
    </p>
{/if}
{#if size === "regular"}
    <h3>
        <slot></slot>
    </h3>
{/if}
{#if size === "large"}
    <h2>
        <slot></slot>
    </h2>
{/if}
{#if size === "largest"}
    <h1>
        <slot></slot>
    </h1>
{/if}

<style>
    h1 {
        font-size: 40px;
        font-weight: 500;
    }

    h2 {
        font-size: 30px;
        color: #7f8c8d;
    }

    h3 {
        font-size: 24px;
    }

    h1, h2, h3 {
        margin: 10px 0;
    }

</style>