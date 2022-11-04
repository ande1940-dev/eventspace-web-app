import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import Link from "next/link";
import { SessionUser } from "next-auth";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { trpc } from "@/utils/trpc";

import Header from "@/components/Header";
import ProfileImage from "@/components/ProfileImage";
import { Friendship, UserWithFriends } from "@prisma/client";

const FriendsPage: NextPage<IFriendsProps> = ({sessionUser}) => {
    //Queries 
    const friendsQuery = trpc.user.getFriendsById.useQuery({ userId: sessionUser.id})

    if (friendsQuery.isSuccess) {
        const friends = friendsQuery.data
        if (friends) {
            const renderFriend = (friend: UserWithFriends, index: number) => {
                const friended: Friendship | undefined = friend.friended.find((friendship: Friendship) => 
                    friendship.acceptedById == sessionUser.id 
                )
                const friendedBy: Friendship | undefined = friend.friendedBy.find((friendship: Friendship) => 
                    friendship.initiatedById == sessionUser.id
                )
                 
                return (
                    <div key={index}>
                        <ProfileImage image={friend.image} size={40}/>
                        <Link href={`/profile/${friend.id}`}><a>{friend.name}</a></Link>
                        {friended !== undefined && 
                            <p>Friends since {friended.createdAt.toLocaleString('en-us',{month:'short', year:'numeric'})}</p>
                        }
                        {friendedBy !== undefined && 
                            <p>Friend since {friendedBy.createdAt.toLocaleString('en-us',{month:'short', year:'numeric'})}</p>
                        }
                    </div>
                )
            }
            
            return (
                <div>
                    <Header sessionUser={sessionUser} />
                    <nav>
                        <Link href="/dashboard/friends/requests">Friend Requests</Link>
                    </nav>
                    {
                        friends.map((friend: UserWithFriends, index: number) =>
                           renderFriend(friend, index) 
                        )
                    }
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