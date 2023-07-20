<script lang="ts">
    import type { Checkout, display } from "$lib/types";

    import { Plus } from "lucide-svelte";

    import TaxBadge from "../misc/TaxBadge.svelte";
    import TrialBadge from "../misc/TrialBadge.svelte";
    import VerifiedBadge from "../misc/VerifiedBadge.svelte";
    import ReadableAmount from "../misc/ReadableAmount.svelte";
    import { Skeleton } from "$components/ui/skeleton";

    export let checkout: Checkout;
    export let display: display;

    import { _ } from "svelte-i18n";
    import CardStripe from "./cards/CardStripe.svelte";
    import ExpressStripe from "./express/ExpressStripe.svelte";
</script>

<!-- amount description -->
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
            <div class="grow w-full flex flex-col gap-3 items-center flex-wrap">
                <div class="flex flex-row gap-3 items-center">
                    <ReadableAmount amount={checkout.upfront} />
                </div>
                <span class="text-sm capitalize">
                    {$_("checkout.totalDueToday")}
                </span>
            </div>
            <Plus />
            <div class="grow w-full flex flex-col gap-3 items-center flex-wrap">
                <ReadableAmount amount={checkout.upcoming} />
                <span class="text-sm capitalize">
                    {#if checkout.delay}
                        {$_("checkout.startingIn")} {checkout.delay}
                    {:else}
                        {$_("checkout.startingInOne")}
                        {checkout.upcoming?.frequency}
                    {/if}
                </span>
            </div>
        </section>
    {/if}
</section>

<!-- express buttons (google pay, apple pay, etc) -->
<section id="express">
    <ExpressStripe {display} {checkout} />
</section>

<!-- card forms -->
<section id="card">
    <CardStripe {display} {checkout} />
</section>

<!-- external buttons -->
<section id="buttons">
    <Skeleton class="w-full h-[150px] rounded" />
</section>

<!-- disclaimer -->
<section class="mt-5 text-xs opacity-50 text-center first-letter:capitalize">
    {$_("checkout.provider")}
    {checkout.audience}, {$_("checkout.agreement")}
</section>