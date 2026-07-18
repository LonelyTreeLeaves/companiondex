import { ScrollView, View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { guides } from "../../../../data/guides";

const MARVEL = {
  background: "#170202",
  backgroundDark: "#080101",
  card: "#260606",
  cardSoft: "#3B0A0A",
  border: "#7F1D1D",
  primary: "#EF4444",
  primaryDark: "#991B1B",
  text: "#FFF7F7",
  muted: "#FECACA",
};

export default function GuidesScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>QuestBind Academy</Text>
      <Text style={styles.title}>Guides</Text>
      <Text style={styles.subtitle}>
        Learn the basics, understand team roles, improve positioning, and build better game sense.
      </Text>

      {guides.map((guide) => (
        <Pressable
          key={guide.id}
          style={styles.card}
          onPress={() => router.push(`/game/marvel-rivals/guides/${guide.id}`)}
        >
          {guide.banner && (
            <Image
              source={guide.banner}
              style={styles.guideBanner}
              resizeMode="cover"
            />
          )}

          <Text style={styles.icon}>{guide.icon}</Text>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{guide.title}</Text>
            <Text style={styles.cardDescription}>{guide.description}</Text>

            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{guide.level}</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MARVEL.background,
  },
  content: {
    padding: 22,
    paddingBottom: 40,
  },
  eyebrow: {
    color: "#EF4444",
    fontWeight: "900",
    marginBottom: 8,
  },
  title: {
    color: MARVEL.text,
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 8,
  },
  subtitle: {
    color: MARVEL.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 22,
  },
  card: {
    backgroundColor: MARVEL.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: MARVEL.border,
    padding: 16,
    marginBottom: 18,
  },
  icon: {
    fontSize: 32,
  },
  cardTitle: {
    color: MARVEL.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 6,
  },
  guideBanner: {
    width: "100%",
    height: 260,
    borderRadius: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: MARVEL.border,
    backgroundColor: MARVEL.backgroundDark,
  },
  cardDescription: {
    color: MARVEL.muted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 10,
  },
  levelBadge: {
    alignSelf: "flex-start",
    backgroundColor: MARVEL.primaryDark,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  levelText: {
    color: MARVEL.muted,
    fontSize: 12,
    fontWeight: "900",
  },
});