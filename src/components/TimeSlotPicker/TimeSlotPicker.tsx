import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { InputAdornment } from '@mui/material';
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FunctionComponent, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { timeSlotFormat } from '../../constants/Formats';
import { ITimeSlot } from '../../types/response/appointments';

interface TimeSlotPickerProps {
    id: string;
    control: Control<any, any>;
    displayName: string;
    timeSlots: ITimeSlot[];
    handleOpen: () => void;
    disabled: boolean;
    isLoading: boolean;
}

export const TimeSlotPicker: FunctionComponent<TimeSlotPickerProps> = ({
    id,
    control,
    displayName,
    timeSlots,
    handleOpen,
    disabled,
    isLoading,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
                name={id}
                control={control}
                render={({ field, fieldState }) => (
                    <>
                        <MobileTimePicker
                            {...field}
                            open={isOpen && !isLoading}
                            onClose={() => setIsOpen(false)}
                            onOpen={() => {
                                setIsOpen(true);
                                handleOpen();
                            }}
                            disabled={disabled}
                            readOnly={disabled}
                            label={displayName}
                            format={timeSlotFormat}
                            minutesStep={10}
                            ampmInClock={true}
                            closeOnSelect={true}
                            shouldDisableTime={(value: dayjs.Dayjs, view) => {
                                if (view === 'hours') {
                                    return !timeSlots.some((slot) => dayjs(slot.time, timeSlotFormat).hour() === value.hour());
                                } else if (view === 'minutes') {
                                    return !timeSlots.some((slot) => slot.time === value.format(timeSlotFormat));
                                }

                                return false;
                            }}
                            defaultValue={field?.value ?? null}
                            value={field?.value ?? null}
                            onChange={(time) => field.onChange(time)}
                            onAccept={(time) => field.onBlur()}
                            onSelectedSectionsChange={() => field.onBlur()}
                            slotProps={{
                                textField: {
                                    sx: { m: 1, width: '75%' },
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
                    </>
                )}
            />
        </LocalizationProvider>
    );
};
