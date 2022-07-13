import { objectType } from '@nexus/schema'

export const Ordermanageitems = objectType({
  name: 'Ordermanageitems',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.product_main_image()
    t.model.name()
    t.model.keepingamount()
    t.model.wholeamount()
    t.model.multiorder()
    t.model.shipping_amount()
    t.model.created_at()
    t.model.updated_at()
    t.model.item_price()
    t.model.paidstatus()
    t.model.productid()
    t.model.userId()
    t.model.User()
  },
})
