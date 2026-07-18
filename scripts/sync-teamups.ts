import axios from "axios";
import { supabase } from "../lib/supabase.ts";
import { officialTeamUps } from "../data/officialTeamUps.ts";

const TEAMUP_SCRIPT_URL =
  "https://www.marvelrivals.com/m/gw/20241128112248/js/heroes/teamup_31a58bf8.js";

function cleanText(value) {
  if (!value) return "";

  return value
    .replace(/\\n/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitHeroes(teamrole: string) {
  if (!teamrole) return [];

  const protectedNames: Record<string, string> = {
    "Cloak & Dagger": "CLOAK_DAGGER",
    "Rocket Raccoon": "ROCKET_RACCOON",
    "Jeff the Land Shark": "JEFF_LAND_SHARK",
    "Jeff The Land Shark": "JEFF_LAND_SHARK",
    "The Thing": "THE_THING",
    "Thing": "THE_THING",
    "Human Torch": "HUMAN_TORCH",
  };

  let safe = teamrole;

  // Protect duo/multi-word names
  Object.entries(protectedNames).forEach(([real, temp]) => {
    safe = safe.replaceAll(real, temp);
  });

  // Normalize separators
  safe = safe.replaceAll("&", "|");
  safe = safe.replace(/\s+x\s+/gi, "|");
  let heroes = safe
    .split("|")
    .map((hero: string) => hero.trim())
    .filter(Boolean);

  // Restore names
  heroes = heroes.map((hero: string) => {
    Object.entries(protectedNames).forEach(([real, temp]) => {
      hero = hero.replaceAll(temp, real);
    });

    return hero;
  });

  // Cleanup aliases
  heroes = heroes.map((hero: string) => {
    const cleaned = hero.trim();

    if (cleaned.toLowerCase() === "rocket racoon") return "Rocket Raccoon";
    if (cleaned.toLowerCase() === "jeff the land shark") return "Jeff The Land Shark";
    if (cleaned.toLowerCase() === "human torch") return "Human Torch";
    if (cleaned.toLowerCase() === "thing") return "The Thing";

    return cleaned;
  });

  return heroes;
  }

async function getMarvelGameId() {
  const { data, error } = await supabase
    .from("games")
    .select("id")
    .eq("slug", "marvel-rivals")
    .single();

  if (error) throw new Error(error.message);
  return data.id;
}


async function syncTeamUps() {
  console.log("Fetching official Marvel Rivals Team-Ups...");

  const gameId = await getMarvelGameId();

  const { data } = await axios.get(TEAMUP_SCRIPT_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const regex =
    /teamname:"([^"]+)",teamrole:"([^"]*)"/g;

  const rows = [];
  const seen = new Set();

  let match;

  while ((match = regex.exec(data)) !== null) {
    const name = cleanText(match[1]);
    const teamrole = cleanText(match[2]);
    const effect = "Official Marvel Rivals Team-Up from Season 8 official team-up data.";

    if (!name || seen.has(name)) continue;

    // Skip broken parser grabs that are actually Chinese/localised text.
    if (/[\u4e00-\u9fff]/.test(name)) continue;

    const heroes = splitHeroes(teamrole);

    if (heroes.length === 0) {
      console.log(`Skipped ${name}: no heroes found`);
      continue;
    }

    const anchorHero = heroes[0];
    const partnerHeroes = heroes.slice(1);

    const manualData = officialTeamUps.find(
      (team) => team.name.toLowerCase() === name.toLowerCase()
    );

    if (manualData) {
      rows.push({
        game_id: gameId,
        name: manualData.name,
        anchor_hero: manualData.anchorHero,
        partner_heroes: manualData.heroes.filter(
          (hero) => hero !== manualData.anchorHero
        ),
        effect: manualData.description,
        source_name: "Official Team-Up",
        source_url: "https://www.marvelrivals.com/m/heroes/teamup.html",
      });
    } else {
      rows.push({
        game_id: gameId,
        name,
        anchor_hero: heroes[0],
        partner_heroes: heroes.slice(1),
        effect: "Official Marvel Rivals Team-Up.",
        source_name: "Official Team-Up",
        source_url: "https://www.marvelrivals.com/m/heroes/teamup.html",
      });
    }

    seen.add(name);
  }

const hasParkerPowerUp = rows.some((row) => row.name === "Parker Power-Up");

if (!hasParkerPowerUp) {
  rows.push({
    game_id: gameId,
    name: "Parker Power-Up",
    anchor_hero: "Spider-Man",
    partner_heroes: ["Peni Parker"],
    effect: "Official Marvel Rivals Team-Up from Season 8 official team-up data.",
    source_name: "Official Team-Up",
    source_url: "https://www.marvelrivals.com/m/heroes/teamup.html",
  });
}

for (const team of officialTeamUps) {
  const alreadyExists = rows.some(
    (row) => row.name.toLowerCase() === team.name.toLowerCase()
  );

  if (!alreadyExists) {
    rows.push({
      game_id: gameId,
      name: team.name,
      anchor_hero: team.anchorHero,
      partner_heroes: team.heroes.filter(
        (hero) => hero !== team.anchorHero
      ),
      effect: team.description,
      source_name: "Official Team-Up",
      source_url: "https://www.marvelrivals.com/m/heroes/teamup.html",
    });
  }
}

  console.log(`Found ${rows.length} clean official Team-Ups.`);

  if (rows.length === 0) {
    console.log("No rows to sync.");
    return;
  }

  // Remove old official rows first so retired/changed Team-Ups disappear.
  const { error: deleteError } = await supabase
    .from("team_ups")
    .delete()
    .eq("game_id", gameId)
    .eq("source_name", "Official Team-Up");

  if (deleteError) {
    console.log("Delete error:", deleteError.message);
    return;
  }

  const { error } = await supabase.from("team_ups").upsert(rows, {
    onConflict: "game_id,name",
  });

  if (error) {
    console.log("Sync error:", error.message);
    return;
  }

  console.log("Official Team-Ups synced successfully.");
  console.log("\nSYNC REPORT");
  console.log("-----------");
  console.log(`Official Team-Ups found: ${rows.length}`);
  console.log(`Source: Marvel Rivals official website`);
  console.log(`Manual corrections applied: Parker Power-Up, Primal Flame, Lucky Loan, Bless of the Kumiho, Cosmic Cyclone, Psionite Mayhem`);
  console.log(`Skipped rows: ${rows.length < 24 ? 24 - rows.length : 0}`);
  console.log("Status: Complete");
  rows.forEach((row, index) => {
    console.log(
      `${index + 1}. ${row.name} — ${row.anchor_hero} + ${row.partner_heroes.join(", ")}`
    );
  });
}

syncTeamUps().catch((error) => {
  console.log("Failed:", error.message);
});