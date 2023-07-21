<script lang="ts">
    import BillingAddress from "$lib/elements/address/BillingAddress.svelte";
    import { Checkout } from "$lib/types";
    let checkout: Checkout;
    (async () => {
        checkout = await Checkout.fromSecret("");
    })();
</script>

<BillingAddress {checkout} display={{
    dark:true,
    popup:false,
}} />
