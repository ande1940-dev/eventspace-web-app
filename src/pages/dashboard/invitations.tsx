import { trpc } from '@/utils/trpc'
import { GetServerSideProps, NextPage } from 'next';
import { Event, EventWithInvitations, Invitation, UserWithEvents} from '@prisma/client'
import { SessionUser, User } from 'next-auth'
import React, { useRef } from 'react'
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import ProfileImage from '@/components/ProfileImage';
import { SubmitHandler, useForm } from 'react-hook-form';

const InvitationsPage: NextPage<IInvitationProps> = ({ sessionUser }) => {
    // Queries
    const hostsQuery = trpc.user.getHostsByInvitee.useQuery()
    // Mutations
    const updateInvitation = trpc.invitation.updateInvitation.useMutation()

    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>() 
    
    const invitationIdRef = useRef<string | null>(null)

    const onUpdateInvitation: SubmitHandler<IFormInput> = (input) => {
        console.log(invitationIdRef.current)
        if (invitationIdRef.current !== null) {
            updateInvitation.mutate({invitationId: invitationIdRef.current, rsvp: input.rsvp})
        }
    }

    if (hostsQuery.isSuccess) {
        const hosts = hostsQuery.data
        const events = hosts.map((host: UserWithEvents) => {
            return host.hostedEvents   
        }).flat()

        if (hosts) {
            const renderInvitations = (event: EventWithInvitations, index: number) => {
                const host = hosts.find((host: UserWithEvents) => 
                    host.id === event.hostId
                )
                const invitation = event.invitations.find((invitation: Invitation) => 
                    invitation.recipientId === sessionUser.id
                )
                if (host !== undefined  && invitation !== undefined) {
                    return (
                        <div key={index}>
                            <h1>{event.name}</h1>
                            <ProfileImage image={host.image} size={40}/>
                            <p>{host.name}</p>
                            <p>{invitation.createdAt.toLocaleDateString()}</p>
                            <div className="flex gap-5">
                                <form onSubmit={handleSubmit(onUpdateInvitation)} >
                                    <select defaultValue={invitation.rsvp}{...register("rsvp")}>
                                        <option value="Going">Going</option>
                                        <option value="Interested">Interested</option>
                                        <option value="Not Going">Not Going</option>
                                    </select>
                                    <button onClick={() => invitationIdRef.current = invitation.id} type="submit">Update</button>
                                </form>
                            </div>
                        </div>
                    )
                }
            }

            return (
                <div>
                    <main className="grid gap-5">
                       {
                            events.map((event: Event, index: number) => 
                                renderInvitations(event, index)
                            )
                       } 
                    </main>
                </div>
            )
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

interface IFormInput {
    rsvp: string
 }

export default InvitationsPage