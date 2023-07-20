<script lang="ts">
    import { Badge } from "$components/ui/badge";
    import type { Amount } from "$lib/types";

    export let amount: Amount;
</script>

{#if amount.taxRate}
    <Badge class="py-1">
        {amount.taxRate}% {amount.taxName}
    </Badge>
{/if}