import { useEffect, useState } from 'react'
import { createParam } from 'solito'
import { TextLink } from 'solito/link'
import { useRouter } from 'solito/router'
import { useFocusEffect } from 'expo-router'

import { View, P, FlatList } from 'dripsy'
import { Button, ListRenderItem } from 'react-native'

import {
  GoogleSignin,
  type User,
} from '@react-native-google-signin/google-signin'

const { useParam } = createParam<{ id: string }>()

type Posts = {
  content: string
  id: string
  users: string
}

export function PostsScreen() {
  const [id] = useParam('id')

  const { push } = useRouter()

  const [user, setUser] = useState<User | null>(null)

  const [posts, setPosts] = useState<Posts[]>([])

  async function getUser() {
    const currentUser = await GoogleSignin.getCurrentUser()
    setUser(currentUser)
  }

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/posts/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      )

      const { data } = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  useFocusEffect(() => {
    if (id) fetchData()
  })

  const renderItem: ListRenderItem<Posts> = ({ item }) => (
    <>
      <P>{item.content}</P>
      {user?.user?.email?.replace(/^(.*?)@.*$/, '$1') === id && (
        <TextLink href={`/edit-post/${item.id.slice(6)}`}>Edit</TextLink>
      )}
    </>
  )

  return (
    <View
      sx={{ flex: 1, justifyContent: 'center', alignItems: 'center', p: 16 }}
    >
      {user && (
        <>
          <Button
            onPress={async () => {
              await GoogleSignin.signOut()

              push('/')
            }}
            title="Log out"
          />
          <TextLink href="/new-post">New</TextLink>
        </>
      )}

      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(post: Posts) => post.id}
      />
    </View>
  )
}
