<script lang="ts">
    import { Stripe } from "stripe";
    import { loadStripe } from "@stripe/stripe-js";
    import StripeDisclaimer from "./StripeDisclaimer.svelte";
    import { onMount } from "svelte";
    import { Button } from "$components/ui/button";
    import { _ } from "svelte-i18n";

    let secret: string;
    let dark: boolean = false;
    let customer: Stripe.Customer | undefined = undefined;

    onMount(async () => {
        const stripe = await loadStripe(
            "pk_test_51N06CaCA7uvn961o2Ic2dccaYYZekwvHsMLcHBoY4vKXG7bCe3ZR2NpAhJA7qPZDYq2TamxwDbCJUXsOVuR62o0o00wemRmGdC"
        );
        const elements = stripe!.elements({
            clientSecret: secret,
            appearance: {
                theme: dark ? "night" : "stripe",
                rules: {
                    ".Tab": {
                        boxShadow: "none",
                    },
                    ".Input": {
                        boxShadow: "none",
                    },
                },
                variables: {
                    colorPrimary: "#" + (dark ? "ffffff" : "000000"),
                    colorBackground: "#" + (dark ? "2c2e2f" : "f7f7f7"),
                },
            },
        });

        const emailElement = elements.create("linkAuthentication", {
            defaultValues: customer?.email ? {
                email: customer?.email,
            } : undefined
        });

        const addressElement = elements.create("address", {
            mode: "billing",
            defaultValues: {
                name: customer?.name,
                email: customer?.email,
                phone: customer?.phone,
                address: customer?.address,
            },
        });
        const dummyElement = elements.create("payment", {
            readOnly: true,
            wallets: {
                applePay: "never",
                googlePay: "never",
            },
        });
        addressElement.mount("#address");
        emailElement.mount("#email");
        dummyElement.mount("#dummy");
    });
</script>

<!-- section title -->
<h2 class="font-extrabold text-2xl">
    {$_("billingAddress")}
</h2>

<!-- dummy, hidden payment, in order to show stripe address autocompletion-->
<div class="hidden" id="dummy" />

<!-- email input, will be appended by stripe elements -->
<div id="email" />

<!-- address form will be appended by stripe elements -->
<div id="address" />

<!-- disclaimer -->
<section class="flex flex-row gap-5 items-center">
    <StripeDisclaimer />
    <Button class="flex flex-row gap-2" variant="outline">
        {$_("continue")}
        <i class="fa-solid fa-caret-right" />
    </Button>
</section>
