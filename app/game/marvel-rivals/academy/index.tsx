import { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MARVEL = {
  background: "#170202",
  card: "#260606",
  cardSoft: "#3B0A0A",
  border: "#7F1D1D",
  primary: "#EF4444",
  primaryDark: "#991B1B",
  text: "#FFF7F7",
  muted: "#FECACA",
};

const academyLessons = [
  "beginner-basics",
  "roles-explained",
  "vanguard-guide",
  "duelist-guide",
  "strategist-guide",
  "positioning",
  "objectives",
  "teamfights",
];

const lessons = [
  {
    title: "Beginner Basics",
    description: "Learn what wins games, common mistakes, and beginner heroes.",
    path: "/game/marvel-rivals/guides/beginner-basics",
    teacher: "🐶 Snee",
    status: "Unlocked",
  },
  {
    title: "Roles Explained",
    description: "Understand Vanguards, Duelists, and Strategists.",
    path: "/game/marvel-rivals/guides/roles-explained",
    teacher: "🐶 Snee",
    status: "Unlocked",
  },
  {
    title: "Vanguard Academy",
    description: "Learn how to tank, create space, and protect your team.",
    path: "/game/marvel-rivals/guides/vanguard-guide",
    teacher: "🐶 Snee",
    status: "Unlocked",
  },
  {
    title: "Duelist Academy",
    description: "Learn pressure, target priority, flanking, and eliminations.",
    path: "/game/marvel-rivals/guides/duelist-guide",
    teacher: "🐶 Snee",
    status: "Unlocked",
  },
  {
    title: "Strategist Academy",
    description: "Learn healing, utility, survival, and support positioning.",
    path: "/game/marvel-rivals/guides/strategist-guide",
    teacher: "🐶 Snee",
    status: "Unlocked",
  },
  {
    title: "Positioning",
    description: "Learn where to stand, how to use cover, and how to survive.",
    path: "/game/marvel-rivals/guides/positioning",
    teacher: "🐱 Buss",
    status: "Unlocked",
  },
  {
    title: "Objectives",
    description: "Learn how objectives, overtime, and map control work.",
    path: "/game/marvel-rivals/guides/objectives",
    teacher: "🐱 Buss",
    status: "Unlocked",
  },
  {
    title: "Teamfights",
    description: "Learn when to engage, regroup, and use ultimates.",
    path: "/game/marvel-rivals/guides/teamfights",
    teacher: "🐱 Buss",
    status: "Unlocked",
  },
  {
    title: "Team Compositions",
    description: "Learn Dive, Brawl, Poke, Protect and Rush team styles.",
    path: "/game/marvel-rivals/guides/team-compositions",
    teacher: "🐱 Buss",
    status: "Unlocked",
  },
  {
    title: "Hero Selection",
    description: "Learn how to choose heroes based on your team and the enemy team.",
    path: "/game/marvel-rivals/guides/hero-selection",
    teacher: "🐱 Buss",
    status: "Unlocked",
  },
  {
    title: "Ult Economy",
    description: "Learn when to use ultimates, combine ultimates, and avoid wasting them.",
    path: "/game/marvel-rivals/guides/ult-economy",
    teacher: "🐱 Buss",
    status: "Unlocked",
  },
];

export default function MarvelRivalsAcademy() {
  const router = useRouter();
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    loadProgress();
  }, []);

  async function loadProgress() {
    const stored = await AsyncStorage.getItem("academy-completed");

    if (stored) {
      setCompletedLessons(JSON.parse(stored));
    }
  }

  const totalLessons = lessons.length;
  const completedCount = completedLessons.length;
  const progressPercent =
    totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);

    let academyRank = "Recruit";

    if (completedCount >= 3) academyRank = "Student";
    if (completedCount >= 6) academyRank = "Graduate";
    if (completedCount >= 9) academyRank = "Veteran";
    if (completedCount >= totalLessons) academyRank = "Master";

  const achievements = [
    {
      title: "First Lesson Complete",
      description: "Complete your first Academy lesson.",
      unlocked: completedCount >= 1,
    },
    {
      title: "Academy Student",
      description: "Complete 3 Academy lessons.",
      unlocked: completedCount >= 3,
    },
    {
      title: "Rivals Graduate",
      description: "Complete 6 Academy lessons.",
      unlocked: completedCount >= 6,
    },
    {
      title: "Academy Veteran",
      description: "Complete 9 Academy lessons.",
      unlocked: completedCount >= 9,
    },
    {
      title: "Master of the Academy",
      description: "Complete every Academy lesson.",
      unlocked: completedCount >= totalLessons,
    },
  ];

  const unlockedAchievements =
    achievements.filter((a) => a.unlocked).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>QuestBind Academy</Text>
      <Text style={styles.title}>Marvel Rivals Academy</Text>
      <Text style={styles.subtitle}>
        Learn the fundamentals with Snee, then uncover advanced secrets with Buss.
      </Text>

      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Academy Progress</Text>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>

        <Text style={styles.progressText}>
          {completedCount} / {totalLessons} Lessons Complete
        </Text>
        <Text style={styles.rankText}>
          🎖 Academy Rank: {academyRank}
        </Text>
      </View>

      {lessons.map((lesson) => {
        const lessonId = lesson.path.split("/").pop();
        const isCompleted = completedLessons.includes(lessonId || "");

        return (
          <Pressable
            key={lesson.title}
            style={styles.lessonCard}
            onPress={() => router.push(lesson.path)}
          >
            <View style={styles.lessonTopRow}>
              <Text style={styles.lessonTeacher}>{lesson.teacher}</Text>

              <Text
                style={[
                  styles.statusBadge,
                  { color: isCompleted ? "#22C55E" : MARVEL.muted },
                ]}
              >
                {isCompleted ? "Completed" : lesson.status}
              </Text>
            </View>

            <Text style={styles.lessonTitle}>
              {isCompleted ? "✅ " : ""}
              {lesson.title}
            </Text>

            <Text style={styles.lessonDescription}>{lesson.description}</Text>

            <Text style={styles.openText}>
              {isCompleted ? "Review Lesson →" : "Open Lesson →"}
            </Text>
          </Pressable>
        );
      })}

      <View style={styles.graduationCard}>
        <Text style={styles.graduationTitle}>
          🎓 Academy Graduation
        </Text>

        <Text style={styles.graduationText}>
          Complete every lesson to earn the Master Academy Rank.
        </Text>

        <Text style={styles.graduationProgress}>
          {completedCount} / {totalLessons}
        </Text>

        <Text style={styles.achievementProgress}>
          🏆 {unlockedAchievements} / {achievements.length} Achievements Unlocked
        </Text>
      </View>

      <View style={styles.achievementSection}>
        <Text style={styles.graduationTitle}>🏆 Academy Achievements</Text>

        {achievements.map((achievement) => (
          <View
            key={achievement.title}
            style={[
              styles.achievementCard,
              !achievement.unlocked && styles.achievementLocked,
            ]}
          >
            <Text style={styles.achievementTitle}>
              {achievement.unlocked ? "🏆 " : "🔒 "}
              {achievement.title}
            </Text>

            <Text style={styles.achievementText}>
              {achievement.description}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MARVEL.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  eyebrow: {
    color: MARVEL.primary,
    fontWeight: "900",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  achievementProgress: {
    color: "#FBBF24",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 8,
  },
  achievementSection: {
    marginTop: 24,
  },
  achievementCard: {
    backgroundColor: MARVEL.card,
    borderWidth: 1,
    borderColor: MARVEL.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  achievementLocked: {
    opacity: 0.45,
  },
  achievementTitle: {
    color: MARVEL.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
  },
  achievementText: {
    color: MARVEL.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  title: {
    color: MARVEL.text,
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 8,
  },
  rankText: {
    color: MARVEL.primary,
    fontWeight: "900",
    marginTop: 8,
    fontSize: 15,
  },
  subtitle: {
    color: MARVEL.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },
  graduationCard: {
    backgroundColor: MARVEL.cardSoft,
    borderWidth: 1,
    borderColor: MARVEL.border,
    borderRadius: 24,
    padding: 20,
    marginTop: 24,
  },
  graduationTitle: {
    color: MARVEL.text,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },
  graduationText: {
    color: MARVEL.muted,
    lineHeight: 22,
  },
  graduationProgress: {
    color: MARVEL.primary,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 12,
  },
  progressCard: {
    backgroundColor: MARVEL.cardSoft,
    borderColor: MARVEL.border,
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
  },
  progressTitle: {
    color: MARVEL.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
  },
  progressBar: {
    height: 12,
    backgroundColor: MARVEL.background,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    width: "0%",
    height: "100%",
    backgroundColor: MARVEL.primary,
  },
  progressText: {
    color: MARVEL.muted,
    fontWeight: "800",
    marginTop: 8,
  },
  lessonCard: {
    backgroundColor: MARVEL.card,
    borderColor: MARVEL.border,
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },
  lessonTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  lessonTeacher: {
    color: MARVEL.primary,
    fontWeight: "900",
  },
  statusBadge: {
    color: MARVEL.muted,
    fontWeight: "900",
    fontSize: 12,
  },
  lessonTitle: {
    color: MARVEL.text,
    fontSize: 23,
    fontWeight: "900",
    marginBottom: 8,
  },
  lessonDescription: {
    color: MARVEL.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  openText: {
    color: MARVEL.primary,
    fontWeight: "900",
    marginTop: 12,
  },
});