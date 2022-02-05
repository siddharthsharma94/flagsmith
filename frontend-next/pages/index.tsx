import {NextPageWithLayout} from 'types/nextPageWithLayout'
import Button, {ButtonLink} from 'components/base/forms/Button'
import useLoggedInRedirect from 'common/providers/useLoggedInRedirect'
import * as React from "react";
import {ChangeEventHandler, useEffect, useState} from "react";
import {API} from "../project/api";
import {useRouter} from "next/router";
import {Constants, Utils} from "common/utils";
import * as yup from 'yup'
import {useFormik} from "formik";
import NavIconSmall from 'components/icons/NavIconSmall';
import {Card, InputGroup, Row} from "reactstrap";
import Link from 'next/link'
import {useAuth} from "../common/providers/useAuth";
import FormGroup from "components/base/grid/FormGroup";
import Flex from "components/base/grid/Flex";
import { SamlForm } from 'components/SamlForm';

const schema = yup.object().shape({
  email: yup
      .string()
      .required("Email address is required"),
  password: yup.string().required("Password is required"),
  organisation_name: yup.string().required("Organisation is required"),
  first_name: yup.string().required("Organisation is required"),
  last_name: yup.string().required("Organisation is required"),
});

const HomePage: NextPageWithLayout = () => {
  useLoggedInRedirect()
  const [marketing_consent_given, setMarketing_consent_given] = useState<boolean>(API.getCookie("marketing_consent_given") !== "false")
  const {
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    setTouched,
    touched,
    values
  } = useFormik({
    validateOnMount: true,
    initialValues: {
      email:"",
      password:"",
      organisation_name:"",
      first_name:"",
      last_name:"",
    },
    validationSchema: schema,
    onSubmit: (values) => {

    }
  });

  const changeHandler = (e:ChangeEventHandler) => {
    handleChange(e)
  };

  const onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    const newTouched = {};
    Object.keys(errors).map((v) => {
      // @ts-ignore
      newTouched[v] = true;
    });
    setTouched(newTouched);
    handleSubmit(e);
  };
  const router = useRouter()
  const path = router.asPath;
  useEffect(()=>{
    let _document = typeof document === "undefined"? null : document;
    const emailField = _document?.querySelector<HTMLInputElement>('input[name="firstName"]') || _document?.querySelector<HTMLInputElement>('input[name="email"]');
    if (emailField) {
      emailField.focus();
      emailField.value = emailField.value;
    }
    if (path.includes("oauth")) {
      const parts = location.href.split('oauth/');
      const params = parts[1];
      if (params && params.includes('google')) {
        const access_token = Utils.fromParam().code;
        // todo:
        // AppActions.oauthLogin('google', {
        //   access_token,
        //   marketing_consent_given: this.state.marketing_consent_given
        // });
      } else if (params && params.includes('github')) {
        const access_token = Utils.fromParam().code;
        // AppActions.oauthLogin('github', {
        //   access_token,
        //   marketing_consent_given: this.state.marketing_consent_given
        // });
      } else if (path.includes("saml")) {
        const access_token = Utils.fromParam().code;
        if (access_token) {
          // AppActions.oauthLogin('saml', {
          //   access_token,
          //   marketing_consent_given:this.state.marketing_consent_given
          // });
          router.replace("/")
        }
      }
      API.trackPage(Constants.pages.HOME);
    }
  },[path])
  const redirect = Utils.fromParam().redirect ? `?redirect=${Utils.fromParam().redirect}` : '';
  let _document = typeof document == "undefined"?  null : document;
  const isInvite = _document?.location.href.indexOf('invite') != -1;
  const isSignup = (!projectOverrides.preventSignup || isInvite) && ((isInvite && _document?.location.href.indexOf('login') === -1) || _document?.location.href.indexOf('signup') != -1);
  const disableSignup = projectOverrides.preventSignup && !isInvite && isSignup;
  const oauths = [];
  const disableOauthRegister = API.flagsmith.hasFeature('disable_oauth_registration');

  const {login,userLoading, userError, register} = useAuth()


  if ((!isSignup || !disableOauthRegister) && !disableSignup) {
    if (API.flagsmith.getValue('oauth_github')) {
      oauths.push((
          <a key="github" className="btn btn__oauth btn__oauth--github" href={JSON.parse(API.flagsmith.getValue('oauth_github') as string).url}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg> GitHub
          </a>
      ));
    }
    if (API.flagsmith.getValue('oauth_google')) {
      oauths.push((
          <a
              key="google" className="btn btn__oauth btn__oauth--google" onClick={() => {
            // Google.login().then((res) => {
            //   if (res) {
            //     _document?.location = `${_document?.location.origin}/oauth/google?code=${res}`;
            //   }
            // });
          }}
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <title>Google icon</title>
              <path
                  fill="#fff"
                  d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
              />
            </svg> Google
          </a>
      ));
    }

    if (API.flagsmith.hasFeature('saml')) {
      oauths.push((
          <a
              onClick={() => {
                openModal('Single Sign-On', <SamlForm/>);
              }
              } key="single-sign-on" className="btn btn__oauth btn__oauth--saml"
          >
            Single Sign-On
          </a>
      ));
    }
  }

  return (
    <div className='container'>
      <div id="login-page" style={{ flexDirection: 'column' }} className="fullscreen-container">
        <div className="mb-4">
          <NavIconSmall className="signup-icon" />
        </div>
        <div className="text-center mb-4">
          {isSignup ? (
              <>
                <h3>It's free to get started.</h3>
                {!isInvite && (
                    <>
                      <p className="mb-0">We have a 100% free for life plan for smaller projects.</p>
                      <ButtonLink
                          className="pt-3 pb-3"
                          buttonText="Check out our Pricing"
                          href="https://flagsmith.com/pricing"
                          target="_blank"
                      />
                    </>
                )}
              </>
          ) : (
              <>
                <h3>Sign in to Flagsmith</h3>
                {!!oauths.length && (
                    <p>
                      Log in to your account with one of these services.
                    </p>
                )}
              </>
          )}

        </div>

        {disableSignup && (
            <div className="signup-form" id="sign-up">
              <Card>
                To join an organisation please contact your administrator for an invite link.

                <div>
                  <Link id="existing-member-btn" href={`/login${redirect}`}>
                    <ButtonLink
                        className="mt-2 pb-3 pt-2"
                        buttonText="Already a member?"
                    />
                  </Link>
                </div>
              </Card>
            </div>
        )}

        {!disableSignup && (
            <div className="signup-form" id="sign-up">
              {!isSignup ? (
                  <React.Fragment>
                    <Card>
                            <form
                                id="form" name="form" onSubmit={(e) => {
                              Utils.preventDefault(e);
                              login({ email, password });
                            }}
                            >
                              {!!oauths.length && (
                                  <Row style={{ justifyContent: 'center' }}>
                                    {oauths}
                                  </Row>
                              )}

                              {isInvite
                                  && (
                                      <div className="notification flex-row">
                                        <span
                                            className="notification__icon ion-md-information-circle-outline mb-2"
                                        />
                                        <p className="notification__text pl-3">Login to accept your invite</p>
                                      </div>
                                  )
                              }
                              <fieldset id="details">
                                {userError?.email || error?.email ? (
                                    <span
                                        id="email-error"
                                        className="text-danger"
                                    >
                                      {userError?.email || error?.email}
                                    </span>
                                ) : null}
                                <InputGroup
                                    title="Email Address / Username"
                                    data-test="email"
                                    inputProps={{
                                      name: 'email',
                                      className: 'full-width',
                                      error: errors.email||userError?.email,
                                    }}
                                    value={values.email}
                                    onChange={changeHandler}
                                    className="input-default full-width mb-2 "
                                    type="email"
                                    name="email" id="email"
                                />
                                {errors.password||userError?.password ? (
                                    <span
                                        id="password-error"
                                        className="text-danger"
                                    >
                                      {errors.password||userError?.password}
                                    </span>
                                ) : null}
                                <InputGroup
                                    title="Password"
                                    inputProps={{
                                      name: 'password',
                                      className: 'full-width',
                                      error: error && error.password,
                                    }}
                                    value={values.email}
                                    onChange={changeHandler}
                                    rightComponent={(
                                        <Link
                                            to={`/password-recovery${redirect}`}
                                            onClick={this.showForgotPassword}
                                        >
                                          <div className="float-right">
                                            <ButtonLink type="button" buttonText="Forgot password?" />
                                          </div>
                                        </Link>
                                    )}
                                    className="input-default full-width mb-2"
                                    type="password"
                                    name="password"
                                    data-test="password"
                                    id="password"
                                />
                                <div className="form-cta">
                                  <Button
                                      id="login-btn"
                                      disabled={userLoading}
                                      type="submit"
                                      className="mt-3 px-4 full-width"
                                  >
                                    Login
                                  </Button>
                                </div>
                              </fieldset>
                              {userError && (
                                  <div id="error-alert" className="alert mt-3 alert-danger">
                                    {typeof userError === "string"? userError : 'Please check your details and try again'}
                                  </div>
                              )}
                            </form>
                    </Card>

                    {(!projectOverrides.preventSignup || isInvite) && (

                        <div>
                          <Row className="justify-content-center mt-2">
                            Creating a new account is easy{' '}
                            <Link id="existing-member-btn" to={`/signup${redirect}`}>
                              <ButtonLink data-test="jsSignup" className="ml-1" buttonText=" Sign up" />
                            </Link>
                          </Row>
                          <div className="mt-5 text-center text-small text-muted">
                            By signing up you agree to our <a
                              style={{ opacity: 0.8 }} target="_blank" className="text-small"
                              href="https://flagsmith.com/terms-of-service/"
                          >Terms of Service
                          </a> and <a
                              style={{ opacity: 0.8 }} target="_blank" className="text-small"
                              href="https://flagsmith.com/privacy-policy/"
                          >Privacy Policy
                          </a>
                          </div>
                        </div>

                    )}
                  </React.Fragment>
              ) : (
                  <React.Fragment>

                    <Card>
                      <form
                          id="form" name="form" onSubmit={(e) => {
                        Utils.preventDefault(e);
                        const isInvite = document.location.href.indexOf('invite') != -1;
                        register({
                              email,
                              password,
                              first_name,
                              last_name,
                              marketing_consent_given:this.state.marketing_consent_given
                            },
                            isInvite);
                      }}
                      >

                        {!!oauths.length && (
                            <Row style={{ justifyContent: 'center' }}>
                              {oauths}
                            </Row>
                        )}

                        {userError
                            && (
                                <FormGroup>
                                  <div id="error-alert" className="alert alert-danger">
                                    {typeof userError === 'string' ? userError : 'Please check your details and try again'}
                                  </div>
                                </FormGroup>
                            )
                        }
                        {isInvite
                            && (
                                <div className="notification flex-row">
                                  <span
                                      className="notification__icon ion-md-information-circle-outline mb-2"
                                  />
                                  <p className="notification__text pl-3">Create an account to accept your
                                    invite
                                  </p>
                                </div>
                            )
                        }
                        <fieldset id="details" className="">
                          <InputGroup
                              title="First Name"
                              data-test="firstName"
                              inputProps={{
                                name: 'firstName',
                                className: 'full-width mb-2',
                                error: userError?.first_name||errors?.first_name,
                              }}
                              onChange={changeHandler}
                              value={values.first_name}
                              className="input-default full-width"
                              type="text"
                              name="firstName" id="firstName"
                          />
                          <InputGroup
                              title="Last Name"
                              data-test="lastName"
                              inputProps={{
                                name: 'lastName',
                                className: 'full-width mb-2',
                                error: userError?.last_name||errors?.last_name,
                              }}
                              onChange={changeHandler}
                              value={values.last_name}
                              className="input-default full-width"
                              type="text"
                              name="lastName" id="lastName"
                          />

                          {userError?.email || errors?.email ? (
                              <span
                                  id="email-error"
                                  className="text-danger"
                              >
                                {userError?.email || errors?.email}
                              </span>
                          ) : null}
                          <InputGroup
                              title="Email Address"
                              data-test="email"
                              inputProps={{
                                name: 'email',
                                className: 'full-width mb-2',
                                error: userError?.email||errors?.email,
                              }}
                              onChange={changeHandler}
                              value={values.email}
                              className="input-default full-width"
                              type="email"
                              name="email"
                              id="email"
                          />
                          {userError?.password || errors?.password ? (
                              <span
                                  id="email-error"
                                  className="text-danger"
                              >
                                {userError?.password || errors?.password}
                              </span>
                          ) : null}
                          <InputGroup
                              title="Password"
                              data-test="password"
                              inputProps={{
                                name: 'password',
                                className: 'full-width mb-2',
                                error: userError?.password||errors?.password,
                              }}
                              onChange={changeHandler}
                              value={values.password}
                              className="input-default full-width"
                              type="password"
                              name="password"
                              id="password"
                          />
                          {API.flagsmith.hasFeature("mailing_list") && (
                              <Row className="text-right">
                                <Flex/>
                                <input onChange={(e)=>{
                                  API.setCookie("marketing_consent_given", `${e.target.checked}`)
                                  this.setState({marketing_consent_given:e.target.checked})
                                }} id="mailinglist" className="mr-2" type="checkbox" checked={this.state.marketing_consent_given}/>
                                <label className="mb-0" htmlFor="mailinglist">Join our mailing list!</label>
                              </Row>
                          )}
                          <div classNam e="form-cta">
                            <Button
                                data-test="signup-btn"
                                name="signup-btn"
                                disabled={userLoading}
                                className="px-4 mt-3 full-width"
                                type="submit"
                            >
                              Create Account
                            </Button>
                          </div>
                        </fieldset>
                      </form>
                    </Card>
                    <Row className="justify-content-center mt-2">
                      Have an account?{' '}
                      <Link id="existing-member-btn" href={`/login${redirect}`}>
                        <ButtonLink
                            className="ml-1"
                            buttonText="Log in"
                        />
                      </Link>
                    </Row>


                  </React.Fragment>
              )}
            </div>
        )}
      </div>
    </div>
  )
}

HomePage.getLayout = (page) => {
  return <>{page}</>
}

export default HomePage
