import { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME = {
  background: "#12051F",
  card: "#190B2D",
  border: "#A855F7",
  primary: "#D8B4FE",
  text: "#F8FAFC",
  muted: "#E9D5FF",
};

const bussExpressions = [
  {
    label: "Secretive",
    image: require("../../assets/images/companions/expressions/buss-secretive.png"),
  },
  {
    label: "Confident",
    image: require("../../assets/images/companions/expressions/buss-confident.png"),
  },
  {
    label: "Thinking",
    image: require("../../assets/images/companions/expressions/buss-thinking.png"),
  },
  {
    label: "Discovery",
    image: require("../../assets/images/companions/expressions/buss-discovery.png"),
  },
];

export default function BussProfile() {
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
    totalLessons === 0
      ? 0
      : Math.round((completedCount / totalLessons) * 100);

  let academyRank = "Recruit";

  const secretsUnlocked =
  (completedCount >= 3 ? 1 : 0) +
  (completedCount >= 6 ? 1 : 0) +
  (completedCount >= 9 ? 1 : 0) +
  (completedCount >= totalLessons ? 1 : 0);

  if (completedCount >= 3) academyRank = "Student";
  if (completedCount >= 6) academyRank = "Graduate";
  if (completedCount >= 9) academyRank = "Veteran";
  if (completedCount >= totalLessons) academyRank = "Master";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={require("../../assets/images/companions/buss.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>🐱 Buss</Text>
      <Text style={styles.subtitle}>Keeper of Secrets</Text>
      <Text style={styles.level}>
  			🔮 Companion Level 1
			</Text>

			<View style={styles.xpContainer}>
  			<View style={styles.xpBar}>
    			<View
      			style={[
        			styles.xpFill,
        			{
          			backgroundColor: "#A855F7",
          			width: "15%",
        			},
      			]}
    			/>
  			</View>

  			<Text style={styles.xpText}>
    			15 / 100 XP
  			</Text>
			</View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔮 Academy Secrets</Text>

        <View style={styles.xpBar}>
          <View
            style={[
              styles.xpFill,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>

        <Text style={styles.text}>
          Secrets Unlocked: {secretsUnlocked} / 4
        </Text>

        <Text style={styles.text}>
          Secret Rank: {academyRank}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          🔐 Secret Vault
        </Text>

        <Text style={styles.text}>
          {completedCount >= 3
            ? "✅ Secret #1: Positioning wins more fights than aim."
            : "🔒 Complete 3 lessons"}
        </Text>

        <Text style={styles.text}>
          {completedCount >= 6
            ? "✅ Secret #2: Team compositions decide matches."
            : "🔒 Complete 6 lessons"}
        </Text>

        <Text style={styles.text}>
          {completedCount >= 9
            ? "✅ Secret #3: Ult economy separates advanced players."
            : "🔒 Complete 9 lessons"}
        </Text>

        <Text style={styles.text}>
          {completedCount >= totalLessons
            ? "✅ Secret #4: Knowledge is the ultimate counter."
            : "🔒 Complete every lesson"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>About Buss</Text>
        <Text style={styles.text}>
          Buss is the mysterious secret keeper of QuestBind. Buss appears when there is hidden knowledge, advanced strategy, rare information, or something clever worth discovering.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Buss’s Role</Text>
        <Text style={styles.text}>• Reveals advanced tips.</Text>
        <Text style={styles.text}>• Guards hidden achievements.</Text>
        <Text style={styles.text}>• Explains secret mechanics.</Text>
        <Text style={styles.text}>• Helps players think one step deeper.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Expressions</Text>

        <View style={styles.expressionGrid}>
          {bussExpressions.map((expression) => (
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
        <Text style={styles.cardTitle}>Buss’s Secrets</Text>
        <Text style={styles.text}>• Positioning wins more fights than aim.</Text>
        <Text style={styles.text}>• Team composition matters more than people realise.</Text>
        <Text style={styles.text}>• Most losses happen because players stagger.</Text>
        <Text style={styles.text}>• Hidden knowledge turns good players into great ones.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Secret Vault</Text>
        <Text style={styles.text}>🔒 Secret #1: Objectives create pressure.</Text>
        <Text style={styles.text}>🔒 Secret #2: Ultimates are strongest when combined.</Text>
        <Text style={styles.text}>🔒 Secret #3: Surviving is often better than chasing.</Text>
      </View>

			<View style={styles.card}>
  			<Text style={styles.cardTitle}>Secret Discoveries</Text>
  			<Text style={styles.text}>🔒 Hidden Knowledge</Text>
  			<Text style={styles.text}>🔒 Counter Master</Text>
  			<Text style={styles.text}>🔒 Meta Scholar</Text>
  			<Text style={styles.text}>🔒 Secret Hunter</Text>
			</View>

			<View style={styles.card}>
  			<Text style={styles.cardTitle}>
    			Secret XP Sources
  			</Text>

  			<Text style={styles.text}>
    			🔒 Discover a Secret (+5 XP)
  			</Text>

  			<Text style={styles.text}>
    			🔮 Read Advanced Guides (+10 XP)
  			</Text>

  			<Text style={styles.text}>
    			🧠 Learn a Counter Matchup (+5 XP)
  			</Text>

  			<Text style={styles.text}>
    			🐱 Find Hidden Knowledge (+15 XP)
  			</Text>
			</View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fun Facts</Text>
        <Text style={styles.text}>• Buss knows more than they admit.</Text>
        <Text style={styles.text}>• Buss loves hidden mechanics and easter eggs.</Text>
        <Text style={styles.text}>• Buss appears when a secret is nearby.</Text>
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
	xpContainer: {
  	marginBottom: 18,
	},
	xpBar: {
    height: 12,
    backgroundColor: "#0B244A",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 10,
  },
  xpFill: {
    height: "100%",
    backgroundColor: THEME.primary,
	},
	xpText: {
  	color: THEME.muted,
  	marginTop: 6,
  	fontWeight: "800",
	},
	expressionGrid: {
  	flexDirection: "row",
  	flexWrap: "wrap",
  	gap: 12,
  	marginTop: 8,
	},
	expressionCard: {
  	width: 120,
  	backgroundColor: "#241039",
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