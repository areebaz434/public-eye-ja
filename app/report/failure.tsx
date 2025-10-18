import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";
import { COLORS } from "../../constants/colors";

export default function ReportFailureScreen() {
  const router = useRouter();
  const { error } = useLocalSearchParams();

  const handleRetry = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Jamaican Map with X */}
      <View style={styles.mapContainer}>
        <Svg width="200" height="200" viewBox="0 0 200 200">
          {/* Jamaica outline (simplified) */}
          <Path
            d="M 40 100 Q 60 80, 80 85 Q 100 90, 120 85 Q 140 80, 160 90 Q 165 95, 163 105 Q 160 115, 150 118 Q 130 120, 110 115 Q 90 110, 70 112 Q 50 115, 45 108 Q 38 102, 40 100 Z"
            fill={COLORS.status.rejected}
            opacity={0.3}
          />

          {/* X circle */}
          <Circle cx="100" cy="100" r="40" fill={COLORS.status.rejected} />

          {/* X mark */}
          <Line
            x1="85"
            y1="85"
            x2="115"
            y2="115"
            stroke={COLORS.white}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <Line
            x1="115"
            y1="85"
            x2="85"
            y2="115"
            stroke={COLORS.white}
            strokeWidth="6"
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <Text style={styles.title}>Submission Failed</Text>
      <Text style={styles.message}>
        We couldn't submit your report. Please check your connection and try
        again.
      </Text>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{String(error)}</Text>
        </View>
      )}

      <View style={styles.tipsBox}>
        <Text style={styles.tipsTitle}>Tips:</Text>
        <Text style={styles.tipsText}>
          • Check your internet connection{"\n"}• Make sure GPS is enabled{"\n"}
          • Try taking a clearer photo{"\n"}• Contact support if problem
          persists
        </Text>
      </View>

      <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.push("/(tabs)")}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
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
    color: COLORS.status.rejected,
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
  errorBox: {
    backgroundColor: "#FFEBEE",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    width: "100%",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.status.rejected,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.status.rejected,
    fontWeight: "500",
  },
  tipsBox: {
    backgroundColor: COLORS.gray.light,
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    width: "100%",
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    color: COLORS.gray.dark,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 32,
    marginBottom: 12,
    width: "100%",
    alignItems: "center",
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.gray.medium,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: COLORS.gray.dark,
    fontSize: 18,
    fontWeight: "600",
  },
});
