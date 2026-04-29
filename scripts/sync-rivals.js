const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://eaofxanagjidpvfinavr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhb2Z4YW5hZ2ppZHB2ZmluYXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5OTIyNTUsImV4cCI6MjA5MjU2ODI1NX0.jF2nnUKbPhWxU62MTCyYo-D9QiX1dzBWiDWyU90IDts";
const marvelApiKey = "9904a78e5fafa82176b65ee85d1688c6bd35fe041cadf1121f5b14cf9e7a6d1f";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const heroImages = {
  "Adam Warlock": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/adam-warlock_avatar.png",
  "Angela": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/angela_avatar.png",
  "Black Cat": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/black-cat_avatar.png",
  "Black Panther": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/black-panther_avatar.png",
  "Black Widow": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/black-widow_avatar.png",
  "Blade": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/blade_avatar.png",
  "Captain America": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/captain-america_avatar.png",
  "Cloak & Dagger": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/cloak-and-dagger_avatar.png",
  "Daredevil": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/daredevil_avatar.png",
  "Deadpool": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/deadpool_avatar.png",
  "Doctor Strange": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/doctor-strange_avatar.png",
  "Elsa Bloodstone": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/elsa-bloodstone_avatar.png",
  "Emma Frost": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/emma-frost_avatar.png",
  "Gambit": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/gambit_avatar.png",
  "Groot": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/groot_avatar.png",
  "Hawkeye": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/hawkeye_avatar.png",
  "Hela": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/hela_avatar.png",
  "Hulk": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/hulk_avatar.png",
  "Human Torch": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/human-torch_avatar.png",
  "Invisible Woman": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/invisible-woman_avatar.png",
  "Iron Fist": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/iron-fist_avatar.png",
  "Iron Man": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/iron-man_avatar.png",
  "Jeff The Land Shark": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/jeff-the-land-shark_avatar.png",
  "Loki": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/loki_avatar.png",
  "Luna Snow": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/luna-snow_avatar.png",
  "Magik": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/magik_avatar.png",
  "Magneto": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/magneto_avatar.png",
  "Mantis": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/mantis_avatar.png",
  "Mister Fantastic": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/mister-fantastic_avatar.png",
  "Moon Knight": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/moon-knight_avatar.png",
  "Namor": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/namor_avatar.png",
  "Peni Parker": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/peni-parker_avatar.png",
  "Phoenix": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/phoenix_avatar.png",
  "Psylocke": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/psylocke_avatar.png",
  "Rocket Raccoon": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/rocket-raccoon_avatar.png",
  "Rogue": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/rogue_avatar.png",
  "Scarlet Witch": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/scarlet-witch_avatar.png",
  "Spider-Man": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/spider-man_avatar.png",
  "Squirrel Girl": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/squirrel-girl_avatar.png",
  "Star-Lord": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/star-lord_avatar.png",
  "Storm": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/storm_avatar.png",
  "The Punisher": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/the-punisher_avatar.png",
  "The Thing": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/the-thing_avatar.png",
  "Thor": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/thor_avatar.png",
  "Ultron": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/ultron_avatar.png",
  "Venom": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/venom_avatar.png",
  "White Fox": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/white-fox_avatar.png",
  "Winter Soldier": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/winter-soldier_avatar.png",
  "Wolverine": "https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-icons-avatars/wolverine_avatar.png",
};

function formatName(name) {
  return name
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function getMarvelRivalsGameId() {
  const { data, error } = await supabase
    .from("games")
    .select("id")
    .eq("slug", "marvel-rivals")
    .single();

  if (error) throw new Error(error.message);
  return data.id;
}

async function fetchMarvel(endpoint) {
  const response = await fetch(`https://marvelrivalsapi.com/api/v1${endpoint}`, {
    headers: {
      "x-api-key": marvelApiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Marvel API failed: ${response.status}`);
  }

  return response.json();
}

async function syncHeroes(gameId) {
  console.log("Syncing Marvel Rivals heroes...");

  const result = await fetchMarvel("/heroes");
  const heroes = result.heroes || result;

  if (!Array.isArray(heroes)) {
    console.log("Hero sync error: heroes data is not an array");
    console.log(result);
    return;
  }

  const rows = heroes.map((hero) => {
    const rawName =
      hero.name ||
      hero.hero_name ||
      hero.real_name ||
      hero.display_name ||
      "Unknown Hero";

    const formattedName = formatName(rawName);

    const role =
      hero.role ||
      hero.class ||
      hero.hero_role ||
      hero.type ||
      "Hero";

    const difficulty =
      hero.difficulty ||
      hero.difficulty_level ||
      "Unknown";

    const abilities =
      hero.abilities ||
      hero.skills ||
      hero.attacks ||
      [];

    const abilityList =
      Array.isArray(abilities) && abilities.length > 0
        ? abilities.map((ability) => {
            const abilityName =
              ability.name ||
              ability.ability_name ||
              ability.title ||
              "Unnamed Ability";

            let abilityDesc =
              ability.description ||
              ability.desc ||
              ability.tooltip ||
              ability.details ||
              "";

            abilityDesc = abilityDesc
              .replace(/<[^>]+>/g, "")
              .replace(/\{[^}]+\}/g, "")
              .replace(/\s+/g, " ")
              .trim();

            return abilityDesc
              ? `• ${abilityName}: ${abilityDesc}`
              : `• ${abilityName}`;
          })
        : ["Abilities not available from API response yet."];

    const uniqueAbilities = [...new Set(abilityList)];
    const abilityText = uniqueAbilities.join("\n");

    const contentParts = [
      `Role: ${role}`,
      `Difficulty: ${difficulty}`,
      "",
      "Abilities:",
      abilityText,
    ];

    return {
      game_id: gameId,
      title: formattedName,
      category: "Heroes",
      summary: `${role} hero in Marvel Rivals.`,
      content: contentParts.join("\n"),
      image_url: heroImages[formattedName] || null,
    };
  });

  const { error } = await supabase
    .from("game_entries")
    .upsert(rows, {
      onConflict: "game_id,category,title",
    });

  if (error) {
    console.log("Hero sync error:", error.message);
    return;
  }

  console.log(`Saved ${rows.length} heroes.`);
}

async function syncMaps(gameId) {
  console.log("Syncing Marvel Rivals maps...");

  const result = await fetchMarvel("/maps");
  const maps = result.maps || result;

  if (!Array.isArray(maps)) {
    console.log("Map sync error: maps data is not an array");
    console.log(result);
    return;
  }

  const rows = maps.map((map) => ({
    game_id: gameId,
    title: map.name || map.map_name || "Unknown Map",
    category: "Maps",
    summary: map.type ? `${map.type} map.` : "Marvel Rivals map.",
    content: JSON.stringify(map, null, 2),
  }));

  const { error } = await supabase
    .from("game_entries")
    .upsert(rows, {
      onConflict: "game_id,category,title",
    });

  if (error) {
    console.log("Map sync error:", error.message);
    return;
  }

  console.log(`Saved ${rows.length} maps.`);
}

async function syncRivals() {
  try {
    const gameId = await getMarvelRivalsGameId();

    await syncHeroes(gameId);
    await syncMaps(gameId);

    console.log("Marvel Rivals sync complete.");
  } catch (error) {
    console.log("Sync failed:", error.message);
  }
}

syncRivals();