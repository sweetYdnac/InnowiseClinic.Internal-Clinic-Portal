import { Roles } from '../constants/Roles';

export const getQueryString = (data: { [key: string]: any }) => {
    const params = [];
    for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
            value.forEach((val, index) => {
                params.push(`${key}[${index}]=${encodeURIComponent(val)}`);
            });
        } else if (value === null) {
            params.push(`${key}=`);
        } else {
            params.push(`${key}=${encodeURIComponent(value)}`);
        }
    }
    return params.join('&');
};

export const getRoleByName = (title: string) =>
    Object.values(Roles).find((role) => role.toLowerCase() === title.toLowerCase()) ?? Roles.None;
