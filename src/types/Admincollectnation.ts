import { objectType } from '@nexus/schema'

export const Admincollectnation = objectType({
  name: 'Admincollectnation',
  definition(t) {
    t.model.id()
    t.model.userId()
    t.model.productamount()
    t.model.market()
    t.model.country()
    t.model.active()
    t.model.image()
  },
})
