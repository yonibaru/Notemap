# Notemap 📍

A location-based note-taking app built with React Native and Expo. Create, view, and manage notes anchored to specific geographic locations with image attachments.

## Features

- **Location-based Notes**: Create and view notes tied to geographic coordinates
- **Interactive Map**: Navigate notes using an integrated map interface
- **Image Attachments**: Attach photos from device gallery to notes
- **Dual View Modes**: Switch between map view and list view
- **User Authentication**: Secure login/signup with Firebase Auth
- **Auto-generated Test Data**: Sample notes created on first launch
- **Persistent Storage**: Local data persistence with AsyncStorage
- **Responsive UI**: Modern interface with animations and toast notifications

## Tech Stack

- **Framework**: React Native with Expo SDK 53
- **Navigation**: Expo Router with file-based routing
- **Styling**: NativeWind (TailwindCSS for React Native)
- **Maps**: React Native Maps
- **Authentication**: Firebase Auth with AsyncStorage persistence
- **Storage**: AsyncStorage for local data persistence
- **Images**: Expo Image Picker for photo selection
- **Location**: Expo Location for GPS functionality
- **UI Components**: Custom components with Expo Vector Icons
- **Animations**: React Native Animated API
- **Toast Notifications**: React Native Toast Message

## Setup & Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase**
   - Update `config/firebase.ts` with your Firebase project credentials
   - Enable Authentication in Firebase Console

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - iOS: `npx expo start --ios`
   - Android: `npx expo start --android`
   - Web: `npx expo start --web`

## Development Practices

- **TypeScript**: Fully typed codebase with strict type checking
- **Component Architecture**: Modular, reusable components with clear interfaces
- **Context Pattern**: Centralized authentication state management
- **Error Handling**: Comprehensive error handling with user feedback
- **Performance**: Optimized with React.memo and efficient state management
- **Code Quality**: ESLint configuration with Expo standards
- **File Organization**: Feature-based folder structure with clear separation of concerns

## Project Structure

```
app/                 # Main application screens (file-based routing)
  (auth)/           # Authentication screens
  _layout.tsx       # Root layout with auth protection
  index.tsx         # Entry point
  main.tsx          # Main app screen
components/         # Reusable UI components
  MapViewComponent.tsx
  NoteEditor.tsx
  NoteViewComponent.tsx
  CustomMarker.tsx
config/             # Configuration files
  firebase.ts       # Firebase setup
  toastConfig.tsx   # Toast notification config
contexts/           # React Context providers
  AuthContext.tsx   # Authentication state management
types/              # TypeScript type definitions
```

## Key Features Implementation

- **Authentication Flow**: Protected routes with automatic redirect
- **Real-time Location**: GPS tracking with permission handling
- **Image Management**: Photo selection, display, and deletion
- **Data Persistence**: Automatic save/load with AsyncStorage
- **Toast Feedback**: User-friendly notifications for all actions
- **Responsive Design**: Adaptive layouts for different screen sizes

## Current Status & Known Issues

### Testing Coverage
- ✅ Tested on iPhone 16 for responsiveness
- ❌ Not tested on Android emulator
- ❌ Not tested on real devices (other than development)
- ❌ Non-responsive design for all device sizes

### Known Bugs
- **Overlapping Notes**: Notes placed at similar locations hide each other on the map
- **Map Animation Issues**: Continuous animation over edited markers causes flickering bugs with react-native-maps

### Planned Features
- **Backend Integration**: Store notes on database (backend on AWS)
- **Note Clustering**: Show stack of notes when multiple notes are placed at same location
- **Social Authentication**: Login via Google/Facebook/Apple
- **Camera Integration**: Add ability to attach images directly from camera (currently gallery only)

### Performance Considerations
- **Map Optimization**: Potential performance issues with too many notes on screen - optimization probably required
- **Device Testing**: Need comprehensive testing across Android devices and various screen sizes
