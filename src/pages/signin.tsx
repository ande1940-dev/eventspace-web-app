import type { NextPage } from "next";
import { GetServerSideProps } from 'next';
import { SessionUser } from "next-auth";
import { ClientSafeProvider, getProviders, LiteralUnion, signIn, signOut, useSession } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";
import { getServerAuthSession } from "../server/common/get-server-auth-session";

const SignIn: NextPage<IPageProps> = ({ providers }) => {

  return (
    <>
      {providers !== undefined && providers !== null &&
          Object.values(providers).map(provider => (
              <button 
                  onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                  key={provider.name} 
              >
                  Continue with {provider.name}
              </button>
      ))}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const providers = await getProviders()
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
            providers,
        }   
    }    
}

interface IPageProps {
  providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
}


export default SignIn;
