import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

interface CustomMarkerProps {
  size?: number;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  backgroundColor?: string;
  noteId?: string; // Add noteId to generate consistent colors per note
}

// Function to generate a random color based on a seed (noteId)
const generateRandomColor = (seed?: string): string => {
  if (!seed) {
    // Fallback to random if no seed provided
    const colors = ['#FF1744', '#00E5FF', '#2196F3', '#4CAF50', '#FFEB3B', '#E91E63', '#00BCD4', '#FF9800', '#9C27B0', '#03A9F4'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  // Generate a hash from the seed string
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert hash to a nice color palette
  const colors = [
    '#FF1744e5', // Bright Red
    '#00E5FFe5', // Bright Cyan
    '#2196F3e5', // Bright Blue
    '#4CAF50e5', // Bright Green
    '#FFEB3Be5', // Bright Yellow
    '#E91E63e5', // Bright Pink
    '#00BCD4e5', // Bright Teal
    '#FF9800e5', // Bright Orange
    '#9C27B0e5', // Bright Purple
    '#03A9F4e5', // Bright Light Blue
    '#FF5722e5', // Bright Deep Orange
    '#8BC34Ae5', // Bright Light Green
    '#F44336e5', // Bright Red-Orange
    '#3F51B5e5', // Bright Indigo
    '#CDDC39e5'  // Bright Lime
  ];
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export default function CustomMarker({
  size = 40,
  iconName = "location-sharp",
  iconColor = "#ffffff",
  backgroundColor,
  noteId,
}: CustomMarkerProps) {
  // Use provided backgroundColor or generate a random one based on noteId
  const markerColor = backgroundColor || generateRandomColor(noteId);
  
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: markerColor,
        borderRadius: size / 2,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ffffff7d",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Ionicons name={iconName} size={size * 0.5} color={iconColor} />
    </View>
  );
}
