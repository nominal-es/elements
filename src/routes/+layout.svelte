<script context="module" lang="ts">
  import "../app.postcss";
  import "./styles.css";

  import "$lib/i18n"; // Import to initialize. Important :)
  import { _, locale, waitLocale, isLoading } from "svelte-i18n";
  import { setCurrentLocale } from "$lib/i18n";

  export const preload = async () => {
    await waitLocale();
  };
  locale.subscribe(setCurrentLocale);
</script>

<div class="app">
  <main class="container max-w-xl py-5 flex flex-col gap-5">
    {#if $isLoading}
      ...
    {:else}
      <slot />
    {/if}
  </main>
</div>
