import { SessionUser } from 'next-auth'
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from 'react'

const Header = ({ sessionUser }: IHeaderProps) => {
    if (sessionUser !== null) {
        const image = sessionUser.image
        const name = sessionUser.name
        return (
            <header className="flex p-5 justify-end">
                <div>
                    {image !== null && image !== undefined && 
                        <Link href={`/dashboard`}>
                            <a>
                                <Image
                                    src={image}
                                    width={35}
                                    height={35}
                                    quality={90}
                                    className="rounded-full"
                                />  
                            </a>
                        </Link>
                    }
                    {
                        name !== null && name !== undefined && 
                        <p>{name}</p>
                    }
                    <button onClick={() => signOut()}>Sign Out</button>
                </div>
            </header>
        )
    } else {
        return (
            <header className="flex p-5 justify-end">
                <div className="grid gap-5">
                    <Link href="/signin">
                        <span className="material-symbols-outlined filled">
                            account_circle
                        </span>
                    </Link>
                    <p>Guest</p>
                </div>
            </header>
        )
    }
}

interface IHeaderProps {
    sessionUser: SessionUser | null
}

export default Header;