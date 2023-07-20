import humanizeDuration from "humanize-duration"
import { currentLocale } from "./i18n"
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { PUBLIC_STRIPE_PK } from "$env/static/public";
import type { Address, StripeElements } from "@stripe/stripe-js";

const production: boolean = process.env.NODE_ENV === 'production'
const api: string = production ? 'api.nominal.es' : 'dev.nominal.es'

type display = {
    popup: boolean,
    dark: boolean
}

class Method {

    readonly slug: string
    public readonly clientId: string
    private readonly secret: string
    private readonly intent: string
    private _action: string | null

    private _stripeInstance: StripeElements | null
    private static _stripe: Stripe | null

    constructor(slug: string, clientId: string, secret: string, intent: string, action: string | null = null, stripeInstance: any | null = null) {
        this.slug = slug
        this.clientId = clientId
        this.secret = secret
        this.intent = intent
        this._action = action
        this._stripeInstance = stripeInstance
    }

    static get stripe() {
        return Method._stripe
    }

    async action() {
        if (!this._action) {
            const request = await fetch(`https://${api}/billing/${this.intent}/checkout/intent/${this.slug}`, {
                body: new URLSearchParams({
                    secret: this.secret
                }),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
            })
            const data: any = await request.json()
            this._action = data.action
        }
        if (!this._action) throw new Error('unable to get the shared private key')
        return this._action
    }

    async instance(display: display) {
        if (this.slug == 'stripe') {
            if (!Method._stripe) {
                Method._stripe = await loadStripe(PUBLIC_STRIPE_PK);
            }
            if (!this._stripeInstance) {
                this._stripeInstance = Method._stripe!.elements({
                    appearance: {
                        theme: display.dark ? 'night' : 'stripe',
                        rules: {
                            '.Tab': {
                                boxShadow: 'none'
                            },
                            '.Input': {
                                boxShadow: 'none'
                            }
                        },
                        variables: {
                            colorPrimary: '#' + (display.dark ? 'ffffff' : '000000'),
                            colorBackground: '#' + (display.dark ? '2c2e2f' : 'f7f7f7')
                        }
                    },
                    clientSecret: await this.action()
                })
            }
            return this._stripeInstance
        }
    }

}

class Amount {
    readonly currency: string
    readonly amount: number
    readonly taxRate: number | null
    readonly taxName: string | null
    readonly frequency: string | null

    constructor(currency: string, amount: number, taxRate: number | null = null, taxName: string | null = null, frequency: string | null = null) {
        this.currency = currency
        this.amount = amount
        this.taxRate = taxRate
        this.taxName = taxName
        this.frequency = frequency
    }

    public str(): string {
        return new Intl.NumberFormat(currentLocale() ?? [], {
            style: "currency",
            currency: this.currency,
        }).format(this.amount) + (this.frequency ? '/' : '')
    }
}

type App = {
    name: string,
    id: string,
}

class Checkout {
    readonly audience: string
    readonly methods: Record<string, Method>
    readonly upfront: Amount
    private readonly offset: number
    readonly upcoming: Amount | null
    readonly app: App | null
    readonly address: Address | null


    constructor(audience: string, methods: Record<string, Method>, upfront: Amount, address: Address | null = null, offset: number = 0, upcoming: Amount | null = null, app: App | null = null) {
        this.audience = audience
        this.methods = methods
        this.upfront = upfront
        this.offset = offset
        this.upcoming = upcoming
        this.app = app
        this.address = address
    }

    get displayName(): string {
        return this.app?.name ?? this.audience
    }

    get hasSetup(): boolean {
        return this.upfront.amount > 0 && this.upcoming?.amount != undefined
    }

    get delay() {
        if (!this.offset) return false
        return humanizeDuration(this.offset * 1000 * 3600 * 24, {
            language: currentLocale().split('-')[0],
            units: ["mo", "w", "d"],
            round: true,
        })
    }
}


export {
    Checkout,
    Method,
    Amount
}

export type { display }

