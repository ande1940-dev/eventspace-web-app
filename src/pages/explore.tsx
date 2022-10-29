import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import { SessionUser } from "next-auth";
import { useRouter } from "next/router";
import { useRef } from "react";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { trpc } from "../utils/trpc";

import Header from "../components/Header";


const Explore: NextPage<IExploreProps> = ({ sessionUser }) => {
    const searchRef = useRef<HTMLInputElement | null>(null)
    const router = useRouter()

    return (
        <>
            <Header sessionUser={sessionUser}/>
            <main>
                <div>
                    <input className="outline outline-black" 
                        ref={searchRef}
                        type="text"
                        placeholder="Search"
                    />
                    <button onClick={() => router.push({pathname: "/search", query: {q: searchRef.current?.value}})}>Search</button>
                </div>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerAuthSession(context);
    const sessionUser = session?.user === undefined ? null : session.user
  
    return {
        props: {
          sessionUser
        }
    }    
}

interface IExploreProps {
    sessionUser: SessionUser 
}

export default Explore;