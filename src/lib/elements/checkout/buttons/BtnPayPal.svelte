<script lang="ts">
    import Skeleton from "$components/ui/skeleton/Skeleton.svelte";
    import PayPalLoader from "$lib/elements/misc/PayPalLoader.svelte";
    import type { Checkout, display } from "$lib/types";
    import { createEventDispatcher } from "svelte";

    export let display: display;
    export let checkout: Checkout;

    const dispatch = createEventDispatcher();

    let loading = true;

    function load(ev: CustomEvent<any>) {
        const paypal = ev.detail
        paypal
            .Buttons({
                createSubscription: checkout.isSubscription
                    ? checkout.methods.paypal.action
                    : undefined,
                createOrder: !checkout.isSubscription
                    ? checkout.methods.paypal.action
                    : undefined,
                onApprove: (d?: any) => dispatch("paid", d),
                style: {
                    height: 48,
                    color: display.dark ? "black" : "silver",
                },
            })
            .render("#paypal-buttons");
        loading = false;
    }
</script>

{#if !display.dark}
    <style>
        iframe[title="PayPal Checkout Overlay"] {
            filter: invert(1) !important;
        }
    </style>
{/if}

<PayPalLoader on:paypal={load} {checkout} />

{#if loading}
<Skeleton class="h-[48px]" />
{/if}
<div class:hidden={loading} id="paypal-buttons" />
