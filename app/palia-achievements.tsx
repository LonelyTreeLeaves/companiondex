import { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";

export default function PaliaAchievementsScreen() {
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    loadAchievements();
  }, []);

  async function loadAchievements() {
    const { data, error } = await supabase
      .from("palia_achievements")
      .select("*")
      .order("achievement_name");

    if (error) {
      console.log("Achievement error:", error.message);
      return;
    }

    setAchievements(data || []);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Palia Achievements</Text>
      <Text style={styles.subtitle}>Track collection and progression milestones.</Text>

      {achievements.map((achievement) => (
        <View
          key={achievement.id}
          style={[
            styles.card,
            achievement.unlocked && styles.cardUnlocked,
          ]}
        >
          <Text style={styles.achievementName}>
            {achievement.unlocked ? "🏆" : "🔒"} {achievement.achievement_name}
          </Text>

          <Text style={styles.description}>
            {achievement.description}
          </Text>

          <Text style={styles.requirement}>
            Goal: {achievement.requirement_amount}
          </Text>
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
  cardUnlocked: {
    borderColor: "#FACC15",
  },
  achievementName: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8,
  },
  description: {
    color: "#CBD5E1",
    lineHeight: 22,
  },
  requirement: {
    color: "#A5B4FC",
    fontWeight: "900",
    marginTop: 10,
  },
});