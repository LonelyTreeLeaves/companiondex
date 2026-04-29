const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

function splitHeroes(teamrole) {
  if (!teamrole) return [];

  return teamrole
    .replace(/x/g, "&")
    .split("&")
    .map((hero) => hero.trim())
    .filter(Boolean)
    .map((hero) => {
      if (hero.toLowerCase() === "thing") return "The Thing";
      if (hero.toLowerCase() === "human torch") return "Human Torch";
      if (hero.toLowerCase() === "rocket racoon") return "Rocket Raccoon";
      if (hero.toLowerCase() === "jeff the land shark") return "Jeff The Land Shark";
      return hero;
    });
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
    const effect = "Official Marvel Rivals Team-Up from Season 7.5 official team-up data.";

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

    rows.push({
      game_id: gameId,
      name,
      anchor_hero: anchorHero,
      partner_heroes: partnerHeroes,
      effect: effect || "Official Marvel Rivals Team-Up.",
      source_name: "Official Team-Up",
      source_url: "https://www.marvelrivals.com/m/heroes/teamup.html",
    });

    seen.add(name);
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

  rows.forEach((row, index) => {
    console.log(
      `${index + 1}. ${row.name} — ${row.anchor_hero} + ${row.partner_heroes.join(", ")}`
    );
  });
}

syncTeamUps().catch((error) => {
  console.log("Failed:", error.message);
});