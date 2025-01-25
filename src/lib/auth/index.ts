import {betterAuth} from "better-auth";
import {Resource} from "sst";

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: Resource.GOOGLE_CLIENT_ID.value,
      clientSecret: Resource.GOOGLE_CLIENT_SECRET.value,
    },
  },
})
