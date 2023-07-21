<script lang="ts">
    import { Card, CardHeader, CardFooter } from "$components/ui/card";
    import { _ } from "svelte-i18n";

    import Button from "$components/ui/button/Button.svelte";
    import { Method, type Checkout, type display } from "$lib/types";
    import { createEventDispatcher, onMount, onDestroy } from "svelte";
    import Skeleton from "$components/ui/skeleton/Skeleton.svelte";
    import type {
        StripeElements,
        StripePaymentElement,
    } from "@stripe/stripe-js";
    import { Loader2 } from "lucide-svelte";

    export let checkout: Checkout;
    export let display: display;

    const dispatch = createEventDispatcher();

    let loading: boolean = true;
    let topLevelLoading: boolean = true;

    let payment: StripePaymentElement;

    let elements: StripeElements;
    onMount(async () => {
        try {
            elements = (await checkout.methods.stripe.instance(display))!;
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
                dispatch("error");
            });
            payment.mount("#stripe-payment-element");
            payment.on("loaderstart", () => {
                topLevelLoading = false;
            });
            payment.on("ready", () => {
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

    async function handlePayment(e: MouseEvent) {
        dispatch("error");
        loading = true;
        try {
            const params = new URLSearchParams({
                secret: checkout.secret,
                popup: display.popup ? "1" : "0",
                dark: display.dark ? "1" : "0",
                origin: display.origin ?? "self",
            });
            const { error } = await Method.stripe!.confirmPayment({
                elements,
                redirect: "if_required",
                confirmParams: {
                    return_url: `https://ui.nominal.es/billing/redirect?${params.toString()}`,
                    payment_method_data: {
                        billing_details: checkout.billing,
                    },
                },
            });
            if (error) {
                dispatch("error", error);
            } else {
                dispatch("success");
            }
        } catch (err) {
            dispatch("error", err);
        }
        loading = false;
    }
</script>

{#if topLevelLoading}
    <Skeleton class="h-[350px]" />
{/if}
<section class:hidden={topLevelLoading}>
    <Card>
        <CardHeader id="stripe-payment-element" />
        <CardFooter>
            <Button
                disabled={loading}
                on:click={handlePayment}
                size="lg"
                class="w-full capitalize"
            >
                {#if loading}
                    <Loader2 class="animate-spin" />
                {:else if checkout.upfront.amount}
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
