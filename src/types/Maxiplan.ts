import { objectType } from '@nexus/schema'

export const Maxiplan = objectType({
  name: 'Maxiplan',
  definition(t) {
    t.model.id()
    t.model.plan()
    t.model.malls()
    t.model.monthlycollecting()
    t.model.productamount()
    t.model.productmanagingamount()
    t.model.update()
    t.model.monthlyplanfee()
    t.model.settingfee()
    t.model.translatefee()
    t.model.createdAt()
    t.model.platformsettingprice()
    t.model.monthlyplatformsfee()
  },
})
