import dayjs from 'dayjs';
import * as Yup from 'yup';
import { dateApiFormat, timeApiFormat, timeSlotFormat } from '../../constants/formats';

declare module 'yup' {
    interface StringSchema {
        hasDateApiFormat: () => StringSchema;
        hasTimeApiFormat: () => StringSchema;
        hasTimeSlotFormat: () => StringSchema;
    }
}

Yup.addMethod(Yup.string, 'hasDateApiFormat', function () {
    return this.test('has-date-api-format', `Date format should be '${dateApiFormat}'`, (value) => dayjs(value, dateApiFormat).isValid());
});

Yup.addMethod(Yup.string, 'hasTimeApiFormat', function () {
    return this.test('has-time-api-format', `Date format should be '${timeApiFormat}'`, (value) => dayjs(value, timeApiFormat).isValid());
});

Yup.addMethod(Yup.string, 'hasTimeSlotFormat', function () {
    return this.test('has-time-slot-format', `Time slot format should be '${timeSlotFormat}'`, (value) =>
        dayjs(value, timeSlotFormat).isValid()
    );
});

declare module 'yup' {
    interface NumberSchema {
        dividedBy: (value: number) => NumberSchema;
    }
}

Yup.addMethod(Yup.number, 'dividedBy', function (value: number) {
    return this.test(`devided-by-${value}`, `Number should be devided by ${value}`, (value) => Number(value) % 10 === 0);
});

export { Yup };
