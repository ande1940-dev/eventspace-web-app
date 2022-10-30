import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import { SessionUser } from "next-auth";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { trpc } from "../../utils/trpc";
import { FriendRequest} from "@prisma/client";

import Header from "../../components/Header";
import Image from "next/image";

const Profile: NextPage<IProfileProps> = ({ sessionUser, userId }) => {
    if (userId !== null) {

        // Queries 
        const { data: owner } = trpc.user.getUserById.useQuery(userId)
        const { data: viewer } = trpc.user.getUserById.useQuery(sessionUser.id)

        // Mutations 
        const blockUserMutation = trpc.user.addToBlockList.useMutation()
        const createFriendRequestMutation = trpc.friendRequest.createFriendRequest.useMutation()
        const createNotificationMutation = trpc.notification.createNotification.useMutation()
        const friendUserMutation = trpc.user.addToFriendList.useMutation()
        const unblockUserMutation = trpc.user.removeFromBlockList.useMutation()
        const unfriendUserMutation = trpc.user.removeFromFriendList.useMutation()

        const acceptFriendRequest = async () => {
            // add friend to friends 
            // delete friendRequest 
        }

        const declineFriendRequest = () =>  {
            // delete FriendRequest 
        }

        const unfriendUser = async () => {

        }

        const sendFriendRequest = async () => {
            if (owner?.name !== null && owner?.name !== undefined) {
                const friendRequest: FriendRequest | undefined = await createFriendRequestMutation.mutateAsync({recipientId: userId, recipientName: owner.name})
                const message = `You received a friend request from ${sessionUser.name}`
                if (friendRequest !== undefined) {
                    createNotificationMutation.mutateAsync({friendRequestId: friendRequest.id, recipientId: userId, message})
                }
            }
        }

        const renderFriendOptions = () => {
            const sentRequest = viewer?.sentFriendRequests.find((request: FriendRequest) => request.recipientId === userId)
            const receivedRequest = viewer?.receivedFriendRequests.find((request: FriendRequest) => request.senderId === userId)

            // TODO Add Unfriend Option
            if (sentRequest !== undefined) {
                return <button disabled>Pending</button>
            } else if (receivedRequest !== undefined) {
                return  <div>
                            <button onClick={acceptFriendRequest}>Accept</button>
                            <button onClick={declineFriendRequest}>Decline</button>
                        </div>
            } else if (owner !== undefined && owner !== null && !viewer?.friends.includes(owner)) {
                return <button onClick={sendFriendRequest}>Add Friend</button>
            }
        }
        
        return (
            <>
                <Header sessionUser={sessionUser}/>
                <main className="grid items-center justify-center">
                    <div>
                        {owner?.image !== null && owner?.image !== undefined && 
                            <Image
                                src={owner.image}
                                width={40}
                                height={40}
                                quality={90}
                                className="rounded-full"
                            />
                        }
                    </div>
                    <div className="flex">
                        { renderFriendOptions() }
                        { owner !== undefined && owner !== null  && viewer?.blockedList !== undefined && 
                            <div>
                                {!viewer?.blockedList.includes(owner) ? 
                                   <button onClick={() =>  blockUserMutation.mutate({blockedUserId: userId})}>Block</button>
                                   : <button onClick={() =>  unblockUserMutation.mutate({blockedUserId: userId})}>Unblock</button>
                                }
                            </div>
                        }
                    </div>
                </main>
            </>
        ) 
    } else {
        return (
            <div>Error</div>
        )
    }
    
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerAuthSession(context);
    const sessionUser = session?.user === undefined ? null : session.user
    const userId = context.params?.userId === undefined ? null : context.params.userId

    if (userId === sessionUser?.id) {
        return {
            redirect: {
                permanent: false, 
                destination: "/dashboard"
            }
        }
    }
    
    return {
        props: {
            sessionUser,
            userId
        }
    }    
}

interface IProfileProps {
    sessionUser: SessionUser
    userId: string | null
}

export default Profile;