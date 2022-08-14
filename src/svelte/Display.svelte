<script lang="ts">
  import { afterUpdate } from 'svelte';
  import { scaleLinear, select } from 'd3';
  export let data;
  let svg;

  const 

  afterUpdate(() => {
    console.log('afterupdate', data);
    const scale = scaleLinear();
    console.log(scale, svg);
  });
</script>

<svg bind:this={svg}>

</svg>

