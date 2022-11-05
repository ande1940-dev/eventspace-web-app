import { trpc } from '@/utils/trpc'
import { GetServerSideProps, NextPage } from 'next';
import { Event, EventWithInvitations, Invitation, UserWithEvents} from '@prisma/client'
import { SessionUser, User } from 'next-auth'
import React, { useRef } from 'react'
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import ProfileImage from '@/components/ProfileImage';
import { SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';

const InvitationsPage: NextPage<IInvitationProps> = ({ sessionUser }) => {
    // Queries
    const hostsQuery = trpc.user.getHostsByInvitee.useQuery()
    // Mutations
    const updateInvitation = trpc.invitation.updateInvitation.useMutation()

    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>() 
    
    const invitationRef = useRef<Invitation | null>(null)
    const modalRef = useRef<HTMLDialogElement | null>(null)

    const openModal = (invitation: Invitation) => {
        invitationRef.current = invitation
        modalRef.current?.showModal()
    }

    const onUpdateInvitation: SubmitHandler<IFormInput> = (input) => {
        if (invitationRef.current !== null) {
            updateInvitation.mutate({invitationId: invitationRef.current?.id, rsvp: input.rsvp})
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
                if (host !== undefined && invitation !== undefined) {
                    return (
                        <div key={index}>
                            <Link href={`/event/${event.id}`}>{event.name}</Link>
                            <ProfileImage image={host.image} size={40}/>
                            <p>{host.name}</p>
                            <p>{invitation.createdAt.toLocaleDateString()}</p>
                            <p>{invitation.rsvp}</p>
                            <button onClick={() => openModal(invitation)}>Update</button>
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
                       <dialog ref={modalRef}>
                            <form onSubmit={handleSubmit(onUpdateInvitation)}>
                                <select defaultValue={invitationRef.current?.rsvp ?? "Going"} {...register("rsvp")}>
                                    <option value="Going">Going</option>
                                    <option value="Interested">Interested</option>
                                    <option value="Not Going">Not Going</option>
                                </select>
                                <button type="submit">Update</button>
                            </form>
                        </dialog>
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