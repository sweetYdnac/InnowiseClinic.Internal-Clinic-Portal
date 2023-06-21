import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FunctionComponent, useCallback, useMemo } from 'react';
import { useController } from 'react-hook-form';
import { dateViewFormat } from '../../../constants/Formats';
import { useStyles } from '../styles';
import { DatepickerProps } from './Datepicker.interface';

export const Datepicker: FunctionComponent<DatepickerProps> = ({
    id,
    control,
    displayName,
    disableFuture = false,
    disablePast = true,
    views = ['year', 'month', 'day'],
    openTo = 'day',
    disabled = false,
    readonly = false,
    handleValueChange,
}: DatepickerProps) => {
    const { classes } = useStyles();

    const { field, fieldState } = useController({
        name: id,
        control: control,
    });

    const format = useMemo(() => (views.includes('day') ? dateViewFormat : views.includes('month') ? 'MM YYYY' : 'YYYY'), [views]);
    const onAccept = useCallback(() => {
        field.onBlur();
        handleValueChange?.();
    }, [field, handleValueChange]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                {...field}
                disabled={disabled}
                readOnly={readonly}
                disableFuture={disableFuture}
                disablePast={disablePast}
                label={displayName}
                views={views}
                openTo={openTo}
                format={format}
                onAccept={onAccept}
                onSelectedSectionsChange={field.onBlur}
                slotProps={{
                    textField: {
                        className: classes.textField,
                        color:
                            fieldState.error?.message && (fieldState.isTouched || (field.value as dayjs.Dayjs)?.isValid())
                                ? 'error'
                                : 'success',
                        focused:
                            !readonly && !fieldState.error?.message && (fieldState.isTouched || (field.value as dayjs.Dayjs)?.isValid()),
                        variant: 'standard',
                        helperText: fieldState.error?.message,
                        error: !!fieldState.error?.message && (fieldState.isTouched || field.value),
                    },
                    popper: {
                        placement: 'bottom',
                    },
                }}
            />
        </LocalizationProvider>
    );
};
