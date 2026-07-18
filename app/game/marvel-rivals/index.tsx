import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function MarvelRivalsHome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marvel Rivals</Text>

      <Pressable
        style={styles.card}
        onPress={() => router.push("/game/marvel-rivals/guides")}
      >
        <Text style={styles.cardTitle}>Guides</Text>
        <Text style={styles.cardText}>
          Learn roles, positioning, objectives, and beginner tips.
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 24,
  },
  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#0F172A",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },
  cardText: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 22,
  },
});