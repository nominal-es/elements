<script lang="ts">
    import type { Checkout, display } from "$lib/types";

    import { Pen, Plus } from "lucide-svelte";

    import TaxBadge from "../misc/TaxBadge.svelte";
    import TrialBadge from "../misc/TrialBadge.svelte";
    import VerifiedBadge from "../misc/VerifiedBadge.svelte";
    import ReadableAmount from "../misc/ReadableAmount.svelte";

    export let checkout: Checkout | null;
    export let display: display;

    let error: Error | null = null;

    import { _ } from "svelte-i18n";
    import CardStripe from "./cards/CardStripe.svelte";
    import BtnPayPal from "./buttons/BtnPayPal.svelte";
    import ExpressStripe from "./express/ExpressStripe.svelte";
    import Alert from "$components/ui/alert/Alert.svelte";
    import AlertDescription from "$components/ui/alert/AlertDescription.svelte";
    import Skeleton from "$components/ui/skeleton/Skeleton.svelte";
    import Card from "$components/ui/card/Card.svelte";
    import CardContent from "$components/ui/card/CardContent.svelte";
    import { Button } from "$components/ui/button";

    function errorHandler(event: CustomEvent<Error>) {
        console.log(event);
        if (!event.detail) {
            // ensure null type
            error = null;
        } else {
            error = event.detail;
        }
    }

    async function successHandler(event: CustomEvent<any>) {
        await checkout!.check();
        window.alert("payment complete");
    }
</script>

<!-- amount description -->
{#if checkout}
    <section
        id="price"
        class="flex flex-row gap-3 items-center text-xl {checkout.hasSetup
            ? 'justify-center'
            : ''}"
    >
        <div
            class="font-extrabold text-ellipsis whitespace-nowrap overflow-hidden min-w-0"
        >
            {checkout.displayName}
        </div>
        <!-- verified checkmark -->
        {#if !checkout.app}
            <VerifiedBadge />
        {/if}

        <!-- no-setup -->
        {#if !checkout.hasSetup}
            <div class="grow" />

            <!-- trial indicator -->
            <TrialBadge {checkout} />

            <!-- tax rate indicator -->
            <TaxBadge amount={checkout.upfront} />

            <!-- amount indicator -->
            <ReadableAmount amount={checkout.upfront} />
        {:else}
            <TaxBadge amount={checkout.upfront} />
        {/if}
    </section>

    <section>
        {#if checkout.hasSetup && checkout.upcoming}
            <!-- multi-charge breakdown -->
            <section class="items-center justify-center flex flex-row gap-5">
                <div
                    class="grow w-full flex flex-col gap-3 items-center flex-wrap"
                >
                    <div class="flex flex-row gap-3 items-center">
                        <ReadableAmount amount={checkout.upfront} />
                    </div>
                    <span class="text-sm capitalize">
                        {$_("checkout.totalDueToday")}
                    </span>
                </div>
                <Plus />
                <div
                    class="grow w-full flex flex-col gap-3 items-center flex-wrap"
                >
                    <ReadableAmount amount={checkout.upcoming} />
                    <span class="text-sm capitalize">
                        {#if checkout.delay}
                            {$_("checkout.startingIn")} {checkout.delay}
                        {:else}
                            {$_("checkout.startingIn")}
                            {checkout.upcoming?.frequency}
                        {/if}
                    </span>
                </div>
            </section>
        {/if}
    </section>

    {#if error}
        <Alert>
            <AlertDescription>
                {error.message}
            </AlertDescription>
        </Alert>
    {/if}

    <!-- express buttons (google pay, apple pay, etc) -->
    {#if "stripe" in checkout.methods}
        <ExpressStripe
            on:success={successHandler}
            on:error={errorHandler}
            {display}
            {checkout}
        />
    {/if}

    <!-- addresss -->
    <section>
        <Card>
            <CardContent
                class="text-foreground flex flex-row items-center py-3 text-sm"
            >
                <div class="grow flex flex-col gap-1">
                    <p>
                        {checkout.billing.email}
                    </p>
                    <div
                        class="text-muted-foreground text-xs flex flex-row gap-2 items-center"
                    >
                        <span>
                            {checkout.billing.address?.country}
                        </span>
                        <span>
                            {checkout.billing.address?.state}
                        </span>
                        <span>
                            {checkout.billing.address?.postal_code}
                        </span>
                        <span>
                            {checkout.billing.name}
                        </span>
                    </div>
                </div>
                <Button
                    href="/checkout/address"
                    size="sm"
                    variant="link"
                    class="text-primary-foreground"
                >
                    <Pen size={17} />
                </Button>
            </CardContent>
        </Card>
    </section>

    <!-- card forms -->
    <section id="card">
        {#if "stripe" in checkout.methods}
            <CardStripe
                on:success={successHandler}
                on:error={errorHandler}
                {display}
                {checkout}
            />
        {/if}
    </section>

    <!-- external buttons -->
    <section id="buttons">
        {#if "paypal" in checkout.methods}
            <BtnPayPal on:success={successHandler} {display} {checkout} />
        {/if}
    </section>

    <!-- disclaimer -->
    <section class="text-xs opacity-50 text-center first-letter:capitalize">
        {$_("checkout.provider")}
        {checkout.audience}, {$_("checkout.agreement")}
    </section>
{:else}
    <Skeleton class="h-[28px]" />
    <Skeleton class="h-[330px]" />
    <Skeleton class="h-[55px]" />
    <Skeleton class="h-[48px]" />
{/if}
