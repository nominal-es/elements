<script lang="ts">
    import { Card, CardHeader, CardFooter } from "$components/ui/card";
    import { _ } from "svelte-i18n";

    import Button from "$components/ui/button/Button.svelte";
    import type { Checkout, display } from "$lib/types";
    import { createEventDispatcher, onMount, onDestroy } from "svelte";
    import Skeleton from "$components/ui/skeleton/Skeleton.svelte";
    import type { StripePaymentElement } from "@stripe/stripe-js";

    export let checkout: Checkout;
    export let display: display;

    const dispatch = createEventDispatcher();

    let loading: boolean = true;

    let payment: StripePaymentElement;

    onMount(async () => {
        try {
            const elements = await checkout.methods.stripe.instance(display);
            payment = elements!.create("payment", {
                layout: "tabs",
                fields: {
                    billingDetails: {
                        name: "never",
                        email: "never",
                        phone: "auto",
                        address: "never",
                    },
                },
            });
            payment.on("change", () => {
                // remove error
            });
            payment.mount("#stripe-payment-element");
            payment.on("loaderstart", () => {
                loading = false;
            });
        } catch (error) {
            loading = false;
            dispatch("error", error);
        }
    });

    onDestroy(() => {
        if (payment) payment.destroy();
    });
</script>

{#if loading}
    <Skeleton class="h-[350px]" />
{/if}
<section class:hidden={loading}>
    <Card>
        <CardHeader id="stripe-payment-element" />
        <CardFooter>
            <Button size="lg" class="w-full capitalize">
                {#if checkout.upfront.amount}
                    {#if checkout.upcoming?.frequency}
                        {$_("checkout.payAndSubscribe")}
                    {:else}
                        {$_("checkout.pay")}
                    {/if}
                {:else if checkout.upcoming?.frequency}
                    {$_("checkout.subscribe")}
                {/if}
            </Button>
        </CardFooter>
    </Card>
</section>
