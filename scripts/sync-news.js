const Parser = require("rss-parser");
const { createClient } = require("@supabase/supabase-js");

const parser = new Parser();

const supabaseUrl = "https://eaofxanagjidpvfinavr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhb2Z4YW5hZ2ppZHB2ZmluYXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5OTIyNTUsImV4cCI6MjA5MjU2ODI1NX0.jF2nnUKbPhWxU62MTCyYo-D9QiX1dzBWiDWyU90IDts";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const feeds = [
  {
    game_name: "Gaming News",
    source_name: "IGN",
    feed_url: "https://feeds.ign.com/ign/games-all",
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

  const newsItems = feed.items.slice(0, 10).map((item) => ({
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