import { SessionUser } from 'next-auth'
import { signOut } from "next-auth/react";
import Link from "next/link";
import React, { useState } from 'react'
import { trpc } from '../utils/trpc';
import { Notification } from '@prisma/client';
import ProfileImage from './ProfileImage';

//TODO: On Notification Click, Mark Notification Read For Friend Request, but delete for notifications not requiring actions
const Header = ({ sessionUser }: IHeaderProps) => {
    const notificationsQuery = trpc.notification.getNotificationsByUser.useQuery()
    const [isNotificationOpen, toggleNotifications] = useState(false)
    if (notificationsQuery.isSuccess) {
        const notifications = notificationsQuery.data
        if (notifications) {
            return (
                <div className="flex gap-5 items-end">
                    <Link href="/dashboard"><a><ProfileImage image={sessionUser.image} size={25}/></a></Link>
                    {sessionUser.name !== null && sessionUser.name !== undefined && 
                        <p>{sessionUser.name}</p>
                    } 
                    <button onClick={() => signOut()}>Sign Out</button>
                    <button onClick={() => toggleNotifications(!isNotificationOpen)}>Notifications</button>
                    {isNotificationOpen && 
                        <div>
                            {
                                notifications.map((notification: Notification, index: number) => 
                                    <Link href={notification.redirect} key={index}>{notification.body}</Link>
                                )
                            }
                        </div>
                    }
                </div>
            )
        }
        return <h1>Error</h1>
    } else if (notificationsQuery.isLoading) {
        return <h1>Loading</h1>
    } else {
        return <h1>Error</h1>
    }
}

interface IHeaderProps {
    sessionUser: SessionUser
}

export default Header;