import { objectType } from '@nexus/schema'

export const Stockhandling = objectType({
  name: 'Stockhandling',
  definition(t) {
    t.model.id()
    t.model.stockimage()
    t.model.name()
    t.model.price()
    t.model.stock()
    t.model.stockdemand()
    t.model.widthrowdemand()
    t.model.productfrom()
    t.model.productto()
    t.model.indexid()
    t.model.User()
    t.model.createdAt()

  },
})
