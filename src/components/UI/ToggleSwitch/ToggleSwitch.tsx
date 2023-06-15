import { FormControlLabel, Switch } from '@mui/material';
import { FunctionComponent } from 'react';
import { ToggleSwitchProps } from './ToggleSwitch.interface';

export const ToggleSwitch: FunctionComponent<ToggleSwitchProps> = ({ value, handleChange, disabled = false }) => {
    return (
        <FormControlLabel
            label={value ? 'Active' : 'Inactive'}
            control={
                <Switch
                    disabled={disabled}
                    color='warning'
                    checked={value}
                    onChange={(_, checked) => {
                        handleChange?.(checked);
                    }}
                />
            }
        />
    );
};
