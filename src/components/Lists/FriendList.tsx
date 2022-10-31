import Link from "next/link";
import { Friendship, UserWithRelations } from "@prisma/client";
import ProfileImage from "../ProfileImage";

const FriendList = ({ friends }: IFriendsProps) => {

    return (
        <div>
            {
                friends.map((friend: UserWithRelations, index: number) =>
                    <div key={index}>
                        <div>
                            <ProfileImage image={friend.image} size={40}/>
                        </div>
                        <Link href={`/profile/${friend.id}`}>{friend.name}</Link>
                    </div>
                )
            }
        </div>
    )
}

interface IFriendsProps {
    friends: UserWithRelations[]
}

export default FriendList