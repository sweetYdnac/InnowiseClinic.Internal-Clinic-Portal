import { Drawer } from '@mui/material';
import { FunctionComponent } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/store';
import { selectAside, switchAside } from '../../../../store/layoutSlice';
import { CustomDrawerProps } from './CustomDrawer.interface';

export const CustomDrawer: FunctionComponent<CustomDrawerProps> = ({ children, variant, sx }: CustomDrawerProps) => {
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
