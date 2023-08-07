<script lang="ts">
    import { _ } from "svelte-i18n";
    import { Button } from "$components/ui/button";
    import {
        Card,
        CardContent,
        CardFooter,
        CardHeader,
        CardTitle,
    } from "$components/ui/card";
    import type { Subscription, display } from "$lib/types";
    import type { StripePaymentElement } from "@stripe/stripe-js";
    import { Loader2, WalletCards } from "lucide-svelte";
    import { fade } from "svelte/transition";
    import { tick, onDestroy } from "svelte";
    import Separator from "$components/ui/separator/Separator.svelte";

    export let subscription: Subscription;
    export let display: display;
    let addingSource = false;
    const transitionDuration = 200;
    enum State {
        INACTIVE,
        MOUNTING,
        MOUNTED,
    }

    let cardModal = State.INACTIVE;
    let cardElement: StripePaymentElement | null = null;

    async function showModal() {
        if (cardModal != State.INACTIVE) return;
        cardModal = State.MOUNTING;
        cardElement = await subscription.getSetup(display);
        await tick();
        cardElement.mount("#stripe-card-element");
        cardElement.on("ready", () => {
            cardModal = State.MOUNTED;
        });
    }

    function hideModal() {
        if (cardElement) cardElement.destroy();
        cardElement = null;
        cardModal = State.INACTIVE;
    }

    async function addCard() {
        addingSource = true;
        await new Promise((resolve) => setTimeout(resolve, 3000));
        addingSource = false;
        hideModal();
    }

    onDestroy(() => {
        if (cardElement) cardElement.destroy();
    });
</script>

<Card>
    {#if cardModal == State.INACTIVE}
        <div
            in:fade={{
                delay: transitionDuration,
                duration: transitionDuration,
            }}
            out:fade={{ delay: 0, duration: transitionDuration }}
        >
            <CardHeader>
                <CardTitle>
                    {$_("subscription.paymentMethod")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {#if subscription.source}
                    source details
                {:else}
                    {$_("subscription.noPaymentMethod")}
                {/if}
            </CardContent>
            <CardFooter>
                <Button
                    on:click={showModal}
                    class="w-full capitalize flex flex-row gap-3"
                >
                    {$_("subscription.attachPaymentMethod")}
                    <WalletCards />
                </Button>
            </CardFooter>
        </div>
    {:else}
        <div
            in:fade={{
                delay: transitionDuration,
                duration: transitionDuration,
            }}
            out:fade={{ delay: 0, duration: transitionDuration }}
        >
            {#if cardModal != State.MOUNTED}
                <Loader2 class="animate-spin my-10 mx-auto" />
            {/if}
            <div class:hidden={cardModal != State.MOUNTED}>
                <CardHeader>
                    <div id="stripe-card-element" />
                </CardHeader>
                <CardFooter class="flex flex-col gap-3">
                    <Button on:click={addCard} class="w-full capitalize">
                        {#if !addingSource}
                            <span>
                                {$_("subscription.addCard")}
                            </span>
                        {:else}
                            <Loader2 class="animate-spin" />
                        {/if}
                    </Button>
                    <Separator />
                    <!-- TODO paypal -->
                    <Separator />
                    <Button
                        class="w-full capitalize"
                        variant="outline"
                        on:click={hideModal}
                    >
                        {$_("action.cancel")}
                    </Button>
                </CardFooter>
            </div>
        </div>
    {/if}
</Card>
