import { DrawerProps } from '@mui/material';
import { FunctionComponent, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/store';
import { selectAside, switchAside } from '../../../../store/layoutSlice';
import { CustomDrawerProps } from './CustomDrawer.interface';
import { PermanentDrawer, TemporaryDrawer } from './CustomDrawer.styles';

export const CustomDrawer: FunctionComponent<CustomDrawerProps> = ({ children, variant }: CustomDrawerProps) => {
    const isAsideOpen = useAppSelector(selectAside);
    const dispatch = useAppDispatch();

    const props = useMemo(
        () =>
            ({
                variant: variant,
                open: isAsideOpen,
                ModalProps: {
                    keepMounted: true,
                },
                onClose: () => dispatch(switchAside()),
            } as DrawerProps),
        [dispatch, isAsideOpen, variant]
    );

    switch (variant) {
        case 'permanent':
            return <PermanentDrawer {...props}>{children}</PermanentDrawer>;
        case 'temporary':
            return <TemporaryDrawer {...props}>{children}</TemporaryDrawer>;
        default:
            return <>{children}</>;
    }
};
