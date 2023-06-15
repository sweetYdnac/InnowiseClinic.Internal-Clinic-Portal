import { Box } from '@mui/material';
import { AsideNavigationReducer } from '../../../reducers/AsideNavigationReducer';
import { CustomDrawer } from './CustomDrawer/CustomDrawer';

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
                <AsideNavigationReducer />
            </CustomDrawer>

            <CustomDrawer
                variant='permanent'
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    height: '100%',
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, position: 'inherit' },
                }}
            >
                <AsideNavigationReducer />
            </CustomDrawer>
        </Box>
    );
};
