import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [itemType, setItemType] = useState("Goal");
  const [academyCompleted, setAcademyCompleted] = useState(0);

  useEffect(() => {
    loadItems();
    loadAcademyProgress();
  }, []);

  async function loadAcademyProgress() {
    const stored = await AsyncStorage.getItem("academy-completed");

    if (stored) {
      const lessons = JSON.parse(stored);
      setAcademyCompleted(lessons.length);
    }
  }

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
      item_type: itemType,
    });

    setTitle("");
    setNote("");
    setGameName("");
    setItemType("Goal");
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

  function renderSection(title: string, sectionItems: any[]) {
    return (
      <>
        <Text style={styles.sectionTitle}>
          {title}
        </Text>

        {sectionItems.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.game}>
              {item.game_name || "General"}
            </Text>

            <Text style={styles.itemType}>
              {item.item_type || "Goal"}
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
                <Text style={styles.deleteText}>
                  Delete
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </>
    );
  }

  const goals = items.filter(
    (item) => item.item_type === "Goal"
  );

  const builds = items.filter(
    (item) => item.item_type === "Build"
  );

  const reminders = items.filter(
    (item) => item.item_type === "Reminder"
  );

  const progressItems = items.filter(
    (item) => item.item_type === "Progress"
  );

  const totalItems = items.length;
  const completedItems = items.filter((item) => item.completed).length;

  const completionPercent =
    totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tracker</Text>

      <Text style={styles.subtitle}>
        Save goals, reminders, builds, and progress.
      </Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Tracker Summary</Text>
        <Text style={styles.summaryText}>🎯 Goals: {goals.length}</Text>
        <Text style={styles.summaryText}>🛠 Builds: {builds.length}</Text>
        <Text style={styles.summaryText}>⏰ Reminders: {reminders.length}</Text>
        <Text style={styles.summaryText}>📈 Progress: {progressItems.length}</Text>
        <Text style={styles.summaryText}>✅ Completed: {completedItems}</Text>
        <Text style={styles.summaryText}>
          🎓 Academy Lessons: {academyCompleted}
        </Text>
        <Text style={styles.summaryText}>
          📊 Completion Rate: {completionPercent}%
        </Text>
      </View>

      <View style={styles.quickAddRow}>
        {[
          { label: "🎯 New Goal", type: "Goal" },
          { label: "🛠 New Build", type: "Build" },
          { label: "⏰ New Reminder", type: "Reminder" },
          { label: "📈 New Progress", type: "Progress" },
        ].map((quick) => (
          <Pressable
            key={quick.type}
            style={styles.quickAddButton}
            onPress={() => setItemType(quick.type)}
          >
            <Text style={styles.quickAddText}>{quick.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.typeRow}>
        {["Goal", "Build", "Reminder", "Progress"].map((type) => (
          <Pressable
            key={type}
            style={[
              styles.typeButton,
              itemType === type && styles.typeButtonActive,
            ]}
            onPress={() => setItemType(type)}
          >
            <Text
              style={[
                styles.typeButtonText,
                itemType === type && styles.typeButtonTextActive,
              ]}
            >
              {type}
            </Text>
          </Pressable>
        ))}
      </View>

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

      {renderSection("🎯 Goals", goals)}

      {renderSection("🛠 Builds", builds)}

      {renderSection("⏰ Reminders", reminders)}

      {renderSection("📈 Progress", progressItems)}
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
  summaryCard: {
    backgroundColor: "#111827",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 18,
  },
  quickAddRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  quickAddButton: {
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  quickAddText: {
    color: "#F8FAFC",
    fontWeight: "900",
    fontSize: 13,
  },
  summaryTitle: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },
  summaryText: {
    color: "#CBD5E1",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
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
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 20,
    marginBottom: 12,
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  typeButton: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  typeButtonActive: {
    backgroundColor: "#6366F1",
    borderColor: "#818CF8",
  },
  typeButtonText: {
    color: "#94A3B8",
    fontWeight: "900",
  },
  typeButtonTextActive: {
    color: "#F8FAFC",
  },
  itemType: {
    color: "#A5B4FC",
    fontWeight: "900",
    marginBottom: 6,
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
