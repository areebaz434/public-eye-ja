import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { MockReportsService } from "@/data/mockData";

const CATEGORIES = [
  { id: "pothole", label: "Pothole" },
  { id: "street_light", label: "Street Light" },
  { id: "drainage", label: "Drainage" },
  { id: "road_damage", label: "Road Damage" },
  { id: "traffic_signal", label: "Traffic Signal" },
  { id: "other", label: "Other" },
];

export default function CreateReportScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"capture" | "categorize" | "submit">(
    "capture"
  );
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setHasPermission(
        cameraStatus.status === "granted" && locationStatus.status === "granted"
      );

      if (locationStatus.status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
    })();
  }, []);

  const takePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setStep("categorize");

      // Simulate AI categorization (replace with actual Cloud Vision API call)
      setTimeout(() => {
        setSelectedCategory("pothole");
      }, 1500);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setStep("categorize");

      setTimeout(() => {
        setSelectedCategory("pothole");
      }, 1500);
    }
  };

  const handleSubmit = async () => {
    if (!imageUri || !location || !selectedCategory) return;

    setLoading(true);
    try {
      const reportId = await MockReportsService.createReport({
        imageUri,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        category: selectedCategory as any,
        description,
      });

      // Navigate to success screen
      router.replace({
        pathname: "/report/success",
        params: { reportId },
      });
    } catch (error: any) {
      // Navigate to failure screen
      router.replace({
        pathname: "/report/failure",
        params: { error: error.message || "Unknown error occurred" },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>No access to camera or location</Text>
      </View>
    );
  }

  if (step === "capture") {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report an Issue</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.captureContainer}>
          <Text style={styles.instruction}>Take a photo of the issue</Text>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.captureButtonText}>Open Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
            <Text style={styles.galleryButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (step === "categorize") {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep("capture")}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Categorize</Text>
          <View style={{ width: 40 }} />
        </View>

        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        )}

        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Select Category</Text>
          {selectedCategory ? (
            <Text style={styles.aiSuggestion}>
              AI Suggestion:{" "}
              {CATEGORIES.find((c) => c.id === selectedCategory)?.label}
            </Text>
          ) : (
            <ActivityIndicator color={COLORS.primary} />
          )}

          <View style={styles.categories}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === cat.id && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === cat.id && styles.categoryTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="Add description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              !selectedCategory && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!selectedCategory || loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>Submit Report</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: COLORS.primary,
  },
  backButton: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
  },
  captureContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  instruction: {
    fontSize: 18,
    color: COLORS.black,
    marginBottom: 40,
    textAlign: "center",
  },
  captureButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 32,
    marginBottom: 16,
    width: "80%",
    alignItems: "center",
  },
  captureButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
  galleryButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.primary,
    width: "80%",
    alignItems: "center",
  },
  galleryButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "600",
  },
  preview: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  categoriesContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 12,
  },
  aiSuggestion: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 20,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.gray.light,
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.gray.dark,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: COLORS.white,
    fontWeight: "600",
  },
  textInput: {
    backgroundColor: COLORS.gray.light,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    marginBottom: 24,
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
});
