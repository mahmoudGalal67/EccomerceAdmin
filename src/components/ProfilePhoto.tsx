"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CropAvatarModal } from "./CropAvatarModal";
import { Progress } from "@/components/ui/progress";
import { useUpdateUserMutation } from "@/services/userApi";
import { axiosBaseApi } from "@/utilis/axios";

export default function UserProfileAvatar({ userId }: { userId: number }) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [preview, setPreview] = useState<string | null>(null);
    const [cropImage, setCropImage] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const [updateUser, { isLoading }] = useUpdateUserMutation();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setCropImage(url);
    };

    const handleUpload = async (file: File) => {
        setCropImage(null);
        setPreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("profile_image", file);
        formData.append("_method", "PUT");

        const res = await axiosBaseApi.post(`/users/2`, formData, {
            onUploadProgress: (e) => {
                if (!e.total) return;
                const percent = Math.round((e.loaded * 100) / e.total);
                setProgress(percent);
            },
        });

    };

    return (
        <div className="flex flex-col items-center gap-3 w-28">
            <div className="relative group">
                <Avatar className="w-24 h-24 shadow-lg ring-4 ring-background">
                    <AvatarImage src={preview ?? "/avatar-placeholder.png"} />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>

                <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 rounded-full"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Camera className="w-4 h-4" />
                    )}
                </Button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                />
            </div>

            {isLoading && <Progress value={progress} className="w-full" />}

            {cropImage && (
                <CropAvatarModal
                    open={!!cropImage}
                    image={cropImage}
                    onClose={() => setCropImage(null)}
                    onSave={handleUpload}
                />
            )}
        </div>
    );
}
