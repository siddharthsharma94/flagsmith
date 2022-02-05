The following guide tells you exactly how to get apps on beta and web deployed.

# Pre-requisites
- Create an organisation and android/ios projects in AppCenter
- Setup a repository on gitlab.com where your project will live
- Setup the environment variables

In order for the pipelines to work, the following is needed, you can look at the boilerplate for reference.

**Web**
- NOW_TOKEN: An access token with permissions on the organisation the website will build to, you can generate a token at https://vercel.com/account/tokens. We should encourage a client to generate one on their account.
- NOW_TEAM_NAME: the name of the vercel team, this can be found in the url e.g. https://vercel.com/solidstategroup

**Mobile**
- APPCENTER_ACCESS_TOKEN: An access token with permissions on the organisation the app will build to, you can generate a token at https://appcenter.ms/settings/apitokens. We should encourage a client to generate one on their account.
- APPCENTER_NAME_ANDROID_PRODUCTION: the full team/name of the android production App, can be pulled from the url: https://appcenter.ms/orgs/Solid-State-Group/apps/Frontend-Boilerplate-Android -> Solid-State-Group/Frontend-Boilerplate-Android  
- APPCENTER_NAME_IOS_PRODUCTION: the full team/name of the iOS production App
- CODE_PUSH_NAME_ANDROID: the full team/name of the App that contains codepush builds (often the same as APPCENTER_NAME_ANDROID_PRODUCTION)
- CODE_PUSH_NAME_IOS: the full team/name of the App that contains codepush builds (often the same as APPCENTER_NAME_IOS_PRODUCTION)

For the first build you should comment out the mobile gitlab steps whilst you setup AppCenter.

**AppCenter Setup**
You'll need to create an iOS and Android project in AppCenter and connect them to the relevant GitLab project. Ideally the client has setup Appstore connect 

Configure the master branch as follows:

**Configuration**

![img.png](packagejson.png)
- Set the package.json to point to /mobile, this will determine which folder builds are attempted from.

![img.png](buildVariant.png)
- For Android you need to select the build Variant, we are encouraging having only 1 app so this will almost always be prodRelease, if we have a test app it'll be uatRelease.

![img.png](iosScheme.png)
- For iOS you need to select a scheme, we are encouraging having only 1 app so this will almost always be appcenter-production, if we have a test app it'll be appcenter-staging.

![img.png](appBundle.png)
- For Android, App bundles are better than APKs due to compression, enable this option so that it can be submitted to the play store.

![img.png](buildFrequency.png)
- Since we build from GitLab set the build frequency to manual

![img.png](buildNumber.png)
- Auto incrementing the build number based on a timestamp is good.

![img.png](iosDistribution.png)
- For iOS

``npm run android:keystore`` and follow the steps, 

![img.png](keystore.png)
### Important: generate a strong password and put the keystore, alias and password into bitwarden. Losing a Keystore is not good.

**todo: document iOS certificates with new client**


