import { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable, TextInput, Image } from "react-native";
import { supabase } from "../lib/supabase";

function getRarityColor(rarity: string) {
  switch (rarity?.toLowerCase()) {
    case "common":
      return "#94A3B8";

    case "uncommon":
      return "#22C55E";

    case "rare":
      return "#3B82F6";

    case "epic":
      return "#A855F7";

    case "legendary":
      return "#F59E0B";

    default:
      return "#CBD5E1";
  }
}

export default function PaliaBugsScreen() {
  const [bugs, setBugs] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [showUncaughtOnly, setShowUncaughtOnly] = useState(false);

  useEffect(() => {
    loadBugs();
  }, []);

  async function loadBugs() {
    const { data, error } = await supabase
      .from("palia_bugs")
      .select("*")
      .order("name");

    if (error) {
      console.log("Bug error:", error.message);
      return;
    }

    setBugs(data || []);
  }

  async function toggleCaught(item: any) {
    const newValue = !item.caught;

    const { error } = await supabase
      .from("palia_bugs")
      .update({ caught: newValue })
      .eq("id", item.id);

    if (error) {
      console.log("Bug toggle error:", error.message);
      return;
    }

    setBugs((prev) =>
      prev.map((bugItem) =>
        bugItem.id === item.id ? { ...bugItem, caught: newValue } : bugItem
      )
    );
  }

  const visibleBugs = bugs.filter((item) => {
    const search = searchText.toLowerCase();

    const matchesSearch =
      item.name?.toLowerCase().includes(search) ||
      item.location?.toLowerCase().includes(search) ||
      item.rarity?.toLowerCase().includes(search) ||
      item.time_of_day?.toLowerCase().includes(search);

    const matchesCaught = showUncaughtOnly ? !item.caught : true;

    return matchesSearch && matchesCaught;
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Palia Bug Tracker</Text>
      <Text style={styles.subtitle}>Track bugs, locations, time and caught status.</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search bugs, location, rarity, time..."
        placeholderTextColor="#64748B"
        value={searchText}
        onChangeText={setSearchText}
      />

      <Pressable
        style={styles.toggleButton}
        onPress={() => setShowUncaughtOnly(!showUncaughtOnly)}
      >
        <Text style={styles.toggleButtonText}>
          {showUncaughtOnly ? "Show All Bugs" : "Show Uncaught Only"}
        </Text>
      </Pressable>

      {visibleBugs.length === 0 ? (
        <Text style={styles.emptyText}>No bugs found yet.</Text>
      ) : (
        visibleBugs.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.headerRow}>
              {item.image_url ? (
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.itemImage}
                />
              ) : (
                <View style={styles.initialBox}>
                  <Text style={styles.initialText}>
                    {item.name?.charAt(0)}
                  </Text>
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Pressable onPress={() => toggleCaught(item)}>
                  <Text style={styles.itemName}>
                    {item.caught ? "✅" : "☐"} {item.name}
                  </Text>
                </Pressable>
              </View>
            </View>

            <Text style={styles.label}>Rarity</Text>
            <Text
              style={[
                styles.text,
                { color: getRarityColor(item.rarity) }
              ]}
            >
              {item.rarity || "Unknown"}
            </Text>

            <Text style={styles.label}>Location</Text>
            <Text style={styles.text}>{item.location || "Unknown"}</Text>

            <Text style={styles.label}>Time</Text>
            <Text style={styles.text}>{item.time_of_day || "Any"}</Text>

            <Text style={styles.label}>How to Find</Text>
            <Text style={styles.text}>{item.how_to_find || "No notes yet."}</Text>

            <Text style={styles.label}>Use Notes</Text>
            <Text style={styles.text}>{item.use_notes || "No notes yet."}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 22,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 6,
  },
  subtitle: {
    color: "#94A3B8",
    marginBottom: 18,
  },
  searchInput: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#334155",
    color: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  toggleButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    marginBottom: 18,
  },
  toggleButtonText: {
    color: "#F8FAFC",
    fontWeight: "900",
  },
  card: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#1E293B",
  },
  initialBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },
  initialText: {
    color: "#A5B4FC",
    fontSize: 26,
    fontWeight: "900",
  },
  itemName: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
  },
  label: {
    color: "#A5B4FC",
    fontWeight: "900",
    marginTop: 8,
    marginBottom: 4,
  },
  text: {
    color: "#CBD5E1",
    lineHeight: 22,
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 16,
  },
});