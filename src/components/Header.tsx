import { SessionUser } from 'next-auth'
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Notification } from '@prisma/client';
import React, { useState } from 'react'
import { trpc } from '../utils/trpc';

const Header = ({ sessionUser }: IHeaderProps) => {
    // const [isNotificationOpen, toggleNotifications] = useState(false)
    // const [isSettingsOpen, toggleSettings] = useState(false)

    // const query = trpc.user.getUserById.useQuery(sessionUserId)
    // if (query.isLoading) {
    //     //display loading screen
    // }
    // const renderNotifications = () => {
    //     if(notifications.length > 0) {
    //         return <div>
    //                     {
    //                         notifications.map((notification: Notification, index: number) => 
    //                             <div>{notification.message}</div>
    //                         )
    //                     }
    //                </div>
    //     }
    // }

    return (
        <header className="flex p-5 justify-end">
            <div>
                <div> 
                    { sessionUser.image !== null && sessionUser.image !== undefined && 
                        <Link href={`/dashboard`}>
                        <a>
                            <Image
                                src={sessionUser.image}
                                width={35}
                                height={35}
                                quality={90}
                                className="rounded-full"
                            />  
                        </a>
                        </Link>
                    }
                </div>
                {sessionUser.name !== null && sessionUser.name !== undefined && 
                    <p>{sessionUser.name}</p>
                }
                <button onClick={() => signOut()}>Sign Out</button>
            </div>
        </header>
    )
}

interface IHeaderProps {
    sessionUser: SessionUser

}

export default Header;


 {/* <div>
                    <button onClick={() => toggleNotifications(!isNotificationOpen)}>
                        {
                            notifications.length > 0 ? 
                            <span className="material-symbols-outlined">notifications_active</span>
                            : <span className="material-symbols-outlined">notifications</span>
                        }
                    </button>
                    {
                        isNotificationOpen && 
                        <div>
                            {notifications.length > 0 ? 
                                {

                                }
                            }
                        </div>
                    }
                </div>
                <button onClick={() => toggleSettings(!isSettingsOpen)}>
                    <span className="material-symbols-outlined filled">expand_more</span>
                </button>  */}