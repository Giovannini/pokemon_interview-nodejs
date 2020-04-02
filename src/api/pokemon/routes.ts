import * as e from 'express'

import { getPokemon, listPokemons } from './service'

export const get = async (req: e.Request, res: e.Response) => {
  const id = parseInt(req.params?.['id'])
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Path parameter id should be a number' })
  } else {
    const pokemon = await getPokemon(id)
    res.status(200).json(pokemon)
  }
}

export const list = async (req: e.Request, res: e.Response) => {
  const list = await listPokemons()
  res.status(200).json(list.results)
}
