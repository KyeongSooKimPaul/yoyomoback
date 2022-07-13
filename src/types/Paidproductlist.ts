import { objectType } from '@nexus/schema'

export const Paidproductlist = objectType({
  name: 'Paidproductlist',
  definition(t) {
    t.model.id()
    t.model.userId()
    t.model.createdAt()
    t.model.title()
    t.model.category()
    t.model.price()
    t.model.discount()
    t.model.images()
    t.model.updated_at()
    t.model.productid()
    t.model.wholeamount()
    t.model.keepingamount()
    t.model.shipping_amount()
    t.model.orderstatus()
    t.model.User()

  },
})

