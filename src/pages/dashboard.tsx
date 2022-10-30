import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import { SessionUser } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import Header from "../components/Header";
import { trpc } from "../utils/trpc";
import { FriendRequest, User } from "@prisma/client";

const Dashboard: NextPage<IDashboardProps> = ({ sessionUser }) => {
    const { data: user } = trpc.user.getUserById.useQuery(sessionUser.id)

    const sentFriendRequests = user?.sentFriendRequests
    const receivedFriendRequests = user?.receivedFriendRequests 
    const blockedList = user?.blockedList
    //const notifications = user?.notifications

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
                                <div key={index}>{`You sent a friend request to ${request.recipientName}`}</div>    
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
                {
                    blockedList !== undefined && 
                    <div>
                        {
                            
                            blockedList.map((user: User, index: number) => (
                                <div key={index}>
                                    <div>
                                        {user.image !== null && user.image !== undefined && 
                                            <Image
                                                src={user.image}
                                                width={40}
                                                height={40}
                                                quality={90}
                                                className="rounded-full"
                                            />
                                        }
                                    </div>
                                    {user.name !== null && 
                                        <p>{user.name}</p>
                                    }
                                </div>
                                 
                                 
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