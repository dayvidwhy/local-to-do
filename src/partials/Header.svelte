<script>
    import Words from "../components/Words.svelte";
</script>

<header
    role="banner"
    class="container page-header text-center">
    <Words
        size={"largest"}>
        Pretty Easy To-Do
    </Words>
    <Words
        size={"large"}>
        Locally Saved
    </Words>
</header>

<style>
    .text-center {
        text-align: center;
    }
    .page-header {
        border-bottom: 1px solid #7f8c8d;
    }
</style>