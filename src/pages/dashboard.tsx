import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import { SessionUser } from "next-auth";
import Link from "next/link";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import Header from "../components/Header";
import { trpc } from "../utils/trpc";
import { FriendRequest } from "@prisma/client";

const Dashboard: NextPage<IDashboardProps> = ({ sessionUser }) => {
    const { data: user } = trpc.user.getDashboardById.useQuery(sessionUser.id)

    const sentFriendRequests = user?.sentFriendRequests
    const receivedFriendRequests = user?.receivedFriendRequests 

    return (
        <>
            <Header sessionUser={sessionUser}/> 
            <nav>
                <Link href="/explore">Explore</Link>
            </nav>
            <main> 
                {
                    receivedFriendRequests !== undefined && 
                    <div>
                        {
                            receivedFriendRequests.map((request: FriendRequest, index: number) => (
                                <div key={index}>{`You sent a friend request to ${request.senderName}`}</div>    
                            ))
                        }
                    </div>
                }
                {
                    sentFriendRequests !== undefined && 
                    <div>
                        {
                            sentFriendRequests.map((request: FriendRequest, index: number) => (
                                <div key={index}>{`You sent a friend request to ${request.recipientName}`}</div>    
                            ))
                        }
                    </div>
                }
            </main>
            <footer></footer>
        </>
    )
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

interface IDashboardProps {
    sessionUser: SessionUser
}

export default Dashboard;