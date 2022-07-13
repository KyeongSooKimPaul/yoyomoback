import { objectType } from '@nexus/schema'

export const Admincommissionfee = objectType({
  name: 'Admincommissionfee',
  definition(t) {
    t.model.id()
 
    t.model.country()
    t.model.market()
    t.model.fee()
  


  },
})
