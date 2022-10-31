import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import { SessionUser } from "next-auth";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { trpc } from "@/utils/trpc";
import FriendRequestList from "@/components/Lists/FriendRequestList";
import Header from "@/components/Header";

const FriendRequestsPage: NextPage<IFriendRequestsProps> = ({ sessionUser }) => {
  //Queries 
  const sendersQuery = trpc.user.getSendersById.useQuery({ userId: sessionUser.id})

  if (sendersQuery.isSuccess) {
    const senders = sendersQuery.data

    if (senders) {
        return (
            <div>
                <Header sessionUser={sessionUser}/>
                {
                  <FriendRequestList senders={senders}/>
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