import { ReactNode } from 'react';

export interface AsideItemProps {
    displayName: string;
    children: ReactNode;
    handleClick: React.MouseEventHandler<HTMLLIElement>;
}
