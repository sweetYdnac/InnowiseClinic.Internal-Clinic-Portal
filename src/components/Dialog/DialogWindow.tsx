import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { FunctionComponent } from 'react';

interface DialogWindowProps {
    isOpen: boolean;
    title: string;
    content: string;
    handleSubmit: () => void;
    handleDecline: () => void;
    submitText?: string;
    declineText?: string;
}

const DialogWindow: FunctionComponent<DialogWindowProps> = ({
    isOpen,
    title,
    content,
    handleSubmit,
    handleDecline,
    submitText = 'Yes',
    declineText = 'No',
}: DialogWindowProps) => {
    return (
        <Dialog open={isOpen} onClose={handleDecline}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDecline}>{declineText}</Button>
                <Button onClick={handleSubmit} autoFocus>
                    {submitText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogWindow;
