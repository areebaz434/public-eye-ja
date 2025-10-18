// ============================================
// app/index.tsx - Splash Screen (Entry Point)
// ============================================
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Image, StyleSheet, View } from "react-native";
import { COLORS } from "./../constants/colors";
import { IMAGES } from "./../constants/images";

const { height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    // Logo animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after 2.5 seconds with slide animation
    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        router.replace("/(auth)/login");
      });
    }, 2500);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#E8F5E9", "#FFFDE7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={IMAGES.logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Slide-up overlay for transition */}
        <Animated.View
          style={[
            styles.slideOverlay,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  slideOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
  },
});

// ============================================
// Update app/(auth)/login.tsx and signup.tsx
// After successful login/signup, navigate to onboarding:
// router.replace('/(auth)/onboarding');
//
// Then from onboarding, navigate to home:
// router.replace('/(tabs)/home');
// ============================================
