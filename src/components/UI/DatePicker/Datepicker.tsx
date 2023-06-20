import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FunctionComponent, useMemo } from 'react';
import { Controller } from 'react-hook-form';
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

    const format = useMemo(() => (views.includes('day') ? dateViewFormat : views.includes('month') ? 'MM YYYY' : 'YYYY'), [views]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
                name={id}
                control={control}
                defaultValue=''
                render={({ field, fieldState }) => (
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
                        defaultValue={field.value as dayjs.Dayjs}
                        value={field.value as dayjs.Dayjs}
                        onChange={(date) => field.onChange(date)}
                        onAccept={() => {
                            field.onBlur();
                            handleValueChange?.();
                        }}
                        onSelectedSectionsChange={() => field.onBlur()}
                        slotProps={{
                            textField: {
                                className: classes.textField,
                                color:
                                    fieldState.error?.message && (fieldState.isTouched || (field.value as dayjs.Dayjs)?.isValid())
                                        ? 'error'
                                        : 'success',
                                focused:
                                    !readonly &&
                                    !fieldState.error?.message &&
                                    (fieldState.isTouched || (field.value as dayjs.Dayjs)?.isValid()),
                                variant: 'standard',
                                helperText: fieldState.error?.message,
                                error: !!fieldState.error?.message && (fieldState.isTouched || field.value),
                            },
                            popper: {
                                placement: 'bottom',
                            },
                        }}
                    />
                )}
            />
        </LocalizationProvider>
    );
};
