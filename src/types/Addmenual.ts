import { objectType } from '@nexus/schema'

export const Addmenual = objectType({
  name: 'Addmenual',
  definition(t) {
    t.model.id()
    t.model.contents()
    t.model.userId()
  },
})
