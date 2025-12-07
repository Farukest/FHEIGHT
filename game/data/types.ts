// Auto-generated card types
export type Faction = 1 | 2 | 3 | 4 | 5 | 6 | 100;
export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type CardType = 'Unit' | 'Spell' | 'Artifact';

export interface Card {
  id: number;
  name: string;
  faction: Faction;
  type: CardType;
  mana: number;
  rarity: Rarity;
  atk?: number;
  hp?: number;
  ability?: string;
  description?: string;
}

export const FACTIONS: Record<Faction, string> = {
  1: 'Lyonar',
  2: 'Songhai',
  3: 'Vetruvian',
  4: 'Abyssian',
  5: 'Magmar',
  6: 'Vanar',
  100: 'Neutral'
};

export const FACTION_COLORS: Record<Faction, string> = {
  1: '#FFD700',  // Gold - Lyonar
  2: '#FF4500',  // Orange Red - Songhai
  3: '#DEB887',  // Burlywood - Vetruvian
  4: '#8B008B',  // Dark Magenta - Abyssian
  5: '#228B22',  // Forest Green - Magmar
  6: '#00CED1',  // Dark Turquoise - Vanar
  100: '#808080' // Gray - Neutral
};
