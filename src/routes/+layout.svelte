<!-- svelte-ignore module-script-reactive-declaration -->
<script context="module" lang="ts">
  import "../app.postcss";
  import "./styles.css";

  import "$lib/i18n"; // Import to initialize. Important :)
  import { _, locale, waitLocale, isLoading } from "svelte-i18n";
  import { setCurrentLocale } from "$lib/i18n";
  import { fade } from "svelte/transition";
  import { emit } from "$lib/types";

  export const preload = async () => {
    await waitLocale();
  };
  locale.subscribe(setCurrentLocale);

  let container: HTMLElement | null = null;

  async function reportSize() {
    if (container) {
      emit(
        "dim",
        {
          h: container!.offsetHeight,
          w: container!.offsetWidth,
        },
        true
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
    reportSize();
  }

  export const load = reportSize();
</script>

<div class="app">
  <main bind:this={container}>
    {#if !$isLoading}
      <div
        class="container max-w-xl py-5 flex flex-col gap-5 px-3"
        transition:fade={{
          duration: 100,
        }}
      >
        <slot />
      </div>
    {/if}
  </main>
</div>
