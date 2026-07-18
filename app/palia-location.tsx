import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { paliaMapImages } from "../constants/paliaMapImages";
import { supabase } from "../lib/supabase";
import { paliaFishImages } from "../constants/paliaFishImages";

function getRarityColor(rarity: string) {
  switch (rarity?.toLowerCase()) {
    case "common":
      return "#94A3B8";
    case "uncommon":
      return "#22C55E";
    case "rare":
      return "#3B82F6";
    case "epic":
      return "#A855F7";
    case "legendary":
      return "#F59E0B";
    default:
      return "#CBD5E1";
  }
}

export default function PaliaLocationScreen() {
  const { location } = useLocalSearchParams();

  const [fish, setFish] = useState<any[]>([]);
  const [bugs, setBugs] = useState<any[]>([]);
  const [activeTime, setActiveTime] = useState("All");

  useEffect(() => {
    loadLocationData();
  }, []);

  async function loadLocationData() {
    const { data: fishData } = await supabase
      .from("palia_fish")
      .select("*")
      .ilike("location", `%${location}%`);

    const { data: bugData } = await supabase
      .from("palia_bugs")
      .select("*")
      .ilike("location", `%${location}%`);

    setFish(fishData || []);
    setBugs(bugData || []);
  }

  const timeFilters = ["All", "Morning", "Day", "Evening", "Night", "Any Time"];

  <View style={styles.tipBox}>
    <Text style={styles.tipTitle}>Best Farming Tip</Text>
    <Text style={styles.tipText}>
      Use the filters above to check what appears at each time of day. Rare and Epic items are usually the highest priority.
    </Text>
  </View>

  const filteredFish =
    activeTime === "All"
      ? fish
      : fish.filter((item) =>
          item.time_of_day?.toLowerCase().includes(activeTime.toLowerCase())
        );

  const filteredBugs =
    activeTime === "All"
      ? bugs
      : bugs.filter((item) =>
          item.time_of_day?.toLowerCase().includes(activeTime.toLowerCase())
        );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📍 {location}</Text>
      {paliaMapImages[String(location)] ? (
        <Image
          source={paliaMapImages[String(location)]}
          style={styles.mapImage}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>Map image coming soon</Text>
        </View>
      )}

      <View style={styles.filterRow}>
        {timeFilters.map((time) => (
          <Pressable
            key={time}
            style={[
              styles.filterButton,
              activeTime === time && styles.filterButtonActive,
            ]}
            onPress={() => setActiveTime(time)}
          >
            <Text style={styles.filterButtonText}>{time}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>🎣 Fish</Text>

      {fish.length === 0 ? (
        <Text style={styles.emptyText}>
          No fish found.
        </Text>
      ) : (
        filteredFish.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.rowCard}>
              <Image
                source={paliaFishImages[item.name]}
                style={styles.thumbnail}
                resizeMode="contain"
              />

              <View style={styles.rowContent}>
                <Text style={styles.itemName}>
                  {item.caught ? "✅" : "☐"} {item.name}
                </Text>

                <Text
                  style={[
                    styles.detail,
                    { color: getRarityColor(item.rarity) },
                  ]}
                >
                  Rarity: {item.rarity}
                </Text>

                <Text style={styles.detail}>
                  Time: {item.time_of_day}
                </Text>

                <Text style={styles.detail}>
                  Bait: {item.bait}
                </Text>
              </View>
            </View>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>🐞 Bugs</Text>

      {bugs.length === 0 ? (
        <Text style={styles.emptyText}>
          No bugs found.
        </Text>
      ) : (
        filteredBugs.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.itemName}>
              {item.name}
            </Text>

            <Text style={styles.detail}>
              Rarity: {item.rarity}
            </Text>

            <Text style={styles.detail}>
              Time: {item.time_of_day}
            </Text>
          </View>
        ))
      )}
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
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 18,
  },

  sectionTitle: {
    color: "#A5B4FC",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 24,
    marginBottom: 16,
  },

  mapImage: {
    width: "100%",
    height: 320,
    borderRadius: 22,
    marginBottom: 18,
    backgroundColor: "#0F172A",
  },

  mapPlaceholder: {
    height: 160,
    backgroundColor: "#0F172A",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  mapPlaceholderText: {
    color: "#64748B",
    fontWeight: "900",
  },

  rowCard: {
    flexDirection: "row",
    alignItems: "center",
  },

  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: "#1E293B",
    marginRight: 14,
  },

  rowContent: {
    flex: 1,
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },

  filterButton: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  filterButtonActive: {
    backgroundColor: "#4F46E5",
    borderColor: "#818CF8",
  },

  filterButtonText: {
    color: "#F8FAFC",
    fontWeight: "800",
  },

  tipBox: {
    backgroundColor: "#111827",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 14,
    marginBottom: 18,
  },

  tipTitle: {
    color: "#F8FAFC",
    fontWeight: "900",
    marginBottom: 6,
  },

  tipText: {
    color: "#CBD5E1",
    lineHeight: 22,
  },

  card: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
  },

  itemName: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 6,
  },

  detail: {
    color: "#CBD5E1",
    marginBottom: 2,
  },

  emptyText: {
    color: "#64748B",
    marginBottom: 18,
  },
});