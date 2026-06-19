import { useState } from "react";

// NOTE: MIGHT REMOVE
export function useOpenInbox() {
    const [isOpen, setIsOpen] = useState(false);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return { isOpen, openInbox: open, closeInbox: close };
}