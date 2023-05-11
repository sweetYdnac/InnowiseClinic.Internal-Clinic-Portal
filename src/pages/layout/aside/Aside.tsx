import { Box } from '@mui/material';
import { AsideNavigation } from './AsideNavigation';
import { CustomDrawer } from './CustomDrawer';

const drawerWidth = 240;

export const Aside = () => {
    return (
        <Box component='nav' sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
            <CustomDrawer
                variant='temporary'
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    height: '100%',
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                <AsideNavigation />
            </CustomDrawer>

            <CustomDrawer
                variant='permanent'
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    height: '100%',
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, position: 'inherit' },
                }}
            >
                <AsideNavigation />
            </CustomDrawer>
        </Box>
    );
};
