import { Provider } from 'app/provider'
import { Stack } from 'expo-router'

import { GoogleSignin } from '@react-native-google-signin/google-signin'

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  offlineAccess: true,
  forceCodeForRefreshToken: true,
})

export default function Root() {
  return (
    <Provider>
      <Stack />
    </Provider>
  )
}
