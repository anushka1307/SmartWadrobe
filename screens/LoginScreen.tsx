import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { AuthContext } from "@/context/AuthContext";
import { useGoogleLogin } from "@/hooks/useGoogleLogin"; // ⬅️ Add this

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { signIn } = useContext(AuthContext);

  
  // Google login hook
  const { promptAsync, request } = useGoogleLogin(async (idToken) => {
    try {
      const res = await axios.post("http://192.168.1.180:3000/api/users/auth/google", {
        token: idToken,
      });

      await signIn(res.data.token);
      Alert.alert("Google Login Successful");
      router.replace("/");
    } catch (e: any) {
      Alert.alert("Google Login Failed", e?.response?.data?.error || "Unknown error");
    }
  });

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://192.168.1.180:3000/api/users/login", {
        email,
        password,
      });

      const { token } = response.data;
      await signIn(token);
      Alert.alert("Login Successful!");
      router.replace("/");
    } catch (err: any) {
      Alert.alert("Login failed", err.response?.data?.message || "Unknown error");
    }
  };

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />

      <Text onPress={() => router.push("/register")} style={styles.link}>
        Don’t have an account? Register
      </Text>

      <View style={{ marginTop: 32 }}>
        <Button
          title="Login with Google"
          onPress={() => promptAsync()}
          disabled={!request}
          color="#DB4437"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  link: {
    marginTop: 16,
    color: "#0A84FF",
    textAlign: "center",
  },
});
