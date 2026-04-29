import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet } from "react-native";
import { supabase } from "../../lib/supabase";

export default function HomeScreen() {
  const [gameCount, setGameCount] = useState(0);
  const [entryCount, setEntryCount] = useState(0);
  const [trackerCount, setTrackerCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const { count: games } = await supabase
      .from("games")
      .select("*", { count: "exact", head: true });

    const { count: entries } = await supabase
      .from("game_entries")
      .select("*", { count: "exact", head: true });

    const { count: tracker } = await supabase
      .from("tracker_items")
      .select("*", { count: "exact", head: true });

    setGameCount(games || 0);
    setEntryCount(entries || 0);
    setTrackerCount(tracker || 0);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.smallTitle}>CompanionDex</Text>

      <Text style={styles.title}>Your gaming companion app</Text>

      <Text style={styles.subtitle}>
        Search game data, track collections, save notes, and keep guides in one place.
      </Text>

      <TextInput
        placeholder="Search heroes, villagers, fish, recipes..."
        placeholderTextColor="#94A3B8"
        style={styles.search}
      />

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{gameCount}</Text>
          <Text style={styles.statLabel}>Games</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{entryCount}</Text>
          <Text style={styles.statLabel}>Entries</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{trackerCount}</Text>
          <Text style={styles.statLabel}>Tracker</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Marvel Rivals Tools</Text>

        <Text style={styles.cardText}>
          Pick an enemy hero and find suggested counters.
        </Text>

        <Text
          style={styles.linkButton}
          onPress={() => router.push("/counter-picker")}
        >
          Open Counter Picker →
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Connected Features</Text>
        <Text style={styles.cardText}>✅ Supabase games</Text>
        <Text style={styles.cardText}>✅ Searchable database</Text>
        <Text style={styles.cardText}>✅ Clickable game pages</Text>
        <Text style={styles.cardText}>✅ Saved tracker items</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    backgroundColor: "#020617",
  },
  smallTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#818CF8",
    marginTop: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    marginTop: 10,
    color: "#F8FAFC",
  },
  subtitle: {
    fontSize: 16,
    color: "#CBD5E1",
    marginTop: 12,
    lineHeight: 24,
  },
  search: {
    marginTop: 24,
    backgroundColor: "#0F172A",
    color: "#F8FAFC",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#334155",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
  },
  statNumber: {
    fontSize: 30,
    fontWeight: "900",
    color: "#F8FAFC",
  },
  statLabel: {
    fontSize: 13,
    color: "#A5B4FC",
    fontWeight: "800",
    marginTop: 4,
  },
  card: {
    marginTop: 24,
    backgroundColor: "#0F172A",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 8,
  },
    linkButton: {
    color: "#A5B4FC",
    fontWeight: "900",
    marginTop: 10,
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
    color: "#F8FAFC",
  },
  cardText: {
    color: "#CBD5E1",
    fontSize: 15,
  },
});
