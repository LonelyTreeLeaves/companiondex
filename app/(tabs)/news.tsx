import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Linking,
  StyleSheet,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function NewsScreen() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    const { data, error } = await supabase
      .from("news_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setNews(data || []);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>News Feed</Text>

      <Text style={styles.subtitle}>
        Latest saved updates, guides and sources.
      </Text>

      {news.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.game}>{item.game_name}</Text>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.source}>{item.source_name}</Text>
          <Text style={styles.summary}>{item.summary}</Text>

          <Pressable
            style={styles.button}
            onPress={() => Linking.openURL(item.source_url)}
          >
            <Text style={styles.buttonText}>Open Source</Text>
          </Pressable>
        </View>
      ))}
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
  },
  card: {
    backgroundColor: "#0F172A",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 14,
  },
  game: {
    color: "#818CF8",
    fontWeight: "900",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#F8FAFC",
  },
  source: {
    color: "#94A3B8",
    marginTop: 8,
    fontWeight: "700",
  },
  summary: {
    color: "#CBD5E1",
    marginTop: 8,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#6366F1",
    padding: 14,
    borderRadius: 14,
    marginTop: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "900",
  },
});
