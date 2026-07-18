import { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import { supabase } from "../lib/supabase";

export default function PaliaSkillsScreen() {
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    const { data, error } = await supabase
      .from("palia_skills")
      .select("*")
      .order("skill_name");

    if (error) {
      console.log("Skills error:", error.message);
      return;
    }

    setSkills(data || []);
  }

  async function updateLevel(skill: any, amount: number) {
    const newLevel = Math.max(1, skill.current_level + amount);

    const { error } = await supabase
      .from("palia_skills")
      .update({ current_level: newLevel })
      .eq("id", skill.id);

    if (error) {
      console.log("Skill update error:", error.message);
      return;
    }

    setSkills((prev) =>
      prev.map((item) =>
        item.id === skill.id ? { ...item, current_level: newLevel } : item
      )
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Palia Skills Tracker</Text>
      <Text style={styles.subtitle}>Track your current level for each skill.</Text>

      {skills.map((skill) => {
        const progressPercent = Math.min(
          100,
          Math.round((skill.current_level / skill.goal_level) * 100)
        );

        return (
          <View key={skill.id} style={styles.card}>
            <Text style={styles.skillName}>{skill.skill_name}</Text>

            <Text style={styles.levelText}>
              Level {skill.current_level} / Goal {skill.goal_level}
            </Text>

            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>

            <Text style={styles.progressPercent}>
              {progressPercent}% complete
            </Text>

            <Text style={styles.notes}>{skill.notes}</Text>

            <View style={styles.buttonRow}>
              <Pressable
                style={styles.levelButton}
                onPress={() => updateLevel(skill, -1)}
              >
                <Text style={styles.levelButtonText}>-</Text>
              </Pressable>

              <Pressable
                style={styles.levelButton}
                onPress={() => updateLevel(skill, 1)}
              >
                <Text style={styles.levelButtonText}>+</Text>
              </Pressable>
            </View>
          </View>
        );
      })}
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
  skillName: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: "#1E293B",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#22C55E",
  },
  progressPercent: {
    color: "#94A3B8",
    marginTop: 6,
    fontSize: 12,
    fontWeight: "800",
  },
  levelText: {
    color: "#A5B4FC",
    fontWeight: "900",
    marginBottom: 8,
  },
  notes: {
    color: "#CBD5E1",
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  levelButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  levelButtonText: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "900",
  },
});