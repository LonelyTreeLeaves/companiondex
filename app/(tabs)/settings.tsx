import { ScrollView, View, Text, StyleSheet } from "react-native";

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.subtitle}>
        Manage CompanionDex options and future app features.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Favourite Games</Text>
        <Text style={styles.cardText}>
          Later this will let users choose which games appear on the Home screen.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Data Sources</Text>
        <Text style={styles.cardText}>
          Future setup for APIs, wiki data, guide indexes, and source syncing.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account</Text>
        <Text style={styles.cardText}>
          Later this will connect to Supabase login so notes and trackers save per user.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Offline Mode</Text>
        <Text style={styles.cardText}>
          Future feature to keep saved database entries available without internet.
        </Text>
      </View>
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
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#0F172A",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#F8FAFC",
    marginBottom: 8,
  },
  cardText: {
    color: "#CBD5E1",
    lineHeight: 22,
  },
});
