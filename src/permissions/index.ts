import { allow, rule, shield } from 'graphql-shield'
import { getUserId } from '../utils'


// export const permissions = shield({})

export const permissions = shield({
  Query: {
    // me: rules.isAuthenticatedUser,
    // filterPosts: rules.isAuthenticatedUser,
    // tweet: rules.isAuthenticatedUser,
    "*": allow,
  },
  Mutation: {
    // createDraft: rules.isAuthenticatedUser,
    // deletePost: rules.isPostOwner,
    // publish: rules.isPostOwner,
    "*": allow,
  },
})
