import { NextPage } from "next";
import { GetServerSideProps } from 'next';
import { SessionUser } from "next-auth";
import Link from "next/link";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import Header from "../components/Header";
import { trpc } from "../utils/trpc";

const Dashboard: NextPage<IDashboardProps> = ({ sessionUser }) => {
    const { data: user } = trpc.user.getUserById.useQuery(sessionUser.id)
    return (
        <>
            <Header sessionUser={sessionUser}/> 
            <nav>
                <Link href="/explore">Explore</Link>
            </nav>
            <main>
            </main>
            <footer></footer>
        </>
    )
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

export default Dashboard;