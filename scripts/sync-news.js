const Parser = require("rss-parser");
const { createClient } = require("@supabase/supabase-js");

const parser = new Parser();

const supabaseUrl = "https://eaofxanagjidpvfinavr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhb2Z4YW5hZ2ppZHB2ZmluYXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5OTIyNTUsImV4cCI6MjA5MjU2ODI1NX0.jF2nnUKbPhWxU62MTCyYo-D9QiX1dzBWiDWyU90IDts";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const feeds = [
  {
    game_name: "Marvel Rivals",
    source_name: "Marvel Rivals Official",
    feed_url: "https://www.marvelrivals.com/news/rss.xml",
    keywords: ["marvel rivals", "season", "hero", "patch", "update"],
  },
  {
    game_name: "Palia",
    source_name: "Palia Official",
    feed_url: "https://palia.com/news/rss.xml",
    keywords: ["palia", "patch", "update", "event"],
  },
  {
    game_name: "Animal Crossing",
    source_name: "Nintendo Life",
    feed_url: "https://www.nintendolife.com/feeds/latest",
    keywords: ["animal crossing", "new horizons"],
  },
  {
    game_name: "Pokémon",
    source_name: "Nintendo Life",
    feed_url: "https://www.nintendolife.com/feeds/latest",
    keywords: ["pokemon", "pokémon"],
  },
];

function cleanText(value) {
  if (!value) return "";
  return value
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function syncFeed(feedConfig) {
  console.log(`Reading feed: ${feedConfig.source_name}`);

  const feed = await parser.parseURL(feedConfig.feed_url);

  const matchingItems = feed.items.filter((item) => {
    const searchableText = `${item.title || ""} ${item.contentSnippet || ""} ${item.content || ""}`
      .toLowerCase();

    return feedConfig.keywords.some((keyword) =>
      searchableText.includes(keyword.toLowerCase())
    );
  });

  const newsItems = matchingItems.slice(0, 10).map((item) => ({
    title: item.title || "Untitled",
    game_name: feedConfig.game_name,
    source_name: feedConfig.source_name,
    source_url: item.link,
    summary: cleanText(item.contentSnippet || item.content || item.summary),
    external_id: item.guid || item.link,
    published_at: item.isoDate || item.pubDate || null,
  }));

  const { error } = await supabase
    .from("news_items")
    .upsert(newsItems, {
      onConflict: "external_id",
    });

  if (error) {
    console.log("Supabase error:", error.message);
    return;
  }

  console.log(`Saved ${newsItems.length} items from ${feedConfig.source_name}`);
}

async function syncNews() {
  console.log("Starting real news sync...");

  for (const feed of feeds) {
    try {
      await syncFeed(feed);
    } catch (error) {
      console.log(`Feed failed: ${feed.source_name}`, error.message);
    }
  }

  console.log("News sync complete.");
}

syncNews();