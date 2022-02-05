type ErrorMessage = {
  defaultErrorMessage: string
  gatewayTimeoutError: string
}

const parseErrorFromAPI = (error: any, defaultErrorMessage: string) => {
  return error?.message || error?.error || defaultErrorMessage
}

const errorHandler = (errorMessage: ErrorMessage) => (e: any) => {
  const defaultErrorMessage = errorMessage.defaultErrorMessage

  if (!e) return defaultErrorMessage

  if (e && e.message) {
    return e.message
  }
  // Handle string errors.
  if (typeof e === 'string') return e

  // Handle JS errors.
  if (e instanceof Error) return e.message || defaultErrorMessage

  // Handle status codes
  if (e.httpStatus) {
    switch (e.httpStatus) {
      case 504: // Gateway timeout
        return errorMessage.gatewayTimeoutError
      default:
        break
    }
  }

  // Handle API errors
  try {
    if (e._bodyText) {
      const error = JSON.parse(e._bodyText)
      return parseErrorFromAPI(error, errorMessage.defaultErrorMessage)
    }
    return defaultErrorMessage
  } catch (err) {
    return e._bodyText || defaultErrorMessage
  }
}

export { errorHandler }
