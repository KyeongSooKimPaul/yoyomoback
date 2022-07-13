import { objectType } from '@nexus/schema'

export const Adminoptionfee = objectType({
  name: 'Adminoptionfee',
  definition(t) {
    t.model.id()

    t.model.productamount()
    t.model.price()
    t.model.promotion()
    t.model.active()
    t.model.modelsort()
    t.model.indexid()

  },
})
