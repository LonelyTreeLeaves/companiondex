import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

export default function GlobalSearchScreen() {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (searchText.length > 1) {
      runSearch();
    } else {
      setResults([]);
    }
  }, [searchText]);

  async function runSearch() {
    const search = searchText.toLowerCase();

    const tables = [
      {
        table: "palia_fish",
        label: "Fish",
        field: "name",
      },
      {
        table: "palia_bugs",
        label: "Bug",
        field: "name",
      },
      {
        table: "palia_recipes",
        label: "Recipe",
        field: "recipe_name",
      },
      {
        table: "palia_quests",
        label: "Quest",
        field: "quest_name",
      },
      {
        table: "palia_skills",
        label: "Skill",
        field: "skill_name",
      },
    ];

    let combined: any[] = [];

    for (const config of tables) {
      const { data } = await supabase
        .from(config.table)
        .select("*")
        .ilike(config.field, `%${search}%`)
        .limit(10);

      if (data) {
        combined.push(
          ...data.map((item: any) => ({
            ...item,
            resultType: config.label,
            resultName: item[config.field],
          }))
        );
      }
    }

    setResults(combined);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Global Search</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search fish, bugs, recipes, quests..."
        placeholderTextColor="#64748B"
        value={searchText}
        onChangeText={setSearchText}
      />

      {results.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.typeText}>{item.resultType}</Text>

          <Text style={styles.resultName}>
            {item.resultName}
          </Text>
        </View>
      ))}

      {searchText.length > 1 && results.length === 0 ? (
        <Text style={styles.emptyText}>
          No results found.
        </Text>
      ) : null}
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
    marginBottom: 18,
  },
  card: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  typeText: {
    color: "#818CF8",
    fontWeight: "900",
    marginBottom: 4,
  },
  resultName: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "900",
  },
  emptyText: {
    color: "#94A3B8",
    marginTop: 18,
  },
});