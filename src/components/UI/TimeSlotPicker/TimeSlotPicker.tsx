import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { InputAdornment } from '@mui/material';
import { LocalizationProvider, MobileTimePicker, TimeView } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FunctionComponent, useCallback, useState } from 'react';
import { Controller } from 'react-hook-form';
import { timeSlotFormat } from '../../../constants/Formats';
import { useStyles } from '../styles';
import { TimeSlotPickerProps } from './TimeSlotPicker.interface';

export const TimeSlotPicker: FunctionComponent<TimeSlotPickerProps> = ({
    id,
    control,
    displayName,
    timeSlots,
    handleOpen,
    disabled,
    isLoading,
}) => {
    const { classes } = useStyles();
    const [isOpen, setIsOpen] = useState(false);

    const onOpen = useCallback(() => {
        setIsOpen(true);
        handleOpen();
    }, [handleOpen]);

    const onClose = useCallback(() => setIsOpen(false), []);

    const shouldDisableTime = useCallback(
        (value: dayjs.Dayjs, view: TimeView) => {
            if (view === 'hours') {
                return !timeSlots.some((slot) => dayjs(slot.time, timeSlotFormat).hour() === value.hour());
            } else if (view === 'minutes') {
                return !timeSlots.some((slot) => slot.time === value.format(timeSlotFormat));
            }

            return false;
        },
        [timeSlots]
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
                name={id}
                control={control}
                render={({ field, fieldState }) => (
                    <MobileTimePicker
                        {...field}
                        open={isOpen && !isLoading}
                        onOpen={onOpen}
                        onClose={onClose}
                        disabled={disabled}
                        readOnly={disabled}
                        label={displayName}
                        format={timeSlotFormat}
                        minutesStep={10}
                        ampmInClock={true}
                        closeOnSelect={true}
                        shouldDisableTime={shouldDisableTime}
                        defaultValue={field?.value ?? null}
                        value={field?.value ?? null}
                        onAccept={field.onBlur}
                        onSelectedSectionsChange={field.onBlur}
                        slotProps={{
                            textField: {
                                className: classes.textField,
                                variant: 'standard',
                                color: fieldState.error?.message && (fieldState.isTouched || field.value) ? 'error' : 'success',
                                focused: !fieldState.error?.message && (fieldState.isTouched || !!field.value),
                                helperText: fieldState.isTouched ? fieldState.error?.message : '',
                                error: !!fieldState.error?.message && (fieldState.isTouched || !!field.value),
                                InputProps: {
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <AccessTimeIcon />
                                        </InputAdornment>
                                    ),
                                },
                            },
                        }}
                    />
                )}
            />
        </LocalizationProvider>
    );
};
