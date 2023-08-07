<script lang="ts">
    import { _ } from "svelte-i18n";

    import { Button } from "$components/ui/button";
    import { Card, CardContent } from "$components/ui/card";
    import CardDescription from "$components/ui/card/CardDescription.svelte";
    import { Separator } from "$components/ui/separator";
    import CardHeader from "$components/ui/card/CardHeader.svelte";
    import CardTitle from "$components/ui/card/CardTitle.svelte";
    import ReadableAmount from "$lib/elements/misc/ReadableAmount.svelte";
    import TaxBadge from "$lib/elements/misc/TaxBadge.svelte";
    import VerifiedBadge from "$lib/elements/misc/VerifiedBadge.svelte";
    import {
        Amount,
        Payment,
        Refund as refound,
        Dispute as dispute,
    } from "$lib/types";
    import CardFooter from "$components/ui/card/CardFooter.svelte";
    import Refund from "./Refund.svelte";
    import Dispute from "./Dispute.svelte";
    import Alert from "$components/ui/alert/Alert.svelte";

    const payment: Payment = new Payment(
        new Date(),
        "serverbench.io",
        new Amount("eur", 10, 21, "IVA"),
        "stripe",
        [
            new refound(new Date(), new Amount("eur", 5, 21, "IVA"), null),
            new refound(
                new Date(),
                new Amount("eur", 3.5, 21, "IVA"),
                new Date()
            ),
        ],
        [new dispute(new Date(), null), new dispute(new Date(), new Date())]
    );
</script>

<Card>
    <CardContent class="py-5">
        <div class="flex items-center gap-3 flex-row">
            <CardTitle class="normal-case">
                {payment.app?.name ?? payment.audience}
            </CardTitle>
            {#if !payment.app}
                <VerifiedBadge />
            {/if}
            <span class="grow" />
            <ReadableAmount amount={payment.amount} />
            <TaxBadge amount={payment.amount} />
        </div>
    </CardContent>
    <Separator />
    <CardFooter class="py-3">
        <CardDescription>
            <!-- TODO fix caps -->
            <span class="first-letter:uppercase">
                {$_("payment.paidUsing")}
                {payment.gateway}.
            </span>
            <span class="first-letter:uppercase">
                {$_("payment.completedOn")}
                {payment.created.toLocaleDateString()}
            </span>
        </CardDescription>
    </CardFooter>
</Card>

<Card>
    {#if payment.refunds.length > 0}
        <CardHeader class="pt-5 pb-3">
            <CardTitle>{$_("payment.refunds")}</CardTitle>
        </CardHeader>
        <CardContent>
            <Card class="p-3 flex flex-col gap-3">
                {#each payment.refunds as refund}
                    <Refund {refund} />
                {/each}
            </Card>
        </CardContent>
    {:else}
        <p class="py-5 text-center text-muted-foreground text-sm">
            {$_("payment.noRefunds")}
        </p>
    {/if}
</Card>

<Card>
    {#if payment.disputes.length > 0}
        <CardHeader class="pt-5 pb-3">
            <CardTitle>{$_("payment.disputes")}</CardTitle>
        </CardHeader>
        <CardContent>
            <Card class="p-3 flex flex-col gap-3">
                {#each payment.disputes as dispute}
                    <Dispute {dispute} />
                {/each}
            </Card>
        </CardContent>
    {:else}
        <p class="py-5 text-center text-muted-foreground text-sm">
            {$_("payment.noDisputes")}
        </p>
    {/if}
</Card>

<Alert>
    {$_("payment.subscriptionRelated")}
</Alert>
<Button class="capitalize">{$_("subscription.manage")}</Button>
