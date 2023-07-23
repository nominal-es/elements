<script lang="ts">
    import { Badge } from "$components/ui/badge";
    import type { Amount } from "$lib/types";

    export let amount: Amount;
    export let slim = false;
</script>

{#if amount.taxRate}
    <Badge class={"!mt-0" + (!slim ? " py-1" : "")}>
        {amount.taxRate}% {amount.taxName}
    </Badge>
{/if}
