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

      const dob = dateParser(dobStr, datePatternType, dateSeparator);

      if (!dob) return { pattern: 'date is invalid' };

      const minDate = dateParser(minDateStr, datePatternType, dateSeparator);
      const maxDate = dateParser(maxDateStr, datePatternType, dateSeparator);

      if (compareDates(dob, minDate) < 0) return {min: true};
      if (compareDates(dob, maxDate) > 0) return {max: true};

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

  requiredOption: function _requiredOption(invalidValue: string): ValidatorFn {
    return (control: FormGroup): ValidationErrors | null => {
      const val = control.value;

      if (!val || val === invalidValue) return { 'required': true };

      return null;
    }; 
  },

  passwordMatchValidator: function _passwordMatchValidator(pwdControlName: string, confirmPwdControlName: string): ValidatorFn {
    return (control: FormGroup): ValidationErrors | null => {
      const pwd = control.get(pwdControlName);
      const cpwd = control.get(confirmPwdControlName);

      if (pwd && cpwd && pwd.value !== cpwd.value) {
        return { doesNotMatch: true };
      }
      return null;
    };
  },

  isbnValidator: function _isbnValidator(mandatory: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const error = { pattern: true };

      if (!mandatory && !control.value ) return null;

      if (isIsbnValid(control.value)) return null;

      return error;
    };
  }
};

function isIsbnValid(isbn: string): boolean {
  if (!isbn) return false;

  isbn = isbn.split('-').join('');

  if (isbn.length !== 13 && isbn.length !== 10) return false;

  if (isbn.length === 10) {
    try {
      let tot = 0;
      
      for (let i = 0; i < 9; i++) {
        let digit = parseInt(isbn.substr(i, 1), 10);
        tot += ((10 - i) * digit);
      }

      let checksum = ((11 - (tot % 11)) % 11) + '';
      if ('10' === checksum) {
        checksum = 'X';
      }

      return checksum === isbn.substr(9);
    } catch (e) {
      return false;
    }
  } else {
    try {
      let tot = 0;
      
      for (let i = 0; i < 12; i++) {
        let digit = parseInt(isbn.substr(i, 1), 10);
        tot += (i % 2 === 0) ? digit * 1 : digit * 3;
      }

      //checksum must be 0-9. If calculated as 10 then = 0
      let checksum = 10 - (tot % 10);
      if (checksum === 10) {
        checksum = 0;
      }

      return checksum === parseInt(isbn.substr(12), 10);
    } catch (e) {
      return false;
    }
  }
}
