import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import { SessionUser } from "next-auth";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { trpc } from "../../utils/trpc";
import { FriendRequest} from "@prisma/client";

import Header from "../../components/Header";
import Image from "next/image";

const NotificationPage: NextPage<INotificationProps> = ({sessionUser, notificationId}) => {
    const { data: viewer } = trpc.user.getUserById.useQuery(sessionUser.id)
  return (
    <div>NotificationPage</div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerAuthSession(context);
    const sessionUser = session?.user === undefined ? null : session.user
    const notificationId = context.params?.notificationId === undefined ? null : context.params.notificationId

    if (notificationId === sessionUser?.id) {
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
            notificationId
        }
    }    
}

interface INotificationProps {
    sessionUser: SessionUser
    notificationId: string
}

export default NotificationPage