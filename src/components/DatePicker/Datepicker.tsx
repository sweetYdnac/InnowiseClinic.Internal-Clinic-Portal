import { DatePicker, DateView, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FunctionComponent, useMemo } from 'react';
import { Control, Controller } from 'react-hook-form';
import { dateViewFormat } from '../../constants/Formats';

interface DatepickerProps {
    id: string;
    control: Control<any, any>;
    displayName: string;
    disableFuture?: boolean;
    disablePast?: boolean;
    views?: DateView[];
    openTo?: DateView;
    disabled?: boolean;
    readonly?: boolean;
    handleValueChange?: () => void;
}

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
    const format = useMemo(() => (views.includes('day') ? dateViewFormat : views.includes('month') ? 'MM YYYY' : 'YYYY'), [views]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
                name={id}
                control={control}
                defaultValue=''
                render={({ field, fieldState }) => (
                    <>
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
                                    sx: { m: 1, width: '75%' },
                                    color: fieldState.error?.message && (fieldState.isTouched || field.value) ? 'error' : 'success',
                                    focused: !readonly && !fieldState.error?.message && (fieldState.isTouched || !!field.value),
                                    variant: 'standard',
                                    helperText: fieldState.error?.message,
                                    error: !!fieldState.error?.message && (fieldState.isTouched || field.value),
                                },
                                popper: {
                                    placement: 'bottom',
                                },
                            }}
                        />
                    </>
                )}
            />
        </LocalizationProvider>
    );
};
