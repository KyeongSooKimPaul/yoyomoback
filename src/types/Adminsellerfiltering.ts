import { objectType } from '@nexus/schema'

export const Adminsellerfiltering = objectType({
  name: 'Adminsellerfiltering',
  definition(t) {
    t.model.id()
    t.model.country()
    t.model.market()
    t.model.contents()
    t.model.userId()
 
  },
})
