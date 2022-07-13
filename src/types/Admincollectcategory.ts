import { objectType } from '@nexus/schema'

export const Admincollectcategory = objectType({
  name: 'Admincollectcategory',
  definition(t) {
    t.model.id()

    t.model.order()
    t.model.first()
    t.model.second()
    t.model.message()
    t.model.active()
 



  },
})
