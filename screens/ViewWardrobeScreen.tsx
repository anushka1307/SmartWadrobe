import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { useClothing } from "@/context/ClothingContext";
import { Picker } from "@react-native-picker/picker";

export default function ViewWardrobeScreen() {
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
    return b.id.localeCompare(a.id); // newest first based on id
  });

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
          <View style={styles.card}>
            <Image source={{ uri: item.imageUri }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fafafa",
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
