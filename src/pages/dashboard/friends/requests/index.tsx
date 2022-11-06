import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import { SessionUser } from "next-auth";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { trpc } from "@/utils/trpc";

import Header from "@/components/Header";
import ProfileImage from "@/components/ProfileImage";
import { FriendRequest, UserWithRequests } from "@prisma/client";


//TODO: When User Accepts Send A Notification 
const FriendRequestsPage: NextPage<IFriendRequestsProps> = ({ sessionUser }) => {
  //Queries 
  const sendersQuery = trpc.user.getSendersById.useQuery()

  //Mutations 
  const createFriendship = trpc.friendship.createFriendship.useMutation()
  const createNotification = trpc.notification.createFriendshipNotification.useMutation()
  const deleteFriendRequest = trpc.friendRequest.deleteFriendRequest.useMutation()

  if (sendersQuery.isSuccess) {
    const senders = sendersQuery.data

    //Mutation Functions 
    const acceptFriendRequest = async (sender: UserWithRequests) => {
      const friendRequest = sender.sentFriendRequests.find((request: FriendRequest) =>
          request.senderId === sender.id
      )
      
      if (friendRequest !== undefined) {
          deleteFriendRequest.mutate({recipientId: friendRequest.recipientId, senderId: friendRequest.senderId})
          const body = `You are now friends with ${sessionUser.name}`
          const friendship = await createFriendship.mutateAsync({initiatedById: friendRequest.senderId})
          createNotification.mutate({body, recipientId: friendship.initiatedById,  redirect: "/dashboard/friends"})
      }
    }

    const declineFriendRequest = async (sender: UserWithRequests) => {
      const friendRequest = sender.sentFriendRequests.find((request: FriendRequest) =>
          request.senderId === sender.id
      )
      await deleteFriendRequest.mutateAsync({recipientId: friendRequest.recipientId, senderId: friendRequest.recipientId})
    }

    //Render Functions
    const renderFriendRequest = (sender: UserWithRequests) => {
        return (
            <div>
                <div>
                    <ProfileImage image={sender.image} size={35}/>
                    <p>{sender.name}</p>
                </div>
                <div>
                    <button onClick={() => acceptFriendRequest(sender)}>Accept</button>
                    <button onClick={() => declineFriendRequest(sender)}>Decline</button>
                </div>
            </div>
        )
    }
    
    if (senders) {
        return (
            <div>
                <Header sessionUser={sessionUser}/>
                { 
                    senders.map((sender: UserWithRequests, index: number) => 
                        <section key={index}>
                            {
                                renderFriendRequest(sender)
                            }
                        </section>
                    ) 
                }
            </div>  
        )
    }
    return <h1>Error</h1>
  } else if (sendersQuery.isLoading) {
      return <h1>Loading</h1>
  } else {
      return <h1>Error</h1>
  }   
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  const sessionUser = session?.user === undefined ? null : session.user

  if (sessionUser === null) {
    return {
      redirect: {
          permanent: false,
          destination: "/signin"
      }
    }
  }

  return {
      props: {
        sessionUser
      }
  }    
}

interface IFriendRequestsProps {
    sessionUser: SessionUser
}

export default FriendRequestsPage