
// handle payment redirect
import { Checkout } from "$lib/types";
import { redirect } from "@sveltejs/kit";

export const load = async ({url}) => {
    const secret = url.searchParams.get("secret");
    const popup = url.searchParams.get("popup");
    const dark = url.searchParams.get("dark");
    const origin = url.searchParams.get("origin");
    
    let errored = [secret, popup, dark, origin].find((v) => v == null) != null;
    
    if (errored) return;
    const checkout: Checkout = await Checkout.fromSecret(secret!);
    if (await checkout.check()) {
        if (origin != "self") {
            // origin should be able to notice the payment success
            throw redirect(302, origin! + "?checkout_success");
        }
    } else {
        if (origin != "self") {
            // origin should be able to pick up the secret and continue with the payment flow
            throw redirect(302, origin! + "?checkout_secret=" + secret);
        } else {
            const args = new URLSearchParams({
                secret: secret!,
                dark: dark!,
                popup: popup!,
            });
            throw redirect(
                302,
                `/checkout/payment?${args.toString()}`
            );
        }
    }
};