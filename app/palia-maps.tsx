import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

const locations = [
  "Kilima Rivers",
  "Kilima Lakes",
  "Kilima Ponds",
  "Bahari Coast",
  "Bahari Rivers",
  "Bahari Bay",
  "Caves",
];

export default function PaliaMapsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Palia Location Maps</Text>
      <Text style={styles.subtitle}>Find fish, bugs and resources by area.</Text>

      {locations.map((location) => (
        <Pressable
          key={location}
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: "/palia-location",
              params: { location },
            })
          }
        >
          <Text style={styles.locationName}>📍 {location}</Text>
          <Text style={styles.locationSubText}>
            View fish and bugs found here →
          </Text>
        </Pressable>
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
  locationName: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 6,
  },
  locationSubText: {
    color: "#A5B4FC",
    fontWeight: "800",
  },
});