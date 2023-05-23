import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import { FunctionComponent } from 'react';
import './ModalWindow.css';

interface CustomizedModalProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
    useDialog?: boolean;
}

export const ModalWindow: FunctionComponent<CustomizedModalProps> = ({ isOpen, children }: CustomizedModalProps) => {
    const handleClose = () => {};

    return (
        <>
            <Modal open={isOpen}>
                <Box className='modal-box' component='div'>
                    <IconButton onClick={handleClose} sx={{ alignSelf: 'end' }}>
                        <CloseIcon fontSize='medium' />
                    </IconButton>
                    {children}
                </Box>
            </Modal>
        </>
    );
};
