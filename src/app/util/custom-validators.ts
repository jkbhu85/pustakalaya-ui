import { ValidatorFn, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { DatePatternType, DateSeparator, dateParser, compareDates } from './date-util';

export const PtkValidators = {
  dobRangeValidator: function _dobRangeValidator(
    minDateStr: string,
    maxDateStr: string,
    datePatternType: DatePatternType,
    dateSeparator: DateSeparator
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const dobStr = control.value;
      const outOfRangeError: ValidationErrors = {
        dateOfBirthRange: 'date of birth is out of range'
      };

      const dob = dateParser(dobStr, datePatternType, dateSeparator);

      if (!dob) return { pattern: 'date is invalid' };

      const minDate = dateParser(minDateStr, datePatternType, dateSeparator);
      const maxDate = dateParser(maxDateStr, datePatternType, dateSeparator);

      if (compareDates(dob, minDate) < 0 || compareDates(dob, maxDate) > 0) return outOfRangeError;

      return null;
    };
  },

  dateValidator: function _dateValidator(
    datePattern: DatePatternType,
    dateSeparator: DateSeparator
  ) {
    return (control: AbstractControl): ValidationErrors | null => {
      const dateError = { pattern: 'date is invalid' };
      const dateStr: string = control.value;

      if (dateParser(dateStr, datePattern, dateSeparator)) return null;

      return dateError;
    };
  },

  passwordMatchValidator: function _passwordMatchValidator(): ValidatorFn {
    console.log('_passwordMatchValidator');
    return (control: FormGroup): ValidationErrors | null => {
      const pwd = control.get('password');
      const cpwd = control.get('confirmPassword');

      if (pwd && cpwd && pwd.value !== cpwd.value) {
        return { doesNotMatch: true };
      }
      return null;
    };
  }
};
