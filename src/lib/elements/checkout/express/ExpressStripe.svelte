<script lang="ts">
    import Skeleton from "$components/ui/skeleton/Skeleton.svelte";
    import { Checkout, Method, type display } from "$lib/types";
    import { onMount, tick, createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

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
        wallet.on("paymentmethod", async (ev) => {
            const { paymentIntent, error: confirmError } =
                await Method.stripe!.confirmCardPayment(
                    await checkout.methods.stripe.action(),
                    { payment_method: ev.paymentMethod.id },
                    { handleActions: false }
                );
            if (confirmError) {
                ev.complete("fail");
                dispatch("error", confirmError);
            } else {
                ev.complete("success");
                if (paymentIntent.status === "requires_action") {
                    const { error } = await Method.stripe!.confirmCardPayment(
                        await checkout.methods.stripe.action()
                    );
                    if (error) {
                        dispatch('error', error);
                    } else {
                        dispatch('success')
                    }
                } else {
                    dispatch('success')
                }
            }
        });
        const express = elements!.create("paymentRequestButton", {
            paymentRequest: wallet,
        });
        express.on("click", () => {
            // remove error
            dispatch("error");
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
        <Skeleton class="h-[40px]" />
    {/if}
    <div class:hidden={loading} id="express-button" />
{/if}
