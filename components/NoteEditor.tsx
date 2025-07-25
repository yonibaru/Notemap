import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

interface Note {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  date?: string;
}

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
      } else {
        // Creating new note
        setTitle("");
        setDescription("");
        setDate(new Date().toLocaleDateString());
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
        className="bg-black/80 border border-white/30 rounded-2xl p-6 mx-4 shadow-2xl"
        style={{
          width: width * 0.9,
          maxHeight: height * 0.5,
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
        <View className="flex-row justify-between">
          {/* Delete Button (only for existing notes) */}
          {note && onDelete && (
            <TouchableOpacity
              onPress={handleDelete}
              className="bg-red-600/80 rounded-xl px-6 py-3 flex-row items-center"
            >
              <Ionicons name="trash-outline" size={18} color="white" />
              <Text className="text-white font-medium ml-2">Delete</Text>
            </TouchableOpacity>
          )}

          {/* Spacer for centering when no delete button */}
          {(!note || !onDelete) && <View />}

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSavePress}
            className={`rounded-xl px-6 py-3 flex-row items-center ${
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
