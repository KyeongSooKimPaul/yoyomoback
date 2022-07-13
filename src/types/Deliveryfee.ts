import { objectType } from '@nexus/schema'

export const Deliveryfee = objectType({
  name: 'Deliveryfee',
  definition(t) {
    t.model.id()
    t.model.cntokor()
    t.model.cntojp()
    t.model.jptokor()
    t.model.jptomal()
    t.model.jptocn()
    t.model.kortomal()
    t.model.kortocn()
    t.model.kortojp()
    t.model.ustocn()
    t.model.ustomal()
    t.model.ustojp()
    t.model.ustokor()
    t.model.indexid()

  },
})
