export const FEATURES = [
  {
    name: "Telepathic Bond",
    cost: 1,
    meta: "action or bonus action (30 ft / 120 ft.)",
    description: [
      [
        { text: "For the next 10 minutes (extended 1 hour), you can communicate " },
        { text: "telepathically", bold: true },
        { text: " with each creature that was within " },
        { text: "30 ft. (extended 120 ft.)", bold: true },
        { text: " of you when you activated this feature and that is bearing a ring." },
      ],
      [
        { text: "The bond on a creature ends early if it moves more than " },
        { text: "30 ft. (extended 120 ft.)", bold: true },
        { text: " away from the closest ring bearer. Only one " },
        { text: "telepathic bond", bold: true },
        { text: " can be active at a time." },
      ],
    ],
    overcharge: [
      "Extended Range (+1 charge): Ranges increase to 120 feet.",
      "Extended Duration (+1 charge): Duration increases to 1 hour.",
    ],
  },
  {
    name: "Coordinated Strike",
    cost: 1,
    isSubFeature: true,
    meta: "bonus action",
    description: [
      [
        { text: "Choose a creature within 5 feet of a ring bearer and another ring bearer who can see the target. Both ring bearers count as " },
        { text: "flanking", bold: true },
        { text: " the target until the start of your next turn." },
      ],
      [
        { text: "Both ring bearers must be in a " },
        { text: "telepathic bond", bold: true },
        { text: " to use this feature, and you must be one of them." },
      ],
    ],
  },
  {
    name: "Defensive Formation",
    cost: 1,
    isSubFeature: true,
    meta: "reaction (30 ft.) when an ally within your telepathic bond is flanked and targeted by an attack",
    description: [
      [
        { text: "The ally is " },
        { text: "immune", bold: true },
        { text: " to the " },
        { text: "flanked condition", bold: true },
        { text: " until the end of their turn." },
      ],
    ],
  },
  {
    name: "Shared Burden",
    cost: 2,
    meta: "reaction (30 ft.) when an ally attuned to a ring takes damage",
    description: [
      [
        { text: "The damage the target takes is " },
        { text: "halved", bold: true },
        { text: ". You take the amount of " },
        { text: "damage", bold: true },
        { text: " reduced by this feature." },
      ],
      [
        { text: "This damage " },
        { text: "can't be reduced", bold: true },
        { text: " in any way." },
      ],
    ],
  },
];
