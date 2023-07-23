<script lang="ts">
    import { Alert } from "$components/ui/alert";
    import { Badge } from "$components/ui/badge";
    import { Button } from "$components/ui/button";
    import { Card, CardHeader } from "$components/ui/card";
    import CardContent from "$components/ui/card/CardContent.svelte";
    import CardFooter from "$components/ui/card/CardFooter.svelte";
    import CardTitle from "$components/ui/card/CardTitle.svelte";
    import ReadableAmount from "$lib/elements/misc/ReadableAmount.svelte";
    import TaxBadge from "$lib/elements/misc/TaxBadge.svelte";
    import VerifiedBadge from "$lib/elements/misc/VerifiedBadge.svelte";
    import { Amount, Subscription } from "$lib/types";
    import {
        FastForward,
        Loader2,
        RefreshCw,
        RefreshCwOff,
        WalletCards,
    } from "lucide-svelte";

    export let subscription: Subscription = new Subscription(
        new Date(),
        "serverbench.io",
        {
            slug: "hosting",
        },
        null,
        7,
        new Amount("eur", 10, 21, "IVA", "month"),
        null,
        null,
        []
    );
</script>

<div class="flex flex-row items-center gap-3 justify-center">
    <CardTitle class="normal-case">
        {subscription.displayName}
    </CardTitle>
    <span>
        {subscription.description.title ?? subscription.description.slug}
    </span>
    <VerifiedBadge />
</div>
<Card>
    <CardHeader class="flex flex-row items-center justify-between">
        <ReadableAmount amount={subscription.amount} />
        <div class="flex flex-row items-center gap-3">
            <TaxBadge amount={subscription.amount} />
            {#if subscription.cancelled}
                <Badge class="flex flex-row items-center gap-1 py-1 !mt-0">
                    Cancelled
                    <RefreshCwOff size={16} />
                </Badge>
            {:else if subscription.isTrialing}
                <Badge class="flex flex-row items-center gap-1 py-1 !mt-0">
                    Trialing
                    <FastForward size={16} />
                </Badge>
            {:else}
                <Badge class="flex flex-row items-center gap-1 py-1 !mt-0">
                    Active
                    <RefreshCw size={16} />
                </Badge>
            {/if}
        </div>
    </CardHeader>
</Card>
<Alert variant="destructive">
    You have past due payments, please, fulfill them as soon as possible, or any
    goods related to this subscription may be terminated.
</Alert>
<Card>
    <CardHeader>
        <CardTitle>Payment Method</CardTitle>
    </CardHeader>
    <CardContent>
        {#if subscription.source}
            source details
        {:else}
            This subscription doesn't have any attached payment methods. You can
            provide one here in order to automatically renew your subscription.
        {/if}
    </CardContent>
    <CardFooter>
        <Button class="w-full capitalize flex flex-row gap-3">
            Attach a payment method
            <WalletCards />
        </Button>
    </CardFooter>
</Card>
<Card>
    <CardHeader>
        <CardTitle>Payments</CardTitle>
    </CardHeader>
    <CardFooter>
        <Loader2 class="animate-spin mx-auto" />
    </CardFooter>
</Card>
<Button variant="outline" class="capitalize flex flex-row gap-3">
    Cancel Subscription
    <RefreshCwOff size={16} />
</Button>
