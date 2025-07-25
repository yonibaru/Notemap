import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Region } from "react-native-maps";
import Toast from "react-native-toast-message";
import MapViewComponent from "../components/MapViewComponent";
import NoteEditor from "../components/NoteEditor";
import NoteViewComponent from "../components/NoteViewComponent";
import { toastConfig } from "../config/toastConfig";
import { useAuth } from "../contexts/AuthContext";

interface Note {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  date?: string;
  imageUri?: string;
}

const NOTES_STORAGE_KEY = '@notemap_notes';
const TEST_NOTES_GENERATED_KEY = '@notemap_test_notes_generated';

export default function MainScreen() {
  const { user, logout } = useAuth();
  const mapRef = useRef<MapView>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isListView, setIsListView] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Load notes from AsyncStorage
  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        setNotes(parsedNotes);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      Toast.show({
        type: "error",
        text2: "Failed to load saved notes",
      });
    }
  };

  // Save notes to AsyncStorage
  const saveNotes = async (notesToSave: Note[]) => {
    try {
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notesToSave));
    } catch (error) {
      console.error('Error saving notes:', error);
      Toast.show({
        type: "error",
        text2: "Failed to save notes",
      });
    }
  };


  // Generate test notes on first app launch (location already obtained)
  const generateTestNotesFirstTime = async () => {
    try {
      const currentLocationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const testNotesData = [
        { title: "Coffee Shop", description: "Great coffee and wifi for working", offset: { lat: 0.001, lng: 0.001 } },
        { title: "Park Bench", description: "Nice spot for reading and relaxation", offset: { lat: -0.002, lng: 0.003 } },
        { title: "Restaurant", description: "Amazing pasta and friendly service", offset: { lat: 0.003, lng: -0.001 } },
        { title: "Grocery Store", description: "Don't forget to buy milk and bread", offset: { lat: -0.001, lng: -0.002 } },
        { title: "Gym", description: "Workout schedule: Mon, Wed, Fri", offset: { lat: 0.002, lng: 0.002 } },
        { title: "Library", description: "Quiet study area on second floor", offset: { lat: -0.003, lng: 0.001 } },
        { title: "Bus Stop", description: "Route 42 stops here every 15 minutes", offset: { lat: 0.001, lng: -0.003 } },
        { title: "Pharmacy", description: "Pick up prescription on Tuesday", offset: { lat: -0.002, lng: -0.001 } },
        { title: "ATM", description: "24/7 access, no fees for my bank", offset: { lat: 0.003, lng: 0.003 } },
        { title: "Meetup Spot", description: "Weekly book club meets here Thursday 7pm", offset: { lat: -0.001, lng: 0.002 } }
      ];

      const newTestNotes: Note[] = testNotesData.map((noteData, index) => ({
        id: `test-${Date.now()}-${index}`,
        latitude: currentLocationData.coords.latitude + noteData.offset.lat,
        longitude: currentLocationData.coords.longitude + noteData.offset.lng,
        title: noteData.title,
        description: noteData.description,
        date: new Date().toLocaleDateString('en-GB'),
      }));

      const updatedNotes = [...notes, ...newTestNotes];
      setNotes(updatedNotes);
      saveNotes(updatedNotes);

      Toast.show({
        type: "success",
        text2: `Welcome! Generated ${newTestNotes.length} sample notes around your location`,
      });

    } catch (error) {
      console.log("Error generating initial test notes:", error);
    }
  };

  // Whenever the component mounts, load notes and request location permissions
  useEffect(() => {
    const initializeApp = async () => {
      // Load saved notes
      loadNotes();
      
      // Show welcome message
      setTimeout(() => {
        Toast.show({
          text2: `Welcome, ${user?.email}`,
        });
      }, 1000);

      // Request location permissions and get current location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          text2: "Location permission is required to use this feature",
        });
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        // Update initial region to user's location
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        // Check if test notes have been generated before
        const testNotesGenerated = await AsyncStorage.getItem(TEST_NOTES_GENERATED_KEY);
        if (!testNotesGenerated) {
          // Generate test notes on first launch
          await generateTestNotesFirstTime();
          // Mark that test notes have been generated
          await AsyncStorage.setItem(TEST_NOTES_GENERATED_KEY, 'true');
        }
      } catch (error) {
        console.log("Error getting location:", error);
      }
    };

    initializeApp();
  }, []);

  const centerMapWithOffset = (latitude: number, longitude: number) => {
    const offsetLatitude = 0.0015; // Offset to show marker below the NoteEditor modal
    const newRegion = {
      latitude: latitude + offsetLatitude,
      longitude: longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    mapRef.current?.animateToRegion(newRegion, 1000);
  };

  const addNoteAtCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text2:
            "Please enable location permissions to add notes at your location",
        });
        return;
      }

      const currentLocationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCurrentLocation({
        latitude: currentLocationData.coords.latitude,
        longitude: currentLocationData.coords.longitude,
      });
      setEditingNote(null);
      setShowNoteEditor(true);

      // Center map slightly above the current location so both marker and modal are visible
      centerMapWithOffset(currentLocationData.coords.latitude, currentLocationData.coords.longitude);

    } catch (error) {
      console.log("Error getting location for note:", error);
      Toast.show({
        type: "error",
        text2: "Unable to get your location.",
      });
    }
  };

  const handleMarkerPress = (note: Note) => {
    setEditingNote(note);
    setCurrentLocation(null);
    setShowNoteEditor(true);

    // Center map slightly above the note marker so both marker and modal are visible
    centerMapWithOffset(note.latitude, note.longitude);
  };

  const centerOnUser = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text2: "Please enable location permissions in settings",
        });
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);

      const newRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      mapRef.current?.animateToRegion(newRegion, 1000);

    } catch (error) {
      console.log("Error getting location:", error);
      Toast.show({
        type: "error",
        text2: "Unable to get your current location.",
      });
    }
  };

  const showNoteOnMap = (note: Note) => {
    // Switch to map view
    setIsListView(false);
    
    // Set up the note for editing
    setEditingNote(note);
    setCurrentLocation(null);
    
    setTimeout(() => {
      centerMapWithOffset(note.latitude, note.longitude);
      // Show note editor after map animation
      setTimeout(() => {
        setShowNoteEditor(true);
      }, 500);
    }, 100);
  };

  const handleNoteSave = (noteData: Note) => {
    let updatedNotes: Note[];
    
    if (editingNote) {
      // Update existing note
      updatedNotes = notes.map(n => n.id === noteData.id ? noteData : n);
      setNotes(updatedNotes);
      Toast.show({
        type: "success",
        text2: `"${noteData.title}" was updated`,
      });
    } else {
      // Add new note
      updatedNotes = [...notes, noteData];
      setNotes(updatedNotes);
      Toast.show({
        type: "success",
        text2: `"${noteData.title}" was saved at your location`,
      });
    }
    
    // Save to AsyncStorage
    saveNotes(updatedNotes);
  };

  const handleNoteDelete = (noteId: string) => {
    const deletedNote = notes.find(n => n.id === noteId);
    const updatedNotes = notes.filter(n => n.id !== noteId);
    setNotes(updatedNotes);
    
    Toast.show({
      type: "error",
      text2: `"${deletedNote?.title}" was removed`,
    });
    
    // Save to AsyncStorage
    saveNotes(updatedNotes);
  };

  const handleNoteEditorClose = () => {
    setShowNoteEditor(false);
    setEditingNote(null);
    setCurrentLocation(null);
  };

  return (
    <View className="flex-1">

      {/* Map View */}
      {!isListView && (
        <MapViewComponent
          mapRef={mapRef}
          region={region}
          setRegion={setRegion}
          notes={notes}
          onMarkerPress={handleMarkerPress}
          onAddNoteAtCurrentLocation={addNoteAtCurrentLocation}
          onCenterOnUser={centerOnUser}
        />
      )}

      {/* Note View */}
      {isListView && (
        <NoteViewComponent
          notes={notes}
          onShowNoteOnMap={showNoteOnMap}
        />
      )}

      {/* Floating Navigation Bar */}
      <View className="absolute bottom-4 left-4 right-4">
        {/* Main Navigation Switch */}
        <View className="bg-black/80 rounded-2xl p-2 mb-4 border border-white/30 shadow-2xl">
          <View className="flex-row">
            {/* Map View Tab */}
            <TouchableOpacity
              className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-xl ${
                !isListView ? "bg-blue-600/90" : "bg-transparent"
              }`}
              onPress={() => {
                if (isListView) {
                  setIsListView(false);
                }
              }}
            >
              <Ionicons
                name="map-outline"
                size={20}
                color={!isListView ? "white" : "#9CA3AF"}
              />
              <Text
                className={`ml-2 font-medium ${!isListView ? "text-white" : "text-gray-400"}`}
              >
                Map
              </Text>
            </TouchableOpacity>

            {/* List View Tab */}
            <TouchableOpacity
              className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-xl ${
                isListView ? "bg-blue-600/90" : "bg-transparent"
              }`}
              onPress={() => {
                if (!isListView) {
                  setIsListView(true);
                  setShowNoteEditor(false);
                  setEditingNote(null);
                  setCurrentLocation(null);
                }
              }}
            >
              <Ionicons
                name="list-outline"
                size={20}
                color={isListView ? "white" : "#9CA3AF"}
              />
              <Text
                className={`ml-2 font-medium ${isListView ? "text-white" : "text-gray-400"}`}
              >
                Notes ({notes.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Toast Messages */}
      <Toast config={toastConfig as any} />

      {/* Note Editor */}
      <NoteEditor
        visible={showNoteEditor}
        note={editingNote}
        currentLocation={currentLocation || undefined}
        onSave={handleNoteSave}
        onDelete={handleNoteDelete}
        onClose={handleNoteEditorClose}
      />
    </View>
  );
}
