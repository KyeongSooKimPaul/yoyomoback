import { objectType } from '@nexus/schema'

export const Termsanduse = objectType({
  name: 'Termsanduse',
  definition(t) {
    t.model.id()
    t.model.contents()
    t.model.userId()
  },
})
