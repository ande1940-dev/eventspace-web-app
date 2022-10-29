import { User } from "@prisma/client";
import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import { SessionUser } from "next-auth";
import { useRouter } from "next/router";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { trpc } from "../../utils/trpc";

import Header from "../../components/Header";
import { useEffect, useState } from "react";

const SearchResult: NextPage<ISearchProps> = ({ sessionUser }) => {
    const { data: users } = trpc.user.getAllUsers.useQuery()
    const router = useRouter()
    const [query, setQuery] = useState<string | null>(null)

    useEffect(() => {
        const query = router.query.q
        if (query !== undefined && !Array.isArray(query)) {
            setQuery(query)
        }
    }, [])

    if (query !== null) {
        console.log("Query", query)
        const filteredUsers = users?.filter((user: User) => 
            user.name !== null && user.name.toLowerCase().indexOf(query.toLowerCase()) >= 0
        )
        return (
            <>
                <Header sessionUser={sessionUser}/>
                {
                    filteredUsers?.map((user: User, index: number) => (
                        <p key={index}>{user.name}</p>
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
                    <p key={index}>{user.name}</p>
                ))
            }
            </>
        )
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerAuthSession(context);
    const sessionUser = session?.user === undefined ? null : session.user
  
    return {
        props: {
          sessionUser,
        }
    }    
}

interface ISearchProps {
    sessionUser: SessionUser 
}

export default SearchResult;