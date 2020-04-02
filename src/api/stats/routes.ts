import * as e from 'express'

export const get = async (req: e.Request, res: e.Response) => {
  const id = parseInt(req.params?.['id'])
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Path parameter id should be a number' })
  } else {
    // TODO
    res.status(501).json({ error: 'Work in progress' })
  }
}
