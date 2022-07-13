import { objectType } from '@nexus/schema'

export const UserProfile = objectType({
  name: 'UserProfile',
  definition(t) {
    t.model.id()
    t.model.kakaoid()
    t.model.gsiid()
    t.model.bankname()
    t.model.bankaccount()
    t.model.businessnumber()
    t.model.contactemail()
    t.model.deposit()
    t.model.point()
  },
})
