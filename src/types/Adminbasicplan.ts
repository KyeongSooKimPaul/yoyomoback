import { objectType } from '@nexus/schema'

export const Adminbasicplan = objectType({
  name: 'Adminbasicplan',
  definition(t) {
    t.model.id()
    t.model.plan()



    t.model.monthlycollecting()
    t.model.productamount()
    t.model.productmanagingamount()
    t.model.update()
    t.model.monthlyplanfee()
    t.model.settingfee()
    t.model.translatefee()
    t.model.active()

  },
})
