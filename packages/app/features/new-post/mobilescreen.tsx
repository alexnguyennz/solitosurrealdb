import { useEffect, useState } from 'react'
import { useRouter } from 'solito/router'

import { View, TextInput } from 'dripsy'
import { Button } from 'react-native'

import {
  GoogleSignin,
  type User,
} from '@react-native-google-signin/google-signin'
import { Stack } from 'expo-router'

export function NewPostScreen() {
  const { push, back } = useRouter()

  const [user, setUser] = useState<User | null>(null)

  const [postContent, setPostContent] = useState('')

  async function getUser() {
    const currentUser = await GoogleSignin.getCurrentUser()
    setUser(currentUser)
  }

  useEffect(() => {
    getUser()
  }, [])

  async function createPost() {
    try {
      const user = await GoogleSignin.getCurrentUser()

      if (user) {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/post/mobile/new`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: user.idToken,
              content: postContent,
            }),
            credentials: 'include',
          },
        )

        const data = await response.json()

        back()
      }
    } catch {
      alert('Error creating post')
    }
  }

  return (
    <View sx={{ flex: 1, justifyContent: 'center', p: 16 }}>
      <Stack.Screen
        options={{
          title: 'New Post',
        }}
      />
      {user && (
        <Button
          onPress={async () => {
            await GoogleSignin.signOut()

            push('/')
          }}
          title="Log out"
        />
      )}

      <TextInput
        value={postContent}
        onChangeText={(text) => setPostContent(text)}
        multiline={true}
        numberOfLines={4}
        sx={{
          backgroundColor: 'white',
        }}
      />

      <Button onPress={createPost} title="Submit" />
    </View>
  )
}
