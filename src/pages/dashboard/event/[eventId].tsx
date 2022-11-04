import React, { useRef } from 'react'
import { GetServerSideProps, NextPage } from 'next';
import { SessionUser } from "next-auth";
import { useRouter } from 'next/router';
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { trpc } from '@/utils/trpc';
import Header from '@/components/Header';
import { Invitation, JoinRequest, User } from '@prisma/client';
import ProfileImage from '@/components/ProfileImage';
import { SubmitHandler, useForm } from 'react-hook-form';

//TODO: redirect to dashboard after delete
const EventPage: NextPage<IEventProps> = ({ eventId, sessionUser}) => {
  //Queries 
  const eventQuery = trpc.event.getEventById.useQuery(({ eventId }))
  const inviteesQuery = trpc.user.getInviteesByEvent.useQuery({ eventId })
  const unInvitedFriendsQuery = trpc.user.getUninvitedByEvent.useQuery({ eventId })
  // Mutation 
  const createInvitation = trpc.invitation.createInvitation.useMutation()
  const deleteEvent = trpc.event.deleteEvent.useMutation()
  const deleteInvitation = trpc.invitation.deleteInvitation.useMutation()
  const deleteJoinRequest = trpc.joinRequest.deleteJoinRequest.useMutation()
  // Form 
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>()
  //Ref
  const modalRef = useRef<HTMLDialogElement>(null)

  if (eventQuery.isSuccess && inviteesQuery.isSuccess && unInvitedFriendsQuery.isSuccess) {
    const event = eventQuery.data
    const invitees = inviteesQuery.data
    const uninvitedFriends = unInvitedFriendsQuery.data
    const onAcceptJoinRequest = (senderId: string) => {
        deleteJoinRequest.mutate({ eventId, senderId })
        createInvitation.mutate({ eventId, userId: senderId })
    }
    const onAddInvitees: SubmitHandler<IFormInput> = (input) => {
      console.log(input.invitees)
      if (Array.isArray(input.invitees)) {
        input.invitees.forEach((inviteeId: string) => 
        createInvitation.mutate({eventId, userId: inviteeId})
      )} else {
        createInvitation.mutate({eventId, userId: input.invitees})
      }
    }
    const renderInvitee = (invitation: Invitation, index: number) => {
      const invitee = invitees.find((invitee: User) => invitee.id === invitation.recipientId)
      if (invitee !== undefined) { 
        return (
          <div key={index}>
              <ProfileImage image={invitee.image} size={40}/>
              <p>{invitee?.name}</p>
              <p>rsvp {invitation.rsvp ?? "Pending"}</p>
              <button onClick={() => deleteInvitation.mutate({invitationId: invitation.id})}>Delete</button>
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
                event.invitations.map((invitation: Invitation, index: number) => 
                  renderInvitee(invitation, index)
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
            <div>
              <h1>Requests</h1>
              {
                event.joinRequests.map((request: JoinRequest, index: number) => 
                  <div key={index}>
                      <p>{request.senderId}</p>
                      <div className='flex'>
                        <button onClick={() => onAcceptJoinRequest(request.senderId)}>Accept</button>
                        <button onClick={() => deleteJoinRequest.mutate({eventId, senderId: request.senderId})}>Decline</button>
                      </div>
                  </div>
                )
              }
            </div>
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