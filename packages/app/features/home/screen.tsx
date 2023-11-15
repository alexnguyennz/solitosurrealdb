import { TextLink } from 'solito/link'
import { Text, View } from 'dripsy'

import { useSession, signIn, signOut } from 'next-auth/react'

export function HomeScreen() {
  const { data: session } = useSession()

  return (
    <View
      sx={{ flex: 1, justifyContent: 'center', alignItems: 'center', p: 16 }}
    >
      {session?.user ? (
        <>
          <button onClick={() => signOut()}>Log out</button>
          <Text>HI THERE. This is home</Text>
          <TextLink href={`${session.user.email?.replace(/^(.*?)@.*$/, '$1')}`}>
            My Posts
          </TextLink>
        </>
      ) : (
        <>
          <Text>Login or Signup with Google</Text>
          <button onClick={() => signIn()}>Login</button>
        </>
      )}
    </View>
  )
}
