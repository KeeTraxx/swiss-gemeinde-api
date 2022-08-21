<script lang="ts">
  import Display from './Display.svelte';
  import Toolbar from './Toolbar.svelte';
  import Comparison from './Comparison.svelte';
  import en from './i18n/en.json';
  import de from './i18n/de.json';
  import fr from './i18n/fr.json';
  import it from './i18n/it.json';
  import { get } from 'svelte/store';
  import {
    addMessages,
    init,
    getLocaleFromNavigator,
    dictionary,
  } from 'svelte-i18n';

  addMessages('en', en);
  addMessages('de', de);
  addMessages('fr', fr);
  addMessages('it', it);

  init({
    fallbackLocale: 'de',
    initialLocale: window.localStorage.getItem('lang') || getLocaleFromNavigator(),
  });
  console.log(get(dictionary));
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
