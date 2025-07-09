import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  Button,
} from "react-native";
import ParallaxHeaderScrollView from "@/components/ParallaxHeaderScrollView";
import { useRouter } from "expo-router";
import { useClothing } from "@/context/ClothingContext";
import { AuthContext } from "@/context/AuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const { userToken, loading, signOut } = useContext(AuthContext);
  const { clothes } = useClothing();

  useEffect(() => {
    if (!loading && !userToken) {
      router.replace("/login");
    }
  }, [loading, userToken]);

  if (loading) {
    // Render nothing or a loading spinner while loading auth state
    return null;
  }

  if (!userToken) {
    // If no token and loading done, don't render UI
    return null;
  }

  return (
    <ParallaxHeaderScrollView
      headerImage={<View style={{ flex: 1, backgroundColor: "#fafafa" }} />}
      headerBackgroundColor={{ light: "#fafafa", dark: "#121212" }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Smart Wardrobe</Text>
        <Text style={styles.subtitle}>
          Organize your clothes. Create your style.
        </Text>

        <Button title="Logout" onPress={signOut} color="#FF3B30" />

        <Text style={styles.sectionTitle}>Your Clothes</Text>
        <FlatList
          data={[...clothes].reverse()}
          extraData={clothes.length}
          horizontal
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
          )}
        />

        <View style={styles.buttonsRow}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/add-clothing")}
          >
            <Text style={styles.buttonText}>Add New Clothing</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/outfit-suggestions")}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Generate Outfit
            </Text>
          </Pressable>
        </View>
      </View>
    </ParallaxHeaderScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: "#fafafa",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginBottom: 14,
  },
  listContainer: {
    paddingLeft: 2,
    paddingRight: 4,
  },
  itemCard: {
    width: 90,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 12,
  },
  itemImage: {
    width: 72,
    height: 72,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: "#eee",
  },
  itemName: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 36,
  },
  button: {
    flex: 1,
    backgroundColor: "#0A84FF",
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: "center",
    marginHorizontal: 6,
  },
  secondaryButton: {
    backgroundColor: "#f0f0f0",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButtonText: {
    color: "#0A84FF",
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
