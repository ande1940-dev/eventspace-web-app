import type { NextPage } from "next";
import { GetServerSideProps } from 'next';
import Link from "next/link";
import { getServerAuthSession } from "../server/common/get-server-auth-session";

const Landing: NextPage = () => {
  return (
    <div>
      <Link href="/signin">Get Started</Link>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  
  if (session?.user !== undefined) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard"
      }
    }
  }

  return {
      props: {
          
      }
  }    
}

export default Landing;