<script lang="ts">
    import { PUBLIC_PAYPAL_PK } from "$env/static/public";
    import type { Checkout } from "$lib/types";
    import { onMount, createEventDispatcher, tick } from "svelte";

    export let checkout: Checkout;

    const dispatch = createEventDispatcher();
    let requiresLoader = false;
    let paypalLoader: HTMLScriptElement;
    let url: string;

    onMount(async () => {
        if ("paypal" in window) {
            dispatch("paypal", window.paypal);
        } else {
            requiresLoader = true;
            const params: URLSearchParams = new URLSearchParams({
                "client-id": PUBLIC_PAYPAL_PK,
                components: "buttons",
            });
            if (checkout.isSubscription) params.set("intent", "subscription");
            params.set("vault", "true");
            if ("stripe" in checkout.methods)
                params.set("disable-funding", "card");
            url = "https://www.paypal.com/sdk/js?" + params.toString();
            await tick();
            paypalLoader.addEventListener("load", () => {
                if ("paypal" in window) {
                    dispatch("paypal", window.paypal);
                }
            });
        }
    });
</script>

<svelte:head>
    {#if requiresLoader}
        <script bind:this={paypalLoader} src={url}></script>
    {/if}
</svelte:head>
