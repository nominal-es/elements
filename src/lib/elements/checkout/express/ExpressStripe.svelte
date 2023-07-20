<script lang="ts">
    import { Checkout, Method, type display } from "$lib/types";
    import { onMount } from "svelte";

    export let checkout: Checkout;
    export let display: display;

    onMount(async () => {
        const elements = await checkout.methods.stripe.instance(display);

        const wallet = Method.stripe!.paymentRequest({
            country: checkout.address?.country!,
            currency: checkout.upfront.currency,
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
            express.mount("#express-button");
            document.getElementById("express-button")!.style.display = "block";
        }
    });
</script>

<div id="express-button" />
