import ProfileImage from "@/components/ProfileImage";
import { trpc } from "@/utils/trpc";
import { FriendRequest, UserWithRequests } from "@prisma/client";

const FriendRequestList = ({ senders }: IFriendsRequestProps) => {
    const createFriendship = trpc.friendship.createFriendship.useMutation()
    const deleteFriendRequest = trpc.friendRequest.deleteFriendRequest.useMutation()

    const acceptFriendRequest = (sender: UserWithRequests) => {
        const friendRequest = sender.sentFriendRequests.find((request: FriendRequest) =>
            request.senderId === sender.id
        )
        
        if (friendRequest !== undefined) {
            deleteFriendRequest.mutate({friendRequestId: friendRequest.id})
        }
        createFriendship.mutate({friendId: sender.id})
    }

    const renderFriendRequest = (sender: UserWithRequests) => {
        if (sender !== undefined) {
            return (
                <div>
                    <div>
                        <ProfileImage image={sender.image} size={35}/>
                    </div>
                    <div>
                        <p>{sender.name}</p>
                        <button onClick={() => acceptFriendRequest(sender)}>Accept</button>
                        <button>Decline</button>
                    </div>
                </div>
            )
        }
    }
    return (
        <div>
            { 
                senders.map((sender: UserWithRequests, index: number) => 
                    <section key={index}>
                        {
                            renderFriendRequest(sender)
                        }
                    </section>
                ) 
            }
        </div>  
    )
}

interface IFriendsRequestProps {
    senders: UserWithRequests[]
}

export default FriendRequestList