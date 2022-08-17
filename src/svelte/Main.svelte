<script lang="ts">
  import { results } from './store';
  import Display from './Display.svelte';
  import Toolbar from './Toolbar.svelte';
</script>

<main>
  <Toolbar />
  <Display />
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
  }
</style>
