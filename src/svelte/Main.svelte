<script lang="ts">
import Display from "./Display.svelte";
import Toolbar from "./Toolbar.svelte";

let data = undefined;

</script>

<main>
    <Display {data}></Display>
    <Toolbar on:dataReceived={(ev) => data = ev.detail}></Toolbar>
</main>

