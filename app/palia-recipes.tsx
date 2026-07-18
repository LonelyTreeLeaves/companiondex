import { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable, TextInput, Image } from "react-native";
import { supabase } from "../lib/supabase";

export default function PaliaRecipesScreen() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [showUncookedOnly, setShowUncookedOnly] = useState(false);

  useEffect(() => {
    loadRecipes();
  }, []);

  async function loadRecipes() {
    const { data, error } = await supabase
      .from("palia_recipes")
      .select("*")
      .order("recipe_name");

    if (error) {
      console.log("Recipe error:", error.message);
      return;
    }

    setRecipes(data || []);
  }

  async function toggleCooked(recipe: any) {
    const newValue = !recipe.cooked;

    const { error } = await supabase
      .from("palia_recipes")
      .update({ cooked: newValue })
      .eq("id", recipe.id);

    if (error) {
      console.log("Cooked toggle error:", error.message);
      return;
    }

    setRecipes((prev) =>
      prev.map((item) =>
        item.id === recipe.id ? { ...item, cooked: newValue } : item
      )
    );
  }

  const visibleRecipes = showUncookedOnly
    ? recipes.filter((recipe) => !recipe.cooked)
    : recipes;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Palia Recipes</Text>
      <Text style={styles.subtitle}>Track recipes, ingredients, stations and cooked status.</Text>

      <Pressable
        style={styles.toggleButton}
        onPress={() => setShowUncookedOnly(!showUncookedOnly)}
      >
        <Text style={styles.toggleButtonText}>
          {showUncookedOnly ? "Show All" : "Show Uncooked Only"}
        </Text>
      </Pressable>

      {visibleRecipes.map((recipe) => (
        <View key={recipe.id} style={styles.card}>
          <View style={styles.headerRow}>
            {recipe.image_url ? (
              <Image
                source={{ uri: recipe.image_url }}
                style={styles.itemImage}
              />
            ) : (
              <View style={styles.initialBox}>
                <Text style={styles.initialText}>
                  {recipe.recipe_name?.charAt(0)}
                </Text>
              </View>
            )}

            <View style={{ flex: 1 }}>
              <Pressable onPress={() => toggleCooked(recipe)}>
                <Text style={styles.recipeName}>
                  {recipe.cooked ? "✅" : "☐"} {recipe.recipe_name}
                </Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.label}>Ingredients</Text>
          <Text style={styles.text}>{recipe.ingredients?.join(", ") || "Unknown"}</Text>

          <Text style={styles.label}>Stations</Text>
          <Text style={styles.text}>{recipe.stations?.join(", ") || "Unknown"}</Text>

          <Text style={styles.label}>How to Get</Text>
          <Text style={styles.text}>{recipe.how_to_get || "Unknown"}</Text>

          <Text style={styles.label}>Use Notes</Text>
          <Text style={styles.text}>{recipe.use_notes || "No notes yet."}</Text>

          {recipe.focus_amount ? (
            <>
              <Text style={styles.label}>Focus</Text>
              <Text style={styles.text}>{recipe.focus_amount}</Text>
            </>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 22,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 6,
  },
  subtitle: {
    color: "#94A3B8",
    marginBottom: 18,
  },
  toggleButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    marginBottom: 18,
  },
  toggleButtonText: {
    color: "#F8FAFC",
    fontWeight: "900",
  },
  card: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    marginBottom: 12,
  },

  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#1E293B",
  },

  initialBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },

  initialText: {
    color: "#A5B4FC",
    fontSize: 26,
    fontWeight: "900",
  },
  recipeName: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
  },
  label: {
    color: "#A5B4FC",
    fontWeight: "900",
    marginTop: 8,
    marginBottom: 4,
  },
  text: {
    color: "#CBD5E1",
    lineHeight: 22,
  },
});