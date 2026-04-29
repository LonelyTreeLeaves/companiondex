import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { supabase } from "../../lib/supabase";

function getDifficulty(content: string) {
  const match = content?.match(/Difficulty:\s*(.+)/i);
  return match ? match[1].trim() : "Unknown";
}

function getRole(content: string, summary: string) {
  const match = content?.match(/Role:\s*(.+)/i);
  if (match) return match[1].trim();

  if (summary?.toLowerCase().includes("strategist")) return "Strategist";
  if (summary?.toLowerCase().includes("vanguard")) return "Vanguard";
  if (summary?.toLowerCase().includes("duelist")) return "Duelist";

  return "Unknown";
}

function getAbilities(content: string) {
  if (!content) return [];

  const split = content.split("Abilities:");
  if (split.length < 2) return [];

  return split[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("•"))
    .map((line) => line.replace(/^•\s*/, ""));
}

function getSection(content: string, label: string) {
  if (!content) return "";

  const regex = new RegExp(
    `${label}:\\s*([\\s\\S]*?)(?=\\n[A-Z][A-Za-z ]+:|$)`,
    "i"
  );

  const match = content.match(regex);

  return match ? match[1].trim() : "";
}

function hasAdvancedProfile(content: string) {
  return content?.includes("Advanced Profile:");
}

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams();
  const [entry, setEntry] = useState<any>(null);
  const [teamUps, setTeamUps] = useState<any[]>([]);
  const [officialTeamUps, setOfficialTeamUps] = useState<any[]>([]);
  const [builds, setBuilds] = useState<any[]>([]);
  const [counters, setCounters] = useState<any[]>([]);

  useEffect(() => {
    loadEntry();
  }, [id]);

  async function loadEntry() {
    const { data, error } = await supabase
      .from("game_entries")
      .select("*, games(name)")
      .eq("id", id)
      .single();

    if (error) {
      console.log("Entry error:", error.message);
      return;
    }

    setEntry(data);

    if (data?.games?.name === "Marvel Rivals" && data?.category === "Heroes") {
      loadTeamUps(data.title);
      loadBuilds(data.title);
      loadCounters(data.title);
    }
  }

  async function loadTeamUps(heroName: string) {
    const { data, error } = await supabase
      .from("team_ups")
      .select("*")
      .or(
        'anchor_hero.ilike.%${heroName}%,partner_heroes.cs.{"${heroName}"}'
      );

    if (error) {
      console.log("Team-up error:", error.message);
      return;
    }

    setOfficialTeamUps(
      (data || []).filter((item) => item.source_name === "Official Team-Up")
    );

    setTeamUps(
      (data || []).filter((item) => item.source_name !== "Official Team-Up")
    );
  }

  async function loadBuilds(heroName: string) {
    const { data, error } = await supabase
      .from("hero_builds")
      .select("*")
      .eq("hero_name", heroName)
      .order("build_name");

    if (error) {
      console.log("Build error:", error.message);
      return;
    }

    setBuilds(data || []);
  }

  async function loadCounters(heroName: string) {
    const { data, error } = await supabase
      .from("hero_counters")
      .select("*")
      .eq("hero_name", heroName)
      .order("counter_name");

    if (error) {
      console.log("Counter error:", error.message);
      return;
    }

    setCounters(data || []);
  }

  if (!entry) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  const isHero = entry.category === "Heroes";
  const role = getRole(entry.content, entry.summary);
  const difficulty = getDifficulty(entry.content);
  const abilities = getAbilities(entry.content);
  const playstyle = getSection(entry.content, "Playstyle");
  const strengths = getSection(entry.content, "Strengths");
  const weaknesses = getSection(entry.content, "Weaknesses");
  const skillFloor = getSection(entry.content, "Skill Floor");
  const skillCeiling = getSection(entry.content, "Skill Ceiling");
  const bestMaps = getSection(entry.content, "Best Maps");
  const worstMaps = getSection(entry.content, "Worst Maps");
  const beginnerTip = getSection(entry.content, "Beginner Tip");
  const advancedTip = getSection(entry.content, "Advanced Tip");

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroCard}>
        {entry.image_url ? (
          <Image source={{ uri: entry.image_url }} style={styles.heroImage} />
        ) : (
          <View style={styles.initialBox}>
            <Text style={styles.initial}>{entry.title?.charAt(0)}</Text>
          </View>
        )}

        <View style={styles.heroText}>
          <Text style={styles.gameName}>{entry.games?.name}</Text>
          <Text style={styles.title}>{entry.title}</Text>
          <Text style={styles.category}>{entry.category}</Text>
        </View>
      </View>

      {isHero ? (
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>Role</Text>
            <Text style={styles.badgeValue}>{role}</Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>Difficulty</Text>
            <Text style={styles.badgeValue}>{difficulty}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.text}>{entry.summary || "No summary available."}</Text>
      </View>

      {isHero && abilities.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Abilities</Text>

          {abilities.map((ability, index) => {
            const [name, ...descParts] = ability.split(":");
            const desc = descParts.join(":").trim();

            return (
              <View key={`${ability}-${index}`} style={styles.abilityCard}>
                <Text style={styles.abilityName}>{name}</Text>
                {desc ? <Text style={styles.abilityText}>{desc}</Text> : null}
              </View>
            );
          })}
        </View>
      ) : null}

      {!isHero ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.text}>{entry.content || "No details available."}</Text>
        </View>
      ) : null}

      {isHero ? (
        <>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Recommended Teammates</Text>

            {teamUps.length === 0 ? (
              <Text style={styles.text}>No recommended teammates added for this hero yet.</Text>
            ) : (
              teamUps.map((teamUp) => (
                <View key={teamUp.id} style={styles.abilityCard}>
                  <Text style={styles.abilityName}>{teamUp.name}</Text>

                  <Text style={styles.abilityText}>
                    Main Hero: {teamUp.anchor_hero || "Unknown"}
                  </Text>

                  <Text style={styles.abilityText}>
                    Recommended Teammates: {teamUp.partner_heroes?.join(", ") || "Unknown"}
                  </Text>

                  <Text style={styles.abilityText}>
                    {teamUp.effect || "No effect details yet."}
                  </Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Official Team-Ups - Season 7.5</Text>

            {officialTeamUps.length === 0 ? (
              <Text style={styles.text}>No official team-ups added for this hero yet.</Text>
            ) : (
              officialTeamUps.map((teamUp) => (
                <View key={teamUp.id} style={styles.teamUpCard}>
                  <Text style={styles.teamUpName}>{teamUp.name}</Text>

                  <View style={styles.badgeSmall}>
                    <Text style={styles.badgeSmallText}>Season 7.5 Active</Text>
                  </View>

                  <Text style={styles.buildLabel}>Team Members</Text>
                  <Text style={styles.abilityText}>
                    {[teamUp.anchor_hero, ...(teamUp.partner_heroes || [])].join(" + ")}
                  </Text>

                  <Text style={styles.buildLabel}>Official Ability / Effect</Text>
                  <Text style={styles.abilityText}>
                    {teamUp.effect || "Official Marvel Rivals Team-Up."}
                  </Text>
                </View>
              ))
            )}
          </View>
        </>
      ) : null}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Official Team-Ups</Text>

          {officialTeamUps.length === 0 ? (
            <Text style={styles.text}>No official team-ups added for this hero yet.</Text>
          ) : (
            officialTeamUps.map((teamUp) => (
              <View key={teamUp.id} style={styles.abilityCard}>
                <Text style={styles.abilityName}>{teamUp.name}</Text>

                <Text style={styles.abilityText}>
                  Main Hero: {teamUp.anchor_hero || "Unknown"}
                </Text>

                <Text style={styles.abilityText}>
                  Linked Heroes: {teamUp.partner_heroes?.join(", ") || "Unknown"}
                </Text>

                <Text style={styles.abilityText}>
                  {teamUp.effect || "No effect details yet."}
                </Text>
              </View>
            ))
          )}
        </View>
      ) : null}

      {isHero && hasAdvancedProfile(entry.content) ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Advanced Profile</Text>

          <View style={styles.abilityCard}>
            <Text style={styles.abilityName}>Playstyle</Text>
            <Text style={styles.abilityText}>{playstyle}</Text>

            <Text style={styles.abilityName}>Strengths</Text>
            <Text style={styles.abilityText}>{strengths}</Text>

            <Text style={styles.abilityName}>Weaknesses</Text>
            <Text style={styles.abilityText}>{weaknesses}</Text>

            <Text style={styles.abilityName}>Skill Floor</Text>
            <Text style={styles.abilityText}>{skillFloor}</Text>

            <Text style={styles.abilityName}>Skill Ceiling</Text>
            <Text style={styles.abilityText}>{skillCeiling}</Text>

            <Text style={styles.abilityName}>Best Maps</Text>
          <Text style={styles.abilityText}>{bestMaps}</Text>

          <Text style={styles.abilityName}>Worst Maps</Text>
          <Text style={styles.abilityText}>{worstMaps}</Text>

          <Text style={styles.abilityName}>Beginner Tip</Text>
          <Text style={styles.abilityText}>{beginnerTip}</Text>

          <Text style={styles.abilityName}>Advanced Tip</Text>
          <Text style={styles.abilityText}>{advancedTip}</Text>
        </View>
      </View>
    ) : null}


      {isHero ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Builds</Text>

          {builds.length === 0 ? (
            <Text style={styles.text}>No builds added for this hero yet.</Text>
          ) : (
            builds.map((build) => (
              <View key={build.id} style={styles.abilityCard}>
                <Text style={styles.abilityName}>{build.build_name}</Text>

                <Text style={styles.buildLabel}>Playstyle</Text>
                <Text style={styles.abilityText}>{build.playstyle}</Text>

                <Text style={styles.buildLabel}>Strengths</Text>
                <Text style={styles.abilityText}>{build.strengths}</Text>

                <Text style={styles.buildLabel}>Weaknesses</Text>
                <Text style={styles.abilityText}>{build.weaknesses}</Text>

                <Text style={styles.buildLabel}>Tips</Text>
                <Text style={styles.abilityText}>{build.tips}</Text>
              </View>
            ))
          )}
        </View>
      ) : null}

      {isHero ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Counters</Text>

          {counters.length === 0 ? (
            <Text style={styles.text}>No counter notes added for this hero yet.</Text>
          ) : (
            counters.map((counter) => (
              <View key={counter.id} style={styles.abilityCard}>
                <Text style={styles.abilityName}>
                  Counter: {counter.counter_name}
                </Text>

                <Text style={styles.abilityText}>{counter.reason}</Text>

                <Text style={styles.buildLabel}>
                  Difficulty: {counter.difficulty || "Unknown"}
                </Text>
              </View>
            ))
          )}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    backgroundColor: "#020617",
  },
  heroCard: {
    backgroundColor: "#0F172A",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 18,
    marginTop: 34,
    marginBottom: 16,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  heroImage: {
    width: 110,
    height: 110,
    borderRadius: 26,
    backgroundColor: "#1E293B",
  },
  initialBox: {
    width: 110,
    height: 110,
    borderRadius: 26,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    fontSize: 42,
    color: "#A5B4FC",
    fontWeight: "900",
  },
  heroText: {
    flex: 1,
  },
  gameName: {
    color: "#818CF8",
    fontWeight: "900",
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#F8FAFC",
  },
  category: {
    color: "#A5B4FC",
    fontWeight: "900",
    marginTop: 8,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  badge: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 16,
  },
  badgeLabel: {
    color: "#94A3B8",
    fontWeight: "800",
    marginBottom: 4,
  },
  badgeValue: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "900",
  },
  card: {
    backgroundColor: "#0F172A",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
  },
  text: {
    color: "#CBD5E1",
    lineHeight: 24,
    fontSize: 15,
  },
  abilityCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  abilityName: {
    color: "#A5B4FC",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },
  teamUpCard: {
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#4F46E5",
  },
  teamUpName: {
    color: "#F8FAFC",
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 8,
  },
  badgeSmall: {
    alignSelf: "flex-start",
    backgroundColor: "#312E81",
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  badgeSmallText: {
    color: "#C7D2FE",
    fontWeight: "900",
    fontSize: 12,
  },
  abilityText: {
    color: "#CBD5E1",
    lineHeight: 22,
    marginBottom: 8,
  },
  buildLabel: {
    color: "#F8FAFC",
    fontWeight: "900",
    marginTop: 8,
    marginBottom: 4,
  },
});
