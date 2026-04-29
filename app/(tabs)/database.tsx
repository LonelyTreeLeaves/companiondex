import { useEffect, useState } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet } from "react-native";
import { supabase } from "../../lib/supabase";

export default function DatabaseScreen() {
  const [entries, setEntries] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    const { data, error } = await supabase
      .from("game_entries")
      .select("*, games(name)")
      .order("title");

    if (error) {
      console.log(error);
      return;
    }

    setEntries(data || []);
  }

  const filteredEntries = entries.filter((entry) => {
    const text = `
      ${entry.title}
      ${entry.category}
      ${entry.summary}
      ${entry.content}
      ${entry.games?.name}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Database</Text>

      <Text style={styles.subtitle}>
        Search all saved game entries.
      </Text>

      <TextInput
        placeholder="Search Luna, fish, Palia..."
        placeholderTextColor="#94A3B8"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {filteredEntries.map((entry) => (
        <View key={entry.id} style={styles.card}>
          <Text style={styles.gameName}>{entry.games?.name}</Text>
          <Text style={styles.category}>{entry.category}</Text>
          <Text style={styles.cardTitle}>{entry.title}</Text>
          <Text style={styles.summary}>{entry.summary}</Text>
          <Text style={styles.content}>{entry.content}</Text>
        </View>
      ))}
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
  },
  search: {
    backgroundColor: "#0F172A",
    color: "#F8FAFC",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 18,
  },
  card: {
    backgroundColor: "#0F172A",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 14,
  },
  gameName: {
    color: "#818CF8",
    fontWeight: "900",
    marginBottom: 4,
  },
  category: {
    color: "#94A3B8",
    fontWeight: "800",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#F8FAFC",
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
});
