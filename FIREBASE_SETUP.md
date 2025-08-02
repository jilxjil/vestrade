# Firebase Setup Guide for Vestrade

This guide will help you set up Firebase for your Vestrade investment journaling app. We'll configure Authentication and Firestore for user management and trade data storage.

## Prerequisites
- A Google account
- Node.js and npm installed
- Your React Native/Expo project ready

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "vestrade")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"

## Step 3: Set Up Firestore Database

1. In your Firebase project console, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location for your database (choose the closest to your users)
5. Click "Done"

## Step 4: Configure Firestore Security Rules

1. In Firestore Database, go to the "Rules" tab
2. Replace the default rules with these secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own trades
    match /trades/{tradeId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Users can only access their own tags
    match /tags/{tagId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

3. Click "Publish"

## Step 5: Get Firebase Configuration

1. In your Firebase project console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "vestrade-web")
6. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 6: Update Your App Configuration

1. Open `config/firebase.ts` in your project
2. Replace the placeholder configuration with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-actual-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-actual-project.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## Step 7: Install Required Dependencies

Make sure you have these packages installed:

```bash
npm install firebase @react-native-async-storage/async-storage
```

## Step 8: Test Your Setup

1. Run your app
2. Try to create a new account
3. Try to log in with the created account
4. Check the Firebase console to see if users are being created

## File Management (Local Storage)

Since Firebase Storage requires a billing plan, this app uses local file storage for screenshots and voice notes:

- **Screenshots**: Stored locally using Expo FileSystem
- **Voice Notes**: Stored locally using Expo FileSystem
- **File Metadata**: Stored in AsyncStorage for persistence

The `utils/fileManager.ts` handles all file operations locally, providing the same functionality without cloud storage costs.

## Security Considerations

1. **Authentication**: Users can only access their own data
2. **Data Validation**: Implement client-side validation for all inputs
3. **Rate Limiting**: Consider implementing rate limiting for production
4. **Backup**: Implement regular data backup strategies

## Production Deployment

Before deploying to production:

1. **Update Security Rules**: Review and tighten Firestore security rules
2. **Enable Authentication Methods**: Add additional sign-in methods if needed
3. **Set Up Monitoring**: Enable Firebase Analytics and Crashlytics
4. **Backup Strategy**: Implement automated backup solutions
5. **Error Handling**: Add comprehensive error handling and logging

## Troubleshooting

### Common Issues:

1. **Authentication Errors**: Ensure your Firebase config is correct
2. **Permission Denied**: Check Firestore security rules
3. **Network Errors**: Verify your internet connection and Firebase project status

### Getting Help:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [React Native Firebase](https://rnfirebase.io/)

## Next Steps

Once Firebase is set up:

1. Test user registration and login
2. Verify trade data is being saved to Firestore
3. Test file uploads (local storage)
4. Implement data synchronization between local and cloud storage
5. Add offline support and conflict resolution 