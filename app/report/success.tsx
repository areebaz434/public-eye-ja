import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { COLORS } from "../../constants/colors";

export default function ReportSuccessScreen() {
  const router = useRouter();
  const { reportId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* Jamaican Map with Checkmark */}
      <View style={styles.mapContainer}>
        <Svg width="200" height="200" viewBox="0 0 200 200">
          {/* Jamaica outline (simplified) */}
          <Path
            d="M 40 100 Q 60 80, 80 85 Q 100 90, 120 85 Q 140 80, 160 90 Q 165 95, 163 105 Q 160 115, 150 118 Q 130 120, 110 115 Q 90 110, 70 112 Q 50 115, 45 108 Q 38 102, 40 100 Z"
            fill={COLORS.primary}
            opacity={0.3}
          />

          {/* Checkmark circle */}
          <Circle cx="100" cy="100" r="40" fill={COLORS.primary} />

          {/* Checkmark */}
          <Path
            d="M 85 100 L 95 110 L 115 85"
            stroke={COLORS.white}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </View>

      <Text style={styles.title}>Report Submitted!</Text>
      <Text style={styles.message}>
        Your report has been successfully submitted and will be reviewed by our
        team.
      </Text>

      {reportId && (
        <View style={styles.reportIdContainer}>
          <Text style={styles.reportIdLabel}>Report ID</Text>
          <Text style={styles.reportId}>#{String(reportId).slice(0, 8)}</Text>
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>What happens next?</Text>
        <Text style={styles.infoText}>
          • Your report will be reviewed within 24 hours{"\n"}• You'll be
          notified of any status updates{"\n"}• Track progress in "My Reports"
        </Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push("/(tabs)/reports")}
      >
        <Text style={styles.primaryButtonText}>View My Reports</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/(tabs)")}
      >
        <Text style={styles.secondaryButtonText}>Back to Map</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  mapContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: COLORS.gray.dark,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  reportIdContainer: {
    backgroundColor: COLORS.gray.light,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  reportIdLabel: {
    fontSize: 12,
    color: COLORS.gray.medium,
    marginBottom: 4,
  },
  reportId: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  infoBox: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    width: "100%",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 32,
    marginBottom: 12,
    width: "100%",
    alignItems: "center",
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.primary,
    width: "100%",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "600",
  },
});
