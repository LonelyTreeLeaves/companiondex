import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>QuestBind</Text>

      <Text style={styles.subtitle}>
        Quick access to your companions, academy, tracker and app tools.
      </Text>

      <Pressable
        style={styles.card}
        onPress={() => router.push("/companions")}
      >
        <Text style={styles.cardTitle}>🐶 Companion Hub</Text>
        <Text style={styles.cardText}>
          Visit Snee and Buss and track your progress.
        </Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() => router.push("/game/marvel-rivals/academy")}
      >
        <Text style={styles.cardTitle}>🎓 Academy</Text>
        <Text style={styles.cardText}>
          Continue lessons and improve your Academy Rank.
        </Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>ℹ️ About QuestBind</Text>
        <Text style={styles.cardText}>
          QuestBind is a community gaming companion app featuring guides,
          databases, trackers, companions, and learning systems.
        </Text>
      </View>

      <Pressable
        style={styles.card}
        onPress={() => router.push("/news")}
      >
        <Text style={styles.cardTitle}>📰 News Feed</Text>
        <Text style={styles.cardText}>
          View the latest game news and updates.
        </Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() => router.push("/database")}
      >
        <Text style={styles.cardTitle}>📚 Database</Text>
        <Text style={styles.cardText}>
          Browse every guide, hero, item and game entry.
        </Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() => router.push("/tracker")}
      >
        <Text style={styles.cardTitle}>✅ Tracker</Text>
        <Text style={styles.cardText}>
          View and manage your saved tracker items.
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    backgroundColor: "#020617",
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    marginTop: 40,
    color: "#F8FAFC",
  },
  subtitle: {
    fontSize: 16,
    color: "#CBD5E1",
    marginTop: 8,
    marginBottom: 18,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#0F172A",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#F8FAFC",
    marginBottom: 8,
  },
  cardText: {
    color: "#CBD5E1",
    lineHeight: 22,
  },
});
