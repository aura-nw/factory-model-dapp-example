import { subYears } from 'date-fns';
import { Between, FindOperator } from 'typeorm';
import { CustomError } from '../common/customError';
import { ErrorMap } from '../common/error.map';

export class CommonUtil {
  makeFileObjects(img) {
    // You can create File objects from a Buffer of binary data
    const buffer = Buffer.from(img.data, 'base64');
    return [
      new File(['contents-of-file-1'], 'plain-utf8.txt'),
      new File([buffer], img.name),
    ];
  }

  getBetweenDate(fromDateStr: string, toDateStr: string): FindOperator<Date> {
    const fromDate = fromDateStr ? new Date(fromDateStr) : undefined;
    const toDate = toDateStr ? new Date(toDateStr) : undefined;
    let betweenDate;
    if (fromDate && toDate) {
      toDate.setUTCHours(23, 59, 59, 999);
      betweenDate = Between(fromDate, toDate);
    } else if (fromDate) {
      betweenDate = Between(fromDate, new Date());
    } else if (toDate) {
      toDate.setUTCHours(23, 59, 59, 999);
      betweenDate = Between(subYears(toDate, 1), toDate);
    } else {
      betweenDate = undefined;
    }
    return betweenDate;
  }

  checkHasDuplicate(array: JSON[]): boolean {
    const hash = Object.create(null);
    return array.some(function (a) {
      return a['code'] && (hash[a['code']] || !(hash[a['code']] = true));
    });
  }

}
export function isCustomError(
  error: Error | CustomError,
  errorMap?: typeof ErrorMap.SUCCESSFUL,
): boolean {
  if (errorMap && error instanceof CustomError && error.errorMap === errorMap)
    return true;
  if (!error && error instanceof CustomError) return true;
  return false;
}