import { objectType } from '@nexus/schema'

export const Deliverymangeitems = objectType({
  name: 'Deliverymangeitems',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.product_main_image()
    t.model.name()
    t.model.currency()
    t.model.shipping_amount()
    t.model.created_at()
    t.model.updated_at()
    t.model.paid_price()
    t.model.item_price()
    t.model.userId()
    t.model.User()
  },
})
