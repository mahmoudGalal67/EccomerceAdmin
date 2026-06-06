export interface PaymentMethod {
    id?: string;
    name: string;
    number: string;
}

export interface StoreSettings {
    website_name: string;

    show_website_name: boolean;
    enable_intro_animation: boolean;
    maintenance_mode: boolean;

    default_shipping_address: string;
    default_billing_address: string;
    address_label: string;

    email_notifications: boolean;

    languages: string[];
    currency: "USD" | "EUR" | "EGP" | "SAR";

    preferred_delivery_time: string;
    leave_at_door: boolean;
    signature_required: boolean;

    contact_email: string;
    contact_phone: string;
    contact_whatsapp: string;

    coupon_code: string;

    footer_font_size: number;

    background_image?: string;
    store_logo?: string;
    favicon?: string;

    seo_title: string;
    seo_description: string;
    seo_keywords: string;

    show_featured_products: boolean;
    show_best_sellers: boolean;
    show_new_arrivals: boolean;

    payment_methods: PaymentMethod[];
}

export const defaultSettings: StoreSettings = {
    website_name: "",

    show_website_name: true,
    enable_intro_animation: false,
    maintenance_mode: false,

    default_shipping_address: "",
    default_billing_address: "",
    address_label: "home",

    email_notifications: true,

    languages: ["en"],
    currency: "USD",

    preferred_delivery_time: "",

    leave_at_door: false,
    signature_required: false,

    contact_email: "",
    contact_phone: "",
    contact_whatsapp: "",

    coupon_code: "",

    footer_font_size: 14,

    background_image: "",
    store_logo: "",
    favicon: "",

    seo_title: "",
    seo_description: "",
    seo_keywords: "",

    show_featured_products: true,
    show_best_sellers: true,
    show_new_arrivals: true,

    payment_methods: [],
};