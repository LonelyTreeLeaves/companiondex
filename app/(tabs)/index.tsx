import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
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
      <Text style={styles.smallTitle}>
        QuestBind • Beta
      </Text>

      <Text style={styles.title}>
        Bound by Adventure.
      </Text>

      <Text style={styles.subtitle}>
        Guided by Buss and Snee. Track progress, discover guides, save builds, and master your favourite games.
      </Text>

      <TextInput
        placeholder="Search heroes, villagers, fish, recipes..."
        placeholderTextColor="#94A3B8"
        style={styles.search}
      />

      <View style={styles.bannerContainer}>
        <Image
          source={require("../../assets/images/banner.png")}
          style={styles.banner}
          resizeMode="cover"
        />
      </View>

      <View style={styles.quickGrid}>

        <Pressable
          style={styles.quickCard}
          onPress={() =>
            router.push("/game/marvel-rivals/academy")
          }
        >
          <Text style={styles.quickEmoji}>🎓</Text>
          <Text style={styles.quickTitle}>Academy</Text>
        </Pressable>

        <Pressable
          style={styles.quickCard}
          onPress={() =>
            router.push("/games")
          }
        >
          <Text style={styles.quickEmoji}>🎮</Text>
          <Text style={styles.quickTitle}>Games</Text>
        </Pressable>

        <Pressable
          style={styles.quickCard}
          onPress={() =>
            router.push("/database")
          }
        >
          <Text style={styles.quickEmoji}>📚</Text>
          <Text style={styles.quickTitle}>Database</Text>
        </Pressable>

        <Pressable
          style={styles.quickCard}
          onPress={() =>
            router.push("/tracker")
          }
        >
          <Text style={styles.quickEmoji}>🎯</Text>
          <Text style={styles.quickTitle}>Tracker</Text>
        </Pressable>

      </View>

      <Pressable
        style={styles.heroCard}
        onPress={() => router.push("/game/marvel-rivals/academy")}
      >
        <Text style={styles.heroTitle}>
          🎓 Continue Your Journey
        </Text>

        <Text style={styles.heroText}>
          Continue your Academy lessons and become a better Marvel Rivals player.
        </Text>

        <Text style={styles.heroButton}>
          Continue Academy →
        </Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() => router.push("/game/marvel-rivals/guides")}
      >
        <Text style={styles.cardTitle}>🐶 Snee Recommends</Text>

        <Text style={styles.cardText}>
          New to Marvel Rivals?
        </Text>

        <Text style={styles.cardText}>
          • Beginner Guide
        </Text>

        <Text style={styles.cardText}>
          • Objectives Academy
        </Text>

        <Text style={styles.cardText}>
          • Team Compositions
        </Text>

        <Text style={styles.linkButton}>
          Start Learning →
        </Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() => router.push("/companions/buss")}
      >
        <Text style={styles.cardTitle}>🐱 Buss's Secret</Text>

        <Text style={styles.cardText}>
          Most players don't lose because of mechanics.
        </Text>

        <Text style={styles.cardText}>
          They lose because they ignore objectives.
        </Text>

        <Text style={styles.linkButton}>
          View Secret →
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
  smallTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#818CF8",
    marginTop: 40,
  },
  bannerContainer: {
    borderRadius: 24,
    overflow: "hidden",
    marginTop: 20,
  },
  banner: {
    width: "100%",
    height:180,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    marginTop: 10,
    color: "#F8FAFC",
  },
  heroCard: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 24,
    padding: 22,
    marginTop: 20,
  },
  heroTitle: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "900",
  },
  heroText: {
    color: "#CBD5E1",
    marginTop: 10,
    lineHeight: 22,
    fontSize: 15,
  },
  heroButton: {
    color: "#818CF8",
    fontWeight: "900",
    marginTop: 14,
    fontSize: 16,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  quickCard: {
    width: "48%",
    backgroundColor: "#0F172A",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
  },
  quickEmoji: {
    fontSize: 34,
  },
  quickTitle: {
    color: "#F8FAFC",
    fontWeight: "900",
    fontSize: 18,
    marginTop: 10,
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
