import { NextPage } from "next";
import { SessionUser } from "next-auth";
import Header from "../../components/Header";

const Profile: NextPage<IProfileProps> = ({ sessionUser }) => {
    return (
        <>
            <Header sessionUser={sessionUser}/>

        </>
    )
}

interface IProfileProps {
    sessionUser: SessionUser
}

export default Profile;