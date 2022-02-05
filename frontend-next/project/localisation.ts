import LocalizedStrings from 'react-localization'
import { stringRecords, setStrings } from 'common/strings'

const Strings = new LocalizedStrings(stringRecords)

// make strings available to common folder
setStrings(Strings)
export default Strings
