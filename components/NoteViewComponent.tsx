import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Note } from "../services/notesService";

interface NoteViewComponentProps {
  notes: Note[];
  onShowNoteOnMap: (note: Note) => void;
}

// Function to generate gradient colors based on note index/id
const generateGradientColors = (noteId: string): [string, string, string] => {
  // Generate a hash from the noteId
  let hash = 0;
  for (let i = 0; i < noteId.length; i++) {
    const char = noteId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Define gradient color sets
  const gradientSets = [
    ['rgba(139, 69, 19, 0.3)', 'rgba(160, 82, 45, 0.2)', 'rgba(210, 180, 140, 0.1)'], // Brown to tan
    ['rgba(25, 25, 112, 0.3)', 'rgba(65, 105, 225, 0.2)', 'rgba(173, 216, 230, 0.1)'], // Navy to light blue
    ['rgba(85, 107, 47, 0.3)', 'rgba(107, 142, 35, 0.2)', 'rgba(154, 205, 50, 0.1)'], // Dark olive to yellow green
    ['rgba(75, 0, 130, 0.3)', 'rgba(138, 43, 226, 0.2)', 'rgba(186, 85, 211, 0.1)'], // Indigo to medium orchid
    ['rgba(178, 34, 34, 0.3)', 'rgba(220, 20, 60, 0.2)', 'rgba(255, 182, 193, 0.1)'], // Fire brick to light pink
    ['rgba(0, 100, 0, 0.3)', 'rgba(34, 139, 34, 0.2)', 'rgba(144, 238, 144, 0.1)'], // Dark green to light green
    ['rgba(72, 61, 139, 0.3)', 'rgba(106, 90, 205, 0.2)', 'rgba(221, 160, 221, 0.1)'], // Dark slate blue to plum
    ['rgba(165, 42, 42, 0.3)', 'rgba(205, 92, 92, 0.2)', 'rgba(240, 128, 128, 0.1)'], // Brown to light coral
    ['rgba(0, 128, 128, 0.3)', 'rgba(32, 178, 170, 0.2)', 'rgba(175, 238, 238, 0.1)'], // Teal to pale turquoise
    ['rgba(184, 134, 11, 0.3)', 'rgba(218, 165, 32, 0.2)', 'rgba(255, 215, 0, 0.1)'], // Dark goldenrod to gold
  ];
  
  const index = Math.abs(hash) % gradientSets.length;
  return gradientSets[index] as [string, string, string];
};

export default function NoteViewComponent({
  notes,
  onShowNoteOnMap,
}: NoteViewComponentProps) {
  return (
    <View className="flex-1 bg-black">
      {/* Notes List - extends behind header */}
      <ScrollView
        contentContainerStyle={{ paddingTop: 80, padding: 16, paddingBottom: 100}}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {notes.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="map-outline" size={64} color="#6B7280" />
            <Text className="text-gray-400 text-lg font-medium mt-4">
              No notes found...
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Switch to map view and place your first note!
            </Text>
          </View>
        ) : (
          notes.map((note, index) => {
            const [startColor, middleColor, endColor] = generateGradientColors(note.id);
            
            return (
              <View
                key={note.id}
                className="rounded-xl p-1 mb-3"
              >
                <LinearGradient
                  colors={[startColor, middleColor, endColor]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-xl"
                >
                  <View className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-white/10">

                    {/* Main note content */}
                    <View className="mb-3">
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1">
                          <Text className="text-white text-lg font-semibold drop-shadow-sm">
                            {note.title}
                          </Text>
                          <Text
                            className="text-gray-300 text-sm mt-1 drop-shadow-sm"
                            numberOfLines={2}
                          >
                            {note.description}
                          </Text>
                          <View className="flex-row-reverse items-center justify-between mt-3">
                            <Text className="text-gray-400 text-xs">
                              📍 {note.latitude.toFixed(4)},{" "}
                              {note.longitude.toFixed(4)}
                            </Text>
                            {note.date && (
                              <Text className="text-gray-400 text-xs">
                                {note.date}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Show on Map button */}
                    <TouchableOpacity
                      className="bg-white/20 backdrop-blur-sm rounded-lg py-2 px-3 flex-row items-center justify-center border border-white/30"
                      onPress={() => onShowNoteOnMap(note)}
                    >
                      <Ionicons name="map-outline" size={16} color="white" />
                      <Text className="text-white font-medium ml-2 text-sm drop-shadow-sm">
                        Show on Map
                      </Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            );
          })
        )}
      </ScrollView>

    </View>
  );
}
