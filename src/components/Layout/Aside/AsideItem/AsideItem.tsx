import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { FunctionComponent } from 'react';
import { useAppDispatch } from '../../../../hooks/store';
import { switchAside } from '../../../../store/layoutSlice';
import { AsideItemProps } from './AsideItem.interface';

export const AsideItem: FunctionComponent<AsideItemProps> = ({ displayName, children, handleClick }: AsideItemProps) => {
    const dispatch = useAppDispatch();

    const handleOnClick = (e: React.MouseEvent<HTMLLIElement>) => {
        handleClick(e);
        dispatch(switchAside());
    };

    return (
        <ListItem disablePadding onClick={handleOnClick}>
            <ListItemButton style={{ margin: '10px 0px' }}>
                <ListItemIcon>{children}</ListItemIcon>
                <ListItemText primary={displayName} />
            </ListItemButton>
        </ListItem>
    );
};
