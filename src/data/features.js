export const FEATURES = [
  {
    name: "Telepathic Bond",
    cost: 1,
    meta: "action or bonus action (30 ft / 120 ft.)",
    description: [
      "For the next 10 minutes, you can communicate telepathically with each creature that was within 30 feet of you when you activated this feature and that is bearing a ring.",
      "The bond on a creature ends early if it moves more than 30 feet away from the closest ring bearer. Only one telepathic bond can be active at a time.",
    ],
    overcharge: [
      "Extended Range (+1 charge): Range increases to 120 feet.",
      "Extended Duration (+1 charge): Duration increases to 1 hour.",
    ],
  },
  {
    name: "Coordinated Strike",
    cost: 1,
    isSubFeature: true,
    meta: "bonus action",
    description: [
      "Choose a creature within 5 feet of a ring bearer and another ring bearer who can see the target. Both ring bearers count as flanking the target until the start of your next turn.",
      "Both ring bearers must be in a telepathic bond to use this feature, and you must be one of them.",
    ],
  },
  {
    name: "Defensive Formation",
    cost: 1,
    isSubFeature: true,
    meta: "reaction (30 ft.) when an ally within your telepathic bond is flanked and targeted by an attack",
    description: [
      "The ally is immune to the flanked condition until the end of their turn.",
    ],
  },
  {
    name: "Shared Burden",
    cost: 2,
    meta: "reaction (30 ft.) when an ally attuned to a ring takes damage",
    description: [
      "The damage the target takes is halved. You take the amount of damage reduced by this feature.",
      "This damage can't be reduced in any way.",
    ],
  },
];
