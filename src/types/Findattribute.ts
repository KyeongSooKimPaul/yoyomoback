import { objectType } from '@nexus/schema'

// export const Findcategory = objectType({
//   name: 'Findcategory',
//   definition(t) {
//     t.list.field('categoryList', {
//       type: findcategory,
//       resolve: (root, args, ctx) => {
//         console.log('!!!!!!!!!!!!!!');
//       }
//     })
//   },
// })


// type lazadaAttributes {
//   advanced: lazadaAttributeAdvanced,
//   is_sale_prop: Int!,
//   options: [lazadaAttributeOptions!]!
//   name: String!,
//   input_type: String!,
//   is_mandatory: Int!,
//   attribute_type: String!,
//   label: String!
// }



const lazadaAttributeAdvanced = objectType({
  name: 'lazadaAttributeAdvanced',
  definition(t) {
    t.int('is_key_prop')
  },
})


const lazadaAttributeOptions = objectType({
  name: 'lazadaAttributeOptions',
  definition(t) {
    t.string('name')
  },
})
export const Findattribute = objectType({
  name: 'Findattribute',
  definition(t) {
    t.field('advanced', {
      type: lazadaAttributeAdvanced,
    })
    t.list.field('options', {
      type: lazadaAttributeOptions,
    })
    t.int('is_sale_prop')
  
    t.string('name')
    t.string('input_type')
    t.int('is_mandatory')
    t.string('attribute_type')
    t.string('label')

  },
})

// // const CategoryList = objectType({
// //   name: 'categoryList',
// //   definition(t) {
// //     t.string('categorye');
// //   }
// // })
