import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";
import { useClothing } from "@/context/ClothingContext";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const categories = ['Top', 'Bottom', 'Shoes', 'Accessory'];

export default function AddClothingScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const router = useRouter();
  const { addClothing } = useClothing();

  async function pickImage() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Please grant permission to access your photos.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!pickerResult.canceled) {
      const asset = pickerResult.assets[0];
      setImageUri(asset.uri);
      setImageMimeType(asset.type || 'image/jpeg'); // Save mime type here
    }
  }

  async function saveClothing() {
    if (!name.trim()) {
      Alert.alert("Name required", "Please enter a name for the clothing item.");
      return;
    }
    if (!imageUri) {
      Alert.alert("Image required", "Please pick an image.");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        Alert.alert("Authentication error", "User is not logged in.");
        return;
      }

      const formData = new FormData();
      formData.append("clothing_name", name);
      formData.append("category", category);

      const mimeType = imageMimeType || 'image/jpeg';

      formData.append("image", {
        uri: imageUri,
        name: imageUri.split("/").pop(),
        type: mimeType,
      } as any);

      const res = await axios.post("http://192.168.1.180:3000/api/users/addClothing", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });

      Alert.alert("Success", "Clothing item added successfully!");
      router.replace("/");

    } catch (error: any) {
      console.error("Upload error:", error?.response?.data || error.message);
      Alert.alert("Error", error?.response?.data?.error || "Upload failed");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Clothing Image</Text>
      <View style={styles.imagePicker}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ color: '#888' }}>No image selected</Text>
          </View>
        )}
        <Button title="Pick an Image" onPress={pickImage} />
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter clothing name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Category</Text>
      {Platform.OS === 'android' ? (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            {categories.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>
      ) : (
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      )}

      <Button title="Save Clothing" onPress={saveClothing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#222',
  },
  imagePicker: {
    marginBottom: 24,
    alignItems: 'center',
  },
  placeholder: {
    width: 200,
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 24,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 24,
  },
  picker: {
    marginBottom: 24,
  },
});
