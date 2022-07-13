import { objectType } from '@nexus/schema'

export const Admincollectmarket = objectType({
  name: 'Admincollectmarket',
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
