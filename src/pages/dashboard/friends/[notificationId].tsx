import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import { SessionUser } from "next-auth";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { trpc } from "../../../utils/trpc";
import { FriendRequest, Notification} from "@prisma/client";

import Header from "../../../components/Header";
import Image from "next/image";
import Link from "next/link";

const NotificationPage: NextPage<INotificationProps> = ({sessionUser, notificationId}) => {
    const query = trpc.user.getUserById.useQuery(sessionUser.id)

    if (query.isError) {
        //display error screen 
        return <h1>Error</h1>
    }
    else if (query.isLoading){
        // display loading screen 
        return  <h1>Loading</h1>
    } else {
        if (query.isSuccess && query.data !== null) {
            const sessionUser = query.data
            const notification = sessionUser.notifications.find((notification: Notification) =>
                notification.id === notificationId
            )
            
            if (notification !== undefined) {
                if (notification.friendRequestId !== null) {
                    return  <div>
                                <Link href={"/dashboard/notifications"}>Back To Notifications</Link>
                                <p>{notification.message}</p>
                                <button>Accept</button>
                                <button>Decline</button>
                            </div>
                }
            }
        } 
        return <h1>Error</h1>
    }
        
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerAuthSession(context);
    const sessionUser = session?.user === undefined ? null : session.user
    const notificationId = context.params?.notificationId === undefined ? null : context.params.notificationId

    
    return {
        props: {
            sessionUser,
            notificationId
        }
    }    
}

interface INotificationProps {
    sessionUser: SessionUser
    notificationId: string
}

export default NotificationPage