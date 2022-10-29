import { User } from "@prisma/client";
import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import { SessionUser } from "next-auth";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { trpc } from "../../utils/trpc";

import Header from "../../components/Header";
import Image from "next/image";

const Profile: NextPage<IProfileProps> = ({ sessionUser, userId }) => {
    const { data: user } = trpc.user.getUserById.useQuery(userId)
    const image = user?.image
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
                    <button>Add Friend</button>
                    <button>Block</button>
                </div>
            </main>
        </>
    )
}

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
    userId: string
}

export default Profile;