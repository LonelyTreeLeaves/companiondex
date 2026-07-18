import { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import { supabase } from "../lib/supabase";

export default function PaliaWeeklyWantsScreen() {
  const [wants, setWants] = useState<any[]>([]);
  const [errorText, setErrorText] = useState("");
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);

  useEffect(() => {
    loadWants();
  }, []);

  async function loadWants() {
    const { data, error, count } = await supabase
        .from("palia_weekly_wants")
        .select("*", { count: "exact" });

    console.log("Weekly wants data:", data);
    console.log("Weekly wants count:", count);
    console.log("Weekly wants error:", error);

    if (error) {
        setErrorText(error.message);
        return;
    }

    setWants(data || []);
  }

  const visibleWants = showIncompleteOnly
    ? wants.filter((want) => !want.gifted)
    : wants;

  const groupedWants = visibleWants.reduce((groups: any, want: any) => {
    if (!groups[want.villager_name]) {
      groups[want.villager_name] = [];
    }

    groups[want.villager_name].push(want);
    return groups;
  }, {});

  async function toggleGifted(item: any) {
    const newValue = !item.gifted;

    const { error } = await supabase
      .from("palia_weekly_wants")
      .update({ gifted: newValue })
      .eq("id", item.id);

    if (error) {
      console.log("Toggle error:", error.message);
      return;
    }

    // update UI instantly
      setWants((prev) =>
        prev.map((w) =>
          w.id === item.id ? { ...w, gifted: newValue } : w
        )
      );
    }

  async function resetWeeklyWants() {
    const { error } = await supabase
      .from("palia_weekly_wants")
      .update({ gifted: false })
      .eq("gifted", true);

    if (error) {
      console.log("Reset error:", error.message);
      return;
    }

    setWants((prev) =>
      prev.map((item) => ({
        ...item,
        gifted: false,
      }))
    );
  }  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Palia Weekly Wants</Text>
      <Text style={styles.subtitle}>Track villager weekly gifts and loved items.</Text>

      <Pressable
        style={styles.toggleButton}
        onPress={() => setShowIncompleteOnly(!showIncompleteOnly)}
      >
        <Text style={styles.toggleButtonText}>
            {showIncompleteOnly ? "Show All" : "Show Incomplete Only"}
        </Text>
      </Pressable>

      <Pressable
        style={styles.resetButton}
        onPress={resetWeeklyWants}
      >
        <Text style={styles.resetButtonText}>
          Reset Weekly Wants
        </Text>
      </Pressable>

      {errorText ? <Text style={styles.itemText}>{errorText}</Text> : null}

      {wants.length === 0 && !errorText ? (
        <Text style={styles.itemText}>No weekly wants loaded yet.</Text>
      ) : null}

      {Object.entries(groupedWants).map(([villager, items]: any) => (
        <View key={villager} style={styles.card}>
          <Text style={styles.villagerName}>{villager}</Text>

          {items.map((item: any) => (
            <Pressable
                key={item.id}
                onPress={() => toggleGifted(item)}
            >
                <Text style={styles.itemText}>
                    {item.gifted ? "✅" : "☐"} {item.item_name} {item.is_loved ? "♥" : ""}
                </Text>
            </Pressable>
          ))}
        </View>
      ))}
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
  card: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
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
  resetButton: {
    backgroundColor: "#7F1D1D",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    marginBottom: 18,
  },
  resetButtonText: {
    color: "#F8FAFC",
    fontWeight: "900",
  },
  villagerName: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 10,
  },
  itemText: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 26,
  },
});