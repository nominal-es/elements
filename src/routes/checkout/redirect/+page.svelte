<script lang="ts">
    // handle payment redirect
    import { page } from "$app/stores";
    import { Checkout } from "$lib/types";
    import { redirect } from "@sveltejs/kit";
    const secret = $page.url.searchParams.get("secret");
    const popup = $page.url.searchParams.get("popup");
    const dark = $page.url.searchParams.get("dark");
    const origin = $page.url.searchParams.get("origin");

    let errored = [secret, popup, dark, origin].find((v) => v == null);

    export const preload = async () => {
        if (errored) return;
        const checkout: Checkout = await Checkout.fromSecret(secret!);
        if (await checkout.check()) {
            if (origin != "self") {
                // origin should be able to notice the payment success
                redirect(301, origin! + "?checkout_success");
            }
        } else {
            if (origin != "self") {
                // origin should be able to pick up the secret and continue with the payment flow
                redirect(301, origin! + "?checkout_secret=" + secret);
            } else {
                const args = new URLSearchParams({
                    secret: secret!,
                    dark: dark!,
                    popup: popup!,
                });
                redirect(
                    301,
                    `https://ui.nominal.es/checkout?${args.toString()}`
                );
            }
        }
    };
</script>
