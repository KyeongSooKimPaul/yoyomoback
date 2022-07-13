import { objectType } from '@nexus/schema'

export const Product = objectType({
  name: 'Product',
  definition(t) {
    t.model.id()
    t.model.userId()
    t.model.productpageId()
    t.model.title()
    t.model.description()
    t.model.type()
    t.model.brand()
    t.model.category()
    t.model.price()
    t.model.newproduct()
    t.model.sale()
    t.model.stock()
    t.model.discount()
    t.model.variants()
    t.model.images()

    t.model.createdAt()
  
  },
})

