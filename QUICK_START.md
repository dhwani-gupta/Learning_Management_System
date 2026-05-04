# Quick Start Guide - Auto-Login Implementation

## Installation

Before running the app, install the required dependency:

```bash
npm install expo-secure-store
```

## How It Works

### 1. **Authentication Flow**

#### Login Flow:

```
User enters credentials → LoginPage → useAuth().login()
→ Tokens stored securely → Auto-redirected to Courses
```

#### Register Flow:

```
User enters details → RegisterPage → useAuth().register()
→ Tokens stored securely → Redirected to login page
```

#### Auto-Login on App Start:

```
App starts → AuthProvider initializes → restoreToken()
→ Check SecureStore for tokens → Auto-login if found
→ If not found, show login page
```

### 2. **Using the Auth Hook**

In any component, access authentication:

```typescript
import { useAuth } from "@/src/context/AuthContext";

const MyComponent = () => {
  const { user, isSignedIn, login, logout } = useAuth();

  // user: { _id, username, email, avatar, fullName, ... }
  // isSignedIn: boolean (true if logged in)
  // login: (username, password) => Promise<void>
  // logout: () => Promise<void>

  return (
    // Your component JSX
  );
};
```

### 3. **Logout Implementation**

From ProfileScreen:

- Tap "Logout" button
- Confirm in dialog
- Logout API called
- All tokens cleared
- Redirected to login page

### 4. **Profile Screen Features**

Navigate to Profile tab to see:

- ✅ User avatar & basic info
- ✅ User ID (truncated)
- ✅ Statistics (enrollments, progress, certs)
- ✅ Account settings (placeholder for future)
- ✅ Logout button

## Testing Scenarios

### Scenario 1: Fresh Install

1. Launch app
2. See LoginPage (no tokens found)
3. Enter valid credentials
4. Successfully logged in → Courses page

### Scenario 2: Remember Session

1. Login successfully (tokens stored)
2. Force close app
3. Reopen app
4. Auto-login works → Directly to Courses page
5. No need to re-enter credentials

### Scenario 3: Manual Logout

1. Navigate to Profile tab
2. Tap "Logout" button
3. Confirm logout
4. Tokens cleared
5. Return to LoginPage

### Scenario 4: Invalid Credentials

1. Enter wrong username/password
2. See error message
3. Can retry login

## Navigation Structure

```
App Start
├─ Not Authenticated
│  ├─ LoginPage (/)
│  └─ RegisterPage (/register)
│
└─ Authenticated
   ├─ Courses Tab (default) - /(auth)/(tabs)/index
   │  └─ Course Details → /(auth)/course-details
   └─ Profile Tab - /(auth)/(tabs)/profile
```

## Token Security

✅ **What's Stored Securely** (Expo SecureStore):

- `accessToken` - Used in API headers
- `refreshToken` - For token refresh (future)
- `userInfo` - User profile data

✅ **What Happens on Logout**:

- All tokens deleted from secure storage
- User object cleared from memory
- User redirected to login page

## API Integration

### Expected Login Response

```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "user_id",
      "username": "username",
      "email": "email@example.com",
      "fullName": "Full Name",
      "avatar": "url_to_avatar"
    },
    "accessToken": "token_string",
    "refreshToken": "refresh_token_string"
  },
  "message": "Login successful",
  "success": true
}
```

### Expected Logout Response

```json
{
  "statusCode": 200,
  "data": {},
  "message": "User logged out",
  "success": true
}
```

## Troubleshooting

### Issue: "Module not found: expo-secure-store"

**Solution**: Run `npm install expo-secure-store`

### Issue: Auto-login not working

**Solution**:

1. Check browser console for errors
2. Verify tokens are being stored (test login first)
3. Force close and reopen app
4. Clear app data if still having issues

### Issue: Logout doesn't redirect to login

**Solution**:

1. Check console for logout API errors
2. Verify router.replace("/") is called
3. Check if tokens are cleared from storage

### Issue: Profile screen shows "User" instead of name

**Solution**:

1. Check if user data includes `fullName` field
2. Fallback to `username` if fullName is empty
3. Verify registration includes fullName (if API supports it)

## Future Enhancements

- [ ] Token refresh when access token expires
- [ ] Biometric authentication (fingerprint/face)
- [ ] Profile picture upload
- [ ] Change password functionality
- [ ] Account deletion
- [ ] Session timeout after inactivity
- [ ] Multiple device sessions management

## Files Overview

| File                            | Purpose                       |
| ------------------------------- | ----------------------------- |
| `src/context/AuthContext.tsx`   | Auth state management & hooks |
| `screens/LoginPage.tsx`         | Login screen with form        |
| `screens/RegisterPage.tsx`      | Registration screen           |
| `screens/ProfileScreen.tsx`     | User profile & logout         |
| `src/api/Auth.ts`               | API endpoints for auth        |
| `app/_layout.tsx`               | Root layout with AuthProvider |
| `app/(auth)/_layout.tsx`        | Authenticated routes group    |
| `app/(auth)/(tabs)/_layout.tsx` | Bottom tab navigation         |

## Support

For issues or questions, refer to `IMPLEMENTATION_SUMMARY.md` for detailed documentation.
