// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";


import { blockRouter } from "./block";
import { eventRouter } from "./event";
import { friendRequestRouter } from "./friendRequest";
import { friendshipRouter } from "./friendship";
import { userRouter } from "./user"
import { invitationRouter } from "./invitation";
import { joinRequestRouter } from "./joinRequest";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  block: blockRouter,
  event: eventRouter,
  friendRequest: friendRequestRouter,
  friendship: friendshipRouter,
  invitation: invitationRouter,
  joinRequest: joinRequestRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
