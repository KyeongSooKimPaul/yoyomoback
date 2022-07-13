import { objectType } from '@nexus/schema'

export const Checkpoint = objectType({
  name: 'Checkpoint',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.marketname()
    t.model.price()
    t.model.image()
    t.model.checkstatus()
    t.model.User()
  },
})
