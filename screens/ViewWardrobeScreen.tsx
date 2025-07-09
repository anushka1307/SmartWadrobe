import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import { useClothing } from "@/context/ClothingContext";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default function ViewWardrobeScreen() {
  const router = useRouter();
  const { clothes, fetchClothes } = useClothing();
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");

  useEffect(() => {
    fetchClothes();
  }, []);

  const filtered = clothes.filter((item) =>
    filter === "All" ? true : item.category === filter
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "Name") return a.name.localeCompare(b.name);
    return b.id.localeCompare(a.id); // newest first
  });

  const handleDelete = async (clothingId: string) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this clothing item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token =
                Platform.OS === "web"
                  ? localStorage.getItem("userToken")
                  : await SecureStore.getItemAsync("userToken");

              await axios.delete(
                `http://192.168.1.180:3000/api/users/deleteClothing/${clothingId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              await fetchClothes(); // refresh the wardrobe
            } catch (err: any) {
              console.error(
                "Delete failed:",
                err.response?.data || err.message
              );
              Alert.alert("Error", "Failed to delete clothing item.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Wardrobe</Text>

      <View style={styles.filterSortContainer}>
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>Filter:</Text>
          <Picker
            selectedValue={filter}
            onValueChange={(val: string) => setFilter(val)}
            style={styles.picker}
          >
            <Picker.Item label="All" value="All" />
            <Picker.Item label="Tops" value="Top" />
            <Picker.Item label="Bottoms" value="Bottom" />
          </Picker>
        </View>

        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>Sort:</Text>
          <Picker
            selectedValue={sort}
            onValueChange={(val: string) => setSort(val)}
            style={styles.picker}
          >
            <Picker.Item label="Newest" value="Newest" />
            <Picker.Item label="Name A-Z" value="Name" />
          </Picker>
        </View>
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleDelete(item.id)} style={styles.card}>
            <Image source={{ uri: item.imageUri }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </Pressable>
        )}
      />
      <Pressable style={styles.backButton} onPress={() => router.push("/")}>
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fafafa",
  },
  backButton: {
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#0A84FF",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 16,
    textAlign: "center",
  },
  filterSortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  pickerWrapper: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
    fontWeight: "600",
  },
  picker: {
    height: Platform.OS === "ios" ? 100 : 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  grid: {
    paddingBottom: 32,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#eaeaea",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: "#888",
  },
});
