<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import type { display } from "../../../../app";

    const dispatch = createEventDispatcher();

    let display: display;
    let paypal: any;

    onMount(async () => {
        const button = paypal
            .Buttons({
                '{{"createSubscription" if recurrent else "createOrder"}}':
                    async () => {
                        const { action } = await getIntent("paypal");
                        return action;
                    },
                onApprove: (d?: any) => dispatch("paid", d),
                style: {
                    height: 48,
                    color: display.dark ? "black" : "silver",
                },
            })
            .render("#paypal-buttons");
    });
</script>

{#if display.dark}
    <style>
        iframe[title="PayPal Checkout Overlay"] {
            filter: invert(1) !important;
        }
    </style>
{/if}

<div id="paypal-buttons" />