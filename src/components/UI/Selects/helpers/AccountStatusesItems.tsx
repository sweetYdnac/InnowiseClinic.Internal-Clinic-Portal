import { MenuItem } from '@mui/material';
import { AccountStatuses, getStatusLabel } from '../../../../constants/AccountStatuses';

export const AccountStatusesItems = Object.keys(AccountStatuses)
    .filter((v) => isNaN(Number(v)) && v !== AccountStatuses[AccountStatuses.None])
    .map((status, index) => (
        <MenuItem key={index} value={AccountStatuses[status as keyof typeof AccountStatuses]}>
            {getStatusLabel(AccountStatuses[status as keyof typeof AccountStatuses])}
        </MenuItem>
    ));
