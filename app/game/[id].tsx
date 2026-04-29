import { useEffect, useState } from "react";
import { heroPortraits } from "../../lib/heroPortraits";
import { useLocalSearchParams, router } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams();
  const [game, setGame] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    loadGame();
    loadEntries();
  }, [id]);

  async function loadGame() {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log("Game error:", error.message);
      return;
    }

    setGame(data);
  }

  async function loadEntries() {
    const { data, error } = await supabase
      .from("game_entries")
      .select("*")
      .eq("game_id", id)
      .order("category")
      .order("title");

    if (error) {
      console.log("Entries error:", error.message);
      return;
    }

    setEntries(data || []);
  }

  const groupedEntries = entries.reduce((groups: any, entry: any) => {
    const category = entry.category || "Other";

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(entry);
    return groups;
  }, {});

  if (!game) {
    return (
      <View style={styles.loading}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={{ uri: game.image_url }}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <View style={styles.heroOverlay}>
          <Text style={styles.title}>{game.name}</Text>
          <Text style={styles.genre}>{game.genre}</Text>
          <Text style={styles.description}>{game.description}</Text>
        </View>
      </ImageBackground>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Entries</Text>

        {entries.length === 0 ? (
          <Text style={styles.emptyText}>No entries added yet.</Text>
        ) : (
          Object.entries(groupedEntries).map(([category, items]: any) => (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryHeading}>{category}</Text>

              {items.map((entry: any) => (
                <Pressable
                  key={entry.id}
                  style={styles.card}
                  onPress={() => router.push(`/entry/${entry.id}`)}
                >
                  <View style={styles.entryHeader}>
                    {entry.image_url ? (
                      <Image
                        source={{ uri: entry.image_url }}
                        style={styles.entryImage}
                        onError={() => {
                          console.log("Image failed:", entry.title, entry.image_url);
                        }}
                      />
                    ) : (
                      <View style={styles.entryInitialBox}>
                        <Text style={styles.entryInitial}>
                          {entry.title?.charAt(0)}
                        </Text>
                      </View>
                    )}

                    <View style={styles.entryText}>
                      <Text style={styles.cardTitle}>{entry.title}</Text>
                      <Text style={styles.summary}>{entry.summary}</Text>
                    </View>
                  </View>

                  <Text style={styles.content} numberOfLines={3}>
                    {entry.content}
                  </Text>
                  <Text style={styles.tapText}>Tap to open full details →</Text>
                </Pressable>
              ))}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    padding: 22,
    backgroundColor: "#020617",
  },
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  hero: {
    minHeight: 320,
    justifyContent: "flex-end",
  },
  heroImage: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 22,
    backgroundColor: "rgba(2, 6, 23, 0.62)",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  title: {
    fontSize: 38,
    fontWeight: "900",
    color: "#F8FAFC",
  },
  genre: {
    fontSize: 18,
    color: "#A5B4FC",
    fontWeight: "900",
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: "#E2E8F0",
    marginTop: 14,
    lineHeight: 24,
  },
  section: {
    padding: 22,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#F8FAFC",
    marginBottom: 14,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeading: {
    fontSize: 22,
    fontWeight: "900",
    color: "#A5B4FC",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#0F172A",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#F8FAFC",
  },
  entryHeader: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  entryImage: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#1E293B",
  },
  entryInitialBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },
  entryInitial: {
    color: "#A5B4FC",
    fontSize: 26,
    fontWeight: "900",
  },
  entryText: {
    flex: 1,
  },
  summary: {
    color: "#E2E8F0",
    fontWeight: "700",
    marginTop: 8,
  },
  content: {
    color: "#CBD5E1",
    marginTop: 8,
    lineHeight: 22,
  },
  tapText: {
    color: "#818CF8",
    fontWeight: "900",
    marginTop: 12,
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 16,
  },
});