import { objectType } from '@nexus/schema'

export const Sellingprice = objectType({
  name: 'Sellingprice',
  definition(t) {
    t.model.id()
    t.model.price()
    t.model.mallname()
  },
})
