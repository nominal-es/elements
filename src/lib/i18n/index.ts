// src/lib/i18n/index.ts
import { getLocaleFromNavigator } from 'svelte-i18n'
import { init, register, locale } from 'svelte-i18n'

const defaultLocale = 'en'

register('en', () => import('./locales/en.json'))
register('es', () => import('./locales/es.json'))

init({
    fallbackLocale: defaultLocale,
    initialLocale: getLocaleFromNavigator(),
});

let lang: string = defaultLocale

export function currentLocale() {
    return lang
}

export function setCurrentLocale(l: string | null | undefined) {
    if (l) {
        lang = l
    }
}