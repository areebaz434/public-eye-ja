import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { IMAGES } from "../../constants/images";
import { MockAuth } from "../../services/mockAuth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      await MockAuth.login(email, password);
      router.replace("/(auth)/onboarding");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={IMAGES.logo} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Log In</Text>
        <Text style={styles.subtitle}>
          Let's <Text style={styles.bold}>Build</Text> the{" "}
          <Text style={styles.highlight}>Future</Text> Together
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Please enter your email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Please enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity>
            <Text style={styles.forgot}>Forgot Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Logging in..." : "Log In"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => router.push("/(auth)/signup")}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 32,
  },
  bold: {
    fontWeight: "bold",
  },
  highlight: {
    color: COLORS.secondary,
    fontWeight: "bold",
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.black,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.gray.light,
  },
  forgot: {
    color: COLORS.secondary,
    fontWeight: "600",
    textAlign: "right",
  },
  button: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: "600",
  },
  signupText: {
    textAlign: "center",
    color: COLORS.black,
    marginTop: 16,
  },
  signupLink: {
    color: COLORS.secondary,
    fontWeight: "600",
  },
});
