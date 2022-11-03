import React, { useRef } from 'react'
import { GetServerSideProps, NextPage } from 'next';
import { SessionUser } from "next-auth";
import { useRouter } from 'next/router';
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { trpc } from '@/utils/trpc';
import Header from '@/components/Header';
import { Invitation, User } from '@prisma/client';
import ProfileImage from '@/components/ProfileImage';
import { SubmitHandler, useForm } from 'react-hook-form';

//TODO: redirect to dashboard after delete
const EventPage: NextPage<IEventProps> = ({ eventId, sessionUser}) => {
  //Queries 
  const eventQuery = trpc.event.getEventById.useQuery(({ eventId }))
  const inviteesQuery = trpc.user.getInviteesByEvent.useQuery({ eventId })
  const unInvitedFriendsQuery = trpc.user.getUninvitedByEvent.useQuery({ eventId })
  // Mutation 
  const deleteEvent = trpc.event.deleteEvent.useMutation()
  const createInvitation = trpc.invitation.createInvitation.useMutation()
  // Form 
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>()
  //Ref
  const modalRef = useRef<HTMLDialogElement>(null)

  if (eventQuery.isSuccess && inviteesQuery.isSuccess && unInvitedFriendsQuery.isSuccess) {
    const event = eventQuery.data
    const invitees = inviteesQuery.data
    const uninvitedFriends = unInvitedFriendsQuery.data

    const onAddInvitees: SubmitHandler<IFormInput> = (input) => {
      console.log(input.invitees)
      if (Array.isArray(input.invitees)) {
        input.invitees.forEach((inviteeId: string) => 
        createInvitation.mutate({eventId, userId: inviteeId})
      )} else {
        createInvitation.mutate({eventId, userId: input.invitees})
      }
    }
    const renderInvitee = (recipientId: string) => {
      const invitee = invitees.find((invitee: User) => invitee.id === recipientId)
      if (invitee !== undefined) { 
        return (
          <div>
              <ProfileImage image={invitee.image} size={40}/>
              <p>{invitee?.name}</p>
          </div>
        )
      }
    }

    if (event && invitees && uninvitedFriends ) {
      return (
        <div>
          <Header sessionUser={sessionUser}/> 
          <main>
            <p>{event.name}</p>
            <p>{event.hostId}</p>
            <button onClick={() => deleteEvent.mutate({ eventId })}>Delete</button>
            <div>
              <h1>Invitations</h1>
              {
                event.invitations.map((invitation: Invitation) => 
                  renderInvitee(invitation.recipientId)
                )
              }
            </div>
            <button onClick={() => modalRef.current?.showModal()}>Add Invitees</button>
            <dialog className="grid gap-5" ref={modalRef}>
              <div className="flex justify-between gap-5">
                  <h1>Create Event</h1>
                  <button onClick={() => modalRef.current?.close()}>X</button>
              </div>
              <form onSubmit={handleSubmit(onAddInvitees)} className="grid">
                <div>
                  {
                    uninvitedFriends.map((friend: User, index: number) => 
                      <label className='flex gap-5 ' key={index}>
                        <ProfileImage image={friend.image} size={40}/> 
                        <h1>{friend.name}</h1>
                        <input {...register("invitees")} type="checkbox" value={friend.id}/>
                      </label>
                    )
                  }
                </div>
                <button type="submit">Send Invitation</button>
              </form>
            </dialog>
          </main>
        </div>
      )
    }
    return <h1>Error</h1>
  } else if (!eventQuery.isError && !inviteesQuery.isError && !unInvitedFriendsQuery.isError) {
    return <h1>Loading</h1>
  } else {
    return <h1>Error</h1>
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  const sessionUser = session?.user === undefined ? null : session.user
  const eventId = context.params?.eventId === undefined ? null : context.params.eventId

  if (eventId === null) {
      return {
          redirect: {
              permanent: false, 
              destination: "/dashboard"
          }
      }
  } 
  
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
          sessionUser,
          eventId
      }
  } 
}

interface IEventProps {
  sessionUser: SessionUser
  eventId: string 
}

interface IFormInput {
  invitees: string[] | string
}

export default EventPage