import { Box } from '@mui/material';
import { CustomDrawer } from './CustomDrawer/CustomDrawer';
import { Navigation } from './Navigation/Navigation';

export const Aside = () => {
    return (
        <Box component='nav'>
            <CustomDrawer variant='temporary'>
                <Navigation />
            </CustomDrawer>

            <CustomDrawer variant='permanent'>
                <Navigation />
            </CustomDrawer>
        </Box>
    );
};
