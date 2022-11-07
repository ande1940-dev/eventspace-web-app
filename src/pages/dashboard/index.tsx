import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import { SessionUser } from "next-auth";
import Link from "next/link";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import Header from "@/components/Header";
import { trpc } from "@/utils/trpc";
import { Event, Friendship, User } from "@prisma/client";
import { useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";

//TODO: Invalidate Queries
//TODO: Send Notification To All Friends When You Make An Event 
const Dashboard: NextPage<IDashboardProps> = ({ sessionUser }) => {
    //Queries
    const userQuery = trpc.user.getUserById.useQuery({ userId: sessionUser.id })
    //Mutations 
    const createEvent = trpc.event.createEvent.useMutation()
    const createEventNotification = trpc.notification.createEventNotification.useMutation()

    const modalRef = useRef<HTMLDialogElement>(null)
    const { register, handleSubmit } = useForm<IFormInput>()
    const router = useRouter()


    if (userQuery.isSuccess) {
        const user = userQuery.data
        if (user) {

            /**
            * Uses the createEvent mutation to create an event and redirects to the newly created event page 
            * Uses the createEventNotification mutation to notify friends of the newly created event 
            * @param {{name: string}} input The data submitted from the event form
            */
            const onCreateEvent: SubmitHandler<IFormInput> = async (input) => {
                const startDate = new Date(input.startDate)
                const endDate = new Date(input.endDate)
                const event = await createEvent.mutateAsync({name: input.name, location: input.location, startDate, endDate})

                const body = `${sessionUser.name} created an event: ${event.name}`
                const redirect = `/event/${event.id}`
                const friendedData = user.friended.map((friendship: Friendship) => {
                    return {
                        eventId: event.id,
                        body: body,
                        recipientId: friendship.acceptedById,
                        redirect: redirect
                    }
                })
                const friendedByData = user.friendedBy.map((friendship: Friendship) => {
                    return {
                        eventId: event.id,
                        body: body,
                        recipientId: friendship.initiatedById,
                        redirect: redirect
                    }
                })
                createEventNotification.mutate({data: friendedData.concat(friendedByData)})
                router.replace(redirect)
            }
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
                                user.hostedEvents.map((event: Event, index: number) =>
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
                                    Start Date: 
                                    <input  {...register("startDate")} type="datetime-local"/>
                                </label>
                               
                                <label>
                                    End Date: 
                                    <input  {...register("endDate")} type="datetime-local"/>
                                </label>
                                <button type="submit" className="outline outline-black">Create</button>
                            </form>
                        </dialog>
                    </main>
                </>
                
            )
        } 
        return <h1>Error</h1>
    } else if (userQuery.isLoading || userQuery.isFetching) {
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
   startDate: Date
   endDate: Date
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