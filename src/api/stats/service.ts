import axios from "axios"
import { Pokemon, Stat, StatName, Type } from '../pokemon/Pokemon'
import { Transform, Writable } from 'stream'
import { streamAllPokemons, PokemonListResult } from "../pokemon/service"

interface PokemonWithStats {
  id: number
  name: string,
  stats: {
    pokemon: Array<Stat>
    average: Stat[]
  },
  types: Type[]
}

/**
  * Retrieve stats for a given pokemon along with the average of the stats
  * for the same-type pokemons.
  */
export const GetPokemonWithAverageStats =
  async (id: number): Promise<PokemonWithStats> => {
    const baseUrl = "https://pokeapi.co/api/v2/pokemon"
    let urlS = baseUrl.concat(id.toString())
    let response = await axios.get<Pokemon>(urlS)
    let pokemon = response.data
    let pokemonS: PokemonWithStats = {} as PokemonWithStats
    pokemonS.id = pokemon.id
    pokemonS.name = pokemon.name

    pokemonS.stats = {
      pokemon: pokemon.stats,
      average: [],
    }

    pokemonS.types = pokemon.types

    await setAverageStat(pokemonS)
    return pokemonS
  }

const setAverageStat = async (pokemonS: PokemonWithStats) => {
  // Get all possible types for the pokemon
  const types = pokemonS.types.map(_ => _.type.name)
  console.log(`Got ${types.length} types`)


  // Get all pokemons with those types
  let pokemons: Pokemon[] = []
  streamAllPokemons() // Readable
    .pipe(new Transform({ objectMode: true, transform: (chunk, _, callback) => {
      const poke: PokemonListResult = chunk
      axios.get<Pokemon>(poke.url).then(_ => {
        callback(null, _.data)
      })
    }}))
    .pipe(new Writable({ objectMode: true, write: (chunk, _, callback) => {
      const _pokemon: Pokemon = chunk
      if (_pokemon.types.map(_ => _.type.name).some(_ => types.includes(_))) {
        pokemons.push(_pokemon)
        console.log('Count: ', pokemons.length)
      }
      callback()
    }}))
  // If I do not do that, stat is always equal to 0...
  await new Promise(res => setTimeout(() => res(), 10000))


  // Compute average for each stat
  pokemonS.stats.pokemon.forEach(stat => {
    let stats: Stat[] = []

    // Get the stat value for each pokemon
    pokemons.forEach(_pokemon => {
      _pokemon.stats.forEach(pokemonStat => {
        if (pokemonStat.stat.name === stat.stat.name) stats.push(pokemonStat)
      })
    })

    // Compute average
    console.log('Computing average for stat', stat.stat.name)
    console.log(stats)
    if (stats.length !== 0) {
      const averageStat = stats.reduce((acc, _) => acc + _.base_stat, 0) / stats.length
      console.log('Average', stat.stat.name, 'is', averageStat)
      pokemonS.stats.pokemon.push({
        ...stat,
        base_stat: averageStat
      })
    } else {
      pokemonS.stats.average.push({
        ...stat,
        base_stat: 0
      })
    }
  })
}
