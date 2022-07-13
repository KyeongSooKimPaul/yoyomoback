import { objectType } from '@nexus/schema'

export const Productupdate = objectType({
  name: 'Productupdate',
  definition(t) {
    t.model.id()
    t.model.postfix()
    t.model.prefix()
    t.model.userId()
   

  },
})
