import { objectType } from '@nexus/schema'

export const Admincommissiontransfer = objectType({
  name: 'Admincommissiontransfer',
  definition(t) {
    t.model.id()
    t.model.country()
    t.model.market()
    t.model.fee()
  
  },
})
