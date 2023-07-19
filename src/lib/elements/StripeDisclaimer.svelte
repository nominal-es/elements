<script>
    import { _ } from "svelte-i18n";
</script>

<div class="grow text-sm opacity-50 leading-6 first-letter:capitalize">
    {$_("stripeDisclaimer")}
    <a
        target="_blank"
        class="no-underline"
        href="https://stripe.com/docs/security"
    >
        <i class="fa-brands fa-stripe align-middle text-2xl ml-1" />
    </a>
</div>
