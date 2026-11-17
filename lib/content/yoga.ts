export type PracticeType = "Yoga" | "Meditation" | "Pranayama";

export type Practice = {
  slug: string;
  name: string;
  sanskrit: string;
  type: PracticeType;
  level: "Beginner" | "Intermediate" | "Advanced";
  minutes: number;
  focus: string;
  summary: string;
  steps: string[];
  benefits: string[];
  cautions: string[];
  breathing?: string;
  hold?: string;
};

export const PRACTICES: Practice[] = [
  {
    slug: "tadasana",
    name: "Mountain pose",
    sanskrit: "Tadasana",
    type: "Yoga",
    level: "Beginner",
    minutes: 2,
    focus: "Posture and balance",
    summary: "A quiet standing pose that sets alignment for the rest of a practice.",
    steps: [
      "Stand with feet hip-width apart, weight even across both feet.",
      "Lengthen the spine and let the arms rest beside the body, palms facing forward.",
      "Soften the shoulders down and back, and let the jaw relax.",
      "Breathe evenly for 6 to 10 slow breaths, keeping the gaze soft.",
      "Step out gently and shake out the legs before the next pose.",
    ],
    benefits: [
      "Encourages upright posture and body awareness.",
      "Low effort, suitable for most fitness levels.",
      "Useful as a starting and resetting pose.",
    ],
    cautions: [
      "Use a wall for support if balance is limited.",
      "Avoid long standing holds with acute foot or knee pain.",
    ],
    breathing: "Natural breath through the nose.",
    hold: "30 to 60 seconds",
  },
  {
    slug: "surya-namaskar",
    name: "Sun salutation",
    sanskrit: "Surya Namaskar",
    type: "Yoga",
    level: "Beginner",
    minutes: 12,
    focus: "Full-body sequence",
    summary: "A flowing sequence of twelve linked positions that warms the whole body.",
    steps: [
      "Begin standing in mountain pose with hands together at the chest.",
      "Inhale, reach the arms overhead; exhale and fold forward from the hips.",
      "Inhale to a halfway lift, then exhale and step back into a plank.",
      "Lower the knees, chest and chin, then inhale into a gentle backbend.",
      "Exhale into downward-facing dog and hold for 3 breaths.",
      "Step forward, inhale to halfway lift, exhale to fold, then rise with an inhale.",
      "Repeat 4 to 8 rounds, moving with the breath rather than rushing.",
    ],
    benefits: [
      "Provides moderate physical activity and mobility work.",
      "Links movement with breathing, which many people find calming.",
      "Can be adapted by using a chair or wall for support.",
    ],
    cautions: [
      "Skip deep backbends and full plank if you have wrist, shoulder or low back injury.",
      "Avoid inversions during pregnancy; use a modified sequence with a teacher.",
      "Stop if you feel dizzy or breathless.",
    ],
    breathing: "One movement per breath: inhale to lengthen, exhale to fold or lower.",
    hold: "Flow continuously; 4 to 8 rounds",
  },
  {
    slug: "vrikshasana",
    name: "Tree pose",
    sanskrit: "Vrikshasana",
    type: "Yoga",
    level: "Beginner",
    minutes: 3,
    focus: "Balance",
    summary: "A one-legged balance that trains ankle stability and concentration.",
    steps: [
      "Stand in mountain pose and shift weight onto the left foot.",
      "Place the right foot on the inner calf or inner thigh, never on the knee joint.",
      "Bring the hands together at the chest, or overhead if balance allows.",
      "Fix the gaze on a still point ahead and breathe for 5 breaths.",
      "Release, repeat on the other side.",
    ],
    benefits: [
      "Trains balance and ankle strength.",
      "Requires focus, which can interrupt rumination.",
    ],
    cautions: [
      "Keep the foot off the knee joint.",
      "Use a wall if balance is reduced or you have neuropathy.",
    ],
    breathing: "Slow, even breaths.",
    hold: "20 to 30 seconds per side",
  },
  {
    slug: "bhujangasana",
    name: "Cobra pose",
    sanskrit: "Bhujangasana",
    type: "Yoga",
    level: "Beginner",
    minutes: 3,
    focus: "Spine extension",
    summary: "A gentle prone backbend that opens the chest and strengthens the back.",
    steps: [
      "Lie face down with legs extended and the tops of the feet on the floor.",
      "Place the palms beside the ribs, elbows close to the body.",
      "Inhale and lift the chest using the back muscles, keeping the shoulders down.",
      "Keep the neck long and the gaze forward; do not crank the head back.",
      "Exhale to lower slowly. Repeat 3 to 5 times.",
    ],
    benefits: [
      "Strengthens the back extensors.",
      "Counteracts prolonged sitting posture.",
    ],
    cautions: [
      "Avoid during pregnancy and with acute low back pain or recent abdominal surgery.",
      "Do not force the lift with the arms if the back is uncomfortable.",
    ],
    breathing: "Inhale to lift, exhale to lower.",
    hold: "3 to 5 breaths",
  },
  {
    slug: "adho-mukha-svanasana",
    name: "Downward-facing dog",
    sanskrit: "Adho Mukha Svanasana",
    type: "Yoga",
    level: "Intermediate",
    minutes: 4,
    focus: "Hamstrings and shoulders",
    summary: "An inverted V shape that lengthens the back body and loads the shoulders.",
    steps: [
      "Start on hands and knees with wrists under shoulders.",
      "Tuck the toes and lift the hips up and back into an inverted V.",
      "Keep a soft bend in the knees so the spine can lengthen.",
      "Press the floor away through the hands and relax the neck.",
      "Hold for 5 breaths, then lower the knees to the floor.",
    ],
    benefits: [
      "Stretches hamstrings and calves.",
      "Builds shoulder and arm strength.",
    ],
    cautions: [
      "Avoid with uncontrolled high blood pressure or glaucoma if the head is below the heart for long periods.",
      "Use a wall variation with wrist pain.",
      "Not recommended in late pregnancy.",
    ],
    breathing: "Slow nasal breathing.",
    hold: "30 to 60 seconds",
  },
  {
    slug: "virabhadrasana-ii",
    name: "Warrior II",
    sanskrit: "Virabhadrasana II",
    type: "Yoga",
    level: "Intermediate",
    minutes: 4,
    focus: "Leg strength",
    summary: "A wide standing pose that builds leg endurance and hip mobility.",
    steps: [
      "Step the feet wide apart, about one leg length.",
      "Turn the right foot out 90 degrees and the left foot slightly in.",
      "Bend the right knee over the ankle, keeping it tracking over the toes.",
      "Extend the arms parallel to the floor, gaze over the front hand.",
      "Hold 5 breaths, then change sides.",
    ],
    benefits: [
      "Strengthens thighs and glutes.",
      "Opens the hips and chest.",
    ],
    cautions: [
      "Keep the front knee behind the toes and not collapsing inward.",
      "Shorten the stance with knee or hip pain.",
    ],
    breathing: "Steady breath; keep the jaw soft.",
    hold: "30 seconds per side",
  },
  {
    slug: "setu-bandhasana",
    name: "Bridge pose",
    sanskrit: "Setu Bandhasana",
    type: "Yoga",
    level: "Beginner",
    minutes: 3,
    focus: "Glutes and spine",
    summary: "A supported backbend lying on the back, useful for gentle spine extension.",
    steps: [
      "Lie on your back with knees bent and feet hip-width apart.",
      "Press through the feet and lift the hips a few inches.",
      "Keep the ribs from flaring and the neck relaxed.",
      "Hold for 3 to 5 breaths, then lower one vertebra at a time.",
    ],
    benefits: [
      "Strengthens glutes and hamstrings.",
      "Gentle extension for a stiff spine.",
    ],
    cautions: [
      "Avoid with acute neck injury or recent spinal surgery.",
      "Use a low lift if the back feels compressed.",
    ],
    breathing: "Inhale to lift, exhale to lower.",
    hold: "3 to 5 breaths",
  },
  {
    slug: "balasana",
    name: "Child's pose",
    sanskrit: "Balasana",
    type: "Yoga",
    level: "Beginner",
    minutes: 2,
    focus: "Rest",
    summary: "A resting forward fold used to recover between stronger poses.",
    steps: [
      "Kneel with the big toes together and knees apart.",
      "Sit back toward the heels and fold forward, forehead resting on the floor or a cushion.",
      "Extend the arms forward or rest them beside the body.",
      "Breathe into the back of the ribs for 6 to 10 breaths.",
    ],
    benefits: [
      "Provides a supported rest position.",
      "Gently lengthens the lower back.",
    ],
    cautions: [
      "Widen the knees or use a cushion in pregnancy.",
      "Avoid with acute knee pain.",
    ],
    breathing: "Slow diaphragmatic breathing.",
    hold: "30 to 90 seconds",
  },
  {
    slug: "nadi-shodhana",
    name: "Alternate-nostril breathing",
    sanskrit: "Nadi Shodhana",
    type: "Pranayama",
    level: "Beginner",
    minutes: 5,
    focus: "Breath regulation",
    summary: "A slow breathing practice that alternates nostrils; often used before meditation.",
    steps: [
      "Sit upright and rest the left hand on the knee.",
      "Bring the right hand to the nose and close the right nostril with the thumb.",
      "Inhale slowly through the left nostril for a comfortable count.",
      "Close the left nostril with the ring finger, release the thumb, and exhale through the right.",
      "Inhale right, then exhale left. That is one round.",
      "Continue for 5 to 10 rounds without straining.",
    ],
    benefits: [
      "Slows the breathing rate, which many people find calming.",
      "Easy to learn and needs no equipment.",
    ],
    cautions: [
      "Do not hold the breath or force the count.",
      "Stop if you feel light-headed.",
      "Avoid forceful breathing practices with uncontrolled asthma or panic symptoms.",
    ],
    breathing: "Inhale 4 counts, exhale 6 counts, no breath retention.",
    hold: "5 to 10 minutes",
  },
  {
    slug: "box-breathing",
    name: "Box breathing",
    sanskrit: "Sama Vritti",
    type: "Pranayama",
    level: "Beginner",
    minutes: 4,
    focus: "Stress regulation",
    summary: "Equal-count breathing in four phases, used to settle a busy mind.",
    steps: [
      "Sit comfortably with the spine upright.",
      "Inhale through the nose for 4 counts.",
      "Hold gently for 4 counts, without clenching.",
      "Exhale through the nose for 4 counts.",
      "Hold empty for 4 counts, then repeat for 8 to 12 rounds.",
    ],
    benefits: [
      "Simple structured breathing that can reduce acute stress.",
      "Can be practised almost anywhere.",
    ],
    cautions: [
      "Shorten the counts or drop the holds if you feel dizzy.",
      "Not a substitute for emergency care for chest pain or breathing difficulty.",
    ],
    breathing: "4 in, 4 hold, 4 out, 4 hold.",
    hold: "4 to 5 minutes",
  },
  {
    slug: "body-scan",
    name: "Guided body scan",
    sanskrit: "Yoga Nidra",
    type: "Meditation",
    level: "Beginner",
    minutes: 10,
    focus: "Relaxation",
    summary: "A lying-down attention practice that moves through the body systematically.",
    steps: [
      "Lie on your back with palms up and feet slightly apart, or sit supported.",
      "Set a timer for the length you want and close your eyes.",
      "Bring attention to the feet, noticing contact and temperature without changing anything.",
      "Move attention slowly upward: calves, knees, thighs, hips, belly, chest, hands, arms, neck, face.",
      "When the mind wanders, note it and return to the last area you remember.",
      "Finish by widening attention to the whole body and breathing a little deeper.",
    ],
    benefits: [
      "Encourages relaxation and body awareness.",
      "Requires no movement, useful on low-energy days.",
    ],
    cautions: [
      "Not recommended while driving or operating machinery.",
      "Some people find trauma-sensitive practices difficult; stop if distressed.",
    ],
    breathing: "Natural breath, no control.",
    hold: "10 to 20 minutes",
  },
  {
    slug: "breath-awareness",
    name: "Breath awareness",
    sanskrit: "Anapana Sati",
    type: "Meditation",
    level: "Beginner",
    minutes: 8,
    focus: "Attention",
    summary: "The simplest formal meditation: attention resting on the sensation of breathing.",
    steps: [
      "Sit in a stable, upright position and let the hands rest in the lap.",
      "Notice the sensation of air at the nostrils or the movement of the abdomen.",
      "When attention drifts, return to the next breath without judging the drift.",
      "Continue for the chosen time, ending with three slower breaths.",
    ],
    benefits: [
      "Trains attention and reduces reactive thinking with practice.",
      "Modest evidence for reducing anxiety and improving sleep quality.",
    ],
    cautions: [
      "Meditation can bring difficult thoughts to the surface; seek support if this happens.",
      "Not a replacement for treatment of depression or anxiety disorders.",
    ],
    breathing: "Natural, unforced breath.",
    hold: "5 to 20 minutes",
  },
];

export const PRACTICE_BY_TYPE = (type: PracticeType) => PRACTICES.filter((p) => p.type === type);

export const PRACTICE_TYPES: PracticeType[] = ["Yoga", "Meditation", "Pranayama"];
