import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import { SessionUser } from "next-auth";
import Link from "next/link";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import Header from "@/components/Header";
import { trpc } from "@/utils/trpc";
import { Event } from "@prisma/client";
import { useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";

//TODO: Invalidate Queries
const Dashboard: NextPage<IDashboardProps> = ({ sessionUser }) => {
    //Queries
    const eventsQuery = trpc.event.getHostedEvents.useQuery({ userId: sessionUser.id})
    //Mutations 
    const createEvent = trpc.event.createEvent.useMutation()

    const modalRef = useRef<HTMLDialogElement>(null)
    const { register, handleSubmit } = useForm<IFormInput>()
    const router = useRouter()

    /**
     * Uses mutation to create an event & redirects to the newly created event page
     *
     * @param {{name: string}} input The data submitted from the event form
     */
    const onCreateEvent: SubmitHandler<IFormInput> = async (input) => {
        const startDate = new Date(input.date)
        const event = await createEvent.mutateAsync({name: input.name, location: input.location, startDate})
        router.replace(`/dashboard/event/${event.id}`)
    }

    if (eventsQuery.isSuccess) {
        const events = eventsQuery.data
        if (events) {
            return (
                <>
                    <Header sessionUser={sessionUser}/>
                    <nav className="flex gap-5">
                        <Link href="/explore">Explore</Link>
                        <Link href="/dashboard/friends">Friends</Link>
                        <Link href="/dashboard/invitations">Invitations</Link>
                    </nav>
                    <main>
                        <div>
                            {
                                events.map((event: Event, index: number) =>
                                    <div key={index}>
                                        <Link href={`/dashboard/event/${event.id}`}>{event.name}</Link>
                                    </div>
                                )
                            }
                        </div>
                        <button onClick={() => modalRef.current?.showModal()}>Create Event</button>
                        <dialog ref={modalRef}>
                            <div className="flex justify-between gap-5">
                                <h1>Create Event</h1>
                                <button onClick={() => modalRef.current?.close()}>X</button>
                            </div>
                            <form onSubmit={handleSubmit(onCreateEvent)} className="grid">
                                <label>
                                    Name:
                                    <input {...register("name")} type="text" placeholder="Name"/>
                                </label>
                                <label>
                                    Location:
                                    <input {...register("location")} type="text"/>
                                </label>
                                <label>
                                    Date: 
                                    <input  {...register("date")} type="datetime-local"/>
                                </label>
                                <button type="submit">Create</button>
                            </form>
                        </dialog>
                    </main>
                </>
                
            )
        } 
        return <h1>Error</h1>
    } else if (eventsQuery.isLoading || eventsQuery.isFetching) {
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

interface IDashboardProps {
    sessionUser: SessionUser
}

interface IFormInput {
   name: string
   location: string 
   date: Date
}

export default Dashboard;


// {
//     user.receivedFriendRequests !== undefined && 
//     <div>
//         {
//             user.receivedFriendRequests.map((request: FriendRequest, index: number) => (
//                 <div>
//                     <div key={index}>{`You received a friend request from ${request.recipientName}`}</div>
//                     <button>Accept</button>
//                     <button>Decline</button>
//                 </div>
                 

//             ))
//         }
//     </div>
// }
// {
//     user.sentFriendRequests !== undefined && 
//     <div>
//         {
//             user.sentFriendRequests.map((request: FriendRequest, index: number) => (
//                 <div>
//                     <div key={index}>{`You sent a friend request to ${request.recipientName}`}</div>
//                     <button>Cancel</button>
//                 </div>
                    
//             ))
//         }
//     </div>
// }
// {
//     user.blockedList !== undefined && 
//     <div>
//         {
            
//             user.blockedList.map((user: User, index: number) => (
//                 <div key={index}>
//                     <div>
//                         {user.image !== null && user.image !== undefined && 
//                             <Image
//                                 src={user.image}
//                                 width={40}
//                                 height={40}
//                                 quality={90}
//                                 className="rounded-full"
//                             />
//                         }
//                     </div>
//                     {user.name !== null && 
//                         <p>{user.name}</p>
//                     }
//                 </div>
                 
                 
//             ))
//         }
//     </div>
// }