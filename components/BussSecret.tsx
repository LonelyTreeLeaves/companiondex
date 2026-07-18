import { View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function BussSecret({
  secret,
}: {
  secret: string;
}) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push("/companions/buss")}
    >
      <View
        style={{
          backgroundColor: "#190B2D",
          borderRadius: 20,
          padding: 16,
          marginTop: 12,
          borderWidth: 1,
          borderColor: "#A855F7",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/images/companions/buss.png")}
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              marginRight: 12,
            }}
          />

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#D8B4FE",
                fontSize: 18,
                fontWeight: "900",
              }}
            >
              🐱 Buss's Secret
            </Text>

            <Text
              style={{
                color: "#E9D5FF",
                marginTop: 4,
                fontSize: 14,
              }}
            >
              Keeper of Secrets
            </Text>
          </View>
        </View>

        <Text
          style={{
            color: "white",
            marginTop: 12,
            lineHeight: 24,
            fontSize: 15,
          }}
        >
          {secret}
        </Text>

        <Text
          style={{
            color: "#D8B4FE",
            marginTop: 10,
            fontSize: 12,
          }}
        >
          Tap Buss to uncover secrets →
        </Text>
      </View>
    </Pressable>
  );
}