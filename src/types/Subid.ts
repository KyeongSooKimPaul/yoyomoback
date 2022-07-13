import { objectType } from '@nexus/schema'

export const Subid = objectType({
  name: 'Subid',
  definition(t) {
    t.model.id()
    t.model.subid()

  },
})
