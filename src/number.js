// @flow

import type {
  IAny,
  IFormatted,
  IFormatter,
  IValidator
} from './interface'
import {isNumericString} from './util'

/**
 * @interface IFormatNumberOpts
 * @package interface
 * @property {string} digitDelimiter
 * @property {string} fractionDelimiter
 * @property {boolean} sign forces sign indication
 */
export type IFormatNumberOpts = {
  digitDelimiter: string;
  fractionDelimiter: string;
  strict: boolean;
  sign: boolean;
}

const DEFAULT_OPTS: IFormatNumberOpts = {
  digitDelimiter: ' ',
  fractionDelimiter: ',',
  strict: true,
  sign: false
}

export const validate: IValidator = (value: IAny) => !isNaN(value)

/**
 * Number formatter.
 * @name formatNumber
 * @type {Function}
 * @public
 * @param {string} value
 * @param {IFormatNumberOpts} [opts]
 * @return {string}
 * @example

 formatNumber(12345.6789)  //  '12 345,6789'
 formatNumber(12345.6789, {digitDelimiter: ',', fractionDelimiter: '.'}) // '12,345.6789'

 */
export const format: IFormatter = (value: IAny, opts?: ?IFormatNumberOpts): IFormatted => {
  const {fractionDelimiter, digitDelimiter, strict, sign} = {...DEFAULT_OPTS, ...opts}

  if (strict && !validate(value)) {
    throw new Error('formatNumber: invalid input')
  }

  const num = +value
  const _value = isNumericString(value)
    ? num.toFixed(Math.max(value.length - (num|0).toString().length - 1, 0))
    : num.toString()

  const signPrefix = sign
    ? num > 0 ? '+' : ''
    : ''

  return signPrefix + _value
    .split('.')
    .map((v, i) => i === 0
      ? v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + digitDelimiter)
      : v
    )
    .join(fractionDelimiter)

}

export default format
