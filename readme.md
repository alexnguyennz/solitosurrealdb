# Solito SurrealDB

## Setup

### Google
**Web**
1. Create OAuth Client ID of `Web` type
```
// Authorized Origin 
https://nextjsappname.vercel.app

// Authorized Redirect URIs
http://localhost:3000/api/auth/callback/google
https://nextjsappname.vercel.app/auth/callback/google
```
2. Copy client ID and secret for Next.js environment variables

**Android**
1. Create OAuth Client ID of `Android` type
2. Copy package name from `/apps/expo/app.json` e.g. `com.anonymous.solitoexporouter` and enter in configuration
3. cd into `/apps/expo/.android` and run `keytool -keystore app/debug.keystore -list -v`
   4. use password of `android`
   5. copy SHA1 into configuration

### Expo[.yarnrc.yml](.yarnrc.yml)
**.env** (/apps/expo)
```
// change local IP address to your own
// change to live domain in production
EXPO_PUBLIC_API_URL=http://192.168.1.68:3000

EXPO_PUBLIC_GOOGLE_CLIENT_ID=webGoogleClientID
```

### Next.js
**.env.local** (/apps/next)
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=mysecret

// change to live database in production
SURREAL_ENDPOINT=http://localhost:8000

// change accordingly
SURREAL_NAMESPACE=test
SURREAL_DATABASE=test
SURREAL_USERNAME=root
SURREAL_PASSWORD=root

GOOGLE_CLIENT_ID=webGoogleClientID
GOOGLE_CLIENT_SECRET=webGoogleClientSecret
```

### Installation and Development
1. Run `yarn install`
2. In two terminals:
   3. cd into `apps/expo` and run `npx expo ios:android`
   4. run `yarn web` for Next.js

### SurrealDB
**Setup**
1. Run below schema in SurrealDB

**Schema**
```sql
DEFINE TABLE users SCHEMAFULL
	PERMISSIONS
		FOR select, update, delete WHERE id = $auth.id;

DEFINE FIELD sub ON users TYPE string;
DEFINE FIELD name ON users TYPE string;
DEFINE FIELD email ON users TYPE string ASSERT string::is::email($value);
DEFINE FIELD picture ON users TYPE string;

DEFINE INDEX sub ON users COLUMNS sub UNIQUE;
DEFINE INDEX email ON users FIELDS email UNIQUE;

DEFINE SCOPE users
  SESSION 1d
  SIGNUP (CREATE users SET sub = $sub, email = $email, name = $name, picture = $picture)
  SIGNIN (SELECT * FROM users WHERE sub = $sub AND email = $email)
;

DEFINE TABLE posts SCHEMAFULL
  PERMISSIONS
		FOR create, update, delete WHERE users = $auth.id;

DEFINE FIELD content on posts TYPE string;
DEFINE FIELD users ON posts TYPE record (users) ASSERT $value IS NOT NONE;
```
