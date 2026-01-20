"use client";

import { AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface LaravelErrorPopupProps {
    error: any;
}

export default function LaravelErrorPopup({ error }: LaravelErrorPopupProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (error) setOpen(true);
    }, [error]);

    if (!error) return null;

    // ✅ Support wrapped Laravel errors
    const payload = error?.data ?? error;

    const message =
        payload?.message || "Something went wrong. Please try again.";

    const errors = payload?.errors;

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-destructive/30 bg-background shadow-2xl"
                    >
                        <div className="flex items-start gap-3 p-5">
                            <AlertCircle className="mt-1 h-6 w-6 text-destructive" />

                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-destructive">
                                    Error
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {message}
                                </p>

                                {errors && (
                                    <ul className="mt-3 space-y-1 text-sm text-destructive">
                                        {Object.values(errors).flat().map((err: any, i) => (
                                            <li key={i}>• {err}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setOpen(false)}
                                className="h-7 w-7"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex justify-end gap-2 border-t p-4">
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Close
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
