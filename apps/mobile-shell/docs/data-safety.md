# Google Play Data Safety

Last reviewed: 2026-08-17

Use these answers for Google Play Console > Policy and programs > App content > Data safety.

## Data collection

- Does the app collect or share user data? Yes
- Is all user data encrypted in transit? Yes
- Can users request that data be deleted? Yes
- Deletion path: Settings > 회원 탈퇴
- Data shared with third parties: No
- Ads or advertising ID: No

## Data types

### Personal info

- Email address
- Collected: Yes
- Shared: No
- Required: Required for account/login functionality; optional when used for premium launch notification requests
- Purpose: App functionality, developer communications/marketing

- Phone number
- Collected: Yes
- Shared: No
- Required: Optional; only when the user requests premium launch notifications by phone/contact number
- Purpose: Developer communications/marketing

- User IDs
- Collected: Yes
- Shared: No
- Required: Required for account/session functionality
- Purpose: App functionality

### Photos and videos

- Photos
- Collected: Yes
- Shared: No
- Required: Optional; only when the user uploads a feed/rest activity photo
- Purpose: App functionality

### App activity

- Other user-generated content
- Collected: Yes
- Shared: No
- Required: Optional; only when the user creates feed/review content
- Purpose: App functionality

- App interactions
- Collected: Yes
- Shared: No
- Required: Required for core rest recommendation/feed functionality
- Purpose: App functionality, personalization

## Not declared

Do not declare these unless the app changes:

- Location
- Contacts
- Calendar
- Audio files or voice recordings
- Health and fitness
- Financial info
- Advertising ID
- Device or other IDs
- Crash logs or diagnostics SDK data

## Permission notes

- `android.permission.RECORD_AUDIO` is blocked because the app does not record audio.
- `android.permission.SYSTEM_ALERT_WINDOW` is blocked because release builds do not need overlay access.
- Photo permissions are used only for user-initiated camera/gallery upload flows.
