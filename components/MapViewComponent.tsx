import { Ionicons } from "@expo/vector-icons";
import React, { RefObject } from "react";
import { Alert, Dimensions, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { useAuth } from "../contexts/AuthContext";
import CustomMarker from "./CustomMarker"; // Ensure this import is correct

const { width, height } = Dimensions.get("window");

interface Note {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  date?: string;
}

interface MapViewComponentProps {
  mapRef: RefObject<MapView | null>;
  region: Region;
  setRegion: (region: Region) => void;
  notes: Note[];
  onMarkerPress: (note: Note) => void;
  onAddNoteAtCurrentLocation: () => void;
  onCenterOnUser: () => void;
  generateTestNotes: () => void; // Function to generate test notes
}

export default function MapViewComponent({
  mapRef,
  region,
  setRegion,
  notes,
  onMarkerPress,
  onAddNoteAtCurrentLocation,
  onCenterOnUser,
  generateTestNotes,
}: MapViewComponentProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error("Logout error:", error);
          }
        },
      },
    ]);
  };

  return (
    <>
      <MapView
        ref={mapRef}
        className="flex-1"
        initialRegion={region}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton={false}
        followsUserLocation={false}
        style={{ width, height }}
      >
        {notes.map((note) => (
          <Marker
            key={note.id}
            coordinate={{
              latitude: note.latitude,
              longitude: note.longitude,
            }}
            onPress={() => onMarkerPress(note)}
          >
            <CustomMarker noteId={note.id} />
          </Marker>
        ))}
      </MapView>

      {/* Top Right Buttons */}
      <View className="absolute top-16 right-4 z-20 flex-col space-y-2">
        {/* Logout Button */}
        <TouchableOpacity
          className="bg-red-600/90 rounded-full p-3 shadow-lg border border-white/50"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="white" />
        </TouchableOpacity>

        {/* Test Notes Button :: DEV-MODE ONLY! */}
        {/* <TouchableOpacity
          className="bg-yellow-600/90 rounded-full p-3 shadow-lg border border-white/50 mt-5"
          onPress={generateTestNotes}
        >
          <Text className="text-red-600 text-xs">DEV</Text>
        </TouchableOpacity> */}
      </View>

      {/* Floating Action Buttons */}
      <View className="absolute bottom-28 left-4 right-4">
        <View className="flex-row gap-4 justify-center items-center">
          <TouchableOpacity
            className="bg-black/80 rounded-full px-5 py-4 shadow-lg border border-white/50 flex-row items-center"
            onPress={onAddNoteAtCurrentLocation}
          >
            <Ionicons name="location" size={20} color="white" />
            <Text className="text-white font-medium ml-2">Place Note</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-600/80 rounded-full p-4 shadow-lg border border-white/50"
            onPress={onCenterOnUser}
          >
            <Ionicons name="locate-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
