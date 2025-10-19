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
const GAP = 2;
const ITEM_WIDTH = (width - GAP * 2) / 3;
const ITEM_HEIGHT = ITEM_WIDTH * 1.25; // 4:5 aspect ratio like Instagram

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
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
      <View style={styles.overlay}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: STATUS_COLORS[item.status] },
          ]}
        >
          <Text style={styles.statusText}>{item.status.replace("_", " ")}</Text>
        </View>
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
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
        ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
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
    padding: 0,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: GAP,
  },
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    position: "relative",
    backgroundColor: COLORS.gray.light,
    overflow: "hidden",
  },
  gridImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  statusText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
