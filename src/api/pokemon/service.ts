import axios, { AxiosResponse } from 'axios'
import { Readable } from 'stream'

import { Pokemon } from './Pokemon'

const uri = "https://pokeapi.co/api/v2/pokemon"

export const getPokemon = (id: number) => {
  return axios.get<Pokemon>(`${uri}/${id}`).then(_ => _.data)
}

export interface PokemonListResult {
  name: string
  url: string
}
interface PokemonList {
  count: number,
  next: string | null,
  previous: string | null,
  results: Array<PokemonListResult>
}

export const listPokemons = () => {
  return axios.get<PokemonList>(`${uri}`).then(_ => _.data)
}

export const streamAllPokemons = () => {
  const stream = new Readable({ objectMode: true, read: () => {} })
  new Promise(async res => {
    let currenturi: string | null = uri
    do {
      const response: AxiosResponse<PokemonList> =
        await axios.get<PokemonList>(currenturi)
      response.data.results.forEach(pokemon => stream.push(pokemon))
      currenturi = response.data.next
    } while (currenturi !== null)
    res()
  })
  return stream
}
