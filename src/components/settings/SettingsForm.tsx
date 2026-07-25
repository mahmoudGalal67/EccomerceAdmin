"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Switch } from "@/components/ui/switch";

import { Button } from "@/components/ui/button";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    StoreSettings,
    defaultSettings,
} from "./settings.types";

import {
    settingsSchema,
    SettingsFormValues,
} from "./settings.schema";


import PaymentMethods from "./PaymentMethods";
import ImageUploader from "./ImageUploader";
import { useGetFeaturesQuery, useUpdateFeaturesMutation } from "@/services/FeaturesApi";

export default function SettingsForm() {
    const {
        data,
        isLoading,
    } = useGetFeaturesQuery(undefined);

    const [updateSettings, updateState] =
        useUpdateFeaturesMutation();

    const [backgroundFile, setBackgroundFile] =
        useState<File | null>(null);

    const [logoFile, setLogoFile] =
        useState<File | null>(null);

    const [faviconFile, setFaviconFile] =
        useState<File | null>(null);

    const [
        backgroundPreview,
        setBackgroundPreview,
    ] = useState("");

    const [
        logoPreview,
        setLogoPreview,
    ] = useState("");

    const [
        faviconPreview,
        setFaviconPreview,
    ] = useState("");

    const {
        register,
        reset,
        watch,
        setValue,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: defaultSettings,
    });

    useEffect(() => {
        if (!data) return;

        reset(data);

        if (data.background_image) {
            setBackgroundPreview(
                process.env.NEXT_PUBLIC_API_URL + data.background_image
            );
        }

        if (data.store_logo) {
            setLogoPreview(process.env.NEXT_PUBLIC_API_URL + data.store_logo);
        }

        if (data.favicon) {
            setFaviconPreview(process.env.NEXT_PUBLIC_API_URL + data.favicon);
        }
    }, [data, reset]);

    // if (isLoading) {
    //     return (
    //         <div className="p-10">
    //             Loading Settings...
    //         </div>
    //     );
    // }

    const languages =
        watch("languages");

    const addLanguage = (
        language: string
    ) => {
        if (languages.includes(language))
            return;

        setValue("languages", [
            ...languages,
            language,
        ]);
    };

    const removeLanguage = (
        language: string
    ) => {
        setValue(
            "languages",
            languages.filter(
                (item) => item !== language
            )
        );
    };

    const onSubmit = async (
        values: SettingsFormValues
    ) => {
        try {
            console.log(values)
            const formData =
                new FormData();

            Object.entries(values).forEach(([key, value]) => {

                if (key === "payment_methods") {
                    formData.append(
                        "payment_methods",
                        JSON.stringify(value)
                    );
                }
                else if (Array.isArray(value)) {
                    value.forEach((item: any) => {
                        formData.append(`${key}[]`, item);
                    });
                } else if (typeof value === "object" && value !== null) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            });

            if (backgroundFile) {
                formData.append(
                    "background_image",
                    backgroundFile
                );
            }

            if (logoFile) {
                formData.append(
                    "store_logo",
                    logoFile
                );
            }

            if (faviconFile) {
                formData.append(
                    "favicon",
                    faviconFile
                );
            }

            await updateSettings(
                formData
            ).unwrap();

        } catch (error) {
            console.error(error);
        }
    };


    return (
        <form
            onSubmit={handleSubmit(
                onSubmit
            )}
            className="space-y-6"
        >
            <div className="grid gap-6 xl:grid-cols-2">

                <Card>
                    <CardHeader>
                        <CardTitle>
                            General Settings
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">

                        <div>
                            <Label className="mb-2">
                                Website Name
                            </Label>

                            <Input
                                {...register(
                                    "website_name"
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label className="mb-2">
                                Show Website Name
                            </Label>

                            <Switch
                                checked={watch(
                                    "show_website_name"
                                )}
                                onCheckedChange={(
                                    value
                                ) =>
                                    setValue(
                                        "show_website_name",
                                        value
                                    )
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label className="mb-2">
                                Intro Animation
                            </Label>

                            <Switch
                                checked={watch(
                                    "enable_intro_animation"
                                )}
                                onCheckedChange={(
                                    value
                                ) =>
                                    setValue(
                                        "enable_intro_animation",
                                        value
                                    )
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label className="mb-2">
                                Maintenance Mode
                            </Label>

                            <Switch
                                checked={watch(
                                    "maintenance_mode"
                                )}
                                onCheckedChange={(
                                    value
                                ) =>
                                    setValue(
                                        "maintenance_mode",
                                        value
                                    )
                                }
                            />
                        </div>

                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Address Settings
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-5">

                        <div>
                            <Label className="mb-2">
                                Default Shipping Address
                            </Label>

                            <Input
                                {...register(
                                    "default_shipping_address"
                                )}
                            />
                        </div>

                        <div>
                            <Label className="mb-2">
                                Default Billing Address
                            </Label>

                            <Input
                                {...register(
                                    "default_billing_address"
                                )}
                            />
                        </div>

                        <div>
                            <Label className="mb-2">
                                Address Label
                            </Label>

                            <Select
                                value={watch(
                                    "address_label"
                                )}
                                onValueChange={(
                                    value
                                ) =>
                                    setValue(
                                        "address_label",
                                        value
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="home">
                                        Home
                                    </SelectItem>

                                    <SelectItem value="work">
                                        Work
                                    </SelectItem>

                                    <SelectItem value="other">
                                        Other
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Notifications
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <div className="flex items-center justify-between">
                            <Label className="mb-2">
                                Email Notifications
                            </Label>

                            <Switch
                                checked={watch(
                                    "email_notifications"
                                )}
                                onCheckedChange={(
                                    value
                                ) =>
                                    setValue(
                                        "email_notifications",
                                        value
                                    )
                                }
                            />
                        </div>

                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Localization
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-5">

                        <div>
                            <Label className="mb-2">
                                Languages
                            </Label>

                            <div className="mt-3 flex flex-wrap gap-2">

                                {[
                                    "en",
                                    "ar",
                                    "fr",
                                    "de",
                                ].map((lang) => {

                                    const selected =
                                        languages?.includes(
                                            lang
                                        );

                                    return (
                                        <Button
                                            key={lang}
                                            type="button"
                                            variant={
                                                selected
                                                    ? "default"
                                                    : "outline"
                                            }
                                            onClick={() =>
                                                selected
                                                    ? removeLanguage(
                                                        lang
                                                    )
                                                    : addLanguage(
                                                        lang
                                                    )
                                            }
                                        >
                                            {lang.toUpperCase()}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <Label className="mb-2">
                                Currency
                            </Label>

                            <Select
                                value={watch(
                                    "currency"
                                )}
                                onValueChange={(
                                    value
                                ) =>
                                    setValue(
                                        "currency",
                                        value as
                                        | "USD"
                                        | "EUR"
                                        | "EGP"
                                        | "SAR"
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>

                                    <SelectItem value="USD">
                                        USD
                                    </SelectItem>

                                    <SelectItem value="EUR">
                                        EUR
                                    </SelectItem>

                                    <SelectItem value="EGP">
                                        EGP
                                    </SelectItem>

                                    <SelectItem value="SAR">
                                        SAR
                                    </SelectItem>

                                </SelectContent>
                            </Select>
                        </div>

                    </CardContent>
                </Card>
                <div className="grid gap-6 xl:grid-cols-2">

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Delivery Preferences
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-5">

                            <div>
                                <Label className="mb-2">
                                    Preferred Delivery Time
                                </Label>

                                <Input
                                    {...register(
                                        "preferred_delivery_time"
                                    )}
                                    placeholder="10:00 AM - 02:00 PM"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="mb-2">
                                    Leave At Door
                                </Label>

                                <Switch
                                    checked={watch(
                                        "leave_at_door"
                                    )}
                                    onCheckedChange={(value) =>
                                        setValue(
                                            "leave_at_door",
                                            value
                                        )
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="mb-2">
                                    Signature Required
                                </Label>

                                <Switch
                                    checked={watch(
                                        "signature_required"
                                    )}
                                    onCheckedChange={(value) =>
                                        setValue(
                                            "signature_required",
                                            value
                                        )
                                    }
                                />
                            </div>

                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Contact Information
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-5">

                            <div>
                                <Label className="mb-2">Email</Label>

                                <Input
                                    {...register(
                                        "contact_email"
                                    )}
                                />
                                {errors.contact_email && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.contact_email.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="mb-2">Phone</Label>

                                <Input
                                    {...register(
                                        "contact_phone"
                                    )}
                                />
                            </div>

                            <div>
                                <Label className="mb-2">Whatsapp</Label>

                                <Input
                                    {...register(
                                        "contact_whatsapp"
                                    )}
                                />
                            </div>

                        </CardContent>
                    </Card>

                </div>
                <div className="grid gap-6 xl:grid-cols-2">

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Coupon Settings
                            </CardTitle>
                        </CardHeader>

                        <CardContent>

                            <Input
                                {...register(
                                    "coupon_code"
                                )}
                                placeholder="WELCOME10"
                            />

                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                SEO Settings
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-5">

                            <Input
                                {...register(
                                    "seo_title"
                                )}
                                placeholder="Meta Title"
                            />

                            <Input
                                {...register(
                                    "seo_description"
                                )}
                                placeholder="Meta Description"
                            />

                            <Input
                                {...register(
                                    "seo_keywords"
                                )}
                                placeholder="keywords,separated,by,comma"
                            />

                        </CardContent>
                    </Card>

                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Homepage Settings
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">

                        <div className="flex items-center justify-between">
                            <Label className="mb-2">
                                Show Featured Products
                            </Label>

                            <Switch
                                checked={watch(
                                    "show_featured_products"
                                )}
                                onCheckedChange={(value) =>
                                    setValue(
                                        "show_featured_products",
                                        value
                                    )
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label className="mb-2">
                                Show Best Sellers
                            </Label>

                            <Switch
                                checked={watch(
                                    "show_best_sellers"
                                )}
                                onCheckedChange={(value) =>
                                    setValue(
                                        "show_best_sellers",
                                        value
                                    )
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label className="mb-2">
                                Show New Arrivals
                            </Label>

                            <Switch
                                checked={watch(
                                    "show_new_arrivals"
                                )}
                                onCheckedChange={(value) =>
                                    setValue(
                                        "show_new_arrivals",
                                        value
                                    )
                                }
                            />
                        </div>

                    </CardContent>
                </Card>
                <div className="grid gap-6 xl:grid-cols-2">

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Appearance
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-5">

                            <div>
                                <Label className="mb-2">
                                    Footer Font Size
                                </Label>

                                <Input
                                    type="number"
                                    min={10}
                                    max={40}
                                    {...register(
                                        "footer_font_size",
                                        {
                                            valueAsNumber: true,
                                        }
                                    )}
                                />
                            </div>

                        </CardContent>
                    </Card>

                </div>
                <div className="grid gap-6 lg:grid-cols-3">

                    <ImageUploader
                        title="Background Image"
                        preview={backgroundPreview}
                        onFileSelect={(
                            file,
                            preview
                        ) => {
                            setBackgroundFile(file);
                            setBackgroundPreview(
                                preview
                            );
                        }}
                    />

                    <ImageUploader
                        title="Store Logo"
                        preview={logoPreview}
                        onFileSelect={(
                            file,
                            preview
                        ) => {
                            setLogoFile(file);
                            setLogoPreview(
                                preview
                            );
                        }}
                    />

                    <ImageUploader
                        title="Favicon"
                        preview={faviconPreview}
                        onFileSelect={(
                            file,
                            preview
                        ) => {
                            setFaviconFile(file);
                            setFaviconPreview(
                                preview
                            );
                        }}
                    />

                </div>
                <PaymentMethods
                    control={control}
                    register={register}
                />
            </div>
            <div className="sticky bottom-5 z-50 flex justify-end">

                <Button
                    size="lg"
                    type="submit"
                    className="cursor-pointer"
                    disabled={
                        updateState.isLoading
                    }
                >
                    {updateState.isLoading
                        ? "Saving..."
                        : "Save Changes"}
                </Button>

            </div>
        </form>
    )

}
