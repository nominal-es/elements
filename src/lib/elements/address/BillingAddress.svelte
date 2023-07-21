<script lang="ts">
    import type { Stripe } from "stripe";
    import StripeDisclaimer from "../misc/StripeDisclaimer.svelte";
    import { onMount, onDestroy } from "svelte";
    import { Button } from "$components/ui/button";
    import { _ } from "svelte-i18n";
    import type { Checkout, display } from "$lib/types";
    import type {
        Address,
        StripeAddressElement,
        StripeAddressElementOptions,
        StripeLinkAuthenticationElement,
        StripePaymentElement,
    } from "@stripe/stripe-js";
    import Skeleton from "$components/ui/skeleton/Skeleton.svelte";
    import { ChevronRight, Loader2 } from "lucide-svelte";
    import { redirect } from "@sveltejs/kit";
    import { goto } from "$app/navigation";

    export let display: display;
    export let checkout: Checkout | null;

    let customer: Stripe.Customer | undefined = undefined;
    let mounted = 0;
    let completed = {
        email: false,
        address: false,
    };

    let emailElement: StripeLinkAuthenticationElement;
    let addressElement: StripeAddressElement;
    let dummyElement: StripePaymentElement;

    let address: Address;
    let name: string;
    let email: string;

    let submitting = false;
    $: mounting = mounted < 3;
    $: loading = !checkout || submitting;
    $: complete = completed.email && completed.address;

    async function mount() {
        if (!checkout) return;
        const elements = await checkout.methods.stripe.instance(display);

        emailElement = elements!.create("linkAuthentication", {
            defaultValues: customer?.email
                ? {
                      email: customer?.email,
                  }
                : undefined,
        });
        emailElement.mount("#email");
        emailElement.on("loaderstart", () => mounted++);
        emailElement.on("change", (ev) => {
            email = ev.value.email;
            completed.email = ev.complete;
        });

        addressElement = elements!.create("address", <
            StripeAddressElementOptions
        >{
            mode: "billing",
            defaultValues: {
                name: customer?.name,
                email: customer?.email,
                phone: customer?.phone,
                address: customer?.address,
            },
        });
        addressElement.mount("#address");
        addressElement.on("loaderstart", () => mounted++);
        addressElement.on("change", (ev) => {
            address = ev.value.address;
            name = ev.value.name;
            completed.address = ev.complete;
        });

        dummyElement = elements!.create("payment", {
            readOnly: true,
            wallets: {
                applePay: "never",
                googlePay: "never",
            },
        });
        dummyElement.mount("#dummy");
        dummyElement.on("loaderstart", () => mounted++);
    }

    async function submit() {
        submitting = true;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        goto("/checkout/payment");
    }

    onDestroy(() => {
        if (dummyElement) dummyElement.destroy();
        if (emailElement) emailElement.destroy();
        if (addressElement) addressElement.destroy();
    });

    onMount(async () => {
        mount();
    });

    $: if (checkout) {
        mount();
    }
</script>

<!-- section title -->
<h2 class="font-extrabold text-2xl">
    {$_("billingAddress")}
</h2>

<!-- dummy, hidden payment, in order to show stripe address autocompletion-->
<div class="hidden" id="dummy" />

<!-- email input, will be appended by stripe elements -->
<div class:hidden={loading} id="email" />

<!-- address form will be appended by stripe elements -->
{#if mounting}
    {#each Array(5) as _}
        <Skeleton class="h-[43px] mt-4" />
    {/each}
{/if}
<div class:hidden={mounting} id="address" />

<!-- disclaimer -->
<section class="flex flex-row gap-5 items-center">
    <StripeDisclaimer />
    <Button
        disabled={!complete || loading}
        on:click={submit}
        class="flex flex-row gap-1 capitalize"
        variant="default"
    >
        {#if !loading}
            {$_("continue")}
            <ChevronRight />
        {:else}
            <Loader2 class="animate-spin mx-10" />
        {/if}
    </Button>
</section>
