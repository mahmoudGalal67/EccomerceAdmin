"use client";

import Cropper from "react-easy-crop";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function CropAvatarModal({
    open,
    image,
    onClose,
    onSave,
}: {
    open: boolean;
    image: string;
    onClose: () => void;
    onSave: (file: File) => void;
}) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const handleSave = async () => {
        const res = await fetch(image);
        const blob = await res.blob();
        onSave(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="p-0 overflow-hidden">
                <div className="relative w-full h-80 bg-black">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                    />
                </div>

                <div className="flex justify-end gap-2 p-4">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
