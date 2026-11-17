export type CountryEmergency = {
  code: string;
  country: string;
  emergency: string;
  ambulance: string;
  police: string;
  notes: string;
  poison?: string;
};

/**
 * Publicly listed national emergency numbers. Numbers can change; the app
 * labels each entry with a review date and tells users to confirm locally.
 */
export const EMERGENCY_NUMBERS: CountryEmergency[] = [
  { code: "IN", country: "India", emergency: "112", ambulance: "108", police: "100", notes: "112 is the all-in-one emergency number. 108 and 102 connect to ambulance services in most states. 104 is a health helpline in many states.", poison: "1066 (varies by state)" },
  { code: "US", country: "United States", emergency: "911", ambulance: "911", police: "911", notes: "911 handles police, fire and medical emergencies.", poison: "1-800-222-1222" },
  { code: "GB", country: "United Kingdom", emergency: "999", ambulance: "999", police: "999", notes: "111 is the NHS non-emergency line for urgent advice.", poison: "111" },
  { code: "EU", country: "European Union", emergency: "112", ambulance: "112", police: "112", notes: "112 works across EU member states and many neighbouring countries." },
  { code: "AE", country: "United Arab Emirates", emergency: "999", ambulance: "998", police: "999", notes: "998 for ambulance, 997 for fire." },
  { code: "SA", country: "Saudi Arabia", emergency: "911", ambulance: "997", police: "999", notes: "911 operates in major cities; 997 for ambulance nationally." },
  { code: "AU", country: "Australia", emergency: "000", ambulance: "000", police: "000", notes: "000 connects to police, fire and ambulance. 112 also works from mobile phones.", poison: "13 11 26" },
  { code: "CA", country: "Canada", emergency: "911", ambulance: "911", police: "911", notes: "911 handles police, fire and medical emergencies." },
  { code: "SG", country: "Singapore", emergency: "995", ambulance: "995", police: "999", notes: "995 for ambulance, 999 for police." },
  { code: "ZA", country: "South Africa", emergency: "112", ambulance: "10177", police: "10111", notes: "112 works from mobile phones; 10177 for ambulance." },
  { code: "BR", country: "Brazil", emergency: "192", ambulance: "192", police: "190", notes: "192 for ambulance (SAMU), 193 for fire." },
  { code: "JP", country: "Japan", emergency: "119", ambulance: "119", police: "110", notes: "119 for ambulance and fire, 110 for police." },
];

export const EMERGENCY_REVIEWED = "2026-11-10";

export type FirstAid = {
  slug: string;
  title: string;
  summary: string;
  steps: string[];
  avoid: string[];
  source: { label: string; url: string };
};

export const FIRST_AID: FirstAid[] = [
  {
    slug: "severe-bleeding",
    title: "Severe bleeding",
    summary: "Pressure and elevation while emergency help is on the way.",
    steps: [
      "Call your local emergency number immediately.",
      "Apply firm, direct pressure to the wound with a clean cloth or sterile dressing.",
      "Keep pressing continuously; do not lift the cloth to check every few seconds.",
      "If blood soaks through, add another layer on top and keep pressing.",
      "Lay the person down and raise the injured limb if a fracture is not suspected.",
      "Keep the person warm and monitor breathing until help arrives.",
    ],
    avoid: [
      "Do not remove an object that is embedded in the wound; press around it.",
      "Do not use a tourniquet unless trained and the bleeding is life-threatening and uncontrolled.",
    ],
    source: { label: "IFRC International First Aid Guidelines", url: "https://www.ifrc.org/document/international-first-aid-resuscitation-and-education-guidelines" },
  },
  {
    slug: "choking",
    title: "Choking in an adult",
    summary: "Encourage coughing first; back blows and abdominal thrusts if the airway is blocked.",
    steps: [
      "Ask if they are choking. If they can cough forcefully, encourage coughing.",
      "If they cannot speak, cough or breathe, call emergency services immediately.",
      "Give up to 5 sharp back blows between the shoulder blades.",
      "If unsuccessful, give up to 5 abdominal thrusts (Heimlich manoeuvre).",
      "Alternate 5 back blows and 5 abdominal thrusts until the object clears or help arrives.",
      "If they become unresponsive, start CPR and follow the dispatcher's instructions.",
    ],
    avoid: [
      "Do not give abdominal thrusts to pregnant women or infants; use chest thrusts or infant-specific technique as trained.",
      "Do not put your fingers blindly into the mouth.",
    ],
    source: { label: "Red Cross — Choking response", url: "https://www.redcross.org/take-a-class/first-aid/performing-first-aid" },
  },
  {
    slug: "cpr",
    title: "CPR basics",
    summary: "For an unresponsive adult who is not breathing normally: call, then push hard and fast.",
    steps: [
      "Check responsiveness and breathing. Shout for help and call emergency services or ask someone else to call.",
      "Place the person on their back on a firm surface.",
      "Place the heel of one hand in the centre of the chest, the other hand on top, and interlock fingers.",
      "Push hard and fast at about 100 to 120 compressions per minute, at least 5 cm deep, allowing full recoil.",
      "If trained and willing, give 2 rescue breaths after every 30 compressions; otherwise continue compressions only.",
      "Use an AED as soon as one is available and follow its spoken prompts.",
    ],
    avoid: [
      "Do not stop to check for a pulse repeatedly if you are unsure; continue compressions until help takes over.",
      "Do not practice on a person; use a certified training course.",
    ],
    source: { label: "American Red Cross — CPR steps", url: "https://www.redcross.org/take-a-class/cpr/performing-cpr" },
  },
  {
    slug: "burns",
    title: "Burns and scalds",
    summary: "Cool with running water for 20 minutes; never apply ice, butter or toothpaste.",
    steps: [
      "Stop the burning process and remove clothing or jewellery that is not stuck to the skin.",
      "Cool the burn under cool running water for 20 minutes.",
      "Keep the rest of the body warm to avoid hypothermia, especially in children.",
      "Cover loosely with cling film or a sterile non-stick dressing.",
      "Seek medical care for burns larger than a palm, on the face, hands, feet or genitals, or in children and older adults.",
    ],
    avoid: [
      "Do not apply ice, butter, oil, toothpaste or turmeric paste.",
      "Do not burst blisters.",
    ],
    source: { label: "WHO — Burns fact sheet and first aid", url: "https://www.who.int/news-room/fact-sheets/detail/burns" },
  },
  {
    slug: "heat-stroke",
    title: "Heat exhaustion and heat stroke",
    summary: "Move to shade, cool actively, and treat confusion or collapse as an emergency.",
    steps: [
      "Move the person to a cool, shaded place and remove excess clothing.",
      "If they are conscious and alert, give cool water to drink in small sips.",
      "Cool the skin with water, wet cloths and fanning.",
      "Call emergency services if they are confused, unconscious, have a temperature above 40°C, or are not improving within 30 minutes.",
      "Continue cooling while waiting for help.",
    ],
    avoid: [
      "Do not give fluids to an unconscious person.",
      "Do not leave anyone in a parked vehicle, especially children.",
    ],
    source: { label: "WHO — Heatwaves and health", url: "https://www.who.int/news-room/fact-sheets/detail/climate-change-heat-and-health" },
  },
  {
    slug: "snake-bite",
    title: "Snake bite",
    summary: "Keep the person still and get to hospital; do not cut, suck or apply a tight bandage.",
    steps: [
      "Move away from the snake and keep the person calm and still.",
      "Call emergency services and arrange transport to a hospital with antivenom.",
      "Keep the bitten limb still and below heart level if possible.",
      "Remove rings, watches and tight clothing before swelling starts.",
      "Note the time of the bite and any symptoms; photograph the snake from a safe distance if it is still visible.",
    ],
    avoid: [
      "Do not cut the wound, suck out venom, apply a tourniquet or use traditional herbal poultices.",
      "Do not try to catch or kill the snake.",
    ],
    source: { label: "WHO — Snakebite envenoming", url: "https://www.who.int/news-room/fact-sheets/detail/snakebite-envenoming" },
  },
];

export const EMERGENCY_DISCLAIMER =
  "LIMITLESS does not contact emergency services for you. Tapping a number opens your device dialler and you must place the call. Numbers and first-aid steps are general guidance reviewed in November 2026; local protocols differ and training is required for CPR and choking response.";
