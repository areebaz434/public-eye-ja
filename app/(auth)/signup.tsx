import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { IMAGES } from "../../constants/images";
import { MockAuth } from "../../services/mockAuth";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      await MockAuth.signup(email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={IMAGES.icon} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>
            Let's <Text style={styles.bold}>Build</Text> the{" "}
            <Text style={styles.highlight}>Future</Text> Together
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Please enter your email address"
              placeholderTextColor={COLORS.gray.medium}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Please enter your password"
              placeholderTextColor={COLORS.gray.medium}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Creating account..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text
                style={styles.loginLink}
                onPress={() => router.push("/(auth)/login")}
              >
                Log In
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Styles same as login screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
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
    color: COLORS.primary,
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
  loginText: {
    textAlign: "center",
    color: COLORS.black,
    marginTop: 16,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
