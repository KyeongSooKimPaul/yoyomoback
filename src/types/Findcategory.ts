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
export const Findcategory = objectType({
    name: 'Findcategory',
    definition(t) {
      t.string('categoryList')
    },
  })
// // const CategoryList = objectType({
// //   name: 'categoryList',
// //   definition(t) {
// //     t.string('categorye');
// //   }
// // })
