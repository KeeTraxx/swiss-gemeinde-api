<script lang="ts">
  let municipalities = [];
  import { compare, removeFromCompare } from './store';

  compare.subscribe((m) => (municipalities = m));
</script>

<aside class="container p-4">
  <table class="table">
    <tr>
      <th>Name</th>
      {#each municipalities as m}
        <td>{m.properties.name}</td>
      {/each}
    </tr>
    <tr>
      <th>Stuff</th>
      {#each municipalities as m}
        <td>{m.properties['age_0-19_%']}</td>
      {/each}
    </tr>
  </table>
</aside>

<style lang="scss">
  aside {
    position: fixed;
    top: 4em;
    left: 0;
    bottom: 0;
  }
</style>
