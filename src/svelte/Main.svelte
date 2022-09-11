<script lang="ts">
  import Router from 'svelte-spa-router';
  import {location, replace} from 'svelte-spa-router';
  import Display from './Display.svelte';
  import Toolbar from './Toolbar.svelte';
  import Comparison from './Comparison.svelte';
  import en from './i18n/en.json';
  import de from './i18n/de.json';
  import fr from './i18n/fr.json';
  import it from './i18n/it.json';
  import { addMessages, init } from 'svelte-i18n';
  import {payload} from './store';
  import municipalityService from './municipality.service';

  addMessages('en', en);
  addMessages('de', de);
  addMessages('fr', fr);
  addMessages('it', it);

  init({
    fallbackLocale: 'de',
    initialLocale: window.localStorage.getItem('lang'),
  });

  location.subscribe( async l => {
    console.log('location', l);
    if (l === '/') {
      const f = await municipalityService.findByGeolocation();
      $payload = f.properties.name;
    }
  })

  const routes = {
    '/c/:municipalityNames/:metric': Comparison,
    '/m/:municipalityName/:metric': Display,
  };

  let municipalityName;
  let selectedMetric;

</script>

<main>
  <Toolbar />
  <Router {routes} />
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
  }
</style>
