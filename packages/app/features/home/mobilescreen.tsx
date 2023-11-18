import { useEffect, useState } from 'react'
import { TextLink } from 'solito/link'
import { useFocusEffect, Stack } from 'expo-router'

import { Text, View } from 'dripsy'

import { Button } from 'react-native'

import {
  GoogleSignin,
  GoogleSigninButton,
  type User,
} from '@react-native-google-signin/google-signin'

export function HomeScreen() {
  const [user, setUser] = useState<User | null>(null)

  async function getUser() {
    const currentUser = await GoogleSignin.getCurrentUser()
    setUser(currentUser)
  }

  useFocusEffect(() => {
    getUser()
  })

  async function signOut() {
    await GoogleSignin.signOut()
    setUser(null)
  }

  return (
    <View
      sx={{ flex: 1, justifyContent: 'center', alignItems: 'center', p: 16 }}
    >
      <Stack.Screen options={{ title: 'Home' }} />
      {user ? (
        <>
          <Button onPress={signOut} title="Log out" />
          <Text>HI THERE. This is home</Text>

          <TextLink href={`/${user.user.email?.replace(/^(.*?)@.*$/, '$1')}`}>
            My Posts
          </TextLink>
        </>
      ) : (
        <>
          <Text>Login or Signup with Google</Text>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={() => {
              GoogleSignin.signIn().then((userInfo) => {
                setUser(userInfo)
              })
            }}
          />
        </>
      )}
    </View>
  )
}
