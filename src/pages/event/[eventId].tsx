import React, { useRef } from 'react'
import { GetServerSideProps, NextPage } from 'next';
import { SessionUser } from "next-auth";
import { useRouter } from 'next/router';
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { trpc } from '@/utils/trpc';
import Header from '@/components/Header';
import { Comment, Event, EventWithRelations, Invitation, JoinRequest, User, UserWithComments } from '@prisma/client';
import ProfileImage from '@/components/ProfileImage';
import { SubmitHandler, useForm } from 'react-hook-form';
import { comment } from 'postcss';

//TODO: redirect to dashboard after delete
//TODO: have DateTime on event for when to rsvp by
//TODO: have get directions button
const EventPage: NextPage<IEventProps> = ({ eventId, sessionUser }) => {
  //Queries 
  const hostQuery = trpc.user.getHostByEvent.useQuery({eventId})
  const commentersQuery = trpc.user.getCommentersByEvent.useQuery({eventId}) 
  // Mutation 
  const createComment = trpc.comment.createComment.useMutation()
  //createjoinrequest
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>() 

  if (hostQuery.isSuccess) {
    const host = hostQuery.data
    const commenters = commentersQuery.data

    if (host && commenters) {
      const event = host.hostedEvents.find((event: EventWithRelations) => event.id === eventId)
      
      if (event !== undefined) {
        const comments = event.comments.filter((comment: Comment) => 
          comment.parentId === null
        )
        const onCreateComment: SubmitHandler<IFormInput> = (input) => {
            createComment.mutate({eventId, authorId: sessionUser.id, text: input.text})
        }
        const renderComment = (comment: Comment, index: number) => {
          const author = commenters.find((commenter: User) =>  commenter.id === comment.authorId)
          if (author !== undefined) {
            return(
              <div key={index}>
                <div className="flex gap-3 items-end">
                  <ProfileImage image={author.image} size={20}/>
                  <p>{author.name}</p>
                </div>
                <p>{comment.comment}</p>
                <div className='flex gap-5'>
                  <p>Created At {comment.updatedAt.toLocaleString('en-us',{month:'short', day: 'numeric', 'year': 'numeric'})}</p>
                  <button>View Replies</button>
                </div>
              </div>
            )
          }
        }

        return (
          <div>
            <Header sessionUser={sessionUser}/> 
            <main>
              <p>{event.name}</p>
              <p>{event.location}</p>
              <p>{event.date.toLocaleString('en-us',{weekday: 'long', month:'short', day: 'numeric', 'year': 'numeric'})}</p>
              <div className='flex gap-3'>
                Hosted by
                <div className="flex gap-2 items-end">
                  <ProfileImage image={host.image} size={25}/> 
                  {host.name}
                </div>
              </div>
              <div>
                {
                  comments.map((comment: Comment, index: number) => 
                    renderComment(comment, index)
                  )
                }
                <div className="flex gap-5">
                  <div>
                    {sessionUser.image && 
                      <ProfileImage image={sessionUser.image} size={25}/>
                    } 
                  </div>
                  <form onSubmit={handleSubmit(onCreateComment)}>
                      <textarea rows={1} cols={50} {...register("text")} placeholder="Add a comment..." style={{resize: "none"}}/>
                      <button type="submit">Submit</button>
                  </form>
                </div>
              </div>
            </main>
          </div>
        )
      }
    }
    return <h1>Error</h1>
  } else if (hostQuery.isLoading) {
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
  text: string
}


export default EventPage