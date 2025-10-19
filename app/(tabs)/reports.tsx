import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { MockReportsService } from "../../services/mockApi";
import { MockAuth } from "../../services/mockAuth";
import type { Report } from "../../types";

const { width } = Dimensions.get("window");
const ITEM_SIZE = (width - 48) / 3; // 3 columns

const STATUS_COLORS = {
  pending: COLORS.status.pending,
  in_review: COLORS.status.pending,
  approved: COLORS.primary,
  in_progress: COLORS.status.inProgress,
  resolved: COLORS.status.resolved,
  rejected: COLORS.status.rejected,
};

export default function MyReportsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadMyReports();
  }, []);

  const loadMyReports = async () => {
    const user = MockAuth.getCurrentUser();
    if (!user) return;

    const data = await MockReportsService.getUserReports(user.id);
    setReports(data);
    setLoading(false);
  };

  const renderReport = ({ item }: { item: Report }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => router.push(`/report/${item.id}`)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: STATUS_COLORS[item.status] },
        ]}
      >
        <Text style={styles.statusText}>{item.status.replace("_", " ")}</Text>
      </View>
    </TouchableOpacity>
  );

  if (!loading && reports.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>📋</Text>
        <Text style={styles.emptyText}>
          You haven't submitted any reports yet.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/report/create")}
        >
          <Text style={styles.buttonText}>Report an Issue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Reports</Text>
        <Text style={styles.subtitle}>{reports.length} submissions</Text>
      </View>

      <FlatList
        data={reports}
        renderItem={renderReport}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        refreshing={loading}
        onRefresh={loadMyReports}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  grid: {
    padding: 12,
  },
  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 4,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  statusBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: COLORS.white,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray.dark,
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 32,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
