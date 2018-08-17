/**
 * Represents date pattern types.
 */
export enum DatePatternType {
  DDMMYYYY = 1,
  MMDDYYYY = 2,
  YYYYMMDD = 3
}

/**
 * Represents date separators.
 */
export enum DateSeparator {
  HYPHEN = 1,
  SLASH = 2
}

/**
 * Returns a date pattern that can be used to match a date string. If the specified
 * date separator is `null` then DateSeparator.HYPHEN is taken by default. If the
 * specified date pattern type is `null` then DatePatternType.DDMMYYYY is taken
 * by default.
 *
 * @param datePatternType type of date pattern from `DatePatternType`
 * @param dateSeparator date separator character from `DateSeparator`
 */
export function createDatePattern(
  datePatternType: DatePatternType,
  dateSeparator: DateSeparator
): RegExp {
  if (!datePatternType) datePatternType = DatePatternType.DDMMYYYY;

  let separator = separatorFor(dateSeparator);
  let pattern = null;

  switch (+datePatternType) {
    case DatePatternType.DDMMYYYY:
      pattern = '\\d{2}' + separator + '\\d{2}' + separator + '\\d{4}';
      break;
    case DatePatternType.MMDDYYYY:
      pattern = '\\d{2}' + separator + '\\d{2}' + separator + '\\d{4}';
      break;
    case DatePatternType.YYYYMMDD:
      pattern = '\\d{4}' + separator + '\\d{2}' + separator + '\\d{2}';
      break;
    default:
      pattern = '\\d{2}' + separator + '\\d{2}' + separator + '\\d{4}';
  }

  pattern = '^' + pattern + '$';

  return new RegExp(pattern);
}

/**
 * Returns a date object if the date string passed is a valid date and returns `null` otherwise.
 *
 * @param dateStr date string to be parsed
 * @param datePattern date pattern type from `DatePatternType`
 * @param dateSeparator date separator from `DateSeparator`
 */
export function dateParser(
  dateStr: string,
  datePattern: DatePatternType,
  dateSeparator: DateSeparator
): Date {
  if (!dateStr) return null;
  const regExp: RegExp = createDatePattern(datePattern, dateSeparator);

  if (!regExp.test(dateStr)) return null;

  let separator = separatorFor(dateSeparator);

  const multiple: string[] = dateStr.split(separator);
  const day = +multiple[0];
  const month = +multiple[1] - 1; // month starts with 0 in date object
  const year = +multiple[2];
  const date: Date = new Date();

  date.setDate(day);
  date.setMonth(month);
  date.setFullYear(year);

  if (date.getDate() === day && month === date.getMonth() && year === date.getFullYear())
    return date;

  return null;
}

/**
 * Returns a string representing the date according to the specified
 * pattern type and date separator if none of the three parameters are
 * `null` and returns `null` otherwise.
 *
 * @param date the specified date object to convert into string
 * @param datePatternType required pattern of date
 * @param dateSeparator separator to be used
 */
export function toString(
  date: Date,
  datePatternType: DatePatternType,
  dateSeparator: DateSeparator
): string {
  if (!date || !datePatternType || !dateSeparator) return null;

  let separator = separatorFor(dateSeparator);
  let dayOfMonth = (date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate());
  let month = (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1));
  let year = '' + date.getFullYear();


  switch (+datePatternType) {
    case DatePatternType.DDMMYYYY:
      return dayOfMonth + separator + month + separator + year;
    case DatePatternType.MMDDYYYY:
     return month + separator + dayOfMonth + separator + year;
    case DatePatternType.YYYYMMDD:
    default:
      return year + separator + month + separator + dayOfMonth;
  }
}

/**
 * Returns string to be used as separator for the sepcified date separator.
 *
 * @param dateSeparator separator from `DateSeparator`
 */
function separatorFor(dateSeparator: DateSeparator) {
  switch (+dateSeparator) {
    case DateSeparator.SLASH:
      return '/';
    default:
      return '-';
  }
}

/**
 * Returns the difference between left and right object. A return value greater than zero
 * indicates that left object is greater. A return value less than zero indicates that
 * the right object is greater. A return value zero indicates that both dates are equal.
 *
 * @param left date object to be compared
 * @param right date object to be compared
 */
export function compareDates(left: Date, right: Date): number {
  if (left.getFullYear() !== right.getFullYear()) return left.getFullYear() - right.getFullYear();
  if (left.getMonth() !== right.getMonth()) return left.getMonth() - right.getMonth();

  return left.getDate() - right.getDate();
}
