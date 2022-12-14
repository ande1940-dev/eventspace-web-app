import { User } from "@prisma/client";
import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import { SessionUser } from "next-auth";
import { useRouter } from "next/router";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { trpc } from "@/utils/trpc";

import Header from "@/components/Header";
import { useState } from "react";
import Link from "next/link";

//TODO: Implement Pagination 
const SearchResult: NextPage<ISearchProps> = ({ searchTerm, sessionUser }) => {
    const { data: users } = trpc.user.getAllUsers.useQuery()
    const [query, setQuery] = useState<string | null>(null)

    if (query !== null) {
        const filteredUsers = users?.filter((user: User) => 
            user.name !== null && user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0
        )
        return (
            <>
                <Header sessionUser={sessionUser}/>
                {
                    filteredUsers?.map((user: User, index: number) => (
                        <Link href={`/profile/${user.id}`} key={index}><a>{user.name}</a></Link>
                    ))
                }
            </>
        )
    } else {
        return (
            <> 
            <Header sessionUser={sessionUser}/>
            {
                users?.map((user: User, index: number) => (
                    <Link href={`/profile/${user.id}`} key={index}><a>{user.name}</a></Link>
                ))
            }
            </>
        )
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerAuthSession(context);
    const sessionUser = session?.user === undefined ? null : session.user
    const searchTerm = context.params?.q === undefined ? null : context.params.eventId
  
    return {
        props: {
          sessionUser,
          searchTerm, 
        }
    }    
}

interface ISearchProps {
    sessionUser: SessionUser 
    searchTerm: string
}

export default SearchResult;