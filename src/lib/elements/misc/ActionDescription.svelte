<script lang="ts">
    import type { Checkout } from "$lib/types";

    export let checkout: Checkout;
</script>

<span>
    {#if checkout.upfront}
        Pay {checkout.upfront.str()} Now
    {/if}
    {#if checkout.delay && checkout.upcoming}
        <span>Then, After {checkout.delay} Days, {checkout.upcoming.str()}</span>
    {/if}
</span>
