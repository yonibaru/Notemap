import { Ionicons } from "@expo/vector-icons";
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
import { Note, NotesService } from "../services/notesService";

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

  // Load notes using NotesService
  const loadNotes = async () => {
    try {
      const notes = await NotesService.loadNotes();
      setNotes(notes);
    } catch (error) {
      console.error('Error loading notes:', error);
      Toast.show({
        type: "error",
        text2: "Failed to load saved notes",
      });
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

        // Check if test notes have been generated before using NotesService
        const testNotesGenerated = await NotesService.hasGeneratedTestNotes();
        if (!testNotesGenerated) {
          // Generate test notes on first launch
          await NotesService.generateTestNotes(location.coords.latitude, location.coords.longitude);
          // Reload notes to include the new test notes
          loadNotes();
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

  const handleNoteSave = async (noteData: Note) => {
    try {
      if (editingNote) {
        // Update existing note
        await NotesService.updateNote(noteData.id, noteData);
        setNotes(prevNotes => prevNotes.map(n => n.id === noteData.id ? noteData : n));
        Toast.show({
          type: "success",
          text2: `"${noteData.title}" was updated`,
        });
      } else {
        // Create new note
        const newNote = await NotesService.createNote(noteData);
        setNotes(prevNotes => [...prevNotes, newNote]);
        Toast.show({
          type: "success",
          text2: `"${noteData.title}" was saved at your location`,
        });
      }
    } catch (error) {
      console.error('Error saving note:', error);
      Toast.show({
        type: "error",
        text2: "Failed to save note",
      });
    }
  };

  const handleNoteDelete = async (noteId: string) => {
    try {
      const deletedNote = await NotesService.deleteNote(noteId);
      if (deletedNote) {
        setNotes(prevNotes => prevNotes.filter(n => n.id !== noteId));
        Toast.show({
          type: "error",
          text2: `"${deletedNote.title}" was removed`,
        });
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      Toast.show({
        type: "error",
        text2: "Failed to delete note",
      });
    }
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
