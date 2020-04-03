import * as e from 'express'

import { getPokemonWithAverageStats } from './service'

export const get = async (req: e.Request, res: e.Response) => {
  try {
    const id = parseInt(req.params?.['id'])
    if (Number.isNaN(id)) {
      res.status(400).json({ error: 'Path parameter id should be a number' })
    } else {
      const result = await getPokemonWithAverageStats(id)
      res.status(200).json(result)
    }
  } catch (e) {
    console.error('An error occured', e)
    res.status(500).json({ error: 'An error occured' })
  }
}
