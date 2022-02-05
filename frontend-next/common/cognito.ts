import Amplify, { Auth } from 'aws-amplify'
import { getApi } from './api/api'

// "amazon-cognito-identity-js": "^4.5.11",
//   "aws-amplify": "^3.3.20",
//   "aws-amplify-react-native": "^4.3.1",

const Cognito = {
  init: (config: any) => {
    getApi().log('COGNITO', 'INIT', config)
    Amplify.configure({
      Auth: config,
    })
  },
  signUp: async function (
    username: string,
    password: string,
    attributes?: Record<any, any>,
  ) {
    try {
      const { user, userConfirmed } = await Auth.signUp({
        username,
        password,
        attributes,
      })
      return {
        user,
        userConfirmed,
      }
    } catch (error) {
      console.log('error signing up:', error)
      throw error
    }
  },
  getSession: async function () {
    try {
      await Auth.currentAuthenticatedUser()
      return await Auth.currentSession()
    } catch (e) {
      return null
    }
  },
  confirmSignUp: async function (username: string, code: string) {
    return await Auth.confirmSignUp(username, code)
  },
  login: async function (username: string, password: string): Promise<string> {
    getApi().log('COGNITO', username, password)
    await Auth.signIn({
      username,
      password,
    })
    const session = await Auth.currentSession()
    return session.getAccessToken().getJwtToken()
  },
  resetPassword: async function (email: string) {
    return await Auth.forgotPassword(email)
  },
  changePassword: async function (
    username: string,
    code: string,
    password: string,
  ) {
    return await Auth.forgotPasswordSubmit(username, code, password)
  },
  logout: async function () {
    return await Auth.signOut()
  },
  resendConfirmSignUp: async function (username: string) {
    return await Auth.resendSignUp(username)
  },
  resendConfimationCode: async function (email: string) {
    return await Auth.forgotPassword(email)
  },
}

export default Cognito
