export enum AccountStatuses {
    None = 0,
    AtWork = 1,
    OnVacation = 2,
    SickDay = 3,
    SickLeave = 4,
    SelfIsolation = 5,
    LeaveWithoutPay = 6,
    Inactive = 7,
}

export const getStatusLabel = (value: number) => {
    switch (value) {
        case AccountStatuses.None:
            return 'None';
        case AccountStatuses.AtWork:
            return 'At work';
        case AccountStatuses.OnVacation:
            return 'On vacation';
        case AccountStatuses.SickDay:
            return 'Sick day';
        case AccountStatuses.SickLeave:
            return 'Sick leave';
        case AccountStatuses.SelfIsolation:
            return 'Self isolation';
        case AccountStatuses.LeaveWithoutPay:
            return 'Leave without pay';
        case AccountStatuses.Inactive:
            return 'Inactive';
        default:
            console.log('Unknown account status - ' + value);
            break;
    }
};
