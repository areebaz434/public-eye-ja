// ============================================
// components/Sidebar.tsx - Sidebar Menu
// ============================================
import { useRouter } from "expo-router";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../constants/colors";
import { IMAGES } from "../constants/images";
import { MockAuth } from "../services/mockAuth";

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export default function Sidebar({ visible, onClose }: SidebarProps) {
  const router = useRouter();
  const user = MockAuth.getCurrentUser();

  const handleNavigation = (route: string) => {
    onClose();
    router.push(route as any);
  };

  const handleLogout = async () => {
    await MockAuth.logout();
    onClose();
    router.replace("/(auth)/login");
  };

  const menuItems = [
    {
      icon: "👤",
      label: "Profile",
      route: "/profile",
      color: COLORS.primary,
    },
    {
      icon: "📊",
      label: "My Stats",
      route: "/stats",
      color: COLORS.status.inProgress,
    },
    {
      icon: "🔔",
      label: "Notifications",
      route: "/notifications",
      color: COLORS.secondary,
      badge: "3",
    },
    {
      icon: "⚙️",
      label: "Settings",
      route: "/settings",
      color: COLORS.gray.dark,
    },
    {
      icon: "❓",
      label: "Help & FAQ",
      route: "/help",
      color: COLORS.status.inProgress,
    },
    {
      icon: "ℹ️",
      label: "About Public Eye JA",
      route: "/about",
      color: COLORS.primary,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sidebar}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image source={IMAGES.logo} style={styles.avatar} />
            </View>
            <Text style={styles.userName}>
              {user?.displayName || "Citizen User"}
            </Text>
            <Text style={styles.userEmail}>
              {user?.email || "user@email.com"}
            </Text>
            <View style={styles.userBadge}>
              <Text style={styles.userBadgeText}>🇯🇲 Active Citizen</Text>
            </View>
          </View>

          {/* Menu Items */}
          <ScrollView
            style={styles.menuContainer}
            showsVerticalScrollIndicator={false}
          >
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleNavigation(item.route)}
              >
                <View style={styles.menuItemLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: item.color + "20" },
                    ]}
                  >
                    <Text style={styles.menuIcon}>{item.icon}</Text>
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}

            {/* Logout */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Public Eye JA v1.0</Text>
            <Text style={styles.footerSubtext}>
              Building a Better Jamaica 🇯🇲
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sidebar: {
    width: "80%",
    backgroundColor: COLORS.white,
    elevation: 16,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  profileSection: {
    backgroundColor: COLORS.primary,
    padding: 24,
    paddingTop: 60,
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: COLORS.secondary,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 12,
  },
  userBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  userBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.black,
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray.light,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.black,
  },
  menuArrow: {
    fontSize: 24,
    color: COLORS.gray.medium,
    marginLeft: 8,
  },
  badge: {
    backgroundColor: COLORS.status.rejected,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.white,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    backgroundColor: COLORS.status.rejected + "10",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.status.rejected,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.status.rejected,
  },
  footer: {
    padding: 20,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.gray.light,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.gray.medium,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 11,
    color: COLORS.gray.medium,
  },
});
