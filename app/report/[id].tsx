import { MockReportsService } from "@/services/mockApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { COLORS } from "../../constants/colors";
import type { Report } from "../../types";

const STATUS_INFO = {
  pending: { color: COLORS.status.pending, label: "Pending Review" },
  in_review: { color: COLORS.status.pending, label: "In Review" },
  approved: { color: COLORS.primary, label: "Approved" },
  in_progress: { color: COLORS.status.inProgress, label: "In Progress" },
  resolved: { color: COLORS.status.resolved, label: "Resolved" },
  rejected: { color: COLORS.status.rejected, label: "Rejected" },
};

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    if (typeof id === "string") {
      const data = await MockReportsService.getReport(id);
      setReport(data);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.container}>
        <Text>Report not found</Text>
      </View>
    );
  }

  const statusInfo = STATUS_INFO[report.status];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <Image source={{ uri: report.imageUrl }} style={styles.image} />

        <View style={styles.details}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusInfo.color },
              ]}
            >
              <Text style={styles.statusText}>{statusInfo.label}</Text>
            </View>
            <Text style={styles.reportId}>Report #{report.id.slice(0, 8)}</Text>
          </View>

          <Text style={styles.category}>
            {report.category.replace("_", " ").toUpperCase()}
          </Text>

          {report.description && (
            <Text style={styles.description}>{report.description}</Text>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Submitted:</Text>
            <Text style={styles.value}>
              {new Date(report.createdAt).toLocaleDateString()}
            </Text>
          </View>

          {report.confidence && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>AI Confidence:</Text>
              <Text style={styles.value}>
                {(report.confidence * 100).toFixed(0)}%
              </Text>
            </View>
          )}

          {report.adminNotes && (
            <View style={styles.adminNotes}>
              <Text style={styles.adminNotesTitle}>Admin Notes:</Text>
              <Text style={styles.adminNotesText}>{report.adminNotes}</Text>
            </View>
          )}

          <View style={styles.mapContainer}>
            <Text style={styles.sectionTitle}>Location</Text>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude: report.location.latitude,
                longitude: report.location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: report.location.latitude,
                  longitude: report.location.longitude,
                }}
              />
            </MapView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  content: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 300,
  },
  details: {
    padding: 20,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  reportId: {
    fontSize: 12,
    color: COLORS.gray.medium,
  },
  category: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: COLORS.gray.dark,
    lineHeight: 24,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray.light,
  },
  label: {
    fontSize: 14,
    color: COLORS.gray.medium,
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.black,
  },
  adminNotes: {
    marginTop: 20,
    padding: 16,
    backgroundColor: COLORS.gray.light,
    borderRadius: 12,
  },
  adminNotesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 8,
  },
  adminNotesText: {
    fontSize: 14,
    color: COLORS.gray.dark,
    lineHeight: 20,
  },
  mapContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 12,
  },
  map: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
});
