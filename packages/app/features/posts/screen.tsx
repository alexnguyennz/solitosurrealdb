import { useEffect, useState } from 'react'
import { createParam } from 'solito'

import { TextLink } from 'solito/link'
import { View } from 'dripsy'

import { useSession, signOut } from 'next-auth/react'

const { useParam } = createParam<{ id: string }>()

type Posts = {
  content: string
  id: string
  users: string
}

export function PostsScreen() {
  const [id] = useParam('id')

  const { data: session } = useSession()

  const [posts, setPosts] = useState<Posts[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        const { data } = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchData()
  }, [session?.user, id])

  return (
    <View
      sx={{ flex: 1, justifyContent: 'center', alignItems: 'center', p: 16 }}
    >
      {session?.user && (
        <>
          <button onClick={() => signOut({ callbackUrl: '/' })}>Log out</button>
          <TextLink href="/new-post">New</TextLink>
        </>
      )}

      <div>
        <ul className="flex flex-col gap-4">
          {posts.map((post) => (
            <li key={post.id}>
              {post.content}
              {session?.user?.email?.replace(/^(.*?)@.*$/, '$1') === id && (
                <a href={`/edit-post/${post.id.slice(6)}`}>Edit</a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </View>
  )
}
