export interface DialogWindowProps {
    isOpen: boolean;
    title: string;
    content: string;
    handleSubmit: () => void;
    handleDecline: () => void;
    submitText?: string;
    declineText?: string;
}
