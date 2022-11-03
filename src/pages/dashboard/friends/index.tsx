import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import Link from "next/link";
import { SessionUser } from "next-auth";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { trpc } from "@/utils/trpc";

import Header from "@/components/Header";
import FriendList from "@/components/Lists/FriendList";

const FriendsPage: NextPage<IFriendsProps> = ({sessionUser}) => {
    //Queries 
    const friendsQuery = trpc.user.getFriendsById.useQuery({ userId: sessionUser.id})

    if (friendsQuery.isSuccess) {
        const friends = friendsQuery.data
        if (friends) {
            return (
                <div>
                    <Header sessionUser={sessionUser} />
                    <nav>
                        <Link href="/dashboard/friends/requests">Friend Requests</Link>
                    </nav>
                    <FriendList friends={friends} />
                </div>
            )
        } else {
            return <h1>Error</h1>
        }
    } else if (friendsQuery.isLoading || friendsQuery.isFetching) {
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

interface IFriendsProps {
    sessionUser: SessionUser
    notificationId: string
}

export default FriendsPage