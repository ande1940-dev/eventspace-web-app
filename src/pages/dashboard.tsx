import { NextPage } from "next";
import { SessionUser } from "next-auth";
import { GetServerSideProps } from 'next';
import Image from "next/image";
import Link from "next/link";
import { getServerAuthSession } from "../server/common/get-server-auth-session";

const Dashboard: NextPage<IDashboardProps> = ({ sessionUser }) => {
    const image = sessionUser.image
    return (
        <>
            <header className="flex p-5 justify-end">
                {image !== null && image !== undefined && 
                    <Image
                        src={image}
                        width={35}
                        height={35}
                        quality={90}

                        className="rounded-full"
                    /> 
                }
            </header>
            <main></main>
            <footer></footer>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerAuthSession(context);
    const sessionUser = session?.user === undefined ? null : session.user

    if (sessionUser === null) {
      return {
        notFound: true
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