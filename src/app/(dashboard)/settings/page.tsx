'use client'

import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import axios from 'axios'
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/services/SettingsApi'

type Social = {
    name: string
    link: string
    logo: File | string
}

type SettingsForm = {
    site_name: string
    logo: File | string
    colors: {
        primary: string
        secondary: string
    }
    socials: Social[]
}

export default function SettingsPage() {
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const { data: settings, isError, isLoading } = useGetSettingsQuery(undefined)
    const [updateSettings, { isError: updateError, isLoading: updateLoading }] = useUpdateSettingsMutation()

    const {
        register,
        control,
        setValue,
        watch,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm<SettingsForm>({
        defaultValues: {
            site_name: '',
            colors: {
                primary: '#000000',
                secondary: '#ffffff'
            },
            socials: []
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'socials'
    })

    /* ==============================
       Load settings from backend
    =============================== */
    useEffect(() => {
        if (settings) {
            reset(settings)
        }
    }, [settings])

    if (isLoading) return <div>Loading...</div>

    const onSubmit = async (data: SettingsForm) => {
        const formData = new FormData()

        formData.append('site_name', data.site_name)

        if (data.logo instanceof File) {
            formData.append('logo', data.logo)
        }

        // ✅ colors as array
        formData.append('colors[primary]', data.colors.primary)
        formData.append('colors[secondary]', data.colors.secondary)

        // ✅ socials as array
        data.socials.forEach((social, index) => {
            formData.append(`socials[${index}][name]`, social.name)
            formData.append(`socials[${index}][link]`, social.link)

            if (social.logo instanceof File) {
                formData.append(`socials[${index}][logo]`, social.logo)
            }
        })

        updateSettings(formData)
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Website Settings</CardTitle>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Site Name */}
                    <div className="space-y-2">
                        <Label>Site Name</Label>
                        <Input
                            {...register('site_name', {
                                required: 'Site name is required',
                                minLength: { value: 3, message: 'Min 3 characters' }
                            })}
                        />
                        {errors.site_name && (
                            <p className="text-sm text-red-500">
                                {errors.site_name.message}
                            </p>
                        )}
                    </div>

                    <Separator />

                    {/* Logo */}
                    <div className="space-y-3">
                        <Label>Logo</Label>

                        {logoPreview ? (
                            <img
                                src={logoPreview}
                                className="h-16 rounded border object-contain"
                                alt="logo"
                            />
                        ) :
                            <img
                                src={process.env.NEXT_PUBLIC_API_URL + "/storage/" + settings.logo}
                                className="h-16 rounded border object-contain"
                                alt="logo"
                            />}

                        <Label
                            htmlFor="logo"
                            className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground hover:bg-muted"
                        >
                            Click to upload logo
                        </Label>

                        <Input
                            id="logo"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                setValue('logo', file)
                                setLogoPreview(URL.createObjectURL(file))
                            }}
                        />
                    </div>

                    <Separator />

                    {/* Colors */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Primary Color</Label>
                            <Input
                                type="color"
                                className="h-12 cursor-pointer"
                                {...register('colors.primary', { required: true })}
                            />
                        </div>

                        <div>
                            <Label>Secondary Color</Label>
                            <Input
                                type="color"
                                className="h-12 cursor-pointer"
                                {...register('colors.secondary', { required: true })}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Socials */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-lg">Social Links</Label>
                            <Button
                                type="button"
                                onClick={() =>
                                    append({ name: '', link: '', logo: '' })
                                }
                            >
                                Add Social <Plus />
                            </Button>
                        </div>

                        {fields.map((field, index) => {
                            const value = watch(`socials.${index}.logo`)
                            const preview =
                                value instanceof File
                                    ? URL.createObjectURL(value)
                                    : typeof value === 'string'
                                        ? value
                                        : null

                            return (
                                <div
                                    key={field.id}
                                    className="grid grid-cols-6 gap-3 items-end"
                                >
                                    <div>
                                        <Input
                                            placeholder="Name"
                                            {...register(`socials.${index}.name`, {
                                                required: 'Required'
                                            })}
                                        />
                                        {errors.socials?.[index]?.name && (
                                            <p className="text-xs text-red-500">
                                                Required
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Input
                                            placeholder="Link"
                                            {...register(`socials.${index}.link`, {
                                                required: 'Required'
                                            })}
                                        />
                                        {errors.socials?.[index]?.link && (
                                            <p className="text-xs text-red-500">
                                                Required
                                            </p>
                                        )}
                                    </div>

                                    {preview ? <img
                                        src={typeof preview === 'string' ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${preview}` : preview}
                                        className="h-10 w-10 rounded border object-contain"
                                        alt="icon"
                                    /> :
                                        <img
                                            src="/logo.png"
                                            className="h-10 w-10 rounded border object-contain"
                                            alt="icon"
                                        />
                                    }

                                    <Label
                                        htmlFor={`social-${index}`}
                                        className="flex cursor-pointer items-center justify-center rounded-md border border-dashed px-3 py-2 text-xs hover:bg-muted"
                                    >
                                        Upload Icon
                                    </Label>

                                    <Input
                                        id={`social-${index}`}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={e =>
                                            setValue(
                                                `socials.${index}.logo`,
                                                e.target.files?.[0] || ''
                                            )
                                        }
                                    />

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => remove(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            )
                        })}
                    </div>

                    <Separator />

                    <Button type="submit" className="w-full cursor-pointer">
                        {updateLoading ? "Updating..." : " Save Settings"}
                    </Button>
                </CardContent>
            </Card>
        </form>
    )
}
