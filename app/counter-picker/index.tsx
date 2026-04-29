import { useEffect, useState } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { supabase } from "../../lib/supabase";

export default function CounterPickerScreen() {
  const [heroes, setHeroes] = useState<any[]>([]);
  const [selectedHero, setSelectedHero] = useState("");
  const [counters, setCounters] = useState<any[]>([]);

  useEffect(() => {
    loadHeroes();
  }, []);

  async function getMarvelGameId() {
    const { data, error } = await supabase
      .from("games")
      .select("id")
      .eq("slug", "marvel-rivals")
      .single();

    if (error) {
      console.log("Game ID error:", error.message);
      return "";
    }

    return data.id;
  }

  async function loadHeroes() {
    const gameId = await getMarvelGameId();

    const { data, error } = await supabase
      .from("game_entries")
      .select("title")
      .eq("category", "Heroes")
      .eq("game_id", gameId)
      .order("title");

    if (error) {
      console.log("Hero load error:", error.message);
      return;
    }

    setHeroes(data || []);
  }

  async function chooseHero(heroName: string) {
    setSelectedHero(heroName);

    const { data, error } = await supabase
      .from("hero_counters")
      .select("*")
      .eq("hero_name", heroName)
      .order("counter_type")
      .order("counter_name");

    if (error) {
      console.log("Counter load error:", error.message);
      return;
    }

    setCounters(data || []);
  }

  const groupedCounters = counters.reduce((groups: any, counter: any) => {
    const type = counter.counter_type || "General";

    if (!groups[type]) {
      groups[type] = [];
    }

    groups[type].push(counter);
    return groups;
  }, {});

  const groupOrder = ["Best Counter", "Strong Counter", "General"];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Counter Picker</Text>

      <Text style={styles.subtitle}>
        Pick the enemy hero you are struggling against and view suggested counters.
      </Text>

      <Text style={styles.sectionTitle}>Enemy Hero</Text>

      <View style={styles.heroGrid}>
        {heroes.map((hero) => (
          <Pressable
            key={hero.title}
            style={[
              styles.heroButton,
              selectedHero === hero.title && styles.selectedHeroButton,
            ]}
            onPress={() => chooseHero(hero.title)}
          >
            <Text
              style={[
                styles.heroButtonText,
                selectedHero === hero.title && styles.selectedHeroText,
              ]}
            >
              {hero.title}
            </Text>
          </Pressable>
        ))}
      </View>

      {selectedHero ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Counters for {selectedHero}</Text>

          {counters.length === 0 ? (
            <Text style={styles.text}>No counters added yet for this hero.</Text>
          ) : (
            groupOrder
              .filter((type) => groupedCounters[type])
              .map((type) => (
                <View key={type} style={styles.counterGroup}>
                  <Text style={styles.groupTitle}>{type}</Text>

                  {groupedCounters[type].map((counter: any) => (
                    <View key={counter.id} style={styles.counterCard}>
                      <Text style={styles.counterName}>{counter.counter_name}</Text>
                      <Text style={styles.text}>{counter.reason}</Text>
                      <Text style={styles.difficulty}>
                        Difficulty: {counter.difficulty || "Unknown"}
                      </Text>
                    </View>
                  ))}
                </View>
              ))
          )}
        </View>
      ) : null}
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
    color: "#F8FAFC",
    marginTop: 40,
  },
  subtitle: {
    color: "#CBD5E1",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    marginBottom: 22,
  },
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 14,
  },
  heroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  heroButton: {
    backgroundColor: "#0F172A",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  selectedHeroButton: {
    backgroundColor: "#6366F1",
    borderColor: "#818CF8",
  },
  heroButtonText: {
    color: "#CBD5E1",
    fontWeight: "800",
  },
  selectedHeroText: {
    color: "white",
  },
  card: {
    backgroundColor: "#0F172A",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 14,
  },
  counterGroup: {
    marginBottom: 18,
  },
  groupTitle: {
    color: "#A5B4FC",
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 10,
  },
  counterCard: {
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E293B",
    marginBottom: 10,
  },
  counterName: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
  },
  text: {
    color: "#CBD5E1",
    lineHeight: 22,
  },
  difficulty: {
    color: "#94A3B8",
    marginTop: 8,
    fontWeight: "800",
  },
});
