import { DatePicker, DateView, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FunctionComponent } from 'react';
import { Control, Controller } from 'react-hook-form';
import { dateViewFormat } from '../../constants/formats';

interface DatepickerProps {
    id: string;
    control: Control<any, any>;
    displayName: string;
    disableFuture?: boolean;
    disablePast?: boolean;
    views?: DateView[];
    openTo?: DateView;
    disabled?: boolean;
}

const Datepicker: FunctionComponent<DatepickerProps> = ({
    id,
    control,
    displayName,
    disableFuture = false,
    disablePast = true,
    views = ['year', 'month', 'day'],
    openTo = 'day',
    disabled = false,
}: DatepickerProps) => {
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
                            disableFuture={disableFuture}
                            disablePast={disablePast}
                            label={displayName}
                            views={views}
                            openTo={openTo}
                            format={dateViewFormat}
                            defaultValue={field.value as dayjs.Dayjs}
                            value={field.value as dayjs.Dayjs}
                            onChange={(date) => field.onChange(date)}
                            onAccept={() => field.onBlur()}
                            onSelectedSectionsChange={() => field.onBlur()}
                            slotProps={{
                                textField: {
                                    sx: { m: 1, width: '75%' },
                                    color:
                                        (fieldState.error?.message?.length ?? 0) > 0 && (fieldState.isTouched || field.value)
                                            ? 'error'
                                            : 'success',
                                    focused: (fieldState.error?.message?.length ?? 0) === 0 && (fieldState.isTouched || !!field.value),
                                    variant: 'standard',
                                    helperText: fieldState.error?.message,
                                    error: (fieldState.error?.message?.length ?? 0) > 0 && (fieldState.isTouched || field.value),
                                },
                                popper: {
                                    placement: 'auto',
                                },
                            }}
                        />
                    </>
                )}
            />
        </LocalizationProvider>
    );
};

export default Datepicker;
