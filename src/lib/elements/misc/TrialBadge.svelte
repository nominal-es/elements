<script lang="ts">
    import { Badge } from "$components/ui/badge";
    import type { Checkout } from "$lib/types";

    export let checkout: Checkout;
</script>

{#if checkout.delay}
    <Badge>
        {checkout.delay} trial
    </Badge>
{/if}