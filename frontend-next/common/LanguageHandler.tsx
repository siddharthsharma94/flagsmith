import { useAuth } from './providers/useAuth'
import { FunctionComponent, useEffect } from 'react'
import { Constants } from './utils/constants'
import { getStrings } from './strings'

const LanguageHandler: FunctionComponent<any> = ({ children }) => {
  const { user } = useAuth()
  const locale = user?.locale
  const forceLanguage = Constants.simulate.FORCE_LANGUAGE
  useEffect(() => {
    if (forceLanguage) {
      getStrings().setLanguage(forceLanguage)
    }
    if (locale && locale !== getStrings().getInterfaceLanguage()) {
      try {
        getStrings().setLanguage(locale)
      } catch (e) {}
    }
  }, [locale, forceLanguage])
  return children
}

export default LanguageHandler
