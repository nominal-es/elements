<script>
    import Checkout from "$lib/elements/checkout/Checkout.svelte";
    import { Amount, Method, Checkout as checkout } from "$lib/types";
</script>

<Checkout
    checkout={new checkout(
        "serverbench.io",
        {
            stripe: new Method("stripe", "-", "-", "payment", "pi_3NVyJ3CA7uvn961o03OQUtd0_secret_IgIq5ufxHKjmCJ8b9lR4r4qpb"),
            paypal: new Method("paypal", "-", "-", "payment", "pi_3NVyJ3CA7uvn961o03OQUtd0_secret_IgIq5ufxHKjmCJ8b9lR4r4qpb"),
        },
        new Amount("eur", 25, 21, "IVA"),
        {
            city: "Vallirana",
            country: "ES",
            line1: "",
            line2: "",
            postal_code: "",
            state: "Barcelona",
        },
        7,
        new Amount("eur", 10, 21, "IVA", "month")
    )}
    display={{
        dark: true,
        popup: false,
    }}
/>
