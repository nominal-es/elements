<script lang="ts">
    import Skeleton from "$components/ui/skeleton/Skeleton.svelte";
    import { Checkout, Method, type display } from "$lib/types";
    import { onMount, tick } from "svelte";

    export let checkout: Checkout;
    export let display: display;

    let loading = true;
    let available = false;

    onMount(async () => {
        const elements = await checkout.methods.stripe.instance(display);

        const wallet = Method.stripe!.paymentRequest({
            country: checkout.address?.country!,
            currency: checkout.upfront.currency,
            requestShipping: false,
            disableWallets: ["link"],
            total: {
                label: checkout.displayName,
                amount: checkout.upfront.amount * 100,
            },
        });
        const express = elements!.create("paymentRequestButton", {
            paymentRequest: wallet,
        });
        express.on("click", () => {
            // remove error
        });
        if (await wallet.canMakePayment()) {
            available = true;
            loading = true;
            await tick();
            express.mount("#express-button");
            express.on("ready", () => {
                loading = false;
            });
            document.getElementById("express-button")!.style.display = "block";
        }
    });
</script>

{#if available}
    {#if loading}
        <Skeleton class="h-[54px]" />
    {/if}
    <div class:hidden={loading} id="express-button" />
{/if}
