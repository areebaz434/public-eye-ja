// ============================================
// app/(tabs)/snap.tsx - Dummy Screen (redirects to create)
// ============================================
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function SnapScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/report/create");
  }, []);

  return <View />;
}
