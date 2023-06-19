import { Modal } from '@mui/material';
import { FunctionComponent } from 'react';
import { CustomModalProps } from './CustomModal.interface';
import { StyledModal } from './CustomModal.styles';

export const CustomModal: FunctionComponent<CustomModalProps> = ({ children, isOpen = true }) => {
    return (
        <Modal open={isOpen}>
            <StyledModal>{children}</StyledModal>
        </Modal>
    );
};
