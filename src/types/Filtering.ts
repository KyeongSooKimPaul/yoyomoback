import { objectType } from '@nexus/schema'

export const Filtering = objectType({
  name: 'Filtering',
  definition(t) {
    t.model.id()
    t.model.country()
    t.model.contents()
    t.model.userId()
    t.model.market()

  },
})
