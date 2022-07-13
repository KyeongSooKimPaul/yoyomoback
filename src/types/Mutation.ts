import { arg, booleanArg, intArg, mutationType, stringArg } from '@nexus/schema'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { APP_SECRET, getUserId } from '../utils'
import { getLazadaSign } from '../types/getLazadaSign'
import { URL, URLSearchParams } from 'url'
import axios from 'axios'
import { request, gql } from 'graphql-request'
import { timeStamp } from 'console'
import twilio = require('twilio')

// const marketConnectMutation = gql`
//   mutation ConnectMarket(
//     $apiId: String
//     $apiKey: String
//     $shop: String!
//     $code: String
//   ) {
//     ConnectMarket(
//       input: { apiId: $apiId, apiKey: $apiKey, shop: $shop, code: $code }
//     ) {
//       token
//       refreshToken
//       success
//     }
//   }
// `

export const Mutation = mutationType({
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: stringArg(),
        phonenumber: stringArg(),
        email: stringArg(),
        password: stringArg(),
      },
      resolve: async (
        _parent,
        { name, email, password, phonenumber }: any,
        ctx,
      ) => {
        const hashedPassword = await hash(password, 10)
        const user = await ctx.prisma.user.create({
          data: {
            phonenumber,
            name,
            email,
            password: hashedPassword,
          },
        })

        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { email, password }, ctx) => {
        const user = await ctx.prisma.user.findOne({
          where: {
            email,
          },
        })
        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    // t.field('verificationPhone', {
    //   type: 'User',
    //   args: {
    //     phonenumber: stringArg({ nullable: true }),
    //   },
    //   resolve: async (_parent, { phonenumber }, ctx): Promise<any> => {
    //     console.log('phondfsfe', process.env.ACOUNTSID)

    //     const client = await twilio(
    //       process.env.ACOUNTSID,
    //       process.env.AUTHTOKEN,
    //     )

    //     await client.messages
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
    //     return null
    //   },
    // })

    t.field('resetpassword', {
      type: 'AuthPayload',
      args: {
        email: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { email }, ctx) => {
        const user = await ctx.prisma.user.findOne({
          where: {
            email,
          },
        })
        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }

        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('updatepassword', {
      type: 'AuthPayload',
      args: {
        id: intArg(),
        password: stringArg(),
      },
      resolve: async (_parent, { id, password }: any, ctx): Promise<any> => {
        const userId = getUserId(ctx)
        const hashedPassword = await hash(password, 10)
        if (!userId) throw new Error('Could not authenticate user.')
        return await ctx.prisma.user.update({
          data: {
            password: hashedPassword,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('updateuserdepost', {
      type: 'User',
      args: {
        id: intArg(),
        deposit: stringArg(),
      },
      resolve: (parent, { id, ...args }, ctx): any => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.user.update({
          data: {
            ...(args as any),
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('updateuserdepositandpoint', {
      type: 'User',
      args: {
        id: intArg(),
        deposit: stringArg(),
        point: stringArg(),
      },
      resolve: (parent, { id, ...args }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.user.update({
          data: {
            ...(args as any),
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('createProfile', {
      type: 'Profile',
      args: {
        bio: stringArg(),
        location: stringArg(),
        website: stringArg(),
        avatar: stringArg(),
      },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.profile.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('updateProfile', {
      type: 'Profile',
      args: {
        id: intArg(),
        bio: stringArg(),
        location: stringArg(),
        website: stringArg(),
        avatar: stringArg(),
      },
      resolve: (parent, { id, ...args }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.profile.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    //jinsung
    t.field('createUserProfile', {
      type: 'UserProfile',
      args: {
        kakaoid: stringArg({ nullable: true }),
        gsiid: stringArg({ nullable: true }),
        bankname: stringArg({ nullable: true }),
        bankaccount: stringArg({ nullable: true }),
        businessnumber: stringArg({ nullable: true }),
        contactemail: stringArg({ nullable: true }),
        deposit: stringArg({ nullable: true }),
        point: stringArg({ nullable: true }),
      },
      resolve: (parent, { ...args }, ctx) => {
        const userId = getUserId(ctx)
        console.log('userid', userId)
        console.log('args', args as any)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.userProfile.create({
          data: {
            ...(args as any),
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('updateUserProfile', {
      type: 'UserProfile',
      args: {
        id: intArg(),
        kakaoid: stringArg(),
        gsiid: stringArg(),
        bankname: stringArg(),
        bankaccount: stringArg(),
        businessnumber: stringArg(),
        contactemail: stringArg(),
        deposit: stringArg(),
        point: stringArg(),
      },
      resolve: (parent, { id, ...args }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        console.log('userid', userId)
        console.log('args', args as any)
        return ctx.prisma.userProfile.update({
          data: {
            ...(args as any),
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('createUserProfiledepost', {
      type: 'UserProfile',
      args: {
        deposit: stringArg(),
      },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.userProfile.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          } as any,
        })
      },
    })

    t.field('updateUserProfiledepost', {
      type: 'UserProfile',
      args: {
        id: intArg(),
        deposit: stringArg(),
      },
      resolve: (parent, { id, ...args }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.userProfile.update({
          data: {
            ...args,
          } as any,
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('updateUserProfilepoint', {
      type: 'UserProfile',
      args: {
        id: intArg(),
        point: stringArg(),
      },
      resolve: (parent, { id, ...args }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.userProfile.update({
          data: {
            ...args,
          } as any,
          where: {
            id: Number(id),
          },
        })
      },
    })

    //jinsung
    // t.field('createConnectinfo', {
    //   type: 'Connectinfo',
    //   args: {
    //     shopid: stringArg(),
    //     apiid: stringArg(),
    //     apikey: stringArg(),
    //     code: stringArg(),
    //     shop: stringArg(),
    //     access_token: stringArg(),
    //     refresh_token: stringArg(),
    //     expires_in: intArg(),
    //     refresh_expires_in: intArg(),
    //   },

    //   resolve: async (_parent: any, {shopid, ...args}, ctx: any) => {

    //     console.log('result2,', result2)
    //     return result2

    //   },
    // })
    // t.field('createConnectinfo', {
    //   type: 'Connectinfo',
    //   args: {
    //     shopid: stringArg(),
    //     apiid: stringArg(),
    //     apikey: stringArg(),
    //     code: stringArg(),
    //     shop: stringArg(),
    //     access_token: stringArg(),
    //     refresh_token: stringArg(),
    //     expires_in: stringArg(),
    //     refresh_expires_in: stringArg(),
    //   },

    //   resolve: async (_parent: any, { shopid, ...args }, ctx: any) => {
    //     const userId = getUserId(ctx)
    //     if (!userId) throw new Error('Could not authenticate user.')

    //     if (args.shop?.includes('lazada')) {
    //       var baseUrl = process.env.LAZADA_URL_AUTH
    //       if (baseUrl) {
    //         const requestUrl = '/auth/token/create'

    //         const id = args.apiid
    //         const key = args.apikey
    //         const code = args.code

    //         const payloadIn = {
    //           app_key: id as any,
    //           timestamp: Date.now() as any,
    //           sign_method: 'sha256' as any,
    //           code: code as any,
    //         }

    //         const payloadsSign = await getLazadaSign(
    //           requestUrl,
    //           payloadIn,
    //           key as any,
    //         )
    //         const payload = await { ...payloadIn, sign: payloadsSign }

    //         const url = await new URL(`${baseUrl}${requestUrl}`)
    //         url.search = await new URLSearchParams(payload).toString()
    //         const accessData = await axios.get(url.toString())
    //         // console.log(accessData)
    //         // console.log('---------------------')
    //         if (accessData.status === 200) {
    //           if (accessData.data.code === '0') {
    //             const {
    //               access_token,
    //               refresh_token,
    //               expires_in,
    //               refresh_expires_in,
    //             } = accessData.data

    //             const accessdatapayload = {
    //               ...args,
    //               access_token,
    //               refresh_token,
    //               expires_in,
    //               refresh_expires_in,
    //             }

    //             var result2
    //             // const users = await prisma.user.findMany({
    //             //   where: {
    //             //     email: {
    //             //       endsWith: 'prisma.io',
    //             //       mode: 'insensitive', // Default value: default
    //             //     },
    //             //     name: {
    //             //       equals: 'Archibald', // Default mode
    //             //     },
    //             //   },
    //             // })
    //             const result1 = await ctx.prisma.connectinfo.findMany({
    //               where: {
    //                 shopid: {
    //                   equals: String('lazada_my'),
    //                 },
    //                 userId: {
    //                   equals: Number(userId),
    //                 },
    //               },
    //             })
    //             console.log('result111', result1)
    //             console.log('result111', result1.length)
    //             if (result1.length == 0) {
    //               return (result2 = await ctx.prisma.connectinfo.create({
    //                 data: {
    //                   shopid: String('lazada_my'),
    //                   ...accessdatapayload,
    //                   User: { connect: { id: Number(userId) } },
    //                 },
    //               }))
    //             } else {
    //               console.log('result22,', result2)
    //               result2 = await ctx.prisma.connectinfo.deleteMany({
    //                 where: {
    //                   shopid: {
    //                     equals: String('lazada_my'),
    //                   },
    //                   userId: {
    //                     equals: Number(userId),
    //                   },
    //                 },
    //               })
    //               return (result2 = await ctx.prisma.connectinfo.create({
    //                 data: {
    //                   shopid: String('lazada_my'),
    //                   ...accessdatapayload,
    //                   User: { connect: { id: Number(userId) } },
    //                 },
    //               }))
    //             }
    //           }
    //         }
    //         throw new Error('accessError')
    //       }
    //       throw new Error('invalidCountry')
    //     }
    //   },
    // })

    t.field('updateConnectinfo', {
      type: 'Connectinfo',
      args: {
        id: intArg(),
        shopid: stringArg(),
        apiid: stringArg(),
        apikey: stringArg(),
        code: stringArg(),
        shop: stringArg(),
      },
      resolve: (parent, { id, ...args }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.connectinfo.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('createMaxiplan', {
      type: 'Maxiplan',
      args: {
        malls: stringArg(),

        plan: stringArg(),
        monthlycollecting: stringArg(),
        productamount: stringArg(),
        productmanagingamount: stringArg(),
        update: stringArg(),
        monthlyplanfee: stringArg(),
        settingfee: stringArg(),
        translatefee: stringArg(),

        platformsettingprice: stringArg(),
        monthlyplatformsfee: stringArg(),
      },
      resolve: (parent, args: any, ctx) => {
        const userId = getUserId(ctx)

        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.maxiplan.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('updateMaxiplan', {
      type: 'Maxiplan',
      args: {
        id: intArg(),

        malls: stringArg(),

        plan: stringArg(),
        monthlycollecting: stringArg(),
        productamount: stringArg(),
        productmanagingamount: stringArg(),
        update: stringArg(),
        monthlyplanfee: stringArg(),
        settingfee: stringArg(),
        translatefee: stringArg(),

        platformsettingprice: stringArg(),
        monthlyplatformsfee: stringArg(),
      },
      resolve: (parent, { id, args }: any, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.maxiplan.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('updateMaxiplanoption', {
      type: 'Maxiplan',
      args: {
        id: intArg(),
        productamount: stringArg(),
        update: stringArg(),
      },
      resolve: (parent, { id, productamount, update }: any, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.maxiplan.update({
          data: {
            productamount: String(productamount),
            update: String(update),
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('createExchangeRate', {
      type: 'ExchangeRate',
      args: {
        cntokor: stringArg(),
        cntojp: stringArg(),
        jptokor: stringArg(),
        jptomal: stringArg(),
        jptocn: stringArg(),
        kortomal: stringArg(),
        kortocn: stringArg(),
        kortojp: stringArg(),
        ustocn: stringArg(),
        ustomal: stringArg(),
        indexid: intArg(),
        ustojp: stringArg(),
        ustokor: stringArg(),
      },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.exchangeRate.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('updateExchangeRate', {
      type: 'ExchangeRate',
      args: {
        id: intArg(),
        cntokor: stringArg(),
        cntojp: stringArg(),
        jptokor: stringArg(),
        jptomal: stringArg(),
        jptocn: stringArg(),
        kortomal: stringArg(),
        kortocn: stringArg(),
        kortojp: stringArg(),
        ustocn: stringArg(),
        ustomal: stringArg(),
        indexid: intArg(),
        ustojp: stringArg(),
        ustokor: stringArg(),
      },
      resolve: (parent, { id, ...args }: any, ctx) => {
        return ctx.prisma.exchangeRate.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('createDeliveryfee', {
      type: 'Deliveryfee',
      args: {
        cntokor: stringArg(),
        cntojp: stringArg(),
        jptokor: stringArg(),
        jptomal: stringArg(),
        jptocn: stringArg(),
        kortomal: stringArg(),
        kortocn: stringArg(),
        kortojp: stringArg(),
        ustocn: stringArg(),
        ustomal: stringArg(),
        ustojp: stringArg(),
        ustokor: stringArg(),
        indexid: intArg(),
      },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.deliveryfee.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('updateDeliveryfee', {
      type: 'Deliveryfee',
      args: {
        id: intArg(),
        cntokor: stringArg(),
        cntojp: stringArg(),
        jptokor: stringArg(),
        jptomal: stringArg(),
        jptocn: stringArg(),
        kortomal: stringArg(),
        kortocn: stringArg(),
        kortojp: stringArg(),
        ustocn: stringArg(),
        ustomal: stringArg(),
        ustojp: stringArg(),
        ustokor: stringArg(),
        indexid: intArg(),
      },
      resolve: (parent, { id, ...args }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.deliveryfee.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('createSellingprice', {
      type: 'Sellingprice',
      args: {
        price: stringArg(),
        mallname: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        var result2

        const result1 = await ctx.prisma.sellingprice.findMany({
          where: {
            mallname: {
              equals: args.mallname,
            },
            userId: {
              equals: Number(userId),
            },
          },
        })

        if (result1.length == 0) {
          return (result2 = await ctx.prisma.sellingprice.create({
            data: {
              mallname: String(args.mallname),
              price: String(args.price),
              User: { connect: { id: Number(userId) } },
            },
          }))
        } else {
          result2 = await ctx.prisma.sellingprice.deleteMany({
            where: {
              mallname: {
                equals: String(args.mallname),
              },
              userId: {
                equals: Number(userId),
              },
            },
          })
          return (result2 = await ctx.prisma.sellingprice.create({
            data: {
              mallname: String(args.mallname),
              price: String(args.price),
              User: { connect: { id: Number(userId) } },
            },
          }))
        }
      },
    })

    t.field('updateSellingprice', {
      type: 'Sellingprice',
      args: {
        id: intArg(),
        price: stringArg(),
      },
      resolve: (parent, { id, ...args }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.sellingprice.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('createSubid', {
      type: 'Subid',
      args: {
        subid: stringArg(),
      },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.subid.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })
    t.field('createTweet', {
      type: 'Tweet',
      args: {
        content: stringArg(),
      },
      resolve: (parent, { content }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.tweet.create({
          data: {
            content,
            author: { connect: { id: Number(userId) } },
          },
        })
      },
    })
    t.field('likeTweet', {
      type: 'LikedTweet',
      args: {
        id: intArg(),
      },
      resolve: (parent, { id }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.likedTweet.create({
          data: {
            tweet: { connect: { id: Number(id) } },
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })
    t.field('deleteLike', {
      type: 'LikedTweet',
      args: {
        id: intArg({ nullable: false }),
      },
      resolve: (parent, { id }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.likedTweet.delete({
          where: { id: id },
        })
      },
    })
    t.field('createComment', {
      type: 'Comment',
      args: {
        content: stringArg({ nullable: false }),
        id: intArg({ nullable: false }),
      },
      resolve: (parent, { content, id }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.comment.create({
          data: {
            content,
            User: { connect: { id: Number(userId) } },
            Tweet: { connect: { id: Number(id) } },
          },
        })
      },
    })
    t.field('createReply', {
      type: 'Comment',
      args: {
        content: stringArg({ nullable: false }),
        id: intArg({ nullable: false }),
        commentId: intArg(),
      },
      resolve: (parent, { content, id, commentId }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.comment.create({
          data: {
            content,
            User: { connect: { id: Number(userId) } },
            Tweet: { connect: { id: Number(id) } },
            Comment: { connect: { id: Number(commentId) } },
          },
        })
      },
    })
    t.field('follow', {
      type: 'Following',
      args: {
        name: stringArg({ nullable: false }),
        followId: intArg({ nullable: false }),
        avatar: stringArg({ nullable: false }),
      },
      resolve: (parent, { name, followId, avatar }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.following.create({
          data: {
            name,
            avatar,
            followId,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })
    t.field('deleteFollow', {
      type: 'Following',
      args: {
        id: intArg({ nullable: false }),
      },
      resolve: (parent, { id }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.following.delete({
          where: { id: id },
        })
      },
    })

    //admin

    t.field('createAdminbasicmall', {
      type: 'Adminbasicmall',
      args: {
        country: stringArg(),
        platform: stringArg(),
        settingfee: stringArg(),

        translatefee: stringArg(),
        monthlyfee: stringArg(),
        selleramount: stringArg(),
        active: booleanArg(),
      },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.adminbasicmall.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('updateAdminbasicmalln', {
      type: 'Adminbasicmall',
      args: {
        id: intArg(),
        country: stringArg(),
        platform: stringArg(),
        settingfee: stringArg(),
        translatefee: stringArg(),
        monthlyfee: stringArg(),
        selleramount: stringArg(),
        active: booleanArg(),
      },
      resolve: (parent, { id, ...args }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.adminbasicmall.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('deleteAdminbasicmall', {
      type: 'Adminbasicmall',
      args: {
        id: intArg(),
      },
      resolve: (parent, { id }, ctx) => {
        // const userId = getUserId(ctx)
        // if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.adminbasicmall.delete({
          where: { id: Number(id) },
        })
      },
    })

    t.field('createAdminbasicplan', {
      type: 'Adminbasicplan',
      args: {
        plan: stringArg(),
        monthlycollecting: stringArg(),
        productamount: stringArg(),
        productmanagingamount: stringArg(),
        update: stringArg(),
        monthlyplanfee: stringArg(),
        settingfee: stringArg(),
        translatefee: stringArg(),
        active: booleanArg(),
      },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.adminbasicplan.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('updateAdminbasicplan', {
      type: 'Adminbasicplan',
      args: {
        id: intArg(),
        plan: stringArg(),
        monthlycollecting: stringArg(),
        productamount: stringArg(),
        productmanagingamount: stringArg(),
        update: stringArg(),
        monthlyplanfee: stringArg(),
        settingfee: stringArg(),
        active: booleanArg(),
        translatefee: stringArg(),
      },
      resolve: (parent, { id, ...args }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.adminbasicplan.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('deleteAdminbasicplan', {
      type: 'Adminbasicplan',
      args: {
        id: intArg(),
      },
      resolve: (parent, { id }, ctx) => {
        // const userId = getUserId(ctx)
        // if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.adminbasicplan.delete({
          where: { id: Number(id) },
        })
      },
    })

    t.field('createAdmincollectcategory', {
      type: 'Admincollectcategory',
      args: {
        order: stringArg(),
        first: stringArg(),
        second: stringArg(),
        message: stringArg(),
        active: booleanArg(),
      },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.admincollectcategory.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('updateAdmincollectcategory', {
      type: 'Admincollectcategory',
      args: {
        id: intArg(),
        order: stringArg(),
        first: stringArg(),
        second: stringArg(),
        message: stringArg(),
        active: booleanArg(),
      },
      resolve: (parent, { id, ...args }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.admincollectcategory.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('createAdmincollectmarket', {
      type: 'Admincollectmarket',
      args: {
        productamount: stringArg(),
        market: stringArg(),
        country: stringArg(),
        active: booleanArg(),
        image: stringArg(),
        userId: intArg(),
      },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.admincollectmarket.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('deleteAdmincollectmarket', {
      type: 'Admincollectmarket',
      args: {
        id: intArg(),
      },
      resolve: (parent, { id }, ctx) => {
        // const userId = getUserId(ctx)
        // if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.admincollectmarket.delete({
          where: { id: Number(id) },
        })
      },
    })

    // t.field('updateAdmincollectmarket', {
    //   type: 'Admincollectmarket',
    //   args: {
    //     id: intArg(),
    //     productamount: stringArg(),
    //     market: stringArg(),
    //     country: stringArg(),
    //     active: booleanArg(),
    //     image: stringArg(),
    //   },
    //   resolve: (parent, { id, ...args }, ctx) => {
    //     const userId = getUserId(ctx)
    //     if (!userId) throw new Error('Could not authenticate user.')

    //     return ctx.prisma.admincollectmarket.update({
    //       data: {
    //         ...args,
    //       },
    //       where: {
    //         id: Number(id),
    //       },
    //     })
    //   },
    // })

    t.field('createAdmincollectnation', {
      type: 'Admincollectnation',
      args: {
        productamount: stringArg(),
        country: stringArg(),
        market: stringArg(),
        active: booleanArg(),
        image: stringArg(),
      },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.admincollectnation.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('deleteAdmincollectnation', {
      type: 'Admincollectnation',
      args: {
        id: intArg(),
      },
      resolve: (parent, { id }, ctx) => {
        // const userId = getUserId(ctx)
        // if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.admincollectnation.delete({
          where: { id: Number(id) },
        })
      },
    })
    // t.field('updateAdmincollectnation', {
    //   type: 'Admincollectnation',
    //   args: {
    //     id: intArg(),
    //     productamount: stringArg(),
    //     market: stringArg(),
    //     country: stringArg(),
    //     active: booleanArg(),
    //     image: stringArg(),
    //   },
    //   resolve: (parent, { id, ...args }, ctx) => {
    //     const userId = getUserId(ctx)
    //     if (!userId) throw new Error('Could not authenticate user.')

    //     return ctx.prisma.admincollectnation.update({
    //       data: {
    //         ...args,
    //       },
    //       where: {
    //         id: Number(id),
    //       },
    //     })
    //   },
    // })

    t.field('createAdmincommissionfee', {
      type: 'Admincommissionfee',
      args: {
        country: stringArg(),
        market: stringArg(),
        fee: stringArg(),
      },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.admincommissionfee.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('updateAdmincommissionfee', {
      type: 'Admincommissionfee',
      args: {
        id: intArg(),

        fee: stringArg(),
      },
      resolve: (parent, { id, ...args }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.admincommissionfee.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('deleteAdmincommissionfee', {
      type: 'Admincommissionfee',
      args: {
        id: intArg(),
      },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.admincommissionfee.delete({
          where: { id: Number(id) },
        })
      },
    })

    t.field('createAdmincommissionmarket', {
      type: 'Admincommissionmarket',
      args: {
        country: stringArg(),
        market: stringArg(),
        fee: stringArg(),
      },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.admincommissionmarket.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('updateAdmincommissionmarket', {
      type: 'Admincommissionmarket',
      args: {
        id: intArg(),

        fee: stringArg(),
      },
      resolve: (parent, { id, ...args }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.admincommissionmarket.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('deleteAdmincommissionmarket', {
      type: 'Admincommissionmarket',
      args: {
        id: intArg(),
      },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.admincommissionmarket.delete({
          where: { id: Number(id) },
        })
      },
    })

    t.field('createAdmincommissiontransfer', {
      type: 'Admincommissiontransfer',
      args: {
        country: stringArg(),
        market: stringArg(),
        fee: stringArg(),
      },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.admincommissiontransfer.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('updateAdmincommissiontransfer', {
      type: 'Admincommissiontransfer',
      args: {
        id: intArg(),

        fee: stringArg(),
      },
      resolve: (parent, { id, ...args }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.admincommissiontransfer.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('deleteAdmincommissiontransfer', {
      type: 'Admincommissiontransfer',
      args: {
        id: intArg(),
      },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.admincommissiontransfer.delete({
          where: { id: Number(id) },
        })
      },
    })

    t.field('createAdminoptionfee', {
      type: 'Adminoptionfee',
      args: {
        productamount: stringArg(),
        price: stringArg(),
        promotion: stringArg(),
        active: booleanArg(),
        modelsort: stringArg(),
        indexid: intArg(),
      },
      resolve: (parent, args: any, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.adminoptionfee.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('updateAdminoptionfee', {
      type: 'Adminoptionfee',
      args: {
        id: intArg(),
        productamount: stringArg(),
        price: stringArg(),
        promotion: stringArg(),
        active: booleanArg(),
        modelsort: stringArg(),
        indexid: intArg(),
      },
      resolve: (parent, { id, ...args }: any, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.adminoptionfee.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('deleteAdminoptionfee', {
      type: 'Adminoptionfee',
      args: {
        id: intArg(),
      },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.adminoptionfee.delete({
          where: { id: Number(id) },
        })
      },
    })

    t.field('createAdminsellerfiltering', {
      type: 'Adminsellerfiltering',
      args: {
        country: stringArg(),
        market: stringArg(),
        contents: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        var result2

        const result1 = await ctx.prisma.adminsellerfiltering.findMany({
          where: {
            market: {
              equals: args.market,
            },
            userId: {
              equals: Number(userId),
            },
          } as any,
        })

        if (result1.length == 0) {
          return (result2 = await ctx.prisma.adminsellerfiltering.create({
            data: {
              market: String(args.market),
              contents: String(args.contents),
              User: { connect: { id: Number(userId) } },
            } as any,
          }))
        } else {
          result2 = await ctx.prisma.adminsellerfiltering.deleteMany({
            where: {
              market: {
                equals: String(args.market),
              },
              userId: {
                equals: Number(userId),
              },
            } as any,
          })
          return (result2 = await ctx.prisma.adminsellerfiltering.create({
            data: {
              market: String(args.market),
              contents: String(args.contents),
              User: { connect: { id: Number(userId) } },
            } as any,
          }))
        }
      },
    })

    t.field('updateAdminsellerfiltering', {
      type: 'Adminsellerfiltering',
      args: {
        id: intArg(),
        country: stringArg(),
        market: stringArg(),
        contents: stringArg(),
      },
      resolve: (parent, { id, ...args }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.adminsellerfiltering.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('createStockhandling', {
      type: 'Stockhandling',
      args: {
        stockimage: stringArg(),
        name: stringArg(),
        price: stringArg(),
        stock: stringArg(),
        stockdemand: stringArg(),
        widthrowdemand: stringArg(),
        productfrom: stringArg(),
        productto: stringArg(),
        indexid: intArg(),
      },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.stockhandling.create({
          data: {
            ...(args as any),
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('updateStockhandling', {
      type: 'Stockhandling',
      args: {
        id: intArg(),
        price: stringArg(),
        stock: stringArg(),
        stockdemand: stringArg(),
        widthrowdemand: stringArg(),
      },
      resolve: (parent, { id, ...args }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.stockhandling.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('deleteStockhandling', {
      type: 'Stockhandling',
      args: {
        id: intArg(),
      },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.stockhandling.delete({
          where: { id: Number(id) },
        })
      },
    })

    t.field('createCheckpoint', {
      type: 'Checkpoint',
      args: {
        marketname: stringArg(),
        price: stringArg(),
        image: stringArg(),
        checkstatus: stringArg(),
      },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.checkpoint.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('updateCheckpoint', {
      type: 'Checkpoint',
      args: {
        id: intArg(),
        checkstatus: stringArg(),
      },
      resolve: (parent, { id, ...args }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.checkpoint.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('createChangepoint', {
      type: 'Changepoint',
      args: {
        price: stringArg(),

        checkstatus: stringArg(),
      },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.changepoint.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('updateChangepoint', {
      type: 'Changepoint',
      args: {
        id: intArg(),

        checkstatus: stringArg(),
      },
      resolve: (parent, { id, ...args }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.changepoint.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
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

    t.field('updateDemandpoint', {
      type: 'Demandpoint',
      args: {
        id: intArg(),
        checkname: stringArg(),
        confirmAt: stringArg(),
      },
      resolve: (parent, { id, ...args }: any, ctx) => {
        const userId = getUserId(ctx)
        // const now = Date.now()
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.demandpoint.update({
          data: {
            // confirmAt:now,
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('createDeliverymangeitemst', {
      type: 'Deliverymangeitems',
      args: {
        product_main_image: stringArg(),
        name: stringArg(),
        currency: stringArg(),
        shipping_amount: stringArg(),
        created_at: stringArg(),
        updated_at: stringArg(),
        paid_price: stringArg(),
        item_price: stringArg(),
      },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.deliverymangeitems.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('deleteDeliverymangeitems', {
      type: 'Deliverymangeitems',
      args: {
        id: intArg(),
      },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.deliverymangeitems.delete({
          where: { id: Number(id) },
        })
      },
    })

    t.field('createProductupdate', {
      type: 'Productupdate',
      args: {
        postfix: stringArg(),
        prefix: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        var result2

        const result1 = await ctx.prisma.productupdate.findMany({
          where: {
            userId: {
              equals: Number(userId),
            },
          } as any,
        })

        if (result1.length == 0) {
          return (result2 = await ctx.prisma.productupdate.create({
            data: {
              postfix: String(args.postfix),
              prefix: String(args.prefix),
              User: { connect: { id: Number(userId) } },
            } as any,
          }))
        } else {
          result2 = await ctx.prisma.productupdate.deleteMany({
            where: {
              userId: {
                equals: Number(userId),
              },
            } as any,
          })
          return (result2 = await ctx.prisma.productupdate.create({
            data: {
              postfix: String(args.postfix),
              prefix: String(args.prefix),
              User: { connect: { id: Number(userId) } },
            } as any,
          }))
        }
      },
    })

    t.field('createFiltering', {
      type: 'Filtering',
      args: {
        country: stringArg(),
        market: stringArg(),
        contents: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        var result2

        const result1 = await ctx.prisma.filtering.findMany({
          where: {
            market: {
              equals: args.market,
            },
            userId: {
              equals: Number(userId),
            },
          } as any,
        })

        if (result1.length == 0) {
          return (result2 = await ctx.prisma.filtering.create({
            data: {
              market: String(args.market),
              contents: String(args.contents),
              User: { connect: { id: Number(userId) } },
            } as any,
          }))
        } else {
          result2 = await ctx.prisma.filtering.deleteMany({
            where: {
              market: {
                equals: String(args.market),
              },
              userId: {
                equals: Number(userId),
              },
            } as any,
          })
          return (result2 = await ctx.prisma.filtering.create({
            data: {
              market: String(args.market),
              contents: String(args.contents),
              User: { connect: { id: Number(userId) } },
            } as any,
          }))
        }
      },
    })

    t.field('createAddmenual', {
      type: 'Addmenual',
      args: {
        contents: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        var result2

        const result1 = await ctx.prisma.addmenual.findMany({
          where: {
            // contents: {
            //   equals: args.contents,
            // },
            userId: {
              equals: Number(userId),
            },
          } as any,
        })
        console.log('result', result1)
        if (result1.length == 0) {
          return (result2 = await ctx.prisma.addmenual.create({
            data: {
              contents: String(args.contents),

              User: { connect: { id: Number(userId) } },
            } as any,
          }))
        } else {
          result2 = await ctx.prisma.addmenual.deleteMany({
            where: {
              // contents: {
              //   equals: String(args.contents),
              // },
              userId: {
                equals: Number(userId),
              },
            } as any,
          })
          return (result2 = await ctx.prisma.addmenual.create({
            data: {
              contents: String(args.contents),

              User: { connect: { id: Number(userId) } },
            } as any,
          }))
        }
      },
    })

    t.field('createPrivacypolicy', {
      type: 'Privacypolicy',
      args: {
        contents: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        var result2

        const result1 = await ctx.prisma.privacypolicy.findMany({
          where: {
            // contents: {
            //   equals: args.contents,
            // },
            userId: {
              equals: Number(userId),
            },
          } as any,
        })
        console.log('result', result1)
        if (result1.length == 0) {
          return (result2 = await ctx.prisma.privacypolicy.create({
            data: {
              contents: String(args.contents),

              User: { connect: { id: Number(userId) } },
            } as any,
          }))
        } else {
          result2 = await ctx.prisma.privacypolicy.deleteMany({
            where: {
              // contents: {
              //   equals: String(args.contents),
              // },
              userId: {
                equals: Number(userId),
              },
            } as any,
          })
          return (result2 = await ctx.prisma.privacypolicy.create({
            data: {
              contents: String(args.contents),

              User: { connect: { id: Number(userId) } },
            } as any,
          }))
        }
      },
    })

    t.field('createRefundpolicy', {
      type: 'Refundpolicy',
      args: {
        contents: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        var result2

        const result1 = await ctx.prisma.refundpolicy.findMany({
          where: {
            // contents: {
            //   equals: args.contents,
            // },
            userId: {
              equals: Number(userId),
            },
          } as any,
        })
        console.log('result', result1)
        if (result1.length == 0) {
          return (result2 = await ctx.prisma.refundpolicy.create({
            data: {
              contents: String(args.contents),

              User: { connect: { id: Number(userId) } },
            } as any,
          }))
        } else {
          result2 = await ctx.prisma.refundpolicy.deleteMany({
            where: {
              // contents: {
              //   equals: String(args.contents),
              // },
              userId: {
                equals: Number(userId),
              },
            } as any,
          })
          return (result2 = await ctx.prisma.refundpolicy.create({
            data: {
              contents: String(args.contents),

              User: { connect: { id: Number(userId) } },
            } as any,
          }))
        }
      },
    })

    t.field('createTermsanduse', {
      type: 'Termsanduse',
      args: {
        contents: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        var result2

        const result1 = await ctx.prisma.termsanduse.findMany({
          where: {
            // contents: {
            //   equals: args.contents,
            // },
            userId: {
              equals: Number(userId),
            },
          } as any,
        })
        console.log('result', result1)
        if (result1.length == 0) {
          return (result2 = await ctx.prisma.termsanduse.create({
            data: {
              contents: String(args.contents),

              User: { connect: { id: Number(userId) } },
            } as any,
          }))
        } else {
          result2 = await ctx.prisma.termsanduse.deleteMany({
            where: {
              // contents: {
              //   equals: String(args.contents),
              // },
              userId: {
                equals: Number(userId),
              },
            } as any,
          })
          return (result2 = await ctx.prisma.termsanduse.create({
            data: {
              contents: String(args.contents),

              User: { connect: { id: Number(userId) } },
            } as any,
          }))
        }
      },
    })

    //project
    t.field('productpagemutation', {
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

    t.field('createProduct', {
      type: 'Product',
      args: {
        title: stringArg(),
        description: stringArg(),
        type: stringArg(),
        brand: stringArg(),
        category: stringArg(),
        price: intArg(),
        newproduct: stringArg(),
        sale: stringArg(),
        stock: stringArg(),
        discount: intArg(),
        variants: stringArg(),
        images: stringArg(),
        userId: intArg(),
        productpageId: intArg(),
      },
      resolve: async (
        _parent,
        {
          productpageId,
          userId,
          title,
          description,
          type,
          brand,
          category,
          price,
          newproduct,
          sale,
          stock,
          discount,
          variants,
          images,
        },
        ctx,
      ) => {
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.product.create({
          data: {
            title,
            description,
            type,
            brand,
            category,
            price,
            newproduct,
            sale,
            stock,
            discount,
            variants,
            images,
            User: { connect: { id: Number(userId) } },

            Productpage: { connect: { id: Number(productpageId) } },
          },
        })
      },
    })

    t.field('createOrder', {
      type: 'Ordermanageitems',
      args: {
        product_main_image: stringArg(),
        name: stringArg(),
        productid: intArg(),
        keepingamount: stringArg(),
        wholeamount: stringArg(),
        multiorder: stringArg(),
        shipping_amount: stringArg(),
        updated_at: stringArg(),
        item_price: stringArg(),
        paidstatus: stringArg(),
      },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.ordermanageitems.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('updateOrder', {
      type: 'Ordermanageitems',
      args: {
        id: intArg(),
        paidstatus: stringArg(),
      },
      resolve: (parent, { id, ...args }: any, ctx) => {
        const userId = getUserId(ctx)
        // const now = Date.now()
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.ordermanageitems.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    // t.field('createPaidorderlist', {
    //   type: 'Paidproductlist',
    //   args: {
    //     userId: intArg(),
    //     id: intArg(),
    //     productid: intArg(),
    //     title: stringArg(),
    //     category: stringArg(),
    //     price: stringArg(),
    //     discount: stringArg(),
    //     images: stringArg(),
    //     wholeamount: stringArg(),
    //     keepingamount: stringArg(),
    //     shipping_amount: stringArg(),
    //     updated_at: stringArg(),
    //     orderstatus: stringArg(),
    //   },
    //   resolve: async (parent, args, ctx) => {
    //     const userId = getUserId(ctx)
    //     if (!userId) throw new Error('Could not authenticate user.')
    //     var result2

    //     var test
    //     var wholeamount
    //     var keepingamount
    //     var shipping_amount
    //     const result1: any = await ctx.prisma.paidproductlist.findMany({
    //       where: {
    //         userId: {
    //           equals: Number(args.userId),
    //         },
    //         productid: {
    //           equals: args.productid,
    //         },
    //       } as any,
    //     })
    //     wholeamount = await 0
    //     wholeamount = await result1[0]?.wholeamount
    //     keepingamount = await 0
    //     keepingamount = await result1[0]?.keepingamount
    //     shipping_amount = await 0
    //     shipping_amount = await result1[0]?.shipping_amount

    //     if (result1.length == 0) {
    //       return (result2 = await ctx.prisma.paidproductlist.create({
    //         data: {
    //           productid: Number(args.productid),
    //           title: String(args.title),
    //           category: String(args.category),
    //           price: String(args.price),
    //           discount: String(args.discount),
    //           images: String(args.images),
    //           wholeamount: String(args.wholeamount),
    //           keepingamount: String(args.keepingamount),
    //           shipping_amount: String(args.shipping_amount),
    //           updated_at: String(args.updated_at),
    //           orderstatus: String(args.orderstatus),

    //           User: { connect: { id: Number(userId) } },
    //         } as any,
    //       }))
    //     } else {
    //       result2 = await ctx.prisma.paidproductlist.deleteMany({
    //         where: {
    //           userId: {
    //             equals: Number(args.userId),
    //           },
    //           productid: {
    //             equals: args.productid,
    //           },
    //         } as any,
    //       })
    //       return (result2 = await ctx.prisma.paidproductlist.create({
    //         data: {
    //           productid: Number(args.productid),
    //           title: String(args.title),
    //           category: String(args.category),
    //           price: String(args.price),
    //           discount: String(args.discount),
    //           images: String(args.images),

    //           wholeamount: String(
    //             Number(args.wholeamount) + Number(wholeamount),
    //           ),
    //           keepingamount: String(
    //             Number(args.keepingamount) + Number(keepingamount),
    //           ),
    //           shipping_amount: String(
    //             Number(args.shipping_amount) + Number(shipping_amount),
    //           ),
    //           updated_at: String(args.updated_at),
    //           orderstatus: String(args.orderstatus),
    //           User: { connect: { id: Number(userId) } },
    //         } as any,
    //       }))
    //     }
    //   },
    // })

    t.field('createPaidorderlist', {
      type: 'Paidproductlist',
      args: {
        userId: intArg(),
        id: intArg(),
        productid: intArg(),
        title: stringArg(),
        category: stringArg(),
        price: stringArg(),
        discount: stringArg(),
        images: stringArg(),
        wholeamount: stringArg(),
        keepingamount: stringArg(),
        shipping_amount: stringArg(),
        updated_at: stringArg(),
        orderstatus: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.paidproductlist.create({
          data: {
            productid: Number(args.productid),
            title: String(args.title),
            category: String(args.category),
            price: String(args.price),
            discount: String(args.discount),
            images: String(args.images),
            wholeamount: String(args.wholeamount),
            keepingamount: String(args.keepingamount),
            shipping_amount: String(args.shipping_amount),
            updated_at: String(args.updated_at),
            orderstatus: String(args.orderstatus),

            User: { connect: { id: Number(userId) } },
          } as any,
        })
      },
    })
  },
})
