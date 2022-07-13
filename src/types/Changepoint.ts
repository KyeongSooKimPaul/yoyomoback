import { objectType } from '@nexus/schema'

export const Changepoint = objectType({
  name: 'Changepoint',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.price()
    t.model.checkstatus()
    t.model.User()
  },
})
