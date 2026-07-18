import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { heroPortraits } from "../../lib/heroPortraits";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
  TextInput,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";

function isIncompleteHero(entry: any) {
  if (!entry) return false;

  return (
    entry.category === "Heroes" &&
    (!entry.image_url ||
      !entry.summary ||
      entry.summary.includes("Hero in Marvel Rivals"))
  );
}

function getRole(content: string, summary: string) {
  const roleLine = content?.match(/Role:\s*(.+)/i);

  if (roleLine) {
    return roleLine[1]
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean);
  }

  const text = `${summary || ""}`.toLowerCase();

  if (text.includes("vanguard")) return ["Vanguard"];
  if (text.includes("duelist")) return ["Duelist"];
  if (text.includes("strategist")) return ["Strategist"];

  return ["Unknown"];
}

function getRoleBorderColor(entry: any) {
  const roles = getRole(entry.content, entry.summary);

  if (roles.includes("Duelist")) return "#EF4444";
  if (roles.includes("Vanguard")) return "#3B82F6";
  if (roles.includes("Strategist")) return "#A855F7";

  return "#334155";
}

export default function GameDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [game, setGame] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [questCount, setQuestCount] = useState(0);
  const [questCompleted, setQuestCompleted] = useState(0);


  const [fishCount, setFishCount] = useState(0);
  const [fishCaught, setFishCaught] = useState(0);

  const [bugCount, setBugCount] = useState(0);
  const [bugCaught, setBugCaught] = useState(0);

  const [recipeCount, setRecipeCount] = useState(0);
  const [recipeCooked, setRecipeCooked] = useState(0);

  useEffect(() => {
    async function loadFavorites() {
      const stored = await AsyncStorage.getItem("favorites");
      setFavorites(stored ? JSON.parse(stored) : []);
    }

    loadFavorites();
  }, []);

  useEffect(() => {
    loadGame();
    loadEntries();

    if (id) {
      loadPaliaStats();
    }
  }, [id]);

  async function loadGame() {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log("Game error:", error.message);
      return;
    }

    setGame(data);
  }

  async function loadEntries() {
    const { data, error } = await supabase
      .from("game_entries")
      .select("*")
      .eq("game_id", id)
      .order("category")
      .order("title");

    if (error) {
      console.log("Entries error:", error.message);
      return;
    }

    setEntries(data || []);
  }

  const filteredEntries = entries.filter((entry: any) => {
    const search = searchText.toLowerCase();
    const role = getRole(entry.content, entry.summary);

    const matchesSearch =
      entry.title?.toLowerCase().includes(search) ||
      entry.summary?.toLowerCase().includes(search) ||
      entry.category?.toLowerCase().includes(search) ||
      role.toLowerCase().includes(search);

    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Favorites" && favorites.includes(String(entry.id))) ||
      entry.category === activeFilter ||
      role.includes(activeFilter) ||
      (activeFilter === "Needs Review" && isIncompleteHero(entry));

    return matchesSearch && matchesFilter;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    const aFav = favorites.includes(String(a.id));
    const bFav = favorites.includes(String(b.id));

    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;

    return a.title.localeCompare(b.title);
  });

  const groupedEntries = sortedEntries.reduce((groups: any, entry: any) => {
    const category = entry.category || "Other";

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(entry);
    return groups;
  }, {});

  if (!game) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Loading game...</Text>
      </View>
    );
  }
  const isMarvelRivals = game?.slug === "marvel-rivals";
  const theme =
    isMarvelRivals
      ? MARVEL
      : game?.slug === "palia"
      ? PALIA_THEME
      : game?.slug === "pokemon-pokopia"
      ? POKOPIA_THEME
      : DEFAULT_THEME;

async function loadPaliaStats() {
  const { data: fish } = await supabase
    .from("palia_fish")
    .select("caught");

  const { data: bugs } = await supabase
    .from("palia_bugs")
    .select("caught");

  const { data: recipes } = await supabase
    .from("palia_recipes")
    .select("cooked");

  const { data: quests } = await supabase
    .from("palia_quests")
    .select("completed");

  let fishCaughtCount = 0;
  let bugCaughtCount = 0;
  let recipeCookedCount = 0;
  let questCompletedCount = 0;

  if (fish) {
    fishCaughtCount = fish.filter((f) => f.caught).length;
    setFishCount(fish.length);
    setFishCaught(fishCaughtCount);
  }

  if (bugs) {
    bugCaughtCount = bugs.filter((b) => b.caught).length;
    setBugCount(bugs.length);
    setBugCaught(bugCaughtCount);
  }

  if (recipes) {
    recipeCookedCount = recipes.filter((r) => r.cooked).length;
    setRecipeCount(recipes.length);
    setRecipeCooked(recipeCookedCount);
  }

  if (quests) {
    questCompletedCount = quests.filter((q) => q.completed).length;
    setQuestCount(quests.length);
    setQuestCompleted(questCompletedCount);
  }

  checkAchievements(
    fishCaughtCount,
    bugCaughtCount,
    recipeCookedCount,
    questCompletedCount
  );
}

async function checkAchievements(
  fishCaught: number,
  bugCaught: number,
  recipeCooked: number,
  questCompleted: number
) {
  const { data: achievements } = await supabase
    .from("palia_achievements")
    .select("*");

  if (!achievements) return;

  for (const achievement of achievements) {
    let shouldUnlock = false;

    if (
      achievement.achievement_type === "fish" &&
      fishCaught >= achievement.requirement_amount
    ) {
      shouldUnlock = true;
    }

    if (
      achievement.achievement_type === "bugs" &&
      bugCaught >= achievement.requirement_amount
    ) {
      shouldUnlock = true;
    }

    if (
      achievement.achievement_type === "recipes" &&
      recipeCooked >= achievement.requirement_amount
    ) {
      shouldUnlock = true;
    }

    if (
      achievement.achievement_type === "quests" &&
      questCompleted >= achievement.requirement_amount
    ) {
      shouldUnlock = true;
    }

    if (shouldUnlock && !achievement.unlocked) {
      await supabase
        .from("palia_achievements")
        .update({ unlocked: true })
        .eq("id", achievement.id);
    }
  }
}

  const fishPercent =
    fishCount === 0 ? 0 : Math.round((fishCaught / fishCount) * 100);

  const bugPercent =
    bugCount === 0 ? 0 : Math.round((bugCaught / bugCount) * 100);

  const recipePercent =
    recipeCount === 0 ? 0 : Math.round((recipeCooked / recipeCount) * 100);

  const questPercent =
    questCount === 0 ? 0 : Math.round((questCompleted / questCount) * 100);

  const filters =
    game?.slug === "marvel-rivals"
      ? [
          "All",
          "Favorites",
          "Heroes",
          "Duelist",
          "Vanguard",
          "Strategist",
          "Maps",
          "Beginner Tips",
          "Needs Review",
        ]
      : game?.slug === "animal-crossing"
      ? [
          "All",
          "Museum",
          "Fish",
          "Bugs",
          "Sea Creatures",
          "Villagers",
          "Events",
        ]
      : game?.slug === "palia"
      ? [
          "All",
          "Favorites",
          "Skills",
          "Villagers",
          "Resources",
          "Recipes",
          "Quests",
          "Bundles",
        ]
      : game?.slug === "pokemon-pokopia"
      ? [
          "All",
          "Pokémon",
          "Farming",
          "Decorating",
          "Requests",
          "Beginner Tips",
        ]
      : [
          "All",
          "Favorites",
        ];
  console.log("Current game slug:", game?.slug);
  console.log("Filters:", filters);  
  console.log("Game:", game);
  console.log("Slug:", game?.slug);
  console.log("Theme:", theme);  

  const museumCount = entries.filter(
    (entry) => entry.category === "Museum"
  ).length;

  const fishEntryCount = entries.filter(
    (entry) => entry.category === "Fish"
  ).length;

  const bugsEntryCount = entries.filter(
    (entry) => entry.category === "Bugs"
  ).length;

  const villagerCount = entries.filter(
    (entry) => entry.category === "Villagers"
  ).length;

  const seaCreatureCount = entries.filter(
    (entry) => entry.category === "Sea Creatures"
  ).length;

  const eventCount = entries.filter(
    (entry) => entry.category === "Events"
  ).length;

  const pokemonCount = entries.filter(
    (entry) => entry.category === "Pokémon"
  ).length;

  const farmingCount = entries.filter(
    (entry) => entry.category === "Farming"
  ).length;

  const decoratingCount = entries.filter(
    (entry) => entry.category === "Decorating"
  ).length;

  const requestCount = entries.filter(
    (entry) => entry.category === "Requests"
  ).length;


  return (
    <>
      <Stack.Screen options={{ title: game?.name || "Game" }} />

      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <ImageBackground
        source={{ uri: game.image_url }}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <View
          style={[
            styles.heroOverlay,
            { backgroundColor: isMarvelRivals ? "rgba(23, 2, 2, 0.82)" : "rgba(2, 6, 23, 0.72)" },
          ]}
        >

          <Text style={styles.title}>{game.name}</Text>
          <Text style={[styles.genre, { color: theme.primary }]}>{game.genre}</Text>
          <Text style={[styles.description, { color: theme.muted }]}>{game.description}</Text>
        </View>
      </ImageBackground>

  {isMarvelRivals && (
    <>
      <Pressable
        style={{
          backgroundColor: MARVEL.card,
          padding: 20,
          borderRadius: 24,
          marginTop: 16,
          borderWidth: 1,
          borderColor: MARVEL.border,
        }}
        onPress={() => router.push("/game/marvel-rivals/guides")}
      >
        <Text
          style={{
            color: MARVEL.text,
            fontSize: 24,
            fontWeight: "900",
            marginBottom: 8,
          }}
        >
          Beginner Guides
        </Text>

        <Text
          style={{
            color: MARVEL.muted,
            fontSize: 15,
            lineHeight: 22,
          }}
        >
          Learn roles, positioning, objectives, teamfights, and beginner basics.
        </Text>
      </Pressable>

      <Pressable
        style={{
          backgroundColor: MARVEL.card,
          padding: 20,
          borderRadius: 24,
          marginTop: 16,
          borderWidth: 1,
          borderColor: MARVEL.border,
        }}
        onPress={() => router.push("/game/marvel-rivals/academy")}
      >
        <Text
          style={{
            color: MARVEL.text,
            fontSize: 24,
            fontWeight: "900",
            marginBottom: 8,
          }}
        >
          Marvel Rivals Academy
        </Text>

        <Text
          style={{
            color: MARVEL.muted,
            fontSize: 15,
            lineHeight: 22,
          }}
        >
          Learn beginner lessons with Snee and unlock advanced secrets with Buss.
        </Text>
      </Pressable>

      <Pressable
        style={{
          backgroundColor: MARVEL.card,
          padding: 20,
          borderRadius: 24,
          marginTop: 16,
          borderWidth: 1,
          borderColor: MARVEL.border,
        }}
        onPress={() => router.push("/counter-picker")}
      >
        <Text
          style={{
            color: MARVEL.text,
            fontSize: 24,
            fontWeight: "900",
            marginBottom: 8,
          }}
        >
          Counter Picker
        </Text>

        <Text
          style={{
            color: MARVEL.muted,
            fontSize: 15,
            lineHeight: 22,
          }}
        >
          Pick an enemy hero and find suggested counters.
        </Text>
      </Pressable>
    </>
  )}

      <View style={styles.section}>
        {game?.slug === "palia" && (
          <View style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
            <Text style={[styles.sectionTitle, { color: theme.text }]}>🌿 Palia Companion Hub</Text>
            <Text style={[styles.trackerSubText, { color: theme.muted }]}>
              Track collections, weekly wants, skills, quests, and achievements.
            </Text>

            <View
              style={[
                styles.dashboardBox,
                {
                  backgroundColor: theme.cardSoft,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.dashboardTitle, { color: theme.text }]}>Completion Dashboard</Text>

              <Text style={[styles.dashboardText, { color: theme.muted }]}>🎣 Fish: {fishPercent}%</Text>
              <Text style={[styles.dashboardText, { color: theme.muted }]}>🐞 Bugs: {bugPercent}%</Text>
              <Text style={[styles.dashboardText, { color: theme.muted }]}>🍲 Recipes: {recipePercent}%</Text>
              <Text style={[styles.dashboardText, { color: theme.muted }]}>📖 Quests: {questPercent}%</Text>
            </View>

            <Pressable
              style={[
                styles.trackerButton,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => router.push("/global-search")}
            >
              <Text style={[styles.trackerButtonText, { color: theme.primary }]}>🔎 Global Search</Text>

              <Text style={[styles.trackerSubText, { color: theme.muted }]}>
                Search fish, bugs, recipes, quests and skills
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.trackerButton,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => router.push("/palia-maps")}
            >
              <View style={styles.trackerHeaderRow}>
                <View
                  style={[
                    styles.trackerIconBox,
                    { backgroundColor: theme.cardSoft },
                  ]}
                >
                  <Text style={styles.trackerIcon}>🗺️</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.trackerButtonText, { color: theme.primary }]}>Location Maps</Text>

                  <Text style={[styles.trackerSubText, { color: theme.muted }]}>
                    Find fish and bugs by area
                  </Text>
                </View>
              </View>
            </Pressable>

            <Text style={styles.trackerSectionLabel}>Collections</Text>

            <Pressable
              style={[
                styles.trackerButton,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => router.push("/palia-fish")}
            >
              <View style={styles.trackerHeaderRow}>
                <View
                  style={[
                    styles.trackerIconBox,
                    { backgroundColor: theme.cardSoft },
                  ]}
                >
                  <Text style={styles.trackerIcon}>🎣</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.trackerButtonText, { color: theme.primary }]}>
                    Fish Tracker
                  </Text>

                  <Text style={[styles.trackerSubText, { color: theme.muted }]}>
                    {fishCaught} / {fishCount} caught
                  </Text>
                </View>
              </View>

              <Text style={[styles.trackerSubText, { color: theme.muted }]}>
                {fishCaught} / {fishCount} caught
              </Text>

              <Text style={styles.progressText}>
                {fishPercent}% complete
              </Text>

              <View
                style={[
                  styles.miniProgressBackground,
                  { backgroundColor: theme.border },
                ]}
              >
                <View
                  style={[
                    styles.miniProgressFill,
                    { width: `${fishPercent}%` },
                  ]}
                />
              </View>
            </Pressable>

            <Pressable
              style={[
                styles.trackerButton,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => router.push("/palia-bugs")} 
            >
              <View style={styles.trackerHeaderRow}>
                <View
                  style={[
                    styles.trackerIconBox,
                    { backgroundColor: theme.cardSoft },
                  ]}
                >
                  <Text style={styles.trackerIcon}>🐞</Text> 
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.trackerButtonText, { color: theme.primary }]}>Bug Tracker</Text> 
                  <Text style={[styles.trackerSubText, { color: theme.muted }]}>
                    {bugCaught} / {bugCount} caught 
                  </Text>
                  <Text style={styles.progressText}>{bugPercent}% complete</Text> 
                </View>
              </View>

              <View
  style={[
    styles.miniProgressBackground,
    { backgroundColor: theme.border },
                ]}
              >
                <View
                  style={[
                    styles.miniProgressFill,
                    { width: `${bugPercent}%` }, 
                  ]}
                />
              </View>
            </Pressable>

            <Pressable
              style={[
                styles.trackerButton,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => router.push("/palia-recipes")} 
            >
              <View style={styles.trackerHeaderRow}>
                <View
                  style={[
                    styles.trackerIconBox,
                    { backgroundColor: theme.cardSoft },
                  ]}
                >
                  <Text style={styles.trackerIcon}>🍲</Text> 
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.trackerButtonText, { color: theme.primary }]}>Recipes Tracker</Text> 
                  <Text style={[styles.trackerSubText, { color: theme.muted }]}>
                    {recipeCooked} / {recipeCount} caught 
                  </Text>
                  <Text style={styles.progressText}>{recipePercent}% complete</Text> 
                </View>
              </View>

              <View
                style={[
                  styles.miniProgressBackground,
                  { backgroundColor: theme.border },
                ]}
              >
                <View
                  style={[
                    styles.miniProgressFill,
                    { width: `${recipePercent}%` }, 
                  ]}
                />
              </View>
            </Pressable>

            <Text style={styles.trackerSectionLabel}>Progression</Text>

            <Pressable
              style={[
                styles.trackerButton,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => router.push("/palia-weekly-wants")}
            >
              <View style={styles.trackerHeaderRow}>
                <View
                  style={[
                  styles.trackerIconBox,
                    { backgroundColor: theme.cardSoft },
                  ]}
                >
                  <Text style={styles.trackerIcon}>🎁</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.trackerButtonText, { color: theme.primary }]}>
                    Weekly Wants Tracker
                  </Text>

                  <Text style={[styles.trackerSubText, { color: theme.muted }]}>
                    Track villager weekly gifts
                  </Text>
                </View>
              </View>
            </Pressable>

            <Pressable
              style={[
                styles.trackerButton,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => router.push("/palia-skills")}
            >
              <View style={styles.trackerHeaderRow}>
                <View
                  style={[
                    styles.trackerIconBox,
                    { backgroundColor: theme.cardSoft },
                  ]}
                >
                  <Text style={styles.trackerIcon}>⛏️</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.trackerButtonText, { color: theme.primary }]}>
                    Skills Tracker
                  </Text>

                  <Text style={[styles.trackerSubText, { color: theme.muted }]}>
                    Track all Palia skill levels
                  </Text>
                </View>
              </View>
            </Pressable>

            <Pressable
              style={[
                styles.trackerButton,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => router.push("/palia-achievements")}
            >
              <View style={styles.trackerHeaderRow}>
               <View
                style={[
                  styles.trackerIconBox,
                  { backgroundColor: theme.cardSoft },
                ]}
               >
                  <Text style={styles.trackerIcon}>🏆</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.trackerButtonText, { color: theme.primary }]}>
                    Achievements
                  </Text>

                  <Text style={[styles.trackerSubText, { color: theme.muted }]}>
                    Unlock progression milestones
                  </Text>
                </View>
              </View>
            </Pressable>

            <Text style={styles.trackerSectionLabel}>Guides</Text>

            <Pressable
              style={[
                styles.trackerButton,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => router.push("/palia-quests")} 
            >
              <View style={styles.trackerHeaderRow}>
                <View
                  style={[
                    styles.trackerIconBox,
                    { backgroundColor: theme.cardSoft },
                  ]}
                >
                  <Text style={styles.trackerIcon}>📖</Text> 
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.trackerButtonText, { color: theme.primary }]}>Quest Tracker</Text> 
                  <Text style={[styles.trackerSubText, { color: theme.muted }]}>
                    {questCompleted} / {questCount} completed 
                  </Text>
                  <Text style={styles.progressText}>{questPercent}% complete</Text> 
                </View>
              </View>

              <View
                style={[
                  styles.miniProgressBackground,
                  { backgroundColor: theme.border },
                ]}
              >
                <View
                  style={[
                    styles.miniProgressFill,
                    { width: `${questPercent}%` }, 
                  ]}
                />
              </View>
            </Pressable>
          </View>
        )}

        {game?.slug === "animal-crossing" && (
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.text },
              ]}
            >
              🏝️ Island Dashboard
            </Text>

            <Text style={styles.dashboardText}>
              🏛️ Museum Collection: {museumCount}
            </Text>

            <Text style={styles.dashboardText}>
              🐟 Fish Encyclopedia: {fishEntryCount}
            </Text>

            <Text style={styles.dashboardText}>
              🐛 Bugs Encyclopedia: {bugsEntryCount}
            </Text>

            <Text style={styles.dashboardText}>
              🌊 Sea Creature Catalog: {seaCreatureCount}
            </Text>

            <Text style={styles.dashboardText}>
              👥 Villager Directory: {villagerCount}
            </Text>

            <Text style={styles.dashboardText}>
              📅 Event Calender: {eventCount}
            </Text>
          </View>
        )}

        {game?.slug === "animal-crossing" && (
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.text },
              ]}
            >
              Animal Crossing Hub
            </Text>

            <View style={styles.quickGrid}>
              <Pressable
                style={styles.quickCard}
                onPress={() => setActiveFilter("Museum")}
              >
                <Text style={styles.quickEmoji}>🏛️</Text>
                <Text style={styles.quickTitle}>Museum Collection</Text>
                <Text style={styles.quickCount}>
                  {museumCount} Entries
                </Text>
              </Pressable>

              <Pressable
                style={styles.quickCard}
                onPress={() => setActiveFilter("Fish")}
              >
                <Text style={styles.quickEmoji}>🐟</Text>
                <Text style={styles.quickTitle}>Fish Encyclopedia</Text>
                <Text style={styles.quickCount}>
                  {fishEntryCount} Entries
                </Text>
              </Pressable>

              <Pressable
                style={styles.quickCard}
                onPress={() => setActiveFilter("Bugs")}
              >
                <Text style={styles.quickEmoji}>🐛</Text>
                <Text style={styles.quickTitle}>Bugs Encyclopedia</Text>
                <Text style={styles.quickCount}>
                  {bugsEntryCount} Entries
                </Text>
              </Pressable>

              <Pressable
                style={styles.quickCard}
                onPress={() => setActiveFilter("Sea Creatures")}
              >
                <Text style={styles.quickEmoji}>🌊</Text>
                <Text style={styles.quickTitle}>Sea Creature Catalog</Text>
                <Text style={styles.quickCount}>
                  {seaCreatureCount} Entries
                </Text>
              </Pressable>

              <Pressable
                style={styles.quickCard}
                onPress={() => setActiveFilter("Events")}
              >
                <Text style={styles.quickEmoji}>📅</Text>
                <Text style={styles.quickTitle}>Event Calendar</Text>
                <Text style={styles.quickCount}>
                  {eventCount} Entries
                </Text>
              </Pressable>

              <Pressable
                style={styles.quickCard}
                onPress={() => setActiveFilter("Villagers")}
              >
                <Text style={styles.quickEmoji}>👥</Text>
                <Text style={styles.quickTitle}>Villager Directory</Text>
                <Text style={styles.quickCount}>
                  {villagerCount} Entries
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {game?.slug === "pokemon-pokopia" && (
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              🏡 Pokopia Dashboard
            </Text>

            <Text style={styles.dashboardText}>
              🐾 Pokémon Collection ({pokemonCount})
            </Text>

            <Text style={styles.dashboardText}>
              🌾 Farming Journal ({farmingCount})
            </Text>

            <Text style={styles.dashboardText}>
              🏠 Decoration Catalog ({decoratingCount})
            </Text>

            <Text style={styles.dashboardText}>
              📋 Request Board ({requestCount})
            </Text>

            <Text
              style={[
                styles.dashboardText,
                {
                  color: theme.primary,
                  fontWeight: "800",
                  marginTop: 12,
                },
              ]}
            >
              ✨ Total Entries: {pokemonCount + farmingCount + decoratingCount + requestCount}
            </Text>
          </View>
        )}

        {game?.slug === "pokemon-pokopia" && (
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.text },
              ]}
            >
              🏡 Pokopia Hub
            </Text>

            <View style={styles.quickGrid}>
              <Pressable
                style={styles.quickCard}
                onPress={() => setActiveFilter("Pokémon")}
              >
                <Text style={styles.quickEmoji}>🐾</Text>
                <Text style={styles.quickTitle}>Pokémon</Text>
                <Text style={styles.quickCount}>
                  {pokemonCount} Entries
                </Text>
              </Pressable>

              <Pressable
                style={styles.quickCard}
                onPress={() => setActiveFilter("Farming")}
              >
                <Text style={styles.quickEmoji}>🌾</Text>
                <Text style={styles.quickTitle}>Farming</Text>
                <Text style={styles.quickCount}>
                  {farmingCount} Entries
                </Text>
              </Pressable>

              <Pressable
                style={styles.quickCard}
                onPress={() => setActiveFilter("Decorating")}
              >
                <Text style={styles.quickEmoji}>🏠</Text>
                <Text style={styles.quickTitle}>Decorating</Text>
                <Text style={styles.quickCount}>
                  {decoratingCount} Entries
                </Text>
              </Pressable>

              <Pressable
                style={styles.quickCard}
                onPress={() => setActiveFilter("Requests")}
              >
                <Text style={styles.quickEmoji}>📋</Text>
                <Text style={styles.quickTitle}>Requests</Text>
                <Text style={styles.quickCount}>
                  {requestCount} Entries
                </Text>
              </Pressable>
            </View>
          </View>
        )}


        {isMarvelRivals && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Favorites
            </Text>

            {entries.filter((entry: any) => favorites.includes(String(entry.id))).length === 0 ? (
              <Text style={styles.emptyText}>No favorites yet.</Text>
            ) : (
              entries
                .filter((entry: any) => favorites.includes(String(entry.id)))
                .map((entry: any) => (
                  <Pressable
                    key={entry.id}
                    style={styles.card}
                    onPress={() =>
                      router.push({
                        pathname: `/entry/${entry.id}`,
                      })
                    }
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <View style={styles.cardTitleRow}>
                        <Text style={styles.cardTitle}>{entry.title}</Text>

                        {favorites.includes(String(entry.id)) && (
                          <Text style={styles.favoriteStar}>★</Text>
                        )}
                      </View>

                      {favorites.includes(String(entry.id)) && (
                        <Text style={{ color: "#FACC15", fontWeight: "900" }}>★</Text>
                      )}
                    </View>

                    <Text style={styles.summary}>
                      {entry.summary || "No summary available."}
                    </Text>
                  </Pressable>
                ))
            )}
          </>
        )}



        <Text style={[styles.sectionTitle, { color: theme.text }]}>Game Entries</Text>

        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          
          placeholder="Search heroes, maps, tips..."
          placeholderTextColor="#64748B"
          value={searchText}
          onChangeText={setSearchText}
        />

        <View style={styles.filterRow}>
          {filters.map((filter) => (
            <Pressable
              key={filter}
              style={[
                styles.filterButton,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
                activeFilter === filter && {
                  backgroundColor: theme.primaryDark,
                  borderColor: theme.primary,
                },
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  { color: theme.muted },
                  activeFilter === filter && { color: theme.text },
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          ))}
        </View>

        {searchText ? (
          <Text style={styles.resultCount}>
            {filteredEntries.length} result{filteredEntries.length !== 1 ? "s" : ""}
          </Text>
        ) : null}

        {entries.length === 0 ? (
          <Text style={styles.emptyText}>Loading entries...</Text>
        ) : filteredEntries.length === 0 ? (
          <Text style={styles.emptyText}>
            {searchText
              ? `No results found for "${searchText}"`
              : "No entries added yet."}
          </Text>
        ) : (
          Object.entries(groupedEntries).map(([category, items]: any) => (
            <View key={category} style={styles.categorySection}>
              <Text style={[styles.categoryHeading, { color: theme.primary }]}>{category}</Text>

              {items.map((entry: any) => (
                <Pressable
                  key={entry.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: `/entry/${entry.id}`,
                      params: { isFav: favorites.includes(entry.id).toString() },
                    })
                  }
                >  
                  <View style={styles.entryHeader}>
                    <Image
                      source={
                        heroPortraits[entry.title]
                          ? heroPortraits[entry.title]
                          : entry.image_url
                            ? { uri: entry.image_url }
                            : require("../../assets/images/heroes/placeholder.png")
                      }
                      style={[
                        styles.entryImage,
                        {
                          borderWidth: 3,
                          borderColor: getRoleBorderColor(entry),
                        },
                      ]}
                      onError={() => {
                        console.log("Image failed:", entry.title);
                      }}
                    />

                    <View style={styles.entryText}>
                      <View style={styles.cardTitleRow}>
                        <Text style={styles.cardTitle}>{entry.title}</Text>

                        {favorites.includes(String(entry.id)) && (
                          <Text style={styles.favoriteStar}>★</Text>
                        )}
                      </View>

                      {entry.category === "Heroes" && (
                        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                          {getRole(entry.content, entry.summary).map((role: string) => (
                            <Text key={role} style={styles.roleBadge}>
                              {role === "Duelist" && "⚔️ Duelist"}
                              {role === "Vanguard" && "🛡️ Vanguard"}
                              {role === "Strategist" && "✨ Strategist"}
                              {role === "Unknown" && "❔ Unknown"}
                            </Text>
                          ))}
                        </View>
                      )}

                      {isIncompleteHero(entry) && (
                        <Text style={styles.missingBadge}>Needs Review</Text>
                      )}

                      <Text style={[styles.summary, { color: theme.muted }]}>
                        {entry.summary || "No summary available."}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.tapText, { color: theme.primary }]}>
                    View full guide →
                  </Text>
                </Pressable>
              ))}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  </>
);
}

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

const DEFAULT_THEME = {
  background: "#020617",
  backgroundDark: "#020617",
  card: "#0F172A",
  cardSoft: "#1E293B",
  border: "#334155",
  primary: "#818CF8",
  primaryDark: "#4F46E5",
  text: "#F8FAFC",
  muted: "#CBD5E1",
};

const PALIA_THEME = {
  background: "#020617",
  backgroundDark: "#020617",
  card: "#083344",
  cardSoft: "#0E7490",
  border: "#155E75",
  primary: "#22C55E",
  primaryDark: "#166534",
  text: "#F8FAFC",
  muted: "#CCFBF1",
};

const POKOPIA_THEME = {
  background: "#020617",
  backgroundDark: "#020617",
  card: "#1E3A8A",
  cardSoft: "#2563EB",
  border: "#3B82F6",
  primary: "#FACC15",
  primaryDark: "#EAB308",
  text: "#F8FAFC",
  muted: "#DBEAFE",
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    padding: 22,
    backgroundColor: MARVEL.background,
  },
  container: {
    flex: 1,
    backgroundColor: MARVEL.background,
  },
  hero: {
    minHeight: 320,
    justifyContent: "flex-end",
  },
  heroImage: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 22,
    backgroundColor: "rgba(23, 2, 2, 0.82)",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  resultCount: {
    color: MARVEL.muted,
    fontSize: 12,
    marginBottom: 8,
  },
  roleBadge: {
    color: MARVEL.primary,
    fontSize: 12,
    fontWeight: "900",
    marginTop: 4,
  },
  trackerHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  trackerIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: MARVEL.card,
    alignItems: "center",
    justifyContent: "center",
  },
  quickCount: {
    color: "#94A3B8",
    marginTop: 4,
    fontSize: 12,
  },
  trackerIcon: {
    fontSize: 24,
  },
  missingBadge: {
    color: "#F59E0B",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 4,
    marginBottom: 2,
  },
  title: {
    fontSize: 38,
    fontWeight: "900",
    color: MARVEL.text,
  },
  dashboardBox: {
    backgroundColor: MARVEL.cardSoft,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: MARVEL.border,
  },
  dashboardTitle: {
    color: MARVEL.text,
    fontWeight: "900",
    fontSize: 18,
    marginBottom: 8,
  },
  dashboardText: {
    color: MARVEL.muted,
    fontWeight: "800",
    marginBottom: 4,
  },
  trackerButton: {
    backgroundColor: MARVEL.card,
    borderRadius: 18,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: MARVEL.border,
  },
  miniProgressBackground: {
    height: 8,
    backgroundColor: MARVEL.card,
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 8,
  },
  miniProgressFill: {
    height: "100%",
    backgroundColor: "#22C55E",
  },
  progressText: {
    color: "#22C55E",
    fontWeight: "900",
    marginTop: 2,
    fontSize: 12,
  },
  trackerButtonText: {
    color: MARVEL.primary,
    fontWeight: "900",
    fontSize: 16,
  },
  genre: {
    fontSize: 18,
    color: MARVEL.primary,
    fontWeight: "900",
    marginTop: 8,
  },
  dashboardText: {
    color: "#CBD5E1",
    fontSize: 16,
    marginTop: 6,
  },
  sectionEyebrow: {
    color: MARVEL.primary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  description: {
    fontSize: 16,
    color: MARVEL.muted,
    marginTop: 14,
    lineHeight: 24,
  },
  section: {
    padding: 22,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: MARVEL.text,
    marginBottom: 14,
  },
  categorySection: {
    marginBottom: 24,
  },
  searchInput: {
    backgroundColor: MARVEL.card,
    borderWidth: 1,
    borderColor: MARVEL.border,
    color: MARVEL.text,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 18,
  },
  categoryHeading: {
    fontSize: 22,
    fontWeight: "900",
    color: MARVEL.primary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: MARVEL.card,
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: MARVEL.border,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: MARVEL.text,
  },
  entryHeader: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  trackerSubText: {
    color: MARVEL.muted,
    marginTop: 4,
    fontSize: 13,
  },
  entryImage: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: MARVEL.cardSoft,
  },
  entryInitialBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: MARVEL.cardSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  entryInitial: {
    color: MARVEL.primary,
    fontSize: 26,
    fontWeight: "900",
  },
  entryText: {
    flex: 1,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  filterButton: {
    backgroundColor: MARVEL.card,
    borderWidth: 1,
    borderColor: MARVEL.border,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  filterButtonActive: {
    backgroundColor: MARVEL.primaryDark,
    borderColor: MARVEL.primary,
  },
  filterButtonText: {
    color: MARVEL.muted,
    fontWeight: "800",
    fontSize: 13,
  },
  filterButtonTextActive: {
    color: MARVEL.text,
  },
  summary: {
    color: MARVEL.muted,
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 8,
    lineHeight: 20,
  },
  content: {
    color: MARVEL.muted,
    marginTop: 8,
    lineHeight: 22,
  },
  trackerSectionLabel: {
    color: MARVEL.text,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 16,
    marginBottom: 8,
  },
  tapText: {
    color: MARVEL.primary,
    fontWeight: "900",
    marginTop: 8,
    fontSize: 14,
  },
  emptyText: {
    color: MARVEL.muted,
    fontSize: 16,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  quickCard: {
    width: "48%",
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },
  quickEmoji: {
    fontSize: 28,
  },
  quickTitle: {
    color: "#F8FAFC",
    fontWeight: "900",
    marginTop: 8,
  },
});