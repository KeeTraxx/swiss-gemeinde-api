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
      replace(`/${f.properties.name}/census_population`);
    }
  })

  const routes = {
    '/compare/:municipalityNames/:metric': Comparison,
    '/:municipalityName/:metric': Display,
  };

  let municipalityName;
  let selectedMetric;

  function onRouteLoaded(ev) {
    municipalityName = ev.detail?.params?.municipalityName ?? municipalityName;
    selectedMetric = ev.detail?.params?.metric ?? selectedMetric;
  }
</script>

<main>
  <Toolbar {municipalityName} {selectedMetric} />
  <Router {routes} on:routeLoaded={onRouteLoaded} />
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
  }
</style>
