import { objectType } from '@nexus/schema'

export const Adminbasicmall = objectType({
  name: 'Adminbasicmall',
  definition(t) {
    t.model.id()

    t.model.country()
    t.model.platform()
    t.model.settingfee()
    t.model.translatefee()
    t.model.monthlyfee()
    t.model.selleramount()
    t.model.active()


  },
})
