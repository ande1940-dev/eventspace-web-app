import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import { SessionUser } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import Header from "@/components/Header";
import { trpc } from "@/utils/trpc";
import { Event, FriendRequest, Friendship, User } from "@prisma/client";
import { FormEventHandler, MouseEventHandler, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";

const Dashboard: NextPage<IDashboardProps> = ({ sessionUser }) => {
    // Mutations 
    const createEvent = trpc.event.createEvent.useMutation()

    //Queries 
    const userQuery = trpc.user.getUserById.useQuery({ userId: sessionUser.id})

    // Mutation 
    const deleteEvent = trpc.event.deleteEvent.useMutation()

    //Ref 
    const modalRef = useRef<HTMLDialogElement>(null)

    // Form 
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>()

    const router = useRouter()

    const onCreateEvent: SubmitHandler<IFormInput> = async (input) => {
        const event = await createEvent.mutateAsync({name: input.name})
        router.replace(`/event/${event.id}`)
    }

    if (userQuery.isSuccess) {
        const user = userQuery.data

        if (user) {
            return (
                <>
                    <Header sessionUser={sessionUser}/>
                    <nav>
                        <Link href="/explore">Explore</Link>
                        <Link href="/dashboard/friends">Friends</Link>
                    </nav>
                    <main>
                        <div>
                            {
                                user.hostedEvents.map((event: Event) =>
                                    <div>
                                        <Link href={`/event/${event.id}`}>{event.name}</Link>
                                        <button onClick={() => deleteEvent.mutate({ eventId: event.id })}>Delete</button>
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
                                    Name
                                    <input {...register("name")} type="text" placeholder="Name"/>
                                </label>
                                <button type="submit">Create</button>
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
   //location: string 
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