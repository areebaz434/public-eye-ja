// ============================================
// app/(auth)/onboarding.tsx - Smooth Onboarding
// ============================================
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { COLORS } from "../../constants/colors";
import { IMAGES } from "../../constants/images";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    image: IMAGES.onboarding.seeIt,
    title: "SEE IT",
    description:
      "It starts with noticing a problem\nthat affects everyone in the\ncommunity.",
    gradientColors: [COLORS.primary, "#00C853"],
    buttonColor: COLORS.primary,
    dotColor: COLORS.primary,
  },
  {
    image: IMAGES.onboarding.snapIt,
    title: "SNAP IT",
    description: "Then take a simple photo and AI will\ndocument the problem.",
    gradientColors: ["#1a1a1a", "#000000"],
    buttonColor: "#000000",
    dotColor: "#000000",
  },
  {
    image: IMAGES.onboarding.fixIt,
    title: "FIX IT",
    description:
      "This creates a direct pipeline to\ngovernment, turning reports into\naction.",
    gradientColors: [COLORS.secondary, "#FFC107"],
    buttonColor: COLORS.secondary,
    dotColor: COLORS.secondary,
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleNext = () => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Change slide
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else {
        router.replace("/(tabs)/home");
      }

      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const slide = slides[currentSlide];

  return (
    <View style={styles.container}>
      {/* Top Colored Section with Image */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <LinearGradient colors={slide.gradientColors} style={styles.topSection}>
          <Image source={slide.image} style={styles.image} resizeMode="cover" />

          {/* Curved white overlay */}
          <View style={styles.curveContainer}>
            <Svg height="100" width={width} style={styles.curve}>
              <Path
                d={`M0,100 Q${width / 2},0 ${width},100 L${width},100 L0,100 Z`}
                fill="white"
              />
            </Svg>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Bottom White Section */}
      <View style={styles.bottomSection}>
        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: slide.buttonColor }]}
            onPress={handleNext}
          >
            <Text
              style={[
                styles.buttonText,
                currentSlide === 2 && { color: COLORS.black },
              ]}
            >
              {currentSlide === slides.length - 1 ? "Get Started" : "Continue"}
            </Text>
          </TouchableOpacity>

          {/* Dots Indicator */}
          <View style={styles.dots}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentSlide && [
                    styles.activeDot,
                    { backgroundColor: slide.dotColor },
                  ],
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  topSection: {
    height: height * 0.65,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  curveContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  curve: {
    position: "absolute",
    bottom: 0,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 32,
    paddingTop: 40,
    alignItems: "center",
  },
  contentContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 16,
    letterSpacing: 2,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: "#666666",
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginBottom: 24,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  dots: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D0D0D0",
  },
  activeDot: {
    width: 24,
  },
});
