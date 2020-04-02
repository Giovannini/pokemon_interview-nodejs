export interface Move {
  move: {
    name: string
    url: string
  }
}

export type StatName = 'attack' | 'defense' | 'hp' | 'speed' | 'special-defense' | 'special-attack'
export interface Stat {
  base_stat: number
  stat: {
    name: StatName
    url: string
  }
}

export interface Type {
  slot: number
  type: {
    name: string
    url: string
  }
}

export interface Pokemon {
    id: number
    moves: Move[]
    name: string
    sprites: {
      back_default: string
      front_default: string
    },
    stats: Stat[]
    types: Type[]
}
