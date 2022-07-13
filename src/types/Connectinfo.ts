import { objectType } from '@nexus/schema'

export const Connectinfo = objectType({
  name: 'Connectinfo',
  definition(t) {
    t.model.id()
    t.model.shopid()
    t.model.apiid()
    t.model.apikey()
    t.model.code()
    t.model.shop()
    t.model.access_token()
    t.model.refresh_token()
    t.model.expires_in()
    t.model.User()
    t.model.userId()
    t.model.refresh_expires_in()
  },
})
