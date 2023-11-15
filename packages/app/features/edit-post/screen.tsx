import { useEffect, useState } from 'react'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'

import { View } from 'dripsy'

import { useSession, signOut } from 'next-auth/react'

const { useParam } = createParam<{ id: string }>()

export function EditPostScreen() {
  const [id] = useParam('id')

  const { data: session } = useSession()

  const [postContent, setPostContent] = useState('')

  const { push } = useRouter()

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await fetch(`/api/post/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        if (response.ok) {
          const { data } = await response.json()
          setPostContent(data?.content)
        } else {
          console.error('Error:', response.status)
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }

    getPost()
  }, [session?.user, id])

  async function updatePost() {
    try {
      const response = await fetch(`/api/post/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postContent),
        credentials: 'include',
      })

      await response.json()

      push(`/${session?.user?.email?.replace(/^(.*?)@.*$/, '$1')}`)
    } catch {
      alert('Error updating post')
    }
  }

  return (
    <View
      sx={{ flex: 1, justifyContent: 'center', alignItems: 'center', p: 16 }}
    >
      {session?.user && (
        <>
          <button onClick={() => signOut({ callbackUrl: '/' })}>Log out</button>
        </>
      )}

      <form
        onSubmit={async (e) => {
          e.preventDefault()

          await updatePost()
        }}
      >
        <div>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            rows={4}
          ></textarea>
        </div>

        <button type="submit">Submit</button>
      </form>
    </View>
  )
}
