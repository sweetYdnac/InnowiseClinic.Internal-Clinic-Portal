import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { InputAdornment } from '@mui/material';
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FunctionComponent } from 'react';
import { Control, Controller } from 'react-hook-form';
import { timeViewFormat } from '../../constants/formats';
import { ITimeSlot } from '../../types/response/appointments';

interface TimePickerProps {
    id: string;
    control: Control<any, any>;
    displayName: string;
    readOnly: boolean;
    disabled?: boolean;
    timeSlots: ITimeSlot[];
}

const TimePicker: FunctionComponent<TimePickerProps> = ({ id, control, displayName, readOnly, disabled, timeSlots }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
                name={id}
                control={control}
                render={({ field, fieldState }) => (
                    <>
                        <MobileTimePicker
                            {...field}
                            // onOpen={() => eventEmitter.emit(`${EventType.OPEN_TIMEPICKER} ${id}`)}
                            disabled={disabled}
                            readOnly={readOnly}
                            label={displayName}
                            format={timeViewFormat}
                            minutesStep={10}
                            ampmInClock={true}
                            closeOnSelect={true}
                            shouldDisableTime={(value: dayjs.Dayjs, view) => {
                                if (view === 'hours') {
                                    return !timeSlots.some((slot) => dayjs(slot.time).hour() === value.hour());
                                } else if (view === 'minutes') {
                                    return !timeSlots.some((slot) => slot.time === value.format(timeViewFormat));
                                }

                                return false;
                            }}
                            defaultValue={field?.value ?? null}
                            value={field?.value ?? null}
                            onChange={(time) => field.onChange(time)}
                            onAccept={(time) => {
                                field.onBlur();
                                // eventEmitter.emit(`${EventType.TIMEPICKER_VALUE_CHANGE} ${id}`, time);
                            }}
                            onSelectedSectionsChange={() => field.onBlur()}
                            slotProps={{
                                textField: {
                                    sx: { m: 1, width: '75%' },
                                    variant: 'standard',
                                    color: fieldState.error?.message && (fieldState.isTouched || field.value) ? 'error' : 'success',
                                    focused: !fieldState.error?.message && (fieldState.isTouched || !!field.value),
                                    helperText: fieldState.error?.message,
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

export default TimePicker;
