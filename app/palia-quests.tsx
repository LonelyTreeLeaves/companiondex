import { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable, TextInput, Image } from "react-native";
import { supabase } from "../lib/supabase";

export default function PaliaQuestsScreen() {
  const [quests, setQuests] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);

  useEffect(() => {
    loadQuests();
  }, []);

  async function loadQuests() {
    const { data, error } = await supabase
      .from("palia_quests")
      .select("*")
      .order("category")
      .order("quest_name");

    if (error) {
      console.log("Quest error:", error.message);
      return;
    }

    setQuests(data || []);
  }

  async function toggleCompleted(quest: any) {
    const newValue = !quest.completed;

    const { error } = await supabase
      .from("palia_quests")
      .update({ completed: newValue })
      .eq("id", quest.id);

    if (error) {
      console.log("Quest toggle error:", error.message);
      return;
    }

    setQuests((prev) =>
      prev.map((item) =>
        item.id === quest.id ? { ...item, completed: newValue } : item
      )
    );
  }

  const visibleQuests = quests.filter((quest) => {
    const search = searchText.toLowerCase();

    const matchesSearch =
      quest.quest_name?.toLowerCase().includes(search) ||
      quest.category?.toLowerCase().includes(search) ||
      quest.villager_name?.toLowerCase().includes(search) ||
      quest.location?.toLowerCase().includes(search);

    const matchesComplete = showIncompleteOnly ? !quest.completed : true;

    return matchesSearch && matchesComplete;
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Palia Quest Tracker</Text>
      <Text style={styles.subtitle}>Track quests, requirements, rewards and walkthroughs.</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search quests, villagers, locations..."
        placeholderTextColor="#64748B"
        value={searchText}
        onChangeText={setSearchText}
      />

      <Pressable
        style={styles.toggleButton}
        onPress={() => setShowIncompleteOnly(!showIncompleteOnly)}
      >
        <Text style={styles.toggleButtonText}>
          {showIncompleteOnly ? "Show All Quests" : "Show Incomplete Only"}
        </Text>
      </Pressable>

      {visibleQuests.length === 0 ? (
        <Text style={styles.emptyText}>No quests found.</Text>
      ) : (
        visibleQuests.map((quest) => (
          <View key={quest.id} style={styles.card}>
            <View style={styles.headerRow}>
              {quest.image_url ? (
                <Image source={{ uri: quest.image_url }} style={styles.itemImage} />
              ) : (
                <View style={styles.initialBox}>
                  <Text style={styles.initialText}>
                    {quest.quest_name?.charAt(0)}
                  </Text>
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Pressable onPress={() => toggleCompleted(quest)}>
                  <Text style={styles.questName}>
                    {quest.completed ? "✅" : "☐"} {quest.quest_name}
                  </Text>
                </Pressable>

                <Text style={styles.categoryText}>{quest.category}</Text>
              </View>
            </View>

            {quest.villager_name ? (
              <>
                <Text style={styles.label}>Villager</Text>
                <Text style={styles.text}>{quest.villager_name}</Text>
              </>
            ) : null}

            <Text style={styles.label}>Location</Text>
            <Text style={styles.text}>{quest.location || "Unknown"}</Text>

            <Text style={styles.label}>Requirements</Text>
            <Text style={styles.text}>{quest.requirements || "None listed."}</Text>

            <Text style={styles.label}>Rewards</Text>
            <Text style={styles.text}>{quest.rewards || "Unknown"}</Text>

            <Text style={styles.label}>Walkthrough</Text>
            {quest.walkthrough ? (
              quest.walkthrough.split("\n").map((line: string, index: number) => (
                <Text key={index} style={styles.text}>
                  {line}
                </Text>
              ))
            ) : (
              <Text style={styles.text}>No walkthrough yet.</Text>
            )}
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
  questName: {
    color: "#F8FAFC",
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 4,
  },
  categoryText: {
    color: "#A5B4FC",
    fontWeight: "800",
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