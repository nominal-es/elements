<script lang="ts">
    import type { Refund } from "$lib/types";
    import { Badge } from "$components/ui/badge";
    import {
        Tooltip,
        TooltipContent,
        TooltipProvider,
        TooltipTrigger,
    } from "$components/ui/tooltip";
    import ReadableAmount from "$lib/elements/misc/ReadableAmount.svelte";

    export let refund: Refund;
</script>

<div class="flex gap-3 flex-row items-center capitalize">
    <span>
        {refund.issued.toLocaleDateString()}
    </span>
    <span class="grow">
        {refund.amount.str()}
    </span>
    {#if refund.completed}
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger class="capitalize">
                    <Badge>completed</Badge>
                </TooltipTrigger>
                <TooltipContent>
                    {refund.completed.toLocaleDateString()}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    {:else}
        <Badge>issued</Badge>
    {/if}
</div>
