import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function GamesScreen() {
  const [games, setGames] = useState<any[]>([]);

  useEffect(() => {
    loadGames();
  }, []);

  async function loadGames() {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .order("name");

    if (error) {
      console.log(error);
      return;
    }

    setGames(data || []);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Games</Text>
      <Text style={styles.subtitle}>Choose a game to explore.</Text>

      {games.map((game) => (
        <Pressable
          key={game.id}
          style={styles.card}
          onPress={() => router.push(`/game/${game.id}`)}
        >
          <ImageBackground
            source={{ uri: game.image_url }}
            style={styles.image}
            imageStyle={styles.imageStyle}
          >
            <View style={styles.overlay}>
              <Text style={styles.cardTitle}>{game.name}</Text>
              <Text style={styles.genre}>{game.genre}</Text>
              <Text style={styles.desc}>{game.description}</Text>
            </View>
          </ImageBackground>
        </Pressable>
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
    height: 190,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
    backgroundColor: "#0F172A",
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderRadius: 24,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 18,
    backgroundColor: "rgba(2, 6, 23, 0.58)",
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#F8FAFC",
  },
  genre: {
    color: "#A5B4FC",
    fontWeight: "900",
    marginTop: 4,
    marginBottom: 8,
  },
  desc: {
    color: "#E2E8F0",
    lineHeight: 22,
  },
});
