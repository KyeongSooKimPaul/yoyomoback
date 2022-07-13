import { objectType } from '@nexus/schema'

export const Privacypolicy = objectType({
  name: 'Privacypolicy',
  definition(t) {
    t.model.id()
    t.model.contents()
    t.model.userId()
  },
})
