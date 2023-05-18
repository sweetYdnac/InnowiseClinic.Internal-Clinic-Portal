import dayjs from 'dayjs';
import { timeSlotFormat } from './Formats';

export const startTime = dayjs('08:00', timeSlotFormat);
export const endTime = dayjs('18:00', timeSlotFormat);
