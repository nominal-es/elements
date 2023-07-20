<script lang="ts">
    import { _ } from "svelte-i18n";
    import type { Amount } from "$lib/types";
    export let amount: Amount;
</script>

<span class="font-['JetBrains_Mono'] text-xl font-semibold">
    {amount.str()}{#if amount.frequency}{$_(`time.${amount.frequency}`)}{/if}
</span>
