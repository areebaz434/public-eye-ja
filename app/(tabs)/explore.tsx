import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { MockReportsService } from "../../services/mockApi";
import type { Report } from "../../types";

const STATUS_COLORS = {
  pending: COLORS.status.pending,
  in_review: COLORS.status.pending,
  approved: COLORS.primary,
  in_progress: COLORS.status.inProgress,
  resolved: COLORS.status.resolved,
  rejected: COLORS.status.rejected,
};

export default function ExploreScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const data = await MockReportsService.getApprovedReports();
    setReports(data);
    setLoading(false);
  };

  const renderReport = ({ item }: { item: Report }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/report/${item.id}`)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.category}>
          {item.category.replace("_", " ").toUpperCase()}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: STATUS_COLORS[item.status] },
          ]}
        >
          <Text style={styles.statusText}>{item.status.replace("_", " ")}</Text>
        </View>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Reports</Text>
        <Text style={styles.subtitle}>
          See what's happening in your community
        </Text>
      </View>

      <FlatList
        data={reports}
        renderItem={renderReport}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadReports}
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
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  category: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  date: {
    fontSize: 12,
    color: COLORS.gray.medium,
  },
});
