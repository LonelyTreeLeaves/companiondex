import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function TrackerScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [gameName, setGameName] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const { data, error } = await supabase
      .from("tracker_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setItems(data || []);
  }

  async function addItem() {
    if (!title.trim()) return;

    await supabase.from("tracker_items").insert({
      title,
      note,
      game_name: gameName,
    });

    setTitle("");
    setNote("");
    setGameName("");
    loadItems();
  }

  async function toggleComplete(item: any) {
    await supabase
      .from("tracker_items")
      .update({ completed: !item.completed })
      .eq("id", item.id);

    loadItems();
  }

  async function deleteItem(id: string) {
    await supabase
      .from("tracker_items")
      .delete()
      .eq("id", id);

    loadItems();
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tracker</Text>

      <Text style={styles.subtitle}>
        Save goals, reminders, builds, and progress.
      </Text>

      <TextInput
        placeholder="Game name"
        placeholderTextColor="#94A3B8"
        value={gameName}
        onChangeText={setGameName}
        style={styles.input}
      />

      <TextInput
        placeholder="Task title"
        placeholderTextColor="#94A3B8"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Extra notes..."
        placeholderTextColor="#94A3B8"
        value={note}
        onChangeText={setNote}
        multiline
        style={[styles.input, styles.bigInput]}
      />

      <Pressable style={styles.button} onPress={addItem}>
        <Text style={styles.buttonText}>Add Item</Text>
      </Pressable>

      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.game}>
            {item.game_name || "General"}
          </Text>

          <Text
            style={[
              styles.cardTitle,
              item.completed && styles.doneText,
            ]}
          >
            {item.title}
          </Text>

          {item.note ? (
            <Text style={styles.note}>{item.note}</Text>
          ) : null}

          <View style={styles.row}>
            <Pressable
              style={[
                styles.smallButton,
                item.completed && styles.completeButton,
              ]}
              onPress={() => toggleComplete(item)}
            >
              <Text style={styles.smallButtonText}>
                {item.completed ? "Done" : "Complete"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={() => deleteItem(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
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
  input: {
    backgroundColor: "#0F172A",
    color: "#F8FAFC",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 12,
  },
  bigInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#6366F1",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 18,
  },
  buttonText: {
    color: "white",
    fontWeight: "900",
  },
  card: {
    backgroundColor: "#0F172A",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 14,
  },
  game: {
    color: "#818CF8",
    fontWeight: "900",
    marginBottom: 6,
  },
  cardTitle: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "900",
  },
  doneText: {
    textDecorationLine: "line-through",
    color: "#64748B",
  },
  note: {
    color: "#CBD5E1",
    marginTop: 8,
    lineHeight: 22,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  smallButton: {
    backgroundColor: "#334155",
    padding: 12,
    borderRadius: 14,
  },
  completeButton: {
    backgroundColor: "#16A34A",
  },
  smallButtonText: {
    color: "white",
    fontWeight: "900",
  },
  deleteButton: {
    backgroundColor: "#7F1D1D",
    padding: 12,
    borderRadius: 14,
  },
  deleteText: {
    color: "#FECACA",
    fontWeight: "900",
  },
});
