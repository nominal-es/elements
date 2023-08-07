<script lang="ts">
    import type { Dispute } from "$lib/types";
    import { Badge } from "$components/ui/badge";
    import {
        Tooltip,
        TooltipContent,
        TooltipProvider,
        TooltipTrigger,
    } from "$components/ui/tooltip";

    export let dispute: Dispute;
</script>

<div class="flex gap-3 flex-row items-center capitalize justify-between">
    {dispute.created.toLocaleDateString()}
    {#if dispute.archived}
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger class="capitalize">
                    <Badge>closed</Badge>
                </TooltipTrigger>
                <TooltipContent>
                    {dispute.archived.toLocaleDateString()}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    {:else}
        <Badge>open</Badge>
    {/if}
</div>
