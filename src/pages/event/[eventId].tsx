import React from 'react'
import { GetServerSideProps, NextPage } from 'next';
import { SessionUser } from "next-auth";
import { useRouter } from 'next/router';
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { trpc } from '@/utils/trpc';
import Header from '@/components/Header';

const EventPage: NextPage<IEventProps> = ({ eventId, sessionUser}) => {
  //Queries 
  const eventQuery = trpc.event.getEventById.useQuery(({ eventId }))

  if (eventQuery.isSuccess) {
    const event = eventQuery.data
    if (event) {
      return (
        <div>
          <Header sessionUser={sessionUser}/> 
          <main>
            <p>{event.name}</p>
            <p>{event.hostId}</p>
          </main>
        </div>
      )
    }
    return <h1>Error</h1>
  } else if (eventQuery.isLoading) {
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

export default EventPage