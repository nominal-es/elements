<script lang="ts">
    import { Card, CardHeader, CardFooter } from "$components/ui/card";
    import { _ } from "svelte-i18n";

    import Button from "$components/ui/button/Button.svelte";
    import type { Checkout, display } from "$lib/types";
    import { onMount } from "svelte";

    export let checkout: Checkout;
    export let display: display;

    onMount(async () => {
        const elements = await checkout.methods.stripe.instance(display);

        const payment = elements!.create("payment", {
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
    });
</script>

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
