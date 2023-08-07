<script lang="ts">
    import { _ } from "svelte-i18n";
    import { Alert } from "$components/ui/alert";
    import { Badge } from "$components/ui/badge";
    import { Button } from "$components/ui/button";
    import { Card, CardHeader } from "$components/ui/card";
    import CardFooter from "$components/ui/card/CardFooter.svelte";
    import CardTitle from "$components/ui/card/CardTitle.svelte";
    import ReadableAmount from "$lib/elements/misc/ReadableAmount.svelte";
    import TaxBadge from "$lib/elements/misc/TaxBadge.svelte";
    import VerifiedBadge from "$lib/elements/misc/VerifiedBadge.svelte";
    import { Amount, Subscription, type display } from "$lib/types";
    import {
        Cog,
        FastForward,
        Loader2,
        RefreshCw,
        RefreshCwOff,
    } from "lucide-svelte";
    import PaymentSource from "./PaymentSource.svelte";
    import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "$components/ui/dialog";

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

    const display: display = {
        dark: true,
        popup: false,
    };
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
                <Badge
                    class="flex flex-row items-center gap-1 py-1 !mt-0 capitalize"
                >
                    {$_("subscription.cancelled")}
                    <RefreshCwOff size={16} />
                </Badge>
            {:else if subscription.isTrialing}
                <Badge
                    class="flex flex-row items-center gap-1 py-1 !mt-0 capitalize"
                >
                    {$_("subscription.trialing")}
                    <FastForward size={16} />
                </Badge>
            {:else}
                <Badge
                    class="flex flex-row items-center gap-1 py-1 !mt-0 capitalize"
                >
                    {$_("subscription.active")}
                    <RefreshCw size={16} />
                </Badge>
            {/if}
        </div>
    </CardHeader>
</Card>
<Alert variant="destructive">
    {$_("subscription.pastDueNotice")}
</Alert>
<PaymentSource {subscription} {display} />
<Card>
    <CardHeader>
        <CardTitle>
            {$_("subscription.payments")}
        </CardTitle>
    </CardHeader>
    <CardFooter>
        <Loader2 class="animate-spin mx-auto" />
    </CardFooter>
</Card>

<Dialog modal={true}>
    <DialogTrigger>
        <Button variant="outline" class="capitalize flex flex-row gap-3 w-full">
            {$_("subscription.manage")}
            <Cog size={16} />
        </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>
                {$_("subscription.manage")}
            </DialogTitle>
        </DialogHeader>
        <DialogFooter>
            <Button class="capitalize">
                {$_("action.cancel")}
            </Button>
        </DialogFooter>
    </DialogContent>
</Dialog>
