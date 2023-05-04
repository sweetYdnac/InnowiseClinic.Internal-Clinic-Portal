import { Drawer, DrawerProps } from '@mui/material';
import { FunctionComponent, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { selectAside, switchAside } from '../../../store/layoutSlice';

interface AsideProps {
    children: ReactNode;
    variant: DrawerProps['variant'];
    sx: DrawerProps['sx'];
}

const CustomDrawer: FunctionComponent<AsideProps> = ({ children, variant, sx }: AsideProps) => {
    const isAsideOpen = useAppSelector(selectAside);
    const dispatch = useAppDispatch();

    return (
        <Drawer
            variant={variant}
            open={isAsideOpen}
            onClose={() => dispatch(switchAside())}
            ModalProps={{
                keepMounted: true,
            }}
            sx={sx}
        >
            {children}
        </Drawer>
    );
};

export default CustomDrawer;
