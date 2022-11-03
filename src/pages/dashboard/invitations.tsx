import { trpc } from '@/utils/trpc'
import { GetServerSideProps, NextPage } from 'next';
import { Event, Invitation, UserWithRelations } from '@prisma/client'
import { SessionUser } from 'next-auth'
import React from 'react'
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import ProfileImage from '@/components/ProfileImage';

const InvitationsPage: NextPage<IInvitationProps> = ({ sessionUser }) => {
    // Queries
    const hostsQuery = trpc.user.getHostsById.useQuery()

    if (hostsQuery.isSuccess) {
        const hosts = hostsQuery.data
        if (hosts) {
            <div>Success</div>
        }
        return <h1>Error</h1>
        
    } else if (hostsQuery.isLoading) {
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
  
interface IInvitationProps {
    sessionUser: SessionUser
}

export default InvitationsPage