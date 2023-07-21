<script lang="ts">
    import Checkout from "$lib/elements/checkout/Checkout.svelte";
    import { Amount, Method, Checkout as checkout } from "$lib/types";

    let resource: checkout | null = null;
    (async () => {
        resource = await checkout.fromSecret("test");
    })();
</script>

<Checkout
    checkout={resource}
    display={{
        dark: true,
        popup: false,
    }}
/>
