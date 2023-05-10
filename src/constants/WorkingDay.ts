import dayjs from 'dayjs';
import { timeViewFormat } from './formats';

export const startTime = dayjs('08:00', timeViewFormat);
export const endTime = dayjs('18:00', timeViewFormat);
