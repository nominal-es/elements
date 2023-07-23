import humanizeDuration from "humanize-duration"
import { currentLocale } from "./i18n"
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { PUBLIC_STRIPE_PK } from "$env/static/public";
import type { Address, StripeElements } from "@stripe/stripe-js";
import type { PaymentMethodCreateParams } from "@stripe/stripe-js";

const production: boolean = process.env.NODE_ENV === 'production'
const api: string = production ? 'api.nominal.es' : 'dev.nominal.es'

type display = {
    popup: boolean,
    dark: boolean,
    origin?: string
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

class Refund {
    readonly issued: Date
    readonly amount: Amount
    readonly completed: Date | null

    constructor(issued: Date, amount: Amount, completed: Date | null) {
        this.issued = issued
        this.amount = amount
        this.completed = completed
    }
}

class Dispute {
    readonly created: Date
    readonly archived: Date | null

    constructor(created: Date, archived: Date | null) {
        this.created = created
        this.archived = archived
    }
}

class Payment {
    readonly created: Date
    readonly audience: string
    readonly amount: Amount
    readonly gateway: string
    readonly refunds: Refund[]
    readonly disputes: Dispute[]
    readonly app: App | null

    constructor(created: Date, audience: string, amount: Amount, gateway: string, refunds: Refund[], disputes: Dispute[], app: App | null = null) {
        this.created = created
        this.audience = audience
        this.amount = amount
        this.gateway = gateway
        this.refunds = refunds
        this.disputes = disputes
        this.app = app
    }
}

class Source {
    readonly gateway: string
    readonly lastError: Date | null
    constructor(gateway: string, lastError: Date | null) {
        this.gateway = gateway
        this.lastError = lastError
    }
}

type description = {
    title?: string,
    slug: string
}

class Subscription {
    readonly created: Date
    readonly offset: number
    readonly amount: Amount
    readonly source: Source | null
    readonly cancelled: Date | null
    readonly payments: Payment[]
    readonly app: App | null
    readonly audience: string
    readonly description: description

    constructor(created: Date, audience: string, description: description, app: App | null, offset: number, amount: Amount, source: Source | null, cancelled: Date | null, payments: Payment[]) {
        this.created = created
        this.app = app
        this.audience = audience
        this.description = description
        this.offset = offset
        this.amount = amount
        this.source = source
        this.cancelled = cancelled
        this.payments = payments
    }

    get isTrialing() {
        return true
    }

    get displayName() {
        return this.app?.name ?? this.audience
    }
}

class Checkout {
    readonly secret: string
    readonly audience: string
    readonly methods: Record<string, Method>
    readonly upfront: Amount
    private readonly offset: number
    readonly upcoming: Amount | null
    readonly app: App | null
    readonly billing: PaymentMethodCreateParams.BillingDetails

    constructor(secret: string, audience: string, methods: Record<string, Method>, upfront: Amount, billing: PaymentMethodCreateParams.BillingDetails, offset: number = 0, upcoming: Amount | null = null, app: App | null = null) {
        this.secret = secret
        this.audience = audience
        this.methods = methods
        this.upfront = upfront
        this.offset = offset
        this.upcoming = upcoming
        this.app = app
        this.billing = billing
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

    get isSubscription() {
        return this.upfront.frequency != null || this.upcoming?.frequency != null
    }

    public async check(): Promise<boolean> {
        // TODO if paid, returns true
        await new Promise(resolve => setTimeout(resolve, 500))
        return true
    }

    public static async fromSecret(secret: string): Promise<Checkout> {
        // TODO actually fetch
        await new Promise(resolve => setTimeout(resolve, 500))
        return new Checkout(
            secret,
            'serverbench.io',
            {
                stripe: new Method("stripe", "-", "-", "payment", "pi_3NVyJ3CA7uvn961o03OQUtd0_secret_IgIq5ufxHKjmCJ8b9lR4r4qpb"),
                paypal: new Method("paypal", "-", "-", "payment", "pi_3NVyJ3CA7uvn961o03OQUtd0_secret_IgIq5ufxHKjmCJ8b9lR4r4qpb"),
            },
            new Amount("eur", 25, 21, "IVA"),
            {
                address: {
                    city: "Barcelona",
                    country: "ES",
                    line1: "Carrer de Mallorca",
                    line2: "Sagrada Familia",
                    postal_code: "08017",
                    state: "Barcelona",
                },
                email: 'axolotl@ocean.org',
                name: 'Billy The Axolotl',
                phone: '+0 00000000000'
            },
            7,
            new Amount("eur", 10, 21, "IVA", "month")
        )
    }
}


export {
    Checkout,
    Method,
    Amount,
    Payment,
    Subscription,
    Refund,
    Dispute
}

export type { display }

