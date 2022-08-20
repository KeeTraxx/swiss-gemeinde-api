<script lang="ts">
  import Display from './Display.svelte';
  import Toolbar from './Toolbar.svelte';
  import Comparison from './Comparison.svelte';

  // src/i18n.js
import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

register('en', () => import('./i18n/en.json'));
register('de', () => import('./i18n/de.json'));
register('fr', () => import('./i18n/fr.json'));
register('it', () => import('./i18n/it.json'));
// en, en-US and pt are not available yet

init({
  fallbackLocale: 'de',
  initialLocale: getLocaleFromNavigator(),
});
// starts loading 'en-US' and 'en'
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
