import { GraphQLServer, Options } from 'graphql-yoga'
import { createContext } from './context'
import { permissions } from './permissions'
import { schema } from './schema'


const options : Options = {
  port: 4001,
  // endpoint: '/graphql2',
  // getEndpoint : true,
  // playground : "/",
  
  
}


const server = new GraphQLServer({

  schema,
  context: createContext,

})
// const server = new GraphQLServer({

//   schema,
//   context: createContext,
//   middlewares: [permissions],
// })

server.start(options, (options) => console.log(`🚀 Server ready at: http://localhost:4000`))

