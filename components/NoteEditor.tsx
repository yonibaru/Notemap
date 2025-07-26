import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { Note } from "../services/notesService";

const { width, height } = Dimensions.get("window");

interface NoteEditorProps {
  visible: boolean;
  note?: Note | null;
  onSave: (note: Note) => void;
  onDelete?: (noteId: string) => void;
  onClose: () => void;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

export default function NoteEditor({
  visible,
  note,
  onSave,
  onDelete,
  onClose,
  currentLocation,
}: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (visible) {
      // Reset form when opening
      if (note) {
        // Editing existing note
        setTitle(note.title);
        setDescription(note.description);
        setDate(note.date || new Date().toLocaleDateString());
        setSelectedImageUri(note.imageUri || null);
        setShowImagePreview(true); // Always show image when it exists
      } else {
        // Creating new note
        setTitle("");
        setDescription("");
        setDate(new Date().toLocaleDateString());
        setSelectedImageUri(null);
        setShowImagePreview(true);
      }

      // Animate in
      Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 0.3,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, note]);

  // Pick an image from the library
  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: "error",
          text2: "Photo library permission is required to attach images",
        });
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImageUri(result.assets[0].uri);
        setShowImagePreview(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Toast.show({
        type: "error",
        text2: "Failed to pick image",
      });
    }
  };

  const handleSave = () => {
    // Validate required fields
    if (!title.trim() || !date.trim()) {
      return;
    }

    const noteData: Note = {
      id: note?.id || Date.now().toString(),
      latitude: note?.latitude || currentLocation?.latitude || 0,
      longitude: note?.longitude || currentLocation?.longitude || 0,
      title: title.trim(),
      description: description.trim() || "No description",
      date: date.trim(),
      imageUri: selectedImageUri || undefined, // Use undefined to clear image when null
    };

    onSave(noteData);
    onClose();
  };

  const handleSavePress = () => {
    const isFormValid = title.trim() && date.trim();
    
    if (!isFormValid) {
      // Show toast for incomplete form

      Toast.show({
        type: "error",
        text2: `Please fill all the required fields.`,
      });
      return;
    }

    handleSave();
  };

  const isFormValid = title.trim() && date.trim();

  const handleDelete = () => {
    if (note && onDelete) {
      onDelete(note.id);
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      className="absolute inset-0 z-40 justify-start mt-32 items-center"
      style={{
        opacity: animatedValue,
      }}
      pointerEvents="box-none"
    >
      <Animated.View
        className="bg-black/85 border border-white/30 rounded-2xl p-6 mx-4 shadow-2xl"
        style={{
          width: width * 0.9,
          maxHeight: height * 0.8, // Increased from 0.5 to 0.8 to accommodate image
          transform: [{ scale: scaleValue }],
        }}
        pointerEvents="auto"
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white text-xl font-bold">
            {note ? "Edit Note" : "Drop a Note at Location"}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="bg-gray-600/50 rounded-full p-2"
          >
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Date Field */}
        <View className="mb-4">
          <Text className="text-gray-300 text-sm mb-2">Date</Text>
          <TextInput
            className="bg-gray-800/50 border border-white/20 rounded-xl px-4 py-3 text-white"
            value={date}
            onChangeText={setDate}
            placeholder="Enter date"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Image Attachment Slot */}
        <View className="mb-4">
          {/* Image Attach Button (only when no image or creating new note) */}
          {!selectedImageUri && (
            <TouchableOpacity
              className="bg-white/20 rounded-xl p-3 mb-3 flex-row items-center justify-center border border-white/30"
              onPress={pickImage}
            >
              <Ionicons name="attach-outline" size={20} color="white" />
              <Text className="text-white font-medium ml-2">Attach Image</Text>
            </TouchableOpacity>
          )}

          {/* Selected Image Display */}
          {selectedImageUri && (
            <View className="bg-black/80 rounded-xl border border-white/30">
              <Image
                source={{ uri: selectedImageUri }}
                className="w-full h-40 rounded-lg"
                resizeMode="cover"
              />
              <TouchableOpacity
                className="absolute top-2 right-2 bg-red-600/90 rounded-full p-2 border border-white/30"
                onPress={() => {
                  setSelectedImageUri(null);
                  setShowImagePreview(false);
                }}
              >
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Title Field */}
        <View className="mb-4">
          <Text className="text-gray-300 text-sm mb-2">Title</Text>
          <TextInput
            className="bg-gray-800/50 border border-white/20 rounded-xl px-4 py-3 text-white"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter note title"
            placeholderTextColor="#9CA3AF"
            autoFocus={!note}
          />
        </View>

        {/* Description Field */}
        <View className="mb-6">
          <Text className="text-gray-300 text-sm mb-2">Description</Text>
          <TextInput
            className="bg-gray-800/50 border border-white/20 rounded-xl px-4 py-3 text-white"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter note description"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between items-center">
          {/* Delete Button (only for existing notes) */}
          {note && onDelete && (
            <TouchableOpacity
              onPress={handleDelete}
              className="bg-red-600/80 rounded-xl px-6 py-3 flex-row items-center border border-white/30"
            >
              <Ionicons name="trash-outline" size={18} color="white" />
              <Text className="text-white font-medium ml-2">Delete</Text>
            </TouchableOpacity>
          )}

          {/* Spacer for alignment when no delete button */}
          {(!note || !onDelete) && <View />}

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSavePress}
            className={`rounded-xl px-6 py-3 flex-row items-center border border-white/30 ${
              isFormValid ? "bg-blue-600" : "bg-gray-600/50"
            }`}
          >
            <Ionicons 
              name="save-outline" 
              size={18} 
              color={isFormValid ? "white" : "#9CA3AF"} 
            />
            <Text className={`font-medium ml-2 ${
              isFormValid ? "text-white" : "text-gray-400"
            }`}>
              {note ? "Update" : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
