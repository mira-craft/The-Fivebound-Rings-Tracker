export const MAX_CHARGES = 10;

export const initialState = {
  charges: 10,
  creatureType: "",
  storedSpell: "",
  spellLevel: 1,
  spellStoredThisDawn: false,
  rechargeUsedThisDawn: false,
  canChooseCreature: true,
  lastActionUsage: {},
  history: [],
  activityLog: [],
};
