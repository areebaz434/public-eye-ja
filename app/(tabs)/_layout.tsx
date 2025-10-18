// ============================================
// app/(tabs)/_layout.tsx - 5 Tabs with Camera SNAP Button
// ============================================
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/colors";

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray.medium,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* EXPLORE */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* SNAP (Center Camera Button) */}
      <Tabs.Screen
        name="snap"
        options={{
          title: "",
          tabBarIcon: () => (
            <View style={styles.snapButtonWrapper}>
              <TouchableOpacity
                style={styles.snapButton}
                onPress={() => router.push("/report/create")}
                activeOpacity={0.8}
              >
                <View style={styles.snapButtonInner}>
                  <Ionicons name="camera" size={32} color={COLORS.white} />
                </View>
              </TouchableOpacity>
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/report/create");
          },
        }}
      />

      {/* MAP */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Map",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "map" : "map-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* REPORTS */}
      <Tabs.Screen
        name="reports"
        options={{
          title: "My Reports",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  snapButtonWrapper: {
    position: "absolute",
    top: -35,
    alignItems: "center",
    justifyContent: "center",
  },
  snapButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderWidth: 5,
    borderColor: COLORS.white,
  },
  snapButtonInner: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
