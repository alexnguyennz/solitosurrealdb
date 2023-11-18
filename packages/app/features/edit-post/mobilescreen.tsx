import { useEffect, useState } from 'react'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'

import { View, TextInput } from 'dripsy'
import { Button } from 'react-native'

import {
  GoogleSignin,
  type User,
} from '@react-native-google-signin/google-signin'
import { TextLink } from 'solito/link'
import { Stack } from 'expo-router'

const { useParam } = createParam<{ id: string }>()

export function EditPostScreen() {
  const [id] = useParam('id')

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

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/post/mobile/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        const { data } = await response.json()
        setPostContent(data.content)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    getPost()
  }, [id])

  async function updatePost() {
    try {
      const user = await GoogleSignin.getCurrentUser()

      if (user) {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/post/mobile/${id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: user.idToken,
              content: postContent,
            }),
          },
        )

        await response.json()

        back()
      }
    } catch {
      alert('Error updating post')
    }
  }

  return (
    <View sx={{ flex: 1, justifyContent: 'center', p: 16 }}>
      <Stack.Screen
        options={{
          title: `Edit post ${id}`,
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

      <Button onPress={updatePost} title="Submit" />
    </View>
  )
}
