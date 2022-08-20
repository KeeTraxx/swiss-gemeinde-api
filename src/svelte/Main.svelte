<script lang="ts">
  import { results } from './store';
  import Display from './Display.svelte';
  import Toolbar from './Toolbar.svelte';
  import Comparison from './Comparison.svelte';
</script>

<main>
  <Toolbar />
  <Display />
  <Comparison />
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
  }
</style>
