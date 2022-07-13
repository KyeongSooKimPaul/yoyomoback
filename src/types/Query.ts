import { intArg, queryType, stringArg } from '@nexus/schema'
import { getUserId } from '../utils'
import { getLazadaSign } from '../types/getLazadaSign'
import { URL, URLSearchParams } from 'url'
import axios from 'axios'
import cron = require('node-cron')
import { request, gql } from 'graphql-request'
// const cron = require('node-cron');
import twilio = require('twilio')
import { Findattribute } from '.'

// import * as dotenv from 'dotenv'
// dotenv.config()

const {
  LAZADA_URL_MALAYSIA,
  LAZADA_URL_SINGAPORE,
  LAZADA_URL_VIETNAM,
  LAZADA_URL_THAILAND,
  LAZADA_URL_PHILIPPINES,
  LAZADA_URL_INDONESIA,
} = process.env
const flatten = (data: any, reducerFn: any, result: any) => {
  result = result || []
  if (data.children === undefined) {
    result.push(data.name)
    if (data.category_id) {
      return `${result.join(':')}_____${data.category_id}`
    }
    return ''
  }
  return data.children
    .map((child: any) =>
      flatten(child, reducerFn, result.concat([reducerFn(data)])),
    )
    .flat()
    .sort()
}

const exchangeratesbyid_QUERY = gql`
  query getorders {
    getorders {
      id
      name
      email
      Following {
        id
        followId
        name
        avatar
      }
      Connectinfo {
        id
        shopid
        apikey
        apiid
        code
        shop
      }
      likedTweet {
        id
        tweet {
          id
          content
          createdAt
          author {
            id
            name
            Profile {
              id
              avatar
            }
          }
        }
      }
    }
  }
`

// cron.schedule('*/2 * * * *', function () {
//   console.log('2분 마다 작업 실행 :', new Date().toString());
// });
// cron.schedule('* * * * * *', function () {
//   request(
//     'https://jinsung-server1.ngrok.io/graphql',
//     exchangeratesbyid_QUERY

//   )
//     .then((data) => console.log(data))
//     .catch((e) => {
//       console.log(e)
//     })
//   console.log('매 초 마다 작업 실행 :', new Date().toString());
// });

export const Query = queryType({
  definition(t) {
    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        return ctx.prisma.user.findOne({
          where: {
            id: Number(userId),
          },
        })
      },
    })

    // t.list.field('verificationPhone', {
    //   type: 'User',
    //   args: {
    //     phonenumber: stringArg(),
    //   },
    //   resolve: async (_parent, { phonenumber }, ctx): Promise<any> => {
    //     console.log('phondfsfe', process.env.ACOUNTSID)

    //     const client = await twilio(
    //       process.env.ACOUNTSID,
    //       process.env.AUTHTOKEN,
    //     )
    //     // return client.messages
    //     //   .create({
    //     //     body: 'Maxi Verification Code - [523531]',
    //     //
    //     //     to: `+82${phonenumber?.substr(1)}`,
    //     //   })
    //     //   .then((message) => {
    //     //     console.log('dsfsdf11', message)
    //     //     if (message.status == 'accepted') {
    //     //       // return console.log('dsfsdf')
    //     //     } else {
    //     //       console.log('dsfsdf22')
    //     //       throw new Error(`fail`)
    //     //     }
    //     //   })
    //     client.messages
    //       .create({
    //         body: 'Maxi Verification Code - [523531]',
    //         messagingServiceSid: process.env.SEVICESID,
    //         to: `+82${phonenumber?.substr(1)}`,
    //         // to: `+821047195663`,
    //       })
    //       .then((message) => {
    //         console.log('dsfsdf11', message)
    //         if (message.status == 'accepted') {
    //           // return console.log('dsfsdf')
    //           console.log('message.status', message.status)
    //         } else {
    //           console.log('dsfsdf22')
    //           throw new Error(`fail`)
    //         }
    //       })
    //   },
    // })

    t.list.field('users', {
      type: 'User',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.user.findMany()
      },
    })
    t.list.field('tweets', {
      type: 'Tweet',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.tweet.findMany()
      },
    })

    t.field('tweet', {
      type: 'Tweet',
      nullable: true,
      args: { id: intArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.tweet.findOne({
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.list.field('Maxiplans', {
      type: 'Maxiplan',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.maxiplan.findMany()
      },
    })

    t.list.field('Addmenuals', {
      type: 'Addmenual',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.addmenual.findMany()
      },
    })
    t.list.field('Privacypolicys', {
      type: 'Privacypolicy',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.privacypolicy.findMany()
      },
    })
    t.list.field('Refundpolicys', {
      type: 'Refundpolicy',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.refundpolicy.findMany()
      },
    })
    t.list.field('Termsanduses', {
      type: 'Termsanduse',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.termsanduse.findMany()
      },
    })
    

    t.field('user', {
      type: 'User',
      nullable: true,
      args: { id: intArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.user.findOne({
          where: {
            id: Number(id),
          },
        })
      },
    })

    //jinsung
    // t.list.field('getorders', {
    //   type: 'Connectinfo',
    //   resolve: async (parent, args, ctx) => {
    //     const userId = getUserId(ctx)
    //     var numberfor: any

    //     if (!userId) throw new Error('Could not authenticate user.')
    //     var resultdata = await ctx.prisma.connectinfo.findMany({
    //       where: {
    //         shopid: {
    //           equals: String('lazada_my'),
    //         },
    //         userId: {
    //           equals: Number(userId),
    //         },
    //       },
    //     })
    //     console.log('resultdata', resultdata[0])
    //     // return resultdata

    //     type Connectinfo = {
    //       apiid?: any

    //       id: any
    //       createdAt: any
    //       shopid: any

    //       apikey: any
    //       code: any
    //       shop: any
    //       access_token: any
    //       refresh_token: any
    //       expires_in: any
    //       refresh_expires_in: any
    //       userId: any
    //     }

    //     const { apiid, access_token, apikey } = await resultdata[0]

    //     const payloadIn = await {
    //       app_key: apiid,
    //       timestamp: Date.now() as any,
    //       sign_method: 'sha256' as any,
    //       access_token: access_token as any,
    //       created_after: '2018-02-10T09:00:00+08:00',
    //     }

    //     const payloadSign = getLazadaSign(
    //       '/orders/get',
    //       payloadIn,
    //       apikey as any,
    //     )

    //     const payload = {
    //       ...payloadIn,
    //       sign: payloadSign,
    //     }
    //     // console.log('payload-------', payload)
    //     const baseUrl = await 'https://api.lazada.com.my/rest'
    //     const url = await new URL(`${baseUrl}/orders/get`)
    //     url.search = await new URLSearchParams(payload as any).toString()

    //     const result1 = await ctx.prisma.ordermanageitems.findMany({
    //       where: {
    //         userId: Number(userId),
    //         // userId: Number(1),
    //       },
    //     })

    //     if (result1.length !== 0) {
    //       await ctx.prisma.ordermanageitems.deleteMany({
    //         where: {
    //           userId: Number(userId),
    //         },
    //       })
    //     }

    //     const result2 = await axios.get(url.href).then((result) => {
    //       const order_ids: any = result.data.data.orders
    //         .map((order: any) => order.order_id)
    //         .join(',')

    //       const orderDetailPayloadIn = {
    //         app_key: apiid,
    //         timestamp: Date.now() as any,
    //         sign_method: 'sha256' as any,
    //         access_token: access_token as any,
    //         order_ids: `[${order_ids}]`,
    //       }
    //       const orderDetailPayloadSign = getLazadaSign(
    //         '/orders/items/get',
    //         orderDetailPayloadIn,
    //         apikey as any,
    //       )
    //       const orderDetailPayload = {
    //         ...orderDetailPayloadIn,
    //         sign: orderDetailPayloadSign,
    //       }

    //       const orderDetailUrl = new URL(`${baseUrl}/orders/items/get`)
    //       orderDetailUrl.search = new URLSearchParams(
    //         orderDetailPayload as any,
    //       ).toString()
    //       axios.get(orderDetailUrl.href).then((detailResult) => {
    //         const resultfor: any = detailResult.data.data.map(
    //           (data: any) => data.order_items,
    //         )
    //         // const resultfor =  detailResult.data.data.map((order: any) => order.order_id)

    //         Promise.all(
    //           detailResult.data.data.map(async (data: any) => {
    //             await ctx.prisma.ordermanageitems.create({
    //               data: {
    //                 product_main_image: data.order_items[0].product_main_image,
    //                 name: data.order_items[0].name,
    //                 currency: data.order_items[0].currency,
    //                 shipping_amount: String(
    //                   data.order_items[0].shipping_amount,
    //                 ),
    //                 created_at: data.order_items[0].created_at,
    //                 updated_at: data.order_items[0].updated_at,
    //                 paid_price: String(data.order_items[0].paid_price),
    //                 item_price: String(data.order_items[0].item_price),
    //                 User: { connect: { id: Number(userId) } },
    //               },
    //             })
    //           }),
    //         )
    //           .then((result) => {})
    //           .catch((e) => {
    //             console.error('eeee', e)
    //           })

    //         //  for  (var i = 0; i < resultfor.length; i++) {
    //         //   console.log("detailResult.data.data[i].order_items",data.order_items[0])
    //         //   if  (numberfor == 0) {
    //         //     console.log("sdfsdf",numberfor)

    //         //   }
    //         //   if ( resultfor.length - 1 == i) {
    //         //     console.log("sdfsdf",numberfor)
    //         //   }
    //         // }
    //       })
    //     })
    //     return null
    //   },
    // })
    // t.list.field('getorders', {
    //   type: 'User',
    //   resolve: async (parent, args, ctx) => {
    //     const userId = getUserId(ctx)
    //     if (!userId) throw new Error('Could not authenticate user.')
    //     var resultdata = await ctx.prisma.user.findMany({
    //       // include: {
    //       //   Connectinfo: true,
    //       // },
    //       include: {
    //         Connectinfo: {
    //           where: {
    //             userId: Number(userId),
    //           },
    //         },
    //       },
    //     })

    //     // return resultdata

    //     type Connectinfo = {
    //       apiid?: any

    //       id: any
    //       createdAt: any
    //       shopid: any

    //       apikey: any
    //       code: any
    //       shop: any
    //       access_token: any
    //       refresh_token: any
    //       expires_in: any
    //       refresh_expires_in: any
    //       userId: any
    //     }

    //     const connectInfos: any = await resultdata
    //       .filter((filtering) => filtering.Connectinfo !== null)
    //       .map((data) => data.Connectinfo)
    //     // const connectInfos: Connectinfo[] = await resultdata
    //     // .filter((filtering):any => filtering.Connectinfo.userId == userId)
    //     // .map((data) => data.Connectinfo.userId) as any
    //     console.log('connectInfos', connectInfos)
    //     const { apiid, access_token, apikey } = connectInfos[1][2]
    //     console.log('apiid', apiid)
    //     console.log('access_token', access_token)
    //     console.log('apiKey', apikey)
    //     const payloadIn = {
    //       app_key: apiid,
    //       timestamp: Date.now() as any,
    //       sign_method: 'sha256' as any,
    //       access_token: access_token as any,
    //       created_after: '2018-02-10T09:00:00+08:00',
    //       // app_key: "103654",
    //       // timestamp: Date.now() as any,
    //       // sign_method: 'sha256' as any,
    //       // access_token: "50000501142yRebZ0nTEmScxPHAfhtAlV1GflymZeqsod1joq9srqD1ef4a834mp",
    //       // created_after: '2018-02-10T09:00:00+08:00',
    //     }

    //     const payloadSign = getLazadaSign('/orders/get', payloadIn, apikey)

    //     const payload = {
    //       ...payloadIn,
    //       sign: payloadSign,
    //     }
    //     // console.log('payload-------', payload)
    //     const baseUrl = 'https://api.lazada.com.my/rest'
    //     const url = new URL(`${baseUrl}/orders/get`)
    //     url.search = new URLSearchParams(payload).toString()

    //     const result2 = await axios.get(url.href).then((result) => {
    //       console.log('result', result.data)
    //       console.log(result.data.data.orders[0])

    //       const order_ids: any = result.data.data.orders
    //         .map((order: any) => order.order_id)
    //         .join(',')
    //       console.log(order_ids)
    //       const orderDetailPayloadIn = {
    //         app_key: apiid,
    //         timestamp: Date.now() as any,
    //         sign_method: 'sha256' as any,
    //         access_token: access_token as any,
    //         order_ids: `[${order_ids}]`,
    //       }
    //       const orderDetailPayloadSign = getLazadaSign(
    //         '/orders/items/get',
    //         orderDetailPayloadIn,
    //         apikey,
    //       )
    //       const orderDetailPayload = {
    //         ...orderDetailPayloadIn,
    //         sign: orderDetailPayloadSign,
    //       }

    //       //   Async resolve(parentValue, args) {
    //       //     const results= await axios.get('http://localhost:3000/holidays?date='+ args.date)
    //       //    .then(res => res.data);
    //       //    return results;
    //       // }

    //       const orderDetailUrl = new URL(`${baseUrl}/orders/items/get`)
    //       orderDetailUrl.search = new URLSearchParams(
    //         orderDetailPayload,
    //       ).toString()
    //       axios.get(orderDetailUrl.href).then((detailResult) => {
    //         console.log('__________________________________________________')
    //         console.log(detailResult.data.data)
    //         // resultdata[0].Connectinfo =
    //         // return resultdata
    //       })
    //     })
    //     return null
    //   },
    // })

    t.list.field('exchangerates', {
      type: 'ExchangeRate',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.exchangeRate.findMany()
      },
    })

    t.list.field('exchangeratesbyid', {
      type: 'ExchangeRate',
      args: { indexid: intArg() },
      resolve: (parent, { indexid }, ctx): any => {
        return ctx.prisma.exchangeRate.findMany({
          where: {
            indexid: Number(indexid),
          },
        })
      },
    })

    t.list.field('deliveryfeesbyid', {
      type: 'Deliveryfee',
      args: { indexid: intArg() },
      resolve: (parent, { indexid }, ctx): any => {
        return ctx.prisma.deliveryfee.findMany({
          where: {
            indexid: Number(indexid),
          },
        })
      },
    })

    //jinsungdadmin

    t.list.field('collectmarkets', {
      type: 'Admincollectmarket',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.admincollectmarket.findMany()
      },
    })

    t.list.field('collectnationmarkets', {
      type: 'Admincollectnation',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.admincollectnation.findMany()
      },
    })

    t.list.field('Adminbasicplans', {
      type: 'Adminbasicplan',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.adminbasicplan.findMany()
      },
    })

    t.list.field('Adminbasicmalls', {
      type: 'Adminbasicmall',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.adminbasicmall.findMany()
      },
    })

    t.list.field('Adminoptionfeesbymodel', {
      type: 'Adminoptionfee',
      args: { indexid: intArg(), modelsort: stringArg() },
      resolve: (parent, { indexid, modelsort }, ctx) => {
        return ctx.prisma.adminoptionfee.findMany({
          where: {
            indexid: Number(indexid),
            modelsort: String(modelsort),
          },
        })
      },
    })

    t.list.field('Stockhandlings', {
      type: 'Stockhandling',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.stockhandling.findMany()
      },
    })

    t.list.field('Stockhandlingsbyid', {
      type: 'Stockhandling',
      args: { indexid: intArg() },
      resolve: (parent, { indexid }, ctx) => {
        return ctx.prisma.stockhandling.findMany({
          where: {
            indexid: Number(indexid),
          },
        })
      },
    })

    t.list.field('Stockhandlingsbynation', {
      type: 'Stockhandling',
      args: { productfrom: stringArg() },
      resolve: (parent, { productfrom }, ctx) => {
        return ctx.prisma.stockhandling.findMany({
          where: {
            productfrom: String(productfrom),
          },
        })
      },
    })
    t.list.field('Checkpoint', {
      type: 'Checkpoint',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.checkpoint.findMany()
      },
    })

    t.list.field('Changepoint', {
      type: 'Changepoint',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.changepoint.findMany()
      },
    })
    t.list.field('Demandpoint', {
      type: 'Demandpoint',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.demandpoint.findMany()
      },
    })


    t.field('createDemandpoint', {
      type: 'Demandpoint',
      args: {
        price: stringArg(),
        image: stringArg(),
        bankaccount: stringArg(),
        checkstatus: stringArg(),
        checkname: stringArg(),
      },
      resolve: (parent, args, ctx) => {
     
       

        return ctx.prisma.demandpoint.create({
          data: {
            ...args,
     
          },
        })
      },
    })




    // t.list.field('categoryList', {
    //   type: 'String',
    //   resolve: (root, args, ctx) => {
    //     console.log('!!!!!!!!!!!!!!!!!!!!!')
    //     return ['test']
    //   },
    // })

    // t.list.field('categoryList', {
    //   type: 'String',
    //   resolve: async (parent, { ...args }, ctx) => {
    //     const userId = getUserId(ctx)
    //     const shopid1 = 'lazada_my'
    //     var resultdata = await ctx.prisma.connectinfo.findMany({
    //       where: {
    //         shopid: {
    //           equals: String('lazada_my'),
    //         },
    //         userId: {
    //           equals: Number(userId),
    //         },
    //       },
    //     })
    //     console.log('resultdata', resultdata[0])
    //     const { apiid, access_token, apikey, shopid } = await resultdata[0]

    //     if (shopid1.includes('lazada')) {
    //       let baseUrl: any = null
    //       baseUrl = LAZADA_URL_MALAYSIA
    //       if (shopid1.includes('my')) {
    //         baseUrl = LAZADA_URL_MALAYSIA
    //       }
    //       if (shopid1.includes('sg')) {
    //         baseUrl = LAZADA_URL_SINGAPORE
    //       }
    //       if (shopid1.includes('vn')) {
    //         baseUrl = LAZADA_URL_VIETNAM
    //       }
    //       if (shopid1.includes('th')) {
    //         baseUrl = LAZADA_URL_THAILAND
    //       }
    //       if (shopid1.includes('ph')) {
    //         baseUrl = LAZADA_URL_PHILIPPINES
    //       }
    //       if (shopid1.includes('id')) {
    //         baseUrl = LAZADA_URL_INDONESIA
    //       }
    //       const sellerRequestUrl = '/seller/get'

    //       if (baseUrl) {
    //         const sellerPayload = {
    //           app_key: apiid,
    //           timestamp: Date.now(),
    //           sign_method: 'sha256',
    //           access_token,
    //         }
    //         // sellerPayload.sign = getLazadaSign(
    //         //   sellerRequestUrl,
    //         //   sellerPayload,
    //         //   apikey,
    //         // );
    //         const sellerPayloadSign = getLazadaSign(
    //           sellerRequestUrl,
    //           sellerPayload,
    //           apikey as any,
    //         )
    //         const sellerPayloadind = {
    //           ...sellerPayload,
    //           sign: sellerPayloadSign,
    //         }

    //         const sellerUrl: any = new URL(`${baseUrl}${sellerRequestUrl}`)
    //         sellerUrl.search = new URLSearchParams(sellerPayloadind as any)
    //         return await axios
    //           .get(sellerUrl.toString())
    //           .then(async (sellerResponse) => {
    //             if (sellerResponse.data.code === 'IllegalAccessToken') {
    //               throw new Error('IllegalAccessToken')
    //             }
    //             if (shopid1.includes('lazada')) {
    //               const requestUrl = '/category/tree/get'
    //               const payloadIn = await {
    //                 app_key: apiid,
    //                 timestamp: Date.now(),
    //                 sign_method: 'sha256',
    //               }
    //               const payloadid = await getLazadaSign(
    //                 requestUrl,
    //                 payloadIn,
    //                 apikey as any,
    //               )

    //               const payload = {
    //                 ...payloadIn,
    //                 sign: payloadid,
    //               }

    //               // payload.sign = getLazadaSign(requestUrl, payload, apikey);
    //               const url: any = new URL(`${baseUrl}${requestUrl}`)
    //               url.search = new URLSearchParams(payload as any)
    //               return await axios
    //                 .get(url.toString())
    //                 .then((response) =>
    //                   response.data.data
    //                     .map((data: any) =>
    //                       flatten(data, (flatData: any) => flatData.name, null),
    //                     )
    //                     .flat()
    //                     .sort(),
    //                 )
    //                 .catch((e) => e)
    //             }
    //           })
    //       }
    //     }
    //     throw new Error('invalidStore')
    //     // const targetApi = profile
    //     // ._source
    //     // .APIS
    //     // .filter((filtering) => filtering.storeName === market);
    //   },
    // })

    // t.list.field('attributelist', {
    //   type: Findattribute,
    //   args: { categoryId: stringArg() },
    //   resolve: async (parent, { categoryId }: any, ctx) => {
    //     const userId = getUserId(ctx)
    //     const shopid1 = 'lazada_my'
    //     var resultdata = await ctx.prisma.connectinfo.findMany({
    //       where: {
    //         shopid: {
    //           equals: String('lazada_my'),
    //         },
    //         userId: {
    //           equals: Number(userId),
    //         },
    //       },
    //     })
    //     var result222
    //     const { apiid, access_token, apikey, shopid } = await resultdata[0]

    //     if (shopid1.includes('lazada')) {
    //       // const { input: { categoryId, market } } = args;

    //       let baseUrl: any = null
    //       if (shopid1.includes('my')) {
    //         baseUrl = LAZADA_URL_MALAYSIA
    //       }
    //       if (shopid1.includes('sg')) {
    //         baseUrl = LAZADA_URL_SINGAPORE
    //       }
    //       if (shopid1.includes('vn')) {
    //         baseUrl = LAZADA_URL_VIETNAM
    //       }
    //       if (shopid1.includes('th')) {
    //         baseUrl = LAZADA_URL_THAILAND
    //       }
    //       if (shopid1.includes('ph')) {
    //         baseUrl = LAZADA_URL_PHILIPPINES
    //       }
    //       if (shopid1.includes('id')) {
    //         baseUrl = LAZADA_URL_INDONESIA
    //       }
    //       const sellerRequestUrl = '/seller/get'

    //       const { apiid, access_token, apikey, shopid } = await resultdata[0]

    //       if (baseUrl) {
    //         const sellerPayload = {
    //           app_key: apiid,
    //           timestamp: Date.now(),
    //           sign_method: 'sha256',
    //           access_token: access_token,
    //         }

    //         const sellerPayloadSign = getLazadaSign(
    //           sellerRequestUrl,
    //           sellerPayload,
    //           apikey as any,
    //         )
    //         const sellerPayloadind = {
    //           ...sellerPayload,
    //           sign: sellerPayloadSign,
    //         }

    //         const sellerUrl: any = new URL(`${baseUrl}${sellerRequestUrl}`)
    //         sellerUrl.search = new URLSearchParams(sellerPayloadind as any)
    //         return await axios
    //           .get(sellerUrl.toString())
    //           .then(async (sellerResponse) => {
    //             if (sellerResponse.data.code === 'IllegalAccessToken') {
    //               throw new Error('IllegalAccessToken')
    //             }
    //             if (shopid1.includes('lazada')) {
    //               const requestUrl = '/category/attributes/get'
    //               if (baseUrl) {
    //                 const payloadIn = await {
    //                   app_key: apiid,
    //                   timestamp: Date.now(),
    //                   sign_method: 'sha256',
    //                   primary_category_id: String(categoryId),
    //                 }
    //                 const payloadid = await getLazadaSign(
    //                   requestUrl,
    //                   payloadIn,
    //                   apikey as any,
    //                 )

    //                 const payload = {
    //                   ...payloadIn,
    //                   sign: payloadid,
    //                 }

    //                 // payload.sign = getLazadaSign(requestUrl, payload, LAZADA_APP_SECRET);
    //                 const url = new URL(`${baseUrl}${requestUrl}`)
    //                 url.search = new URLSearchParams(payload as any).toString()
    //                 return await axios
    //                   .get(url.toString())
    //                   .then((response) => {
    //                     console.log(response.data.data)
    //                     return response.data.data
    //                   })
    //                   // .then((response) => console.log(response.data.data))

    //                   // var result = result22 || []
    //                   // if (data.children === undefined) {
    //                   //   result.push(data.name)}
    //                   .catch((e) => e)
    //               }
    //             }
    //             // throw new Error('invalidStore');
    //           })
    //       }

    //       throw new Error('invalidProfile')
    //     }
    //     throw new Error('invalidMarket')
    //   },
    // })


    t.list.field('Adminsellerfilteringbyid', {
      type: 'Adminsellerfiltering',
      args: {
        userId: intArg(),
      },
      resolve: (parent, { userId}, ctx) => {
   

        return ctx.prisma.adminsellerfiltering.findMany({
          where: {
            userId: Number(userId),
          },
        })
      },
    })

    t.list.field('Connectinfosbyid', {
      type: 'Connectinfo',
      args: { userId: intArg(), shopid: stringArg() },
      resolve: (parent, { userId, shopid }, ctx) => {
        // const userId = getUserId(ctx)
        return ctx.prisma.connectinfo.findMany({
          where: {
            userId: Number(userId),
            shopid: String(shopid) + String(userId),
          },
        })
      },
    })


    t.field('productpage', {
      type: 'Productpage',
      nullable: true,
      args: { id: intArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.productpage.findOne({
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('product', {
      type: 'Product',
      nullable: true,
      args: { id: intArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.product.findOne({
          where: {
            id: Number(id),
          },
        })
      },
    })

    //project

    t.list.field('orders', {
      type: 'Ordermanageitems',
      resolve: (parent, args, ctx) : any => {
        return ctx.prisma.ordermanageitems.findMany(
        )
      },
    })

 

    t.list.field('ordersbyuserid', {
      type: 'Ordermanageitems',
      args: { userId: intArg() },
      resolve: (parent, { userId }, ctx): any => {
        return ctx.prisma.ordermanageitems.findMany({
          where: {
            userId: Number(userId),
          },
        })
      },
    })


    t.list.field('ordersbyorderid', {
      type: 'Ordermanageitems',
      args: { id: intArg() },
      resolve: (parent, { id }, ctx): any => {
        return ctx.prisma.ordermanageitems.findMany({
          where: {
            id: Number(id),
          },
        })
      },
    })


    t.list.field('paidorders', {
      type: 'Paidproductlist',
      resolve: (parent, args, ctx) : any => {
        return ctx.prisma.paidproductlist.findMany(
        )
      },
    })
    t.list.field('paidorderbyid', {
      type: 'Paidproductlist',
      args: { id: intArg() },
      resolve: (parent, { id }, ctx): any => {
        return ctx.prisma.paidproductlist.findMany({
          where: {
            id: Number(id),
          },
        })
      },
    })

    


  },
})
