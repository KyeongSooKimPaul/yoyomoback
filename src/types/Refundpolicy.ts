import { objectType } from '@nexus/schema'

export const Refundpolicy = objectType({
  name: 'Refundpolicy',
  definition(t) {
    t.model.id()
    t.model.contents()
    t.model.userId()
  },
})

