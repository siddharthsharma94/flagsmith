import { each } from 'lodash'
import { Constants } from './utils/constants'
import { LocalizedStringsMethods } from './types/string-types'

export type LanguageContent = typeof defaultContent

export type LocalizedStrings = LocalizedStringsMethods & LanguageContent

type StringsSingleton = {
  instance: LocalizedStrings | undefined
}

const defaultContent = {
  pleaseSelect: 'Please Select',
  defaultErrorMessage: 'An unexpected error has occurred',
  gatewayTimeoutError: 'API is unreachable right now',
}

const strings: StringsSingleton = {
  instance: undefined,
}

const getStrings: () => LocalizedStrings = () => {
  if (!strings.instance) {
    throw new Error(
      'Strings is not initialized. Make sure Web or Mobile sets strings.instance',
    )
  }
  return strings.instance
}

const setStrings = (stringsParam: LocalizedStrings) => {
  strings.instance = stringsParam
  initBlobby()
}

const stringRecords: Record<string, LanguageContent> = {
  en: defaultContent,
  blobby: defaultContent,
}

const initBlobby = () => {
  if (Constants.simulate.FORCE_LANGUAGE === 'blobby') {
    const blobby = {} as LanguageContent
    each(stringRecords.en, (val, key) => {
      const words = val.split(' ')
      const newWordsBlobby = words.map((word: string) => {
        const arr = ['eeeee', 'blob', 'blobby', 'wuueeeeh']
        const random = Math.floor(Math.random() * (1 + (arr.length - 1)))
        if (word.indexOf('{') !== -1) {
          // reserve params
          return word
        }
        return arr[random]
      })
      blobby[key as keyof LanguageContent] = `${newWordsBlobby
        .join(' ')
        .trim()}`
    })
    stringRecords.blobby = blobby
  }
}

export { stringRecords, getStrings, setStrings }
