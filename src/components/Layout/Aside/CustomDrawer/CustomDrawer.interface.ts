import { DrawerProps } from '@mui/material';
import { ReactNode } from 'react';

export interface CustomDrawerProps {
    children: ReactNode;
    variant: DrawerProps['variant'];
    sx?: DrawerProps['sx'];
}
