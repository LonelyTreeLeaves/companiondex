import { ScrollView, View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";

const THEME = {
  background: "#080101",
  card: "#260606",
  border: "#7F1D1D",
  primary: "#EF4444",
  text: "#FFF7F7",
  muted: "#FECACA",
};

export default function CompanionsHome() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>QuestBind</Text>
      <Text style={styles.title}>Meet Snee & Buss</Text>
      <Text style={styles.subtitle}>
        Your cute helpers for guides, secrets, achievements, and hidden tips.
      </Text>

      <Image
        source={require("../../assets/images/companions/snee-buss-poster.jpeg")}
        style={styles.poster}
        resizeMode="cover"
      />

      <Pressable style={styles.card} onPress={() => router.push("/companions/snee")}>
        <Text style={styles.cardTitle}>🐶 Snee</Text>
        <Text style={styles.cardText}>The Companion Keeper. Helps you learn, track progress, and discover guides.</Text>
      </Pressable>

      <Pressable style={styles.card} onPress={() => router.push("/companions/buss")}>
        <Text style={styles.cardTitle}>🐱 Buss</Text>
        <Text style={styles.cardText}>The Keeper of Secrets. Reveals hidden tips, achievements, and advanced knowledge.</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  content: { padding: 20, paddingBottom: 40 },
  eyebrow: { color: THEME.primary, fontWeight: "900", marginBottom: 8 },
  title: { color: THEME.text, fontSize: 34, fontWeight: "900", marginBottom: 8 },
  subtitle: { color: THEME.muted, fontSize: 15, lineHeight: 22, marginBottom: 18 },
  poster: {
    width: "100%",
    height: 260,
    borderRadius: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  card: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },
  cardTitle: { color: THEME.text, fontSize: 24, fontWeight: "900", marginBottom: 8 },
  cardText: { color: THEME.muted, fontSize: 15, lineHeight: 22 },
});