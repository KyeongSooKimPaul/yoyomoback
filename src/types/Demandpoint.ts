import { objectType } from '@nexus/schema'

export const Demandpoint = objectType({
  name: 'Demandpoint',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.price()
    t.model.image()
    t.model.bankaccount()
    t.model.checkstatus()
    t.model.checkname()
    t.model.createdAt()
    t.model.confirmAt()
  },
})
