import { ScrollView, View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import SneeTip from "../../../../components/SneeTip";
import BussSecret from "../../../../components/BussSecret"
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const guideContent: Record<string, any> = {
  "beginner-basics": {
    title: "Beginner Basics",
    subtitle: "The core things every new Marvel Rivals player should understand.",
    sections: [
      {
        title: "What Is Marvel Rivals?",
        body:
          "Marvel Rivals is a team-based hero shooter. Winning is not just about getting eliminations. You win by controlling objectives, fighting with your team, using roles correctly, and surviving important teamfights.",
      },
      {
        title: "The Three Roles",
        body:
          "Vanguards create space and protect the team. Duelists deal damage and secure eliminations. Strategists heal, support, and keep the team alive. A good team needs all three roles working together.",
      },
      {
        title: "What Actually Wins Games",
        body:
          "Marvel Rivals is won by taking space, controlling objectives, and winning teamfights together. Eliminations help, but they only matter if they help your team capture, defend, push, or hold the objective. The strongest teams group up, protect their Strategists, use ultimates together, and know when to back out instead of feeding one by one.",
        sneeTip:
          "Stay with your team. Even strong heroes lose quickly when they run in alone.",
        bussSecret:
          "Most fights are decided before anyone uses an ultimate. The team with better positioning usually controls the fight.",
      },
      {
        title: "Common Beginner Mistakes",
        body:
            "The biggest beginner mistakes are running in alone, chasing kills too far, ignoring the objective, standing in the open, using ultimates after the fight is already lost, and not waiting for teammates to respawn. Another common mistake is blaming healing when the real issue is positioning, overextending, or fighting without cover.",
      },
      {
        title: "Best Beginner Heroes",
        body:
            "Best beginner Vanguards: Groot, The Thing, Venom, and Magneto. Best beginner Duelists: The Punisher, Scarlet Witch, Squirrel Girl, Star-Lord, and Namor. Best beginner Strategists: Mantis, Rocket Raccoon, Luna Snow, Jeff The Land Shark, and Cloak & Dagger. These heroes are easier to understand while still teaching important game fundamentals.",
      },
    ],
  },

  "team-compositions": {
    title: "Team Compositions Academy",
    subtitle: "Learn how heroes work together to create powerful team strategies.",
    sections: [
      {
        title: "What Is A Team Composition?",
        body:
          "A team composition is how your six heroes work together. Strong compositions have a clear plan and each hero contributes to that plan. Random heroes can still win, but coordinated compositions are much stronger.",
        sneeTip:
          "Think about how your hero helps the rest of your team.",
        bussSecret:
          "Many players focus on hero strength instead of team synergy.",
      },
      {
        title: "Dive Composition",
        body:
          "Dive teams use mobility to quickly attack vulnerable backline targets. Dive heroes jump past the enemy frontline and pressure Strategists and Duelists.",
        sneeTip:
          "Dive works best when everyone attacks together.",
        bussSecret:
          "A single diver is feeding. Multiple divers create pressure.",
      },
      {
        title: "Brawl Composition",
        body:
          "Brawl teams want close-range fights. They use durable Vanguards, strong healing, and sustained damage to overwhelm enemies.",
        sneeTip:
          "Stay grouped and push together.",
        bussSecret:
          "Brawl loses when players split apart.",
      },
      {
        title: "Poke Composition",
        body:
          "Poke teams deal damage from range before fully engaging. The goal is to weaken enemies before the teamfight starts.",
        sneeTip:
          "Use cover and keep pressure on enemies.",
        bussSecret:
          "Poke teams often win without needing a full commit.",
      },
      {
        title: "Protect Composition",
        body:
          "Protect compositions focus on keeping one powerful hero alive. The team uses shields, healing, and utility to support a key damage dealer.",
        sneeTip:
          "Stay near the hero you're protecting.",
        bussSecret:
          "A protected carry can become nearly unstoppable.",
      },
      {
        title: "Rush Composition",
        body:
          "Rush teams use speed and aggression to quickly overwhelm enemies before they can react.",
        sneeTip:
          "Commit together and commit quickly.",
        bussSecret:
          "Rush succeeds because it removes the enemy's time to prepare.",
      },
      {
        title: "Choosing The Right Composition",
        body:
          "Different maps, objectives, and enemy teams favour different compositions. Learning when to swap styles is a major skill for improving players.",
        sneeTip:
          "Adapt to the match instead of forcing one strategy.",
        bussSecret:
          "The best players change plans when the situation changes.",
      },
      {
        title: "📚 Lesson Summary",
        body:
          "Team compositions are how heroes work together. Dive attacks the backline, Brawl fights up close, Poke pressures from range, Protect supports a carry, and Rush overwhelms opponents with speed.",
        sneeTip:
          "Strong teamwork beats individual hero strength.",
        bussSecret:
          "Most ranked matches are won by the team with the better composition.",
      },
      {
        title: "🎓 Quick Quiz",
        body:
          "1. What is a team composition?\n\n2. What does Dive target?\n\n3. What does Brawl want?\n\n4. Why are Poke teams effective?\n\n5. What makes Rush dangerous?",
        sneeTip:
          "Try answering before rereading the lesson.",
        bussSecret:
          "Understanding compositions makes hero selection much easier.",
      },
      {
        title: "⭐ Academy Complete",
        body:
          "Congratulations. You completed Team Compositions Academy and learned the five major composition styles used throughout Marvel Rivals.",
        sneeTip:
          "Every lesson completed makes you a stronger teammate.",
        bussSecret:
          "Composition knowledge separates experienced players from beginners.",
      },
    ],
  },

  "hero-selection": {
    title: "Hero Selection Academy",
    subtitle: "Learn how to pick the right hero for the situation.",
    sections: [
      {
        title: "There Is No Perfect Hero",
        body:
          "Most new players look for the strongest hero. In reality, every hero has strengths and weaknesses. Hero selection is about choosing the right hero for the current match.",
        sneeTip:
          "Play heroes you're comfortable with first.",
        bussSecret:
          "A great player on a good hero beats an average player on a meta hero.",
      },
      {
        title: "Consider Your Team",
        body:
          "Before locking in a hero, look at your teammates. Teams generally need a Vanguard, damage dealers, and support. Picking a fifth Duelist is rarely the answer.",
        sneeTip:
          "Fill missing roles whenever possible.",
        bussSecret:
          "The easiest games are often won in hero select.",
      },
      {
        title: "Consider The Enemy",
        body:
          "If an enemy hero is causing problems, consider swapping to something that counters them. Adaptation is one of the most important skills in Marvel Rivals.",
        sneeTip:
          "Don't be afraid to switch heroes.",
        bussSecret:
          "Counter-picking is often stronger than mechanical skill.",
      },
      {
        title: "Play To The Map",
        body:
          "Different maps favour different heroes. Open maps reward long-range pressure while tighter maps reward close-range brawling.",
        sneeTip:
          "Think about where fights happen.",
        bussSecret:
          "Map knowledge creates free advantages.",
      },
      {
        title: "Comfort Picks Matter",
        body:
          "A hero you're skilled with is often stronger than a hero you've barely played. Learn a small hero pool before expanding.",
        sneeTip:
          "Master a few heroes before learning everything.",
        bussSecret:
          "Most top players specialise before diversifying.",
      },
      {
        title: "When Should You Swap?",
        body:
          "Swap when your current hero cannot do their job. This might happen if you are constantly being countered, unable to reach enemies, unable to survive, or your team composition is missing something important.",
        sneeTip:
          "If the same problem keeps happening every fight, consider swapping.",
        bussSecret:
          "Do not swap after every death. Look for repeated patterns before changing heroes.",
      },
      {
        title: "Beginner Hero Pool",
        body:
          "A strong beginner hero pool should include one hero from each role. For example, one Vanguard, one Duelist, and one Strategist. This lets you help your team without needing to master every hero immediately.",
        sneeTip:
          "Start small. One hero per role is enough at first.",
        bussSecret:
          "A small flexible hero pool is better than randomly playing ten heroes poorly.",
      },
      {
        title: "📚 Lesson Summary",
        body:
          "Hero selection is about choosing the right hero for your team, the enemy team, the map, and your own comfort level. The best pick is not always the most popular hero. The best pick is the hero that helps solve the current match.",
        sneeTip:
          "Choose heroes with purpose, not panic.",
        bussSecret:
          "Hero selection is one of the most overlooked skills in Marvel Rivals.",
      },
      {
        title: "🎓 Quick Quiz",
        body:
          "1. Is there one perfect hero for every match?\n\n2. What should you check before locking in a hero?\n\n3. When should you consider swapping?\n\n4. Why does the map matter?\n\n5. What is a comfort pick?",
        sneeTip:
          "Try answering before rereading the lesson.",
        bussSecret:
          "If you can explain your pick, you are already thinking like a better player.",
      },
      {
        title: "⭐ Academy Complete",
        body:
          "Congratulations. You completed Hero Selection Academy and learned how to choose heroes based on team needs, enemy threats, map style, and personal comfort.",
        sneeTip:
          "The right hero at the right time can change an entire match.",
        bussSecret:
          "Smart hero selection makes every teammate stronger.",
      },
    ],
  },

  "roles-explained": {
    title: "Roles Explained",
    subtitle: "Understand what each role is meant to do.",
    sections: [
      {
        title: "Vanguard",
        body:
          "Vanguards are the frontline. Their job is to create space, absorb pressure, protect teammates, and start fights safely.",
      },
      {
        title: "Duelist",
        body:
          "Duelists are damage heroes. Their job is to pressure enemies, secure eliminations, and punish weak or isolated targets.",
      },
      {
        title: "Strategist",
        body:
          "Strategists keep the team alive. They heal, provide utility, protect teammates, and help control the pace of fights.",
      },
    ],
  },

  teamfights: {
    title: "Teamfight Academy",
    subtitle: "Learn when to engage, regroup, use ultimates, and stop staggering.",
    sections: [
      {
        title: "What Is A Teamfight?",
        body:
          "A teamfight is when both teams commit to fighting around an objective or important area. Most matches are decided by who wins these fights, not by random eliminations across the map.",
        sneeTip:
          "Try to fight when your team is nearby, not when you are alone.",
        bussSecret:
          "A teamfight usually starts before damage happens. Positioning and cooldowns decide who has the advantage.",
      },
      {
        title: "Group Before Fighting",
        body:
          "If your teammates are dead or walking back from spawn, wait before engaging. Going in alone usually gives the enemy a free elimination and delays your next full team push.",
        sneeTip:
          "Look around before entering a fight. If your team is not there, wait.",
        bussSecret:
          "Staggering is when players die one by one. It is one of the biggest reasons teams lose games.",
      },
      {
        title: "Follow The Engage",
        body:
          "When your Vanguard starts a safe engage, be ready to follow up. Duelists should pressure vulnerable targets, and Strategists should support the push while staying safe.",
        sneeTip:
          "If your tank goes in safely, help them. If they go in alone, do not throw yourself away too.",
        bussSecret:
          "Good follow-up wins fights faster than random damage.",
      },
      {
        title: "Ultimate Timing",
        body:
          "Ultimates are strongest when used before or during a winnable fight. Avoid using ultimates after most of your team is already dead. Combining ultimates with teammates can win fights instantly.",
        sneeTip:
          "Use your ultimate when your team can follow up.",
        bussSecret:
          "One ultimate can start a fight. Two coordinated ultimates can end it.",
      },
      {
        title: "Know When To Leave",
        body:
          "If a fight is clearly lost, escaping is often better than dying late. Staying alive lets you regroup faster and prevents the enemy from gaining even more time.",
        sneeTip:
          "Backing out is not giving up. It helps your team reset.",
        bussSecret:
          "The last player dying late can delay the entire next teamfight.",
      },
      {
        title: "📚 Lesson Summary",
        body:
          "Teamfights are won by coordination, positioning, timing, and proper ultimate usage. Avoid staggering, engage together, and know when to retreat.",
        sneeTip:
          "Winning together is stronger than fighting alone.",
        bussSecret:
          "The best players know when NOT to fight.",
      },
      {
        title: "🎓 Quick Quiz",
        body:
          "1. What is a teamfight?\n\n2. What does staggering mean?\n\n3. Why should you regroup?\n\n4. When should ultimates be used?\n\n5. Why is retreating sometimes correct?",
        sneeTip:
          "A wrong answer is just a future lesson learned.",
        bussSecret:
          "Most fights are lost before they begin because of poor preparation.",
      },
      {
        title: "⭐ Academy Complete",
        body:
          "Congratulations. You completed Teamfight Academy and learned how coordination, regrouping, timing, and ultimate management decide matches.",
        sneeTip:
          "A team that works together is stronger than five individual stars.",
        bussSecret:
          "Many players focus on mechanics while ignoring teamwork.",
      },
    ],
  },

  positioning: {
    title: "Positioning Academy",
    subtitle: "Learn where to stand, how to use cover, and how to survive longer.",
    sections: [
      {
        title: "What Is Positioning?",
        body:
          "Positioning is where you stand during a fight. Good positioning lets you deal damage, heal allies, escape danger, and survive longer. Bad positioning makes you easy to dive, burst, or separate from your team.",
        sneeTip:
          "Try to stand somewhere you can help your team while still having a way to hide or escape.",
        bussSecret:
          "Strong positioning often wins fights before anyone uses an ultimate.",
      },
      {
        title: "Use Cover",
        body:
          "Cover means walls, corners, payloads, buildings, shields, and objects that block enemy damage. You should avoid standing in the open for long periods. If enemies shoot you, step behind cover instead of relying only on healing.",
        sneeTip:
          "A good rule is: if you are taking damage, ask yourself where your nearest cover is.",
        bussSecret:
          "Healing is stronger when paired with cover. If you stand in the open, even the best Strategist cannot always save you.",
      },
      {
        title: "High Ground",
        body:
          "High ground gives better vision, safer angles, and stronger pressure. Duelists and Strategists often benefit from high ground because it makes them harder to reach and easier to protect.",
        sneeTip:
          "If your hero can safely reach high ground, use it before the fight starts.",
        bussSecret:
          "High ground is powerful because enemies usually need to spend mobility cooldowns to reach you.",
      },
      {
        title: "Do Not Stand Alone",
        body:
          "Being isolated makes you an easy target. Stay close enough that your team can help you, but not so close that everyone gets hit by the same enemy ability or ultimate.",
        sneeTip:
          "You do not need to stand on top of your team. Just stay close enough that they can help.",
        bussSecret:
          "Good players punish isolated targets instantly. If you are alone, you are probably the easiest target.",
      },
      {
        title: "Role Positioning",
        body:
          "Vanguards usually stand near the front to create space. Duelists use side angles, flanks, or high ground to apply pressure. Strategists stay safer behind cover while keeping line of sight on teammates.",
        sneeTip:
          "Your role helps decide where you should stand.",
        bussSecret:
          "Most beginner mistakes happen because players stand in the wrong place for their role.",
      },
      {
        title: "📚 Lesson Summary",
        body:
          "Good positioning keeps you alive, creates pressure, and allows you to help your team. Use cover, high ground, and role-specific positioning to gain advantages before fights even begin.",
        sneeTip:
          "Before every fight, ask yourself where your safest position is.",
        bussSecret:
          "Most fights are decided by positioning long before the first elimination.",
      },
      {
        title: "🎓 Quick Quiz",
        body:
          "1. What is cover?\n\n2. Why is high ground powerful?\n\n3. Why should you avoid standing alone?\n\n4. Where should Strategists usually position?\n\n5. What role does positioning play in winning fights?",
        sneeTip:
          "If you can explain it, you understand it.",
        bussSecret:
          "Players often blame aim when the real problem is positioning.",
      },
      {
        title: "⭐ Academy Complete",
        body:
          "Congratulations. You completed Positioning Academy and learned how cover, high ground, spacing, and role positioning improve your performance.",
        sneeTip:
          "Every great player started by learning fundamentals.",
        bussSecret:
          "Positioning is the hidden skill behind almost every high-ranked player.",
      },
    ],
  },

  objectives: {
    title: "Objectives Academy",
    subtitle: "Kills help, but objectives win the match.",
    sections: [
      {
        title: "Objectives Win Games",
        body:
          "Marvel Rivals is not won by eliminations alone. Eliminations are useful because they help your team capture, push, defend, or hold objectives. If your team wins a fight but leaves the objective, you may still lose progress.",
        sneeTip:
          "After winning a fight, return to the objective instead of chasing too far.",
        bussSecret:
          "A kill only matters if it creates objective pressure.",
      },
      {
        title: "Do Not Overchase",
        body:
          "Chasing one enemy too far can pull you away from the objective and split your team. If your team already won the fight, secure the objective, reset positions, and prepare for the next enemy push.",
        sneeTip:
          "If you chase too far, your team might lose the objective behind you.",
        bussSecret:
          "Overchasing is one of the easiest ways to turn a won fight into a lost one.",
      },
      {
        title: "Contesting",
        body:
          "Contesting means standing on or near the objective so the enemy cannot freely capture or finish progress. Contesting is important, but you should not throw your life away unless it is overtime or a final fight.",
        sneeTip:
          "Touch the objective when needed, but try to stay alive while doing it.",
        bussSecret:
          "The best contest is not always the first person touching point. Sometimes waiting half a second for teammates is stronger.",
      },
      {
        title: "Overtime",
        body:
          "Overtime happens when the objective is contested near the end. During overtime, staying alive becomes extremely important. Use cover, defensive cooldowns, mobility, and ultimates carefully.",
        sneeTip:
          "In overtime, survival matters more than chasing damage.",
        bussSecret:
          "Do not waste movement abilities before touching point. You may need them to survive after contesting.",
      },
      {
        title: "Objective Pressure",
        body:
          "Objective pressure means forcing the enemy to respond to where your team is standing. Sometimes controlling space around the objective is stronger than standing directly on it too early.",
        sneeTip:
          "Help your team control the area around the objective, not just the objective itself.",
        bussSecret:
          "Good teams win objectives by controlling entrances, cover, and enemy approach paths.",
      },
      {
        title: "📚 Lesson Summary",
        body:
          "Objectives win matches. Eliminations are important because they create opportunities to capture, defend, and control objectives. Avoid overchasing, understand when to contest, and focus on creating objective pressure rather than hunting eliminations.",
        sneeTip:
          "Whenever you win a fight, ask yourself: what objective should we take next?",
        bussSecret:
          "The best teams think about objectives first and eliminations second.",
      
      },
      {
        title: "🎓 Quick Quiz",
        body:
          "1. What wins games: eliminations or objectives?\n\n2. What is overchasing?\n\n3. Why is objective pressure important?\n\n4. When should you contest?\n\n5. What should you do after winning a teamfight?",
        sneeTip:
          "Try answering before looking at the lesson again.",
        bussSecret:
          "Teaching yourself is one of the fastest ways to learn.",
      },
      {
        title: "⭐ Academy Complete",
        body:
          "Congratulations. You have completed Objectives Academy. You now understand how objectives, contesting, overtime, and objective pressure work together to win matches.",
        sneeTip:
          "Every lesson completed makes you a stronger player.",
        bussSecret:
          "Most players never study fundamentals. You're already ahead of them.",
      },
    ],
  },

  "ult-economy": {
    title: "Ult Economy Academy",
    subtitle: "Learn how ultimate management wins games.",
    sections: [
      {
        title: "What Is Ult Economy?",
        body:
          "Ult economy is the management of ultimates throughout a match. Good teams use ultimates efficiently to win fights while saving resources for future engagements.",
        sneeTip:
          "Think of ultimates as powerful resources, not panic buttons.",
        bussSecret:
          "Most players waste ultimates because they focus on the current fight and ignore the next one.",
      },
      {
        title: "Don't Ult Lost Fights",
        body:
          "If most of your team is already dead, using an ultimate rarely changes the outcome. Saving it for the next fight often creates more value.",
        sneeTip:
          "Ask yourself: can this fight still be won?",
        bussSecret:
          "Many players throw away game-winning ultimates trying to save a lost fight.",
      },
      {
        title: "Don't Overcommit Ultimates",
        body:
          "Using four or five ultimates to win one fight is often unnecessary. Winning with fewer ultimates means having more available for future fights.",
        sneeTip:
          "Use only what you need.",
        bussSecret:
          "Winning a fight with one ultimate is often better than winning it with four.",
      },
      {
        title: "Ultimate Combos",
        body:
          "Some ultimates become significantly stronger when combined. Coordinated ultimates can instantly win fights and create huge momentum swings.",
        sneeTip:
          "Communicate before using your ultimate.",
        bussSecret:
          "Two coordinated ultimates are often stronger than four random ones.",
      },
      {
        title: "Track Enemy Ultimates",
        body:
          "Pay attention to which enemy heroes have recently used their ultimates. If an enemy has not used an ultimate for several fights, they may be preparing one.",
        sneeTip:
          "Watch for patterns in enemy behaviour.",
        bussSecret:
          "Advanced players often predict ultimates before they happen.",
      },
      {
        title: "📚 Lesson Summary",
        body:
          "Ult economy is about using ultimates efficiently. Avoid wasting them, avoid overcommitting, coordinate with teammates, and think about future fights.",
        sneeTip:
          "The best ultimate is the one that wins the fight with the least investment.",
        bussSecret:
          "Good ult economy can overcome mechanical skill differences.",
      },
      {
        title: "🎓 Quick Quiz",
        body:
          "1. What is ult economy?\n\n2. When should you avoid using an ultimate?\n\n3. Why are ultimate combos powerful?\n\n4. What does overcommitting mean?\n\n5. Why track enemy ultimates?",
        sneeTip:
          "Try answering before rereading the lesson.",
        bussSecret:
          "Understanding ult economy is one of the biggest jumps in player knowledge.",
      },
      {
        title: "⭐ Academy Complete",
        body:
          "Congratulations. You completed Ult Economy Academy and learned how ultimate management can decide entire matches.",
        sneeTip:
          "Every ultimate has value. Spend it wisely.",
        bussSecret:
          "Advanced players think about the next fight before the current one ends.",
      },
    ],
  },

  "vanguard-guide": {
    title: "Vanguard Guide",
    subtitle: "Learn how to lead fights, protect teammates, and control space.",
    sections: [
      {
        title: "What Is A Vanguard?",
        body:
          "Vanguards are the frontline tanks of Marvel Rivals. Their job is to absorb pressure, create space, start fights safely, and protect vulnerable teammates.",
      },
      {
        title: "Your Main Responsibilities",
        body:
            "Vanguards control the pace of fights. You should lead pushes, contest objectives, block dangerous enemy pressure, and create safe space for Duelists and Strategists.",
      },
      {
        title: "Common Vanguard Mistakes",
        body:
            "Do not push alone without your team. Do not chase kills too far. Do not abandon your supports. Avoid wasting defensive cooldowns before fights begin.",
      },
      {
        title: "Positioning",
        body:
            "Stay between enemies and your team whenever possible. Use corners and cover instead of standing in open sightlines for too long.",
      },
      {
        title: "Beginner Friendly Vanguards",
        body:
            "Groot, The Thing, Venom, and Magneto are excellent beginner Vanguards because they have strong survivability and straightforward abilities.",
      },
      {
        title: "Advanced Concepts",
        body:
          "Good Vanguards understand tempo, space control, ultimate tracking, peeling for supports, and when to engage or disengage fights.",
      },
    ],
    recommendedHeroes: {
        beginner: [
          "Groot",
          "The Thing",
        ],
        intermediate: [
          "Magneto",
          "Venom",
        ],
        advanced: [
          "Hulk",
          "Doctor Strange",
        ],
    },
  },
  "duelist-guide": {
    title: "Duelist Guide",
    subtitle: "Learn how to pressure enemies, secure eliminations, and carry fights.",
    sections: [
      {
        title: "What Is A Duelist?",
        body:
            "Duelists are the primary damage dealers in Marvel Rivals. Their job is to pressure enemies, secure eliminations, punish mistakes, and threaten enemy supports.",
      },
      {
        title: "Your Main Responsibilities",
        body:
            "Pressure weak targets, follow up on Vanguard engages, and force enemies to play defensively through constant threat.",
      },
      {
        title: "Common Duelist Mistakes",
        body:
            "Do not overextend without support. Avoid taking fights alone constantly. Do not tunnel vision on kills while ignoring objectives.",
      },
      {
        title: "Positioning",
        body:
            "Use off-angles, flanks, and cover to create pressure safely. Avoid standing directly in front of enemy teams unless your hero specializes in brawling.",
      },
      {
        title: "Beginner Friendly Duelists",
        body:
            "Punisher, Scarlet Witch, Squirrel Girl, and Star-Lord are strong beginner Duelists because they provide reliable pressure without extremely difficult mechanics.",
      },
      {
        title: "Advanced Concepts",
        body:
            "Strong Duelists learn cooldown tracking, angle control, target priority, burst timing, and how to pressure without feeding.",
      },
    ],
    recommendedHeroes: {
        beginner: [
          "Punisher",
          "Scarlet Witch",
          "Squirrel Girl",
        ],
        intermediate: [
          "Star-Lord",
          "Namor",
          "Moon Knight",
        ],
        advanced: [
          "Spider-Man",
          "Psylocke",
          "Wolverine",
        ],
    },
  },
  "strategist-guide": {
    title: "Strategist Guide",
    subtitle: "Learn healing, utility, positioning, and support fundamentals.",
    sections: [
      {
        title: "What Is A Strategist?",
        body:
            "Strategists are the support heroes of Marvel Rivals. Their job is to heal allies, provide utility, protect teammates, and help control the pace of fights.",
      },
      {
        title: "Your Main Responsibilities",
        body:
            "Keep teammates alive, manage cooldowns carefully, support engages, and survive long enough to sustain the team during fights.",
      },
      {
        title: "Common Strategist Mistakes",
        body:
            "Do not stand too close to the frontline. Avoid tunnel vision healing one player. Do not waste mobility cooldowns carelessly.",
      },
      {
        title: "Positioning",
        body:
            "Stay near cover and maintain vision on your team. Position where allies can be healed while still remaining difficult for enemies to dive.",
      },
      {
        title: "Beginner Friendly Strategists",
        body:
            "Rocket Raccoon, Mantis, Luna Snow, and Cloak & Dagger are excellent beginner Strategists due to strong healing and forgiving utility.",
      },
      {
        title: "Advanced Concepts",
        body:
            "Elite Strategists understand positioning, cooldown economy, ultimate tempo, peeling, and when to damage versus heal.",
      },
    ],
    recommendedHeroes: {
        beginner: [
          "Mantis",
          "Rocket Raccoon",
        ],
        intermediate: [
          "Luna Snow",
          "Jeff the Land Shark",
        ],
        advanced: [
          "Loki",
          "Cloak & Dagger",
        ],
    },
  },
};

export default function GuideDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [recommendedEntries, setRecommendedEntries] = useState<any[]>([]);
  
  const guide = guideContent[String(id)];
  useEffect(() => {
    async function loadRecommendedHeroes() {
      if (!guide?.recommendedHeroes) return;

      const heroNames = [
        ...guide.recommendedHeroes.beginner,
        ...guide.recommendedHeroes.intermediate,
        ...guide.recommendedHeroes.advanced,
      ];

      const { data, error } = await supabase
        .from("game_entries")
        .select("id, title, category, image_url, summary")
        .in("title", heroNames);

      if (error) {
        console.log("Recommended hero load error:", error.message);
        return;
      }

      setRecommendedEntries(data || []);
      console.log("Recommended entries:", data);
    }

    loadRecommendedHeroes();
  }, [id]);

  async function markLessonComplete() {
    try {
      const stored = await AsyncStorage.getItem(
        "academy-completed"
      );

      const completed = stored
        ? JSON.parse(stored)
        : [];

      if (!completed.includes(id)) {
        completed.push(id);

        await AsyncStorage.setItem(
          "academy-completed",
          JSON.stringify(completed)
        );

        alert("Lesson Completed!");
      } else {
        alert("Lesson already completed!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!guide) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Guide not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Beginner Guide</Text>
      <Text style={styles.title}>{guide.title}</Text>
      <Text style={styles.subtitle}>{guide.subtitle}</Text>

      {guide.sections.map((section: any, index: number) => (
        <View key={index} style={styles.card}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.text}>{section.body}</Text>

          {section.sneeTip && <SneeTip tip={section.sneeTip} />}

          {section.bussSecret && (
            <BussSecret secret={section.bussSecret} />
          )}
        </View>
      ))}
      {guide.recommendedHeroes && (
        <View style={styles.heroRecommendations}>
          <Text style={styles.sectionTitle}>Recommended Heroes</Text>

          {[
            { label: "🟢 Beginner Friendly", heroes: guide.recommendedHeroes.beginner },
            { label: "🟡 Intermediate", heroes: guide.recommendedHeroes.intermediate },
            { label: "🔴 Advanced", heroes: guide.recommendedHeroes.advanced },
          ].map((tier) => (
            <View key={tier.label}>
              <Text style={styles.heroTier}>{tier.label}</Text>

              <View style={styles.recommendationGrid}>
                {tier.heroes.map((heroName: string) => {
                  const hero = recommendedEntries.find(
                    (entry) =>
                      entry.title?.toLowerCase().trim() ===
                      heroName.toLowerCase().trim()
                  );

                  return (
                    <Pressable
                      key={heroName}
                      style={styles.recommendedHeroCard}
                      onPress={() => {
                        console.log("CARD CLICKED:", heroName);

                        if (!hero?.id) {
                          alert(`No hero ID found for ${heroName}`);
                          return;
                        }

                        router.push(`/entry/${hero.id}?isFav=false`);
                      }}
                    >
                      {hero?.image_url ? (
                        <Image
                          source={{ uri: hero.image_url }}
                          style={styles.recommendedHeroImage}
                        />
                      ) : (
                        <View style={styles.recommendedHeroInitial}>
                          <Text style={styles.recommendedHeroInitialText}>
                            {heroName.charAt(0)}
                          </Text>
                        </View>
                      )}

                      <Text style={styles.recommendedHeroName}>{heroName}</Text>

                      {hero?.category && (
                        <Text style={styles.recommendedHeroRole}>{hero.category}</Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      )}
      <Pressable
        style={styles.completeButton}
        onPress={markLessonComplete}
      >
        <Text style={styles.completeButtonText}>
          ✅ Complete Lesson
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MARVEL.background,
  },
  content: {
    padding: 22,
    paddingBottom: 40,
  },
  eyebrow: {
    color: "#EF4444",
    fontWeight: "900",
    marginBottom: 8,
  },
  title: {
    color: MARVEL.text,
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 8,
  },
  subtitle: {
    color: MARVEL.muted ,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 22,
  },
  card: {
    backgroundColor: MARVEL.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: MARVEL.border,
    padding: 18,
    marginBottom: 16,
  },
  completeButton: {
    backgroundColor: "#16A34A",
    padding: 18,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  completeButtonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 18,
  },
  heroRecommendations: {
    backgroundColor: MARVEL.card,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: MARVEL.border,
  },
  heroTier: {
    color: MARVEL.primary,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 6,
  },
  heroNames: {
    color: MARVEL.text,
    fontSize: 15,
    lineHeight: 24,
  },
  recommendationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
  },
  recommendedHeroCard: {
    width: 130,
    backgroundColor: MARVEL.cardSoft,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: MARVEL.border,
    padding: 12,
    alignItems: "center",
  },
  recommendedHeroImage: {
    width: 64,
    height: 64,
    borderRadius: 18,
    marginBottom: 8,
    backgroundColor: MARVEL.backgroundDark,
  },
  recommendedHeroInitial: {
    width: 64,
    height: 64,
    borderRadius: 18,
    marginBottom: 8,
    backgroundColor: MARVEL.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  recommendedHeroInitialText: {
    color: MARVEL.text,
    fontSize: 28,
    fontWeight: "900",
  },
  recommendedHeroName: {
    color: MARVEL.text,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },
  recommendedHeroRole: {
    color: MARVEL.primary,
    fontSize: 11,
    fontWeight: "900",
    marginTop: 4,
  },
  sectionTitle: {
    color: MARVEL.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 10,
  },
  text: {
    color: MARVEL.muted,
    fontSize: 15,
    lineHeight: 24,
  },
});