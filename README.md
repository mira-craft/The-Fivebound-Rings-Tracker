# 🧙‍♂️ The Ring – Realtime Multiplayer Campaign Engine

> *One Ring to track them all.*
> A realtime multiplayer state engine for D&D-inspired campaigns — built with React, Supabase, and a strong opinion about data integrity.

---

## ✨ What Is This?

This is a **realtime multiplayer web application** that manages a shared campaign state across multiple clients — safely, consistently, and without race-condition-induced heartbreak.

It combines:

* Optimistic locking
* Realtime synchronization
* Snapshot-based undo
* Persistent activity logging
* JSONB-powered state storage

Multiple users can interact with the same campaign simultaneously — without overwriting each other, corrupting state, or summoning undefined behavior.

(We only summon creatures. Intentionally.)

---

## ⚔️ THE ITEM

## ⚔️ The Fivebound Rings

*(requires attunement)*

At the end of a long or short rest, choose a creature type: **devil, demon, or fiend** (for creatures that are neither devils nor demons).

As long as a ring bearer is within 30 feet of two other ring bearers, they gain a **+1 bonus on saving throws** forced by the chosen creature type.

**Charges:** 10 (3 recharged at dawn)
**Prerequisite:** Two other ring bearers within 30 feet who are attuned to the rings.

---

### 🧠 Telepathic Bond

*(1 charge · 30 ft. · action or bonus action)*

For the next 10 minutes, you can communicate telepathically with each creature that was within 30 feet of you when you activated this feature and that is bearing a ring.

The bond on a creature ends early if it moves more than 30 feet away from the closest ring bearer. Only one telepathic bond can be active at a time.

**Overcharge Options:**

* Extended Range (+1 charge): Range increases to 120 feet.
* Extended Duration (+1 charge): Duration increases to 1 hour.

---

### ⚔️ Coordinated Strike

*(1 charge · bonus action)*

Choose a creature within 5 feet of a ring bearer and another ring bearer who can see the target. Both ring bearers count as flanking the target until the start of your next turn.

Both ring bearers must be in a telepathic bond to use this feature, and you must be one of them.

---

### 🛡️ Defensive Formation

*(1 charge · 30 ft. · reaction)*

**Trigger:** An ally within your telepathic bond is flanked and targeted by an attack.

The ally is immune to the flanked condition until the end of their turn.

---

### 🔥 Shared Burden

*(2 charges · 30 ft. · reaction)*

**Trigger:** An ally attuned to a ring takes damage.

The damage the target takes is halved. You take the amount of damage reduced by this feature.

This damage can’t be reduced in any way.

---

### 🔮 Spell Storing

*(once per dawn)*

At the end of a long or short rest, you can cast a spell and store it within the rings, expending a number of charges equal to the spell’s level.

The stored spell must be 3rd level or lower.

Any ring bearer can cast the stored spell. Its range increases to 30 feet, and the target must be an ally bearing a ring.

You use the spellcasting ability, save DC, and spell attack modifier of the creature who stored the spell.

---

### ✨ Recharge

*(once per dawn · action)*

You expend a spell slot. The rings regain a number of charges equal to **twice the level** of the expended slot.

If the expended slot was a pact slot, the number of charges equals the slot’s level.

---

### 🏆 Manufacturing Boon

**Magnificent Finish.** This item’s finish is flawless and it is worth twice its normal value.

---

### ⚠️ Enchanting Flaw

**Attraction.** Ranged weapon attacks made against you have advantage to hit you.



---

## 🧱 Tech Stack

| Layer       | Technology        |
| ----------- | ----------------- |
| Frontend    | React (Vite)      |
| Routing     | react-router-dom  |
| Backend     | Supabase          |
| Database    | PostgreSQL        |
| State Store | JSONB             |
| Realtime    | Supabase Realtime |
| Deployment  | Vercel            |

---

## 🗄️ Data Structure

### Table: `campaigns`

| Column     | Type        |
| ---------- | ----------- |
| id         | text (PK)   |
| state      | jsonb       |
| version    | integer     |
| updated_at | timestamptz |


### Architectural Principles

* Single source of truth in JSONB
* Version-based optimistic locking
* Conflict detection instead of silent overwrites
* Snapshot-based undo (max 15)
* Activity log is immutable (entries are marked `undone`, not removed)

---

## 🛡️ Stability Promise

* No silent overwrites
* No race-condition corruption
* No duplicate saves
* No unnecessary state resets
* Realtime updates never override newer local state
* Conflicts are detected — not ignored

If two players act at the same time, the system resolves it safely.

If something breaks, it breaks loudly — not invisibly.

---

## 🧙‍♂️ Conclusion

This project is more than a React frontend.

It is a multiplayer state engine with version control, realtime synchronization, conflict resolution, undo history, and persistent action tracking — wrapped in a clean dark-fantasy interface.

Built to handle chaos.

Just not database chaos.
