import { useState } from 'react'
import { useRouter } from 'solito/router'

import { View } from 'dripsy'

import { useSession, signOut } from 'next-auth/react'

export function NewPostScreen() {
  const { data: session } = useSession()

  const { push } = useRouter()

  const [postContent, setPostContent] = useState('')

  async function createPost() {
    try {
      const response = await fetch(`/api/post/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postContent),
        credentials: 'include',
      })

      await response.json()

      push(`/${session?.user?.email?.replace(/^(.*?)@.*$/, '$1')}`)
    } catch {
      alert('Error creating post')
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

          await createPost()
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
