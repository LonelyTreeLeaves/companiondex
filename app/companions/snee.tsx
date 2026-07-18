import { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const THEME = {
  background: "#061226",
  card: "#081A36",
  border: "#2563EB",
  primary: "#60A5FA",
  text: "#F8FAFC",
  muted: "#DBEAFE",
};

const sneeExpressions = [
  {
    label: "Happy",
    image: require("../../assets/images/companions/expressions/snee-happy.png"),
  },
  {
    label: "Thinking",
    image: require("../../assets/images/companions/expressions/snee-thinking.png"),
  },
  {
    label: "Teaching",
    image: require("../../assets/images/companions/expressions/snee-teaching.png"),
  },
  {
    label: "Excited",
    image: require("../../assets/images/companions/expressions/snee-excited.png"),
  },
];

export default function SneeProfile() {
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

    const totalLessons = 11;
    const completedCount = completedLessons.length;
    const progressPercent =
      totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);

    let academyRank = "Recruit";
    if (completedCount >= 3) academyRank = "Student";
    if (completedCount >= 6) academyRank = "Graduate";
    if (completedCount >= 9) academyRank = "Veteran";
    if (completedCount >= totalLessons) academyRank = "Master";

    let nextLesson = "Beginner Basics";
    let nextLessonPath = "/game/marvel-rivals/guides/beginner-basics";

    if (completedCount >= 1) {
      nextLesson = "Roles Explained";
      nextLessonPath = "/game/marvel-rivals/guides/roles-explained";
    }
    if (completedCount >= 2) {
      nextLesson = "Positioning Academy";
      nextLessonPath = "/game/marvel-rivals/guides/positioning";
    }
    if (completedCount >= 3) {
      nextLesson = "Objectives Academy";
      nextLessonPath = "/game/marvel-rivals/guides/objectives";
    }
    if (completedCount >= 4) {
      nextLesson = "Teamfight Academy";
      nextLessonPath = "/game/marvel-rivals/guides/teamfights";
    }
    if (completedCount >= 5) {
      nextLesson = "Team Compositions Academy";
      nextLessonPath = "/game/marvel-rivals/guides/team-compositions";
    }
    if (completedCount >= 6) {
      nextLesson = "Hero Selection Academy";
      nextLessonPath = "/game/marvel-rivals/guides/hero-selection";
    }
    if (completedCount >= 7) {
      nextLesson = "Ult Economy Academy";
      nextLessonPath = "/game/marvel-rivals/guides/ult-economy";
    }
    if (completedCount >= totalLessons) {
      nextLesson = "Academy Complete";
      nextLessonPath = "/game/marvel-rivals/academy";
    }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={require("../../assets/images/companions/snee.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>🐶 Snee</Text>
      <Text style={styles.subtitle}>The Companion Keeper</Text>
      <Text style={styles.level}>
  			⭐ Companion Level 1
			</Text>

			<View style={styles.xpContainer}>
  			<View style={styles.xpBar}>
    			<View style={styles.xpFill} />
  			</View>

  			<Text style={styles.xpText}>
    			25 / 100 XP
  			</Text>
			</View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📚 Academy Progress</Text>

        <View style={styles.xpBar}>
          <View
            style={[
              styles.xpFill,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>

        <Text style={styles.text}>
          Lessons Complete: {completedCount} / {totalLessons}
        </Text>

        <Text style={styles.text}>
          Current Rank: {academyRank}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>About Snee</Text>
        <Text style={styles.text}>
          Snee is the friendly guide companion of QuestBind. Snee helps players learn new games, understand guides, track progress, and feel confident while improving.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Snee’s Role</Text>
        <Text style={styles.text}>• Teaches beginner-friendly lessons.</Text>
        <Text style={styles.text}>• Explains confusing systems simply.</Text>
        <Text style={styles.text}>• Encourages progress over perfection.</Text>
        <Text style={styles.text}>• Helps players stay organised.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Snee’s Advice</Text>
        <Text style={styles.text}>• Stay with your team.</Text>
        <Text style={styles.text}>• Objectives matter more than eliminations.</Text>
        <Text style={styles.text}>• Learn one hero at a time.</Text>
        <Text style={styles.text}>• Ask “what did I learn?” after every match.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Expressions</Text>

        <View style={styles.expressionGrid}>
          {sneeExpressions.map((expression) => (
            <View key={expression.label} style={styles.expressionCard}>
              <Image
                source={expression.image}
                style={styles.expressionImage}
                resizeMode="contain"
              />
              <Text style={styles.expressionLabel}>{expression.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Favourite Activities</Text>
        <Text style={styles.text}>• Finding helpful guides.</Text>
        <Text style={styles.text}>• Collecting progress badges.</Text>
        <Text style={styles.text}>• Helping beginners choose heroes.</Text>
        <Text style={styles.text}>• Celebrating tiny wins.</Text>
      </View>

			<View style={styles.card}>
  			<Text style={styles.cardTitle}>Achievements Helped Unlock</Text>
  			<Text style={styles.text}>🏆 First Guide Read</Text>
  			<Text style={styles.text}>🏆 Academy Student</Text>
  			<Text style={styles.text}>🏆 Hero Collector</Text>
  			<Text style={styles.text}>🏆 Team Player</Text>
			</View>

			<View style={styles.card}>
  			<Text style={styles.cardTitle}>
    			How To Earn XP
  			</Text>

  			<Text style={styles.text}>
    			📖 Read a Guide (+5 XP)
  			</Text>

  			<Text style={styles.text}>
    			🎮 Open a Hero Page (+2 XP)
  			</Text>

  			<Text style={styles.text}>
    			🎓 Complete an Academy Lesson (+10 XP)
  			</Text>

  			<Text style={styles.text}>
    			🏆 Unlock an Achievement (+15 XP)
  			</Text>
			</View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fun Facts</Text>
        <Text style={styles.text}>• Snee believes every player can improve.</Text>
        <Text style={styles.text}>• Snee gets excited when you read a full guide.</Text>
        <Text style={styles.text}>• Snee loves organised collections.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  content: { padding: 20, paddingBottom: 40 },
  image: {
    width: "100%",
    height: 280,
    marginBottom: 16,
  },
	expressionGrid: {
  	flexDirection: "row",
  	flexWrap: "wrap",
  	gap: 12,
  	marginTop: 8,
	},
	xpContainer: {
  	marginBottom: 18,
	},
	xpBar: {
  	height: 12,
  	backgroundColor: "#0B244A",
  	borderRadius: 999,
  	overflow: "hidden",
	},
	xpFill: {
  	width: "25%",
  	height: "100%",
  	backgroundColor: "#60A5FA",
	},
	xpText: {
  	color: THEME.muted,
  	marginTop: 6,
  	fontWeight: "800",
	},
	expressionCard: {
  	width: 120,
  	backgroundColor: "#0B244A",
  	borderRadius: 18,
  	borderWidth: 1,
  	borderColor: THEME.border,
  	padding: 10,
  	alignItems: "center",
	},
	expressionImage: {
  	width: 80,
  	height: 80,
  	marginBottom: 8,
	},
	expressionLabel: {
  	color: THEME.text,
  	fontWeight: "900",
  	fontSize: 13,
  	textAlign: "center",
	},
  title: {
    color: THEME.text,
    fontSize: 38,
    fontWeight: "900",
  },
  subtitle: {
    color: THEME.primary,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 4,
  },
  level: {
    color: THEME.muted,
    fontWeight: "900",
    marginTop: 8,
    marginBottom: 18,
  },
  card: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },
  cardTitle: {
    color: THEME.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8,
  },
  text: {
    color: THEME.muted,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 4,
  },
});