import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import type { SessionUser } from "next-auth";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { trpc } from "@/utils/trpc";

import Header from "@/components/Header";
import ProfileImage from "@/components/ProfileImage";
import { Block, FriendRequest, Friendship } from "@prisma/client";
import Link from "next/link";

//TODO: If session user is already blocked show only block options
//TODO: When session user is redirected to friend request page: either hash or use query to make sure they do directly to the correct request 
const Profile: NextPage<IProfileProps> = ({ sessionUser, userId }) => {
    // Queries 
    const userQuery = trpc.user.getUserById.useQuery({ userId })

    // Mutations 
    const createFriendRequest = trpc.friendRequest.createFriendRequest.useMutation()
    const deleteFriendship = trpc.friendship.deleteFriendship.useMutation()
    const createBlock = trpc.block.createBlock.useMutation()
    const unblockUser = trpc.block.deleteBlock.useMutation()

    if (userQuery.isSuccess) {
        const user = userQuery.data
        
        if (user) {
            const friended: Friendship | undefined = user.friended.find((friendship: Friendship) => 
                    friendship.acceptedById == sessionUser.id 
            )
            const friendedBy: Friendship | undefined = user.friendedBy.find((friendship: Friendship) => 
                friendship.initiatedById == sessionUser.id
            )
            const block: Block | undefined = user.blocked.find((block: Block) => 
                    block.blockedById === sessionUser.id
            )

            const blockUser = () => {
                if (friended !== undefined) {
                    deleteFriendship.mutate({acceptedById: sessionUser.id, initiatedById: userId})
                }
                if (friendedBy !== undefined) {
                    deleteFriendship.mutate({acceptedById: userId, initiatedById: sessionUser.id})
                } 
                createBlock.mutate({blockedId: userId})
            }

            const renderFriendOptions = () => {
                const receivedRequest: FriendRequest | undefined = user.sentFriendRequests.find((request: FriendRequest) => 
                    request.recipientId === sessionUser.id
                )
                const sentRequest: FriendRequest | undefined = user.receivedFriendRequests.find((request: FriendRequest) => 
                    request.senderId === sessionUser.id
                )
                
               return (
                    <div className="flex gap-5">
                         {friended !== undefined && 
                            <button onClick={() => 
                                deleteFriendship.mutate({acceptedById: sessionUser.id, initiatedById: userId})}
                            >
                                Unfriend
                            </button>
                        }
                        {friendedBy !== undefined && 
                            <button onClick={() => 
                                deleteFriendship.mutate({acceptedById: userId, initiatedById: sessionUser.id})}
                            >
                                Unfriend
                            </button>
                        }
                        {receivedRequest !== undefined && 
                            <div>
                                <p>Sent you a friend request</p>
                                <Link href="/dashboard/friends/requests">Respond</Link>
                            </div> 
                        }
                        {sentRequest !== undefined && 
                            <button>Pending</button>
                        }
                        {friended === undefined && friendedBy === undefined && receivedRequest === undefined && sentRequest === undefined && block === undefined &&  
                            <button onClick={async () => await createFriendRequest.mutateAsync({recipientId: userId})}>Add Friend</button>
                        }
                    </div>
               )
            }
            
            const renderBlockOptions = () => {
                if (block !== undefined){
                    return (
                        <button onClick={() => unblockUser.mutate({blockedId: userId, blockedById: sessionUser.id})}>Unblock</button>
                    )
                } else {
                    return (
                        <button onClick={blockUser}>Block</button>
                    )
                }
                
            }

            return (
               <div>
                    <Header sessionUser={sessionUser}/>
                    <main className="grid justify-center">
                        <ProfileImage image={user.image} size={50}/>
                        <p>{user.name}</p>
                        <div className="flex gap-5">
                            {
                                renderFriendOptions()
                            }
                            {
                                renderBlockOptions()
                            }
                        </div>
                    </main>
               </div>
            )
        }

        return <h1>Error</h1>
    } else if (userQuery.isLoading) {
        return <h1>Loading</h1>
    } else {
        return <h1>Error</h1>
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerAuthSession(context);
    const sessionUser = session?.user === undefined ? null : session.user
    const userId = context.params?.userId === undefined ? null : context.params.userId

    if (userId === null) {
        return {
            redirect: {
                permanent: false, 
                destination: "/explore"
            }
        }
    } 
    
    if (sessionUser === null) {
        return {
            redirect: {
                permanent: false, 
                destination: "/signin"
            }
        }
    }

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
    userId: string
}

export default Profile;