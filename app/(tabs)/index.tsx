import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { COLORS } from "../../constants/colors";
import { MockReportsService } from "../../services/mockApi";
import type { Report, ReportCategory } from "../../types";

const CATEGORY_COLORS: Record<ReportCategory, string> = {
  pothole: "#F44336",
  street_light: "#FFD100",
  drainage: "#2196F3",
  road_damage: "#FF9800",
  traffic_signal: "#9C27B0",
  other: "#607D8B",
};

const CATEGORIES = [
  { id: "all", label: "All", color: "#009444" },
  { id: "pothole", label: "Potholes", color: CATEGORY_COLORS.pothole },
  { id: "street_light", label: "Lights", color: CATEGORY_COLORS.street_light },
  { id: "drainage", label: "Drainage", color: CATEGORY_COLORS.drainage },
  { id: "road_damage", label: "Roads", color: CATEGORY_COLORS.road_damage },
  {
    id: "traffic_signal",
    label: "Signals",
    color: CATEGORY_COLORS.traffic_signal,
  },
];

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredReports(reports);
    } else {
      setFilteredReports(
        reports.filter((r) => r.category === selectedCategory)
      );
    }
  }, [selectedCategory, reports]);

  const loadData = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      const data = await MockReportsService.getApprovedReports();
      setReports(data);
      setFilteredReports(data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportPress = () => {
    router.push("/report/create");
  };

  if (loading || !location) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 18.0179,
          longitude: -76.8099,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
        showsUserLocation
      >
        {filteredReports.map((report) => (
          <Marker
            key={report.id}
            coordinate={{
              latitude: report.location.latitude,
              longitude: report.location.longitude,
            }}
            pinColor={CATEGORY_COLORS[report.category] || CATEGORY_COLORS.other}
          />
        ))}
      </MapView>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.filterChip,
                { backgroundColor: cat.color },
                selectedCategory === cat.id && styles.filterChipActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={styles.filterChipText}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Showing {filteredReports.length} reports
        </Text>
      </View>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={handleReportPress}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    opacity: 0.7,
  },
  filterChipActive: {
    opacity: 1,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  filterChipText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  statsContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  statsText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 90,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: "bold",
  },
});
