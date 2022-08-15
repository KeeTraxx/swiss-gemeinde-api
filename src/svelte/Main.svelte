<script lang="ts">
import Display from "./Display.svelte";
import Toolbar from "./Toolbar.svelte";

let data = undefined;
let metric = 'census_population'
</script>

<main>
    <Toolbar on:dataReceived={(ev) => data = ev.detail} on:metricUpdated={(ev) => metric = ev.detail}></Toolbar>
    <Display {data} {metric}></Display>
</main>

<style lang="scss">
main {
    display: flex;
    flex-direction: column;
}
</style>