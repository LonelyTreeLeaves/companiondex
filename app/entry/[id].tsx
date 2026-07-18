import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { supabase } from "../../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { heroPortraits } from "../../lib/heroPortraits";
import { heroBanners } from "../../lib/heroBanners";

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

const roleColors: Record<string, string> = {
  Vanguard: "#e63946",
  Duelist: "#3a86ff",
  Strategist: "#8338ec",
};

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
  return getBulletSection(content, "Abilities");
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

function getBulletSection(content: string, label: string) {
  const section = getSection(content, label);
  if (!section) return [];

  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("•"))
    .map((line) => line.replace(/^•\s*/, ""));
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [openSections, setOpenSections] = useState({
    abilities: true,
    ultimate: true,
    passives: false,
    teamUpsParsed: false,
    builds: false,
    counters: false,
    team: false,
    official: false,

    lore: false,
    skins: false,
    combos: true,
    howToPlay: true,
    matchups: true,
    stats: true,
    quickTips: true,
  });

  function toggleSection(section: string) {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }

  useEffect(() => {
    loadEntry();
  }, [id]);

  useEffect(() => {
    async function loadFavorite() {
      try {
        if (!entry?.id) return;

        const stored = await AsyncStorage.getItem("favorites");
        const favs = stored ? JSON.parse(stored) : [];

        setIsFavorite(favs.includes(String(entry.id)));
      } catch (error) {
        console.log("Favorite load error:", error);
      }
    }

    loadFavorite();
  }, [entry?.id]);

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
      .eq("source_name", "Official Team-Up");

    if (error) {
      console.log("Team-up error:", error.message);
      return;
    }

    const matchingTeamUps = (data || []).filter((teamUp) => {
      const anchorMatch =
        teamUp.anchor_hero?.toLowerCase().trim() === heroName.toLowerCase().trim();

      const partnerMatch =
        teamUp.partner_heroes?.some(
          (hero: string) =>
            hero.toLowerCase().trim() === heroName.toLowerCase().trim()
        );

      return anchorMatch || partnerMatch;
    });

    setOfficialTeamUps(matchingTeamUps);
    setTeamUps([]);
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
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingTitle}>Loading hero data...</Text>
        <Text style={styles.loadingText}>Preparing guide, builds, counters and team-ups.</Text>
      </View>
    );
  }

  const isHero = entry.category === "Heroes";
  const role = getRole(entry.content, entry.summary);
  const difficulty = getDifficulty(entry.content);
  const patch = getSection(entry.content, "Patch");
  const abilities = getAbilities(entry.content);
  const ultimates = getBulletSection(entry.content, "Ultimate");
  const passives = getBulletSection(entry.content, "Passives");
  const teamUpsParsed = getBulletSection(entry.content, "Team-Ups");
  const playstyle = getSection(entry.content, "Playstyle");
  const strengths = getSection(entry.content, "Strengths");
  const weaknesses = getSection(entry.content, "Weaknesses");
  const skillFloor = getSection(entry.content, "Skill Floor");
  const skillCeiling = getSection(entry.content, "Skill Ceiling");
  const bestMaps = getSection(entry.content, "Best Maps");
  const worstMaps = getSection(entry.content, "Worst Maps");
  const beginnerTip = getSection(entry.content, "Beginner Tip");
  const advancedTip = getSection(entry.content, "Advanced Tip");
  const lore = getSection(entry.content, "Lore");
  const combos = getSection(entry.content, "Combos");
  const skins = getSection(entry.content, "Skins");
  const howToPlay = getBulletSection(entry.content, "How To Play");
  const teamUpsText = getSection(entry.content, "Team-Ups");
  const recommendedTeammates = getSection(entry.content, "Recommended Teammates");
  const strongAgainst = getSection(entry.content, "Strong Against");
  const weakAgainst = getSection(entry.content, "Weak Against");
  const healthRating = getSection(entry.content, "Health Rating");
  const damageRating = getSection(entry.content, "Damage Rating");
  const mobilityRating = getSection(entry.content, "Mobility Rating");
  const utilityRating = getSection(entry.content, "Utility Rating");
  const survivabilityRating = getSection(entry.content, "Survivability Rating");
  const quickTips = getBulletSection(entry.content, "Quick Tips");

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 10 }}>
      {heroBanners[entry.title] && (
        <Image
          source={heroBanners[entry.title]}
          style={styles.banner}
          resizeMode="cover"
        />
      )}

      <View style={styles.heroCard}>
        <Image
          source={
            heroPortraits[entry.title]
              ? heroPortraits[entry.title]
              : entry.image_url
                ? { uri: entry.image_url }
                : require("../../assets/images/heroes/placeholder.png")
          }
          style={styles.heroImage}
        />

        <View style={styles.heroText}>
          <Text style={styles.gameName}>{entry.games?.name}</Text>

          <Text style={styles.title}>{entry.title}</Text>

          <Text style={styles.category}>{entry.category}</Text>
          {isHero && (
            <View style={styles.headerTags}>
              <View
                style={[
                  styles.rolePill,
                  { backgroundColor: roleColors[role] || "#334155" },
                ]}
              >
                <Text style={styles.rolePillText}>
                  {role}
                </Text>
              </View>

              <View style={styles.patchPill}>
                <Text style={styles.patchPillText}>
                  {patch || "Current Patch"}
                </Text>
              </View>

              <View style={styles.difficultyPill}>
                <Text style={styles.difficultyPillText}>
                  {difficulty}
                </Text>
              </View>
            </View>
          )}

          {isHero && (
            <Pressable 
              onPress={async () => {
                try {
                  const heroId = String(entry.id);
                  const newValue = !isFavorite;

                  const stored = await AsyncStorage.getItem("favorites");
                  let favs = stored ? JSON.parse(stored) : [];

                  if (newValue) {
                    if (!favs.includes(heroId)) {
                      favs.push(heroId);
                    }
                  } else {
                    favs = favs.filter((favId: string) => favId !== heroId);
                  }

                  await AsyncStorage.setItem("favorites", JSON.stringify(favs));
                  setIsFavorite(newValue);

                  console.log("Saved favorites:", favs);
                } catch (error) {
                  console.log("Favorite save error:", error);
                }
              }}
            >
              <Text style={styles.favoriteButton}>
                {isFavorite ? "★ Favorited" : "☆ Add to Favorites"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
      
      {isHero && (
        <View style={styles.card}>
          <Text style={styles.sectionEyebrow}>Stats</Text>

          <Pressable onPress={() => toggleSection("stats")}>
            <Text style={styles.sectionTitle}>
              Hero Ratings {openSections.stats ? "▲" : "▼"}
            </Text>
          </Pressable>

          {openSections.stats && (
            <View style={styles.statGrid}>
              <View style={styles.statBox}>
                <Text style={styles.badgeLabel}>Health</Text>
                <Text style={styles.badgeValue}>
                  {healthRating || "?"}/10
                </Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.badgeLabel}>Damage</Text>
                <Text style={styles.badgeValue}>
                  {damageRating || "?"}/10
                </Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.badgeLabel}>Mobility</Text>
                <Text style={styles.badgeValue}>
                  {mobilityRating || "?"}/10
                </Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.badgeLabel}>Utility</Text>
                <Text style={styles.badgeValue}>
                  {utilityRating || "?"}/10
                </Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.badgeLabel}>Survivability</Text>
                <Text style={styles.badgeValue}>
                  {survivabilityRating || "?"}/10
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.text}>
          {getSection(entry.content, "Summary") ||
            entry.summary ||
              "No summary available."}
        </Text>
      </View>

      {isHero && howToPlay.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionEyebrow}>Companion Guide</Text>

          <Pressable onPress={() => toggleSection("howToPlay")}>
            <Text style={styles.sectionTitle}>
              How To Play {openSections.howToPlay ? "▲" : "▼"}
            </Text>
          </Pressable>

          {openSections.howToPlay && (
            <>
              {howToPlay.map((tip, index) => (
                <View key={index} style={styles.tipBox}>
                  <Text style={styles.text}>• {tip}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      )}

      {isHero && quickTips.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionEyebrow}>
            Fast Advice
          </Text>

          <Pressable onPress={() => toggleSection("quickTips")}>
            <Text style={styles.sectionTitle}>
              Quick Tips {openSections.quickTips ? "▲" : "▼"}
            </Text>
          </Pressable>

          {openSections.quickTips && (
            <>
              {quickTips.map((tip, index) => (
                <View key={index} style={styles.tipBox}>
                  <Text style={styles.text}>
                    • {tip}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>
      )}

      {isHero && lore && (
        <View style={styles.card}>
          <Text style={styles.sectionEyebrow}>Story</Text>

          <Pressable onPress={() => toggleSection("lore")}>
            <Text style={styles.sectionTitle}>
              Lore {openSections.lore ? "▲" : "▼"}
            </Text>
          </Pressable>

          {openSections.lore && (
            <Text style={styles.text}>{lore}</Text>
          )}
        </View>
      )}

      {isHero && skins && (
        <View style={styles.card}>
          <Text style={styles.sectionEyebrow}>Cosmetics</Text>

          <Pressable onPress={() => toggleSection("skins")}>
            <Text style={styles.sectionTitle}>
              Skins {openSections.skins ? "▲" : "▼"}
            </Text>
          </Pressable>

          {openSections.skins && (
            <>
              {skins.split("\n").map((skin, index) => (
                <View key={index} style={styles.abilityCard}>
                  <Text style={styles.abilityText}>{skin}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      )}

      {isHero && hasAdvancedProfile(entry.content) && (
        <View style={styles.card}>
          <Text style={styles.sectionEyebrow}>Strategy</Text>
          <Text style={styles.sectionTitle}>Hero Guide</Text>

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
      )}

{isHero && abilities.length > 0 && (
  <View style={styles.card}>
    <Text style={styles.sectionEyebrow}>Kit</Text>
    
    <Pressable onPress={() => toggleSection("abilities")}>
      <Text style={styles.sectionTitle}>
        Abilities {openSections.abilities ? "▲" : "▼"}
      </Text>
    </Pressable>

    {openSections.abilities && (
      <>
        {abilities.map((ability, index) => {
          const cleaned = ability.replace(/^•\s*/, "");
          const [name, ...descParts] = cleaned.split(":");
          const desc = descParts.join(":").trim();

          return (
            <View key={`${ability}-${index}`} style={styles.abilityCard}>
              <Text style={styles.abilityName}>{name}</Text>
              {desc && <Text style={styles.abilityText}>{desc}</Text>}
            </View>
          );
        })}
      </>
    )}
  </View>
)}

{isHero && ultimates.length > 0 && (
  <View style={styles.card}>
    <Text style={styles.sectionEyebrow}>Kit</Text>

    <Pressable onPress={() => toggleSection("ultimate")}>
      <Text style={styles.sectionTitle}>
        Ultimate {openSections.ultimate ? "▲" : "▼"}
      </Text>
    </Pressable>

    {openSections.ultimate && (
      <>
        {ultimates.map((ability, index) => {
          const [name, ...descParts] = ability.split(":");
          const desc = descParts.join(":").trim();

          return (
            <View key={`${ability}-${index}`} style={styles.abilityCard}>
              <Text style={styles.abilityName}>{name}</Text>
              {desc && <Text style={styles.abilityText}>{desc}</Text>}
            </View>
          );
        })}
      </>
    )}
  </View>
)}

{isHero && passives.length > 0 && (
  <View style={styles.card}>
    <Text style={styles.sectionEyebrow}>Kit</Text>

    <Pressable onPress={() => toggleSection("passives")}>
      <Text style={styles.sectionTitle}>
        Passives {openSections.passives ? "▲" : "▼"}
      </Text>
    </Pressable>

    {openSections.passives && (
      <>
        {passives.map((ability, index) => {
          const [name, ...descParts] = ability.split(":");
          const desc = descParts.join(":").trim();

          return (
            <View key={`${ability}-${index}`} style={styles.abilityCard}>
              <Text style={styles.abilityName}>{name}</Text>
              {desc && <Text style={styles.abilityText}>{desc}</Text>}
            </View>
          );
        })}
      </>
    )}
  </View>
)}

{isHero && teamUpsParsed.length > 0 && (
  <View style={styles.card}>
    <Text style={styles.sectionEyebrow}>Kit</Text>

    <Pressable onPress={() => toggleSection("teamUpsParsed")}>
      <Text style={styles.sectionTitle}>
        Synergy Team-Ups {openSections.teamUpsParsed ? "▲" : "▼"}
      </Text>
    </Pressable>

    {openSections.teamUpsParsed && (
      <>
        {teamUpsParsed.map((ability, index) => {
          const [name, ...descParts] = ability.split(":");
          const desc = descParts.join(":").trim();

          return (
            <View key={`${ability}-${index}`} style={styles.abilityCard}>
              <Text style={styles.abilityName}>{name}</Text>

              {desc && (
                <Text style={styles.abilityText}>{desc}</Text>
              )}
            </View>
          );
        })}
      </>
    )}
  </View>
)}
      {!isHero ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Details</Text>

          {entry.content ? (
            entry.content.split("\n").map((line: string, index: number) => (
              <Text key={index} style={styles.text}>
                {line}
              </Text>
            ))
          ) : (
            <Text style={styles.emptyText}>No details available.</Text>
          )}
        </View>
      ) : null}

            {isHero && teamUps.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.sectionEyebrow}>Team Building</Text>

                <Pressable onPress={() => toggleSection("team")}>
                  <Text style={styles.sectionTitle}>
                    Recommended Teammates {openSections.team ? "▲" : "▼"}
                  </Text>
                </Pressable>

                {openSections.team && (
                  <>
                    {teamUps.map((teamUp) => (
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
                    ))}
                  </>
                )}
              </View>
            )}

            {isHero && officialTeamUps.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.sectionEyebrow}>Official</Text>

                <Pressable onPress={() => toggleSection("official")}>
                  <Text style={styles.sectionTitle}>
                    Official Team-Ups - {patch || "Current Season"}
                  </Text>
                </Pressable>

                {openSections.official && (
                  <>
                    {officialTeamUps.map((teamUp) => (
                      <View key={teamUp.id} style={styles.teamUpCard}>
                        <Text style={styles.teamUpTitle}>{teamUp.name}</Text>
                        <Text style={styles.teamUpSeason}>Season 7.5 Active</Text>

                        <Text style={styles.buildLabel}>Team Members</Text>
                        <Text style={styles.abilityText}>
                          {[teamUp.anchor_hero, ...(teamUp.partner_heroes || [])].join(" + ")}
                        </Text>

                        <Text style={styles.buildLabel}>Ability Effect</Text>
                        <Text style={styles.abilityText}>
                          {teamUp.effect || "Official Marvel Rivals Team-Up."}
                        </Text>
                      </View>
                    ))}
                  </>
                )}
              </View>
            )}

            {isHero && recommendedTeammates && (
              <View style={styles.card}>
                <Text style={styles.sectionEyebrow}>Synergy</Text>

                <Text style={styles.sectionTitle}>
                  Recommended Teammates
                </Text>

                <Text style={styles.text}>
                  {recommendedTeammates}
                </Text>
              </View>
            )}

      {isHero && combos && (
        <View style={styles.card}>
          <Text style={styles.sectionEyebrow}>Gameplay</Text>

          <Pressable onPress={() => toggleSection("combos")}>
            <Text style={styles.sectionTitle}>
              Combos {openSections.combos ? "▲" : "▼"}
            </Text>
          </Pressable>

          {openSections.combos && (
            <>
              {combos
                .split("\n")
                .filter((combo) => combo.trim().length > 0)
                .map((combo, index) => {
                  const [difficultyRaw, comboTextRaw] = combo.split("|");
                  const difficulty = difficultyRaw?.trim() || "Combo";
                  const comboText = comboTextRaw?.trim() || combo.trim();

                  return (
                    <View key={index} style={styles.abilityCard}>
                      <View style={styles.comboRow}>
                        <View
                          style={[
                            styles.comboBadge,
                            difficulty.includes("Easy")
                              ? styles.easyBadge
                              : difficulty.includes("Medium")
                              ? styles.mediumBadge
                              : difficulty.includes("Hard")
                              ? styles.hardBadge
                              : styles.mediumBadge,
                          ]}
                        >
                          <Text style={styles.comboBadgeText}>{difficulty}</Text>
                        </View>

                        <Text style={styles.comboText}>{comboText}</Text>
                      </View>
                    </View>
                  );
                })}
            </>
          )}
        </View>
      )}

      {isHero && builds.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionEyebrow}>Playstyles</Text>

          <Pressable onPress={() => toggleSection("builds")}>
            <Text style={styles.sectionTitle}>
              Builds {openSections.builds ? "▲" : "▼"}
            </Text>
          </Pressable>

          {openSections.builds && (
            <>
              {builds.map((build) => (
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
              ))}
            </>
          )}
        </View>
      )}

            {isHero && (strongAgainst || weakAgainst) && (
              <View style={styles.card}>
                <Text style={styles.sectionEyebrow}>Matchups</Text>

                <Pressable onPress={() => toggleSection("matchups")}>
                  <Text style={styles.sectionTitle}>
                    Matchups {openSections.matchups ? "▲" : "▼"}
                  </Text>
                </Pressable>

                {openSections.matchups && (
                  <>
                    {strongAgainst && (
                      <View style={styles.matchupBoxGood}>
                        <Text style={styles.buildLabel}>Strong Against</Text>
                        <Text style={styles.text}>{strongAgainst}</Text>
                      </View>
                    )}

                    {weakAgainst && (
                      <View style={styles.matchupBoxBad}>
                        <Text style={styles.buildLabel}>Weak Against</Text>
                        <Text style={styles.text}>{weakAgainst}</Text>
                      </View>
                    )}
                  </>
                )}
              </View>
            )}

            {isHero && counters.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.sectionEyebrow}>Matchups</Text>

                <Pressable onPress={() => toggleSection("counters")}>
                  <Text style={styles.sectionTitle}>
                    Counters {openSections.counters ? "▲" : "▼"}
                  </Text>
                </Pressable>

                {openSections.counters && (
                  <>
                    {counters.map((counter) => (
                      <View key={counter.id} style={styles.abilityCard}>
                        <Text style={styles.abilityName}>
                          Counter: {counter.counter_name}
                        </Text>

                        <Text style={styles.abilityText}>{counter.reason}</Text>

                        <Text style={styles.buildLabel}>
                          Difficulty: {counter.difficulty || "Unknown"}
                        </Text>
                      </View>
                    ))}
                  </>
                )}
              </View>
            )}

          </ScrollView>
        );
      }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    backgroundColor: MARVEL.background,
  },
  banner: {
    width: "100%",
    height: 420,
    borderRadius: 24,
    marginBottom: 16,
  },
  heroCard: {
    backgroundColor: MARVEL.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: MARVEL.border,
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
    backgroundColor: MARVEL.cardSoft,
  },
  headerTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  rolePill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  rolePillText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 13,
  },
  patchPill: {
    backgroundColor: MARVEL.primaryDark,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  patchPillText: {
    color: MARVEL.muted,
    fontWeight: "900",
    fontSize: 13,
  },
  difficultyPill: {
    backgroundColor: MARVEL.cardSoft,
    borderWidth: 1,
    borderColor: MARVEL.border,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  difficultyPillText: {
    color: "#FACC15",
    fontWeight: "900",
    fontSize: 13,
  },
  initialBox: {
    width: 110,
    height: 110,
    borderRadius: 26,
    backgroundColor: MARVEL.cardSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: MARVEL.border,
  },
  initial: {
    fontSize: 42,
    color: MARVEL.primary,
    fontWeight: "900",
    lineHeight: 46,
  },
  initialSub: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 2,
  },
  favoriteButton: {
    color: "#FACC15",
    fontWeight: "900",
    marginTop: 12,
    fontSize: 15,
  },
  tipBox: {
    backgroundColor: MARVEL.cardSoft,
    borderLeftWidth: 4,
    borderLeftColor: "#6366F1",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  heroText: {
    flex: 1,
  },
  gameName: {
    color: MARVEL.primary,
    fontWeight: "900",
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: MARVEL.text,
  },
  category: {
    color: MARVEL.primary,
    fontWeight: "900",
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: MARVEL.background,
    padding: 24,
    justifyContent: "center",
  },
  loadingTitle: {
    color: MARVEL.text,
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 8,
  },
  loadingText: {
    color: MARVEL.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  emptyText: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 22,
    fontStyle: "italic",
  },
  matchupBoxGood: {
    backgroundColor: "#052e16",
    borderWidth: 1,
    borderColor: "#22c55e",
    borderRadius: 18,
    padding: 16,
  },
  matchupBoxBad: {
    backgroundColor: "#450a0a",
    borderWidth: 1,
    borderColor: "#ef4444",
    borderRadius: 18,
    padding: 16,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  badge: {
    flex: 1,
    backgroundColor: MARVEL.cardSoft,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MARVEL.border,
    padding: 16,
  },
  badgeLabel: {
    color: MARVEL.muted,
    fontWeight: "800",
    marginBottom: 4,
  },
  badgeValue: {
    color: MARVEL.text,
    fontSize: 18,
    fontWeight: "900",
  },
  card: {
    backgroundColor: MARVEL.card,
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: MARVEL.border,
    marginBottom: 18,
  },
  comboRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  comboBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  easyBadge: {
    backgroundColor: "#2ecc71",
  },
  mediumBadge: {
    backgroundColor: "#f39c12",
  },
  hardBadge: {
    backgroundColor: "#e74c3c",
  },
  comboBadgeText: {
    color: "#fff",
    fontWeight: "700",
  },
  comboText: {
    color: "#fff",
    flex: 1,
  },
  sectionTitle: {
    color: MARVEL.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
  },
  text: {
    color: MARVEL.muted,
    lineHeight: 24,
    fontSize: 15,
  },
  abilityCard: {
    backgroundColor: MARVEL.cardSoft,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: MARVEL.cardSoft,
  },
  abilityName: {
    color: MARVEL.primary,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statBox: {
    width: "48%",
    backgroundColor: MARVEL.cardSoft,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MARVEL.cardSoft,
    padding: 14,
  },
  teamUpCard: {
    backgroundColor: MARVEL.cardSoft,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: MARVEL.primaryDark,
  },
  teamUpTitle: {
    color: MARVEL.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 6,
  },
  teamUpSeason: {
    color: MARVEL.primary,
    marginBottom: 12,
    fontWeight: "800",
  },
  teamUpName: {
    color: MARVEL.text,
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 8,
  },
  tipBox: {
    backgroundColor: MARVEL.cardSoft,
    borderLeftWidth: 4,
    borderLeftColor: MARVEL.primary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  badgeSmall: {
    alignSelf: "flex-start",
    backgroundColor: MARVEL.primaryDark,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  badgeSmallText: {
    color: MARVEL.muted,
    fontWeight: "900",
    fontSize: 12,
  },
  buildLabel: {
    color: MARVEL.text,
    fontWeight: "900",
    marginTop: 10,
    marginBottom: 4,
    fontSize: 13,
    letterSpacing: 0.4,
  },

  abilityText: {
    color: MARVEL.muted,
    lineHeight: 22,
    marginBottom: 8,
    fontSize: 14,
  },
});
