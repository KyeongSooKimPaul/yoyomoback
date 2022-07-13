import { objectType } from '@nexus/schema'
// import {createHmac} from 'create-hmac';
import createHmac = require("create-hmac")

export const getLazadaSign = (requestUrl: string, payload: any, key: string) => {
  try {
    const keys = Object.keys(payload).sort()
    const signString = keys.map((k) => `${k}${payload[k]}`).join('')
    console.log(`${requestUrl}${signString}`)
    return Buffer.from(
      createHmac('sha256', key)
      .update(`${requestUrl}${signString}`)
      .digest('hex')
    )
      .toString('utf8')
      .toUpperCase()
      console.log('@@@@@@@@@@@');
  }
  catch (e) {
    console.log(e)
  }
}
