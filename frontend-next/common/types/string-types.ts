type Formatted = number | string | JSX.Element
type FormatObject<U extends Formatted> = { [key: string]: U }

export abstract class LocalizedStringsMethods {
  /**
   * Can be used from ouside the class to force a particular language
   * indipendently from the interface one
   * @param language
   */
  abstract setLanguage(language: string): void

  /**
   *  The current language displayed (could differ from the interface language
   *  if it has been forced manually and a matching translation has been found)
   */
  abstract getLanguage(): string

  /**
   * The current interface language (could differ from the language displayed)
   */
  abstract getInterfaceLanguage(): string

  /**
   * Format the passed string replacing the numbered placeholders
   * i.e. I'd like some {0} and {1}, or just {0}
   * Use example:
   *   strings.formatString(strings.question, strings.bread, strings.butter)
   */
  abstract formatString<T extends Formatted>(
    str: string,
    ...values: Array<T | FormatObject<T>>
  ): Array<string | T> | string

  /**
   * Return an array containing the available languages passed as props in the constructor
   */
  abstract getAvailableLanguages(): string[]

  /**
   * Return a string with the passed key in a different language
   * @param key
   * @param language
   */
  abstract getString(key: string, language?: string): string

  /**
   * Replace the NamedLocalization object without reinstantiating the object
   * @param props
   */
  abstract setContent(props: any): void
}
