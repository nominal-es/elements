<script lang="ts">
  import "../app.postcss";
  import "./styles.css"

  import { browser } from "$app/environment";
  import "$lib/i18n"; // Import to initialize. Important :)
  import { locale, waitLocale } from "svelte-i18n";

  export const load = async () => {
    if (browser) {
      locale.set(window.navigator.language);
    }
    await waitLocale();
  };
</script>

<div class="app">
  <main class="container max-w-xl py-5 flex flex-col gap-5">
    <slot />
  </main>
</div>
