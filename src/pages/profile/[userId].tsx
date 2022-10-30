import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import { SessionUser } from "next-auth";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { trpc } from "../../utils/trpc";
import { FriendRequest, User } from "@prisma/client";

import Header from "../../components/Header";
import Image from "next/image";

const Profile: NextPage<IProfileProps> = ({ sessionUser, userId }) => {
    if (userId !== null) {
        const image = sessionUser.image
        const { data: user } = trpc.user.getUserById.useQuery(userId)
        const addFriendMutation = trpc.friendRequest.createFriendRequest.useMutation()
        // const blockFriendMutation = trpc.user.removeBlock.userMutation()
        // const removeFriendMutation = trpc.user.removeFriend.useMutation()
        // const createNotificationMutation = trpc.notification.createNotification.useMutation()

        const sendFriendRequest = async () => {
            if (user?.name !== null && user?.name !== undefined) {
                const friendRequest: FriendRequest | undefined = await addFriendMutation.mutateAsync({recipientId: userId, recipientName: user?.name})
                if (friendRequest !== undefined) {
                    
                }
            }
            
        }
        
        return (
            <>
                <Header sessionUser={sessionUser}/>
                <main className="grid items-center justify-center">
                    <div>
                        {image !== null && image !== undefined && 
                            <Image
                                src={image}
                                width={40}
                                height={40}
                                quality={90}
                                className="rounded-full"
                            />
                        }
                    </div>
                    <div className="flex">
                        <button onClick={sendFriendRequest}>Add Friend</button>
                        <button>Block</button>
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

// const { data: user } = trpc.user.getProfileById.useQuery(userId)}
//     if (userId !== null) {
//         trpc.friendRequest.createFriendRequest({recipientId: userId, recipientName: user.name})
//         const image = user?.image
//         return (
//             <>
//                 <Header sessionUser={sessionUser}/>
//                 <main className="grid items-center justify-center">
//                     <div>
//                         {image !== null && image !== undefined && 
//                             <Image
//                                 src={image}
//                                 width={40}
//                                 height={40}
//                                 quality={90}
//                                 className="rounded-full"
//                             />
//                         }
//                     </div>
//                     <div className="flex">
//                         <button>Add Friend</button>
//                         <button>Block</button>
//                     </div>
//                 </main>
//             </>
//         )
//     }

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