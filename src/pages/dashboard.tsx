import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import { SessionUser } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import Header from "../components/Header";
import { trpc } from "../utils/trpc";
import { FriendRequest, Notification, User } from "@prisma/client";

const Dashboard: NextPage<IDashboardProps> = ({ sessionUser }) => {
    const query = trpc.user.getUserById.useQuery(sessionUser.id)
    if (query.isLoading) {
        //display loading screen 
        return <h1>Loading</h1>
    } else if (query.isSuccess && query.data !== null) {
        const user = query.data
        return (
            <>
                <Header sessionUser={sessionUser}/>
                <nav>
                    <Link href="/explore">Explore</Link>
                </nav>
                <main> 
                    {
                        user.notifications.map((notification: Notification) =>
                            // TODO: when the notification is clicked open dashboard/notifications/notificationId
                            <Link href={`/notifications/${notification.id}`}>
                                <a>
                                    <div>
                                        <p>{notification.message}</p>
                                        <p>{notification.createdAt.toLocaleString()}</p>
                                     </div>
                                </a>
                            </Link>
                        )
                    }
                </main>
                <footer></footer>
            </>
        )
    } else {
        // display error screen
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

interface IDashboardProps {
    sessionUser: SessionUser
}

export default Dashboard;


// {
//     user.receivedFriendRequests !== undefined && 
//     <div>
//         {
//             user.receivedFriendRequests.map((request: FriendRequest, index: number) => (
//                 <div>
//                     <div key={index}>{`You received a friend request from ${request.recipientName}`}</div>
//                     <button>Accept</button>
//                     <button>Decline</button>
//                 </div>
                 

//             ))
//         }
//     </div>
// }
// {
//     user.sentFriendRequests !== undefined && 
//     <div>
//         {
//             user.sentFriendRequests.map((request: FriendRequest, index: number) => (
//                 <div>
//                     <div key={index}>{`You sent a friend request to ${request.recipientName}`}</div>
//                     <button>Cancel</button>
//                 </div>
                    
//             ))
//         }
//     </div>
// }
// {
//     user.blockedList !== undefined && 
//     <div>
//         {
            
//             user.blockedList.map((user: User, index: number) => (
//                 <div key={index}>
//                     <div>
//                         {user.image !== null && user.image !== undefined && 
//                             <Image
//                                 src={user.image}
//                                 width={40}
//                                 height={40}
//                                 quality={90}
//                                 className="rounded-full"
//                             />
//                         }
//                     </div>
//                     {user.name !== null && 
//                         <p>{user.name}</p>
//                     }
//                 </div>
                 
                 
//             ))
//         }
//     </div>
// }