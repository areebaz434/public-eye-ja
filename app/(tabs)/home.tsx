import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Sidebar from "../../components/sidebar";
import { COLORS } from "../../constants/colors";
import { IMAGES } from "../../constants/images";
import { MockReportsService } from "../../services/mockApi";
import type { Report } from "../../types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

export default function HomeScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    thisWeek: 0,
  });
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const sparkle1 = useRef(new Animated.Value(0)).current;
  const sparkle2 = useRef(new Animated.Value(0)).current;
  const sparkle3 = useRef(new Animated.Value(0)).current;
  const sparkle4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadData();
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Sparkle animations - staggered
    [sparkle1, sparkle2, sparkle3, sparkle4].forEach((sparkle, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 250),
          Animated.timing(sparkle, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(sparkle, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  };

  const loadData = async () => {
    try {
      const data = await MockReportsService.getApprovedReports();
      setReports(data.slice(0, 10));

      const resolved = data.filter((r) => r.status === "resolved").length;
      const pending = data.filter((r) => r.status === "pending").length;
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const thisWeek = data.filter((r) => r.createdAt >= oneWeekAgo).length;

      setStats({
        total: data.length,
        resolved,
        pending,
        thisWeek,
      });
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
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

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Header with Gradient */}
        <LinearGradient
          colors={[COLORS.primary, "#00C853"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Image
                  source={IMAGES.logo}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setSidebarVisible(true)}
            >
              <View style={styles.menuIconContainer}>
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
              </View>
            </TouchableOpacity>
          </View>

          <Animated.View
            style={[
              styles.heroContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.heroTitle}>Building a</Text>
            <Text style={styles.heroTitleBold}>Better Jamaica</Text>
            <Text style={styles.heroSubtitle}>
              Together, one report at a time 🇯🇲
            </Text>
          </Animated.View>
        </LinearGradient>

        {/* Floating Stats Cards */}
        <View style={styles.statsFloatingContainer}>
          <View style={styles.statsRow}>
            <Animated.View
              style={[
                styles.statCardLarge,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: fadeAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={["#009444", "#00C853"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statGradient}
              >
                <Text style={styles.statNumberLarge}>{stats.total}</Text>
                <Text style={styles.statLabelLarge}>Total Reports</Text>
                <View style={styles.statIcon}></View>
              </LinearGradient>
            </Animated.View>

            <View style={styles.statsColumn}>
              <View
                style={[styles.statCardSmall, { backgroundColor: "#4CAF50" }]}
              >
                <Text style={styles.statNumberSmall}>{stats.resolved}</Text>
                <Text style={styles.statLabelSmall}>Resolved</Text>
              </View>
              <View
                style={[styles.statCardSmall, { backgroundColor: "#FFD100" }]}
              >
                <Text style={[styles.statNumberSmall, { color: COLORS.black }]}>
                  {stats.thisWeek}
                </Text>
                <Text style={[styles.statLabelSmall, { color: COLORS.black }]}>
                  This Week
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Reports Carousel */}
        <View style={styles.carouselSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <Text style={styles.sectionSubtitle}>
                Latest reports in your area
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
              <Text style={styles.seeAllText}>See All →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            snapToInterval={CARD_WIDTH + 20}
            decelerationRate="fast"
          >
            {reports.map((report, index) => (
              <Animated.View
                key={report.id}
                style={[
                  styles.carouselCard,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateX: slideAnim.interpolate({
                          inputRange: [0, 50],
                          outputRange: [0, index * 20],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => router.push(`/report/${report.id}`)}
                >
                  <Image
                    source={{ uri: report.imageUrl }}
                    style={styles.carouselImage}
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.8)"]}
                    style={styles.carouselOverlay}
                  >
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {report.category.replace("_", " ").toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.carouselTitle} numberOfLines={2}>
                      {report.description ||
                        `${report.category} issue reported`}
                    </Text>
                    <View style={styles.carouselFooter}>
                      <Text style={styles.carouselDate}>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </Text>
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: getStatusColor(report.status) },
                        ]}
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions - Clean Text Only */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/report/create")}
            >
              <LinearGradient
                colors={[COLORS.primary, "#00C853"]}
                style={styles.actionGradient}
              >
                <Text style={styles.actionTextLarge}>REPORT</Text>
                <Text style={styles.actionTextSmall}>New Issue</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/(tabs)")}
            >
              <LinearGradient
                colors={["#2196F3", "#03A9F4"]}
                style={styles.actionGradient}
              >
                <Text style={styles.actionTextLarge}>MAP</Text>
                <Text style={styles.actionTextSmall}>View All</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/(tabs)/reports")}
            >
              <LinearGradient
                colors={["#FF9800", "#FFB74D"]}
                style={styles.actionGradient}
              >
                <Text style={styles.actionTextLarge}>MINE</Text>
                <Text style={styles.actionTextSmall}>My Reports</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* GOLDEN Jamaica Impact Section */}
        <View style={styles.impactBannerContainer}>
          <View style={styles.impactBanner}>
            {/* Animated Sparkles - Green, Black, Gold */}
            <Animated.View
              style={[
                styles.sparkle,
                styles.sparkle1,
                {
                  opacity: sparkle1,
                  transform: [
                    {
                      rotate: sparkle1.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "180deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View
                style={[styles.sparkleShape, { backgroundColor: "#009444" }]}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.sparkle,
                styles.sparkle2,
                {
                  opacity: sparkle2,
                  transform: [
                    {
                      rotate: sparkle2.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "-180deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View
                style={[styles.sparkleShape, { backgroundColor: "#000000" }]}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.sparkle,
                styles.sparkle3,
                {
                  opacity: sparkle3,
                  transform: [
                    {
                      rotate: sparkle3.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "180deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View
                style={[styles.sparkleShape, { backgroundColor: "#FFD700" }]}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.sparkle,
                styles.sparkle4,
                {
                  opacity: sparkle4,
                  transform: [
                    {
                      rotate: sparkle4.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "-180deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View
                style={[styles.sparkleShape, { backgroundColor: "#009444" }]}
              />
            </Animated.View>

            {/* Additional sparkles */}
            <Animated.View
              style={[
                styles.sparkle,
                { top: 40, left: "50%", opacity: sparkle1 },
              ]}
            >
              <View
                style={[styles.sparkleShape, { backgroundColor: "#FFD700" }]}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.sparkle,
                { bottom: 100, right: "15%", opacity: sparkle3 },
              ]}
            >
              <View
                style={[styles.sparkleShape, { backgroundColor: "#000000" }]}
              />
            </Animated.View>

            {/* Jamaica Map */}
            <Image
              source={IMAGES.icons.map}
              style={styles.jamaicaMap}
              resizeMode="contain"
            />

            {/* Text */}
            <Text style={styles.impactTitle}>Your Impact Matters!</Text>
            <Text style={styles.impactText}>
              Every report helps build a safer Jamaica.{"\n"}
              You're making a real difference! 🇯🇲
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </>
  );
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "#FFD100",
    in_review: "#FF9800",
    approved: "#009444",
    in_progress: "#2196F3",
    resolved: "#4CAF50",
    rejected: "#F44336",
  };
  return colors[status] || "#607D8B";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heroSection: {
    paddingTop: 60,
    paddingBottom: 100,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logo: {
    width: 60,
    height: 60,
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  menuIconContainer: {
    gap: 4,
  },
  menuLine: {
    width: 24,
    height: 3,
    backgroundColor: COLORS.white,
    borderRadius: 2,
  },
  heroContent: {
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "300",
    color: COLORS.white,
  },
  heroTitleBold: {
    fontSize: 42,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.95,
    lineHeight: 24,
  },
  statsFloatingContainer: {
    marginTop: -60,
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCardLarge: {
    flex: 2,
    borderRadius: 24,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  statGradient: {
    padding: 24,
    borderRadius: 24,
    position: "relative",
  },
  statNumberLarge: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 8,
  },
  statLabelLarge: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    fontWeight: "600",
  },
  statIcon: {
    position: "absolute",
    top: 20,
    right: 20,
    opacity: 0.3,
  },
  statIconText: {
    fontSize: 40,
  },
  statsColumn: {
    flex: 1,
    gap: 12,
  },
  statCardSmall: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  statNumberSmall: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 4,
  },
  statLabelSmall: {
    fontSize: 11,
    color: COLORS.white,
    opacity: 0.9,
    fontWeight: "600",
  },
  carouselSection: {
    marginTop: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.gray.medium,
    marginTop: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  carousel: {
    paddingLeft: 20,
  },
  carouselCard: {
    width: CARD_WIDTH,
    height: 280,
    marginRight: 20,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  carouselOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.white,
  },
  carouselTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 12,
    lineHeight: 22,
  },
  carouselFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carouselDate: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.9,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  quickActionsSection: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  actionGradient: {
    paddingVertical: 24,
    alignItems: "center",
  },
  actionTextLarge: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: 1,
    marginBottom: 4,
  },
  actionTextSmall: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.white,
    opacity: 0.9,
  },
  impactBannerContainer: {
    marginHorizontal: 20,
    marginTop: 40,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    overflow: "hidden",
  },
  impactBanner: {
    padding: 40,
    alignItems: "center",
    position: "relative",
    backgroundColor: COLORS.white,
  },
  sparkle: {
    position: "absolute",
  },
  sparkleShape: {
    width: 8,
    height: 8,
    transform: [{ rotate: "45deg" }],
  },
  sparkle1: {
    top: 30,
    left: 40,
  },
  sparkle2: {
    top: 50,
    right: 50,
  },
  sparkle3: {
    bottom: 120,
    left: 50,
  },
  sparkle4: {
    bottom: 100,
    right: 40,
  },
  jamaicaMap: {
    width: 140,
    height: 140,
    marginBottom: 24,
  },
  impactTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 12,
  },
  impactText: {
    fontSize: 15,
    color: COLORS.gray.dark,
    textAlign: "center",
    lineHeight: 22,
  },
});
