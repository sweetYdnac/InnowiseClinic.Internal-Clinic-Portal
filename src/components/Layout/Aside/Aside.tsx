import { Box } from '@mui/material';
import { AsideNavigationReducer } from '../../../reducers/AsideNavigationReducer';
import { CustomDrawer } from './CustomDrawer/CustomDrawer';

export const Aside = () => {
    return (
        <Box component='nav'>
            <CustomDrawer variant='temporary'>
                <AsideNavigationReducer />
            </CustomDrawer>

            <CustomDrawer variant='permanent'>
                <AsideNavigationReducer />
            </CustomDrawer>
        </Box>
    );
};
