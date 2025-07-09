import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

type ClothingItem = {
  _id: string;
  clothing_name: string;
  category: string;
  image?: string;
};

type Collection = {
  _id: string;
  collection_name: string;
  clothing_id: ClothingItem | null;
};

export default function ViewCollection() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [newName, setNewName] = useState("");

  async function fetchCollections() {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const res = await axios.get(
        "http://192.168.1.180:3000/api/users/getCollections",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCollections(res.data);
    } catch (err) {
      console.error("Error fetching collections", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCollections();
  }, []);

  async function deleteCollection(id: string) {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      await axios.delete(
        `http://192.168.1.180:3000/api/users/deleteCollection/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("Deleted", "Collection deleted successfully");
      setSelectedCollection(null);
      fetchCollections();
    } catch (err) {
      Alert.alert("Error", "Failed to delete collection");
    }
  }

  async function renameCollection() {
    Alert.alert("Rename", "Rename function not implemented yet.");
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0A84FF" />
      </View>
    );
  }

  if (selectedCollection) {
    const clothing = selectedCollection.clothing_id;
    return (
      <View style={styles.detailContainer}>
        <Text style={styles.collectionTitle}>
          {selectedCollection.collection_name}
        </Text>

        {/* Rename and Delete buttons */}
        <TextInput
          placeholder="New Collection Name"
          value={newName}
          onChangeText={setNewName}
          style={styles.textInput}
        />

        <View style={styles.buttonRow}>
          <Pressable
            onPress={renameCollection}
            style={[styles.button, styles.renameButton]}
          >
            <Text style={[styles.buttonText, styles.renameButtonText]}>
              Rename
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              Alert.alert(
                "Delete Collection",
                "Are you sure?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteCollection(selectedCollection._id),
                  },
                ],
                { cancelable: true }
              )
            }
            style={[styles.button, styles.deleteButton]}
          >
            <Text style={[styles.buttonText, styles.deleteButtonText]}>
              Delete
            </Text>
          </Pressable>
        </View>

        {/* Clothing item detail or message */}
        {clothing ? (
          <View style={styles.clothingCard}>
            {clothing.image ? (
              <Image
                source={{ uri: clothing.image }}
                style={styles.clothingImage}
              />
            ) : null}
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.clothingName}>{clothing.clothing_name}</Text>
              <Text style={styles.clothingCategory}>{clothing.category}</Text>
            </View>
          </View>
        ) : (
          <Text style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
            No clothing item in this collection.
          </Text>
        )}
        <Pressable
          onPress={() => setSelectedCollection(null)}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back to collections</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        key={"numColumns-2"}
        data={collections}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => setSelectedCollection(item)}
          >
            <Text style={styles.collectionName}>{item.collection_name}</Text>
            <Text style={styles.collectionSubtitle}>
              {item.clothing_id
                ? item.clothing_id.clothing_name
                : "No items yet"}
            </Text>
          </Pressable>
        )}
      />
      <Pressable
        style={styles.backToHomeButton}
        onPress={() => router.push("/")}
      >
        <Text style={styles.backToHomeText}>← Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
    minWidth: 150,
    maxWidth: "48%",
    alignItems: "center",
  },
  collectionName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#222",
    textAlign: "center",
  },
  collectionSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  detailContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  backButton: {
    marginBottom: 32,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 18,
    fontWeight: "600",
  },
  collectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 20,
    textAlign: "center",
  },
  clothingName: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  clothingCategory: {
    fontSize: 14,
    color: "#888",
  },
  clothingCard: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  clothingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#fafafa",
    color: "#222",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  renameButton: {
    backgroundColor: "#FF9500",
    shadowColor: "#C67C00",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    shadowColor: "#C12B1E",
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 18,
    color: "#fff",
  },
  renameButtonText: {
    color: "#fff",
  },
  deleteButtonText: {
    color: "#fff",
  },
  backToHomeButton: {
    padding: 12,
    margin: 16,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  backToHomeText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
