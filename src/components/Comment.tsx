import { CommentWithChildren, UserWithComments } from "@prisma/client"
import ProfileImage from "./ProfileImage"

const getTimeDelta = (time: number) => {
    const currentTime = new Date().getTime()
    const delta = currentTime - time

    const years = Math.floor(delta / (1000 * 60 * 60 * 24 * 365.25))
    const days = Math.floor(delta / (1000 * 60 * 60 * 24))
    const hours = Math.floor(delta / (1000 * 60 * 60))
    const minutes = Math.floor(delta / (1000 * 60))
    const seconds = Math.floor(delta / (1000))

    if (years > 1) {
        if (years >= 2) {
            return `${years} years ago`
        } else {
            return "1 year ago"
        }
    } else if (days > 1) {
        if (days >= 2) {
            return `${days} days ago`
        } else {
            return "1 day ago"
        }
    } else if (hours > 1) {
        if (hours >= 2) {
            return `${hours} hours ago`
        } else {
            return "1 hour ago"
        }
    } else if (minutes > 1) {
        if (minutes >= 2) {
            return `${minutes} minutes ago`
        } else {
            return "1 minute ago"
        }
    } else if (seconds > 0) {
        if (seconds >= 2) {
            return `${seconds} seconds ago`
        } else {
            return "1 second ago"
        }
    }
}

const Comment = ({author, comment, depth}: ICommentProps) => {
    const createdDelta = getTimeDelta(comment.createdAt.getTime())
    const updatedDelta = comment.createdAt.getTime() === comment.updatedAt.getTime() ? null : getTimeDelta(comment.updatedAt.getTime())
    return (

        <div>
            <div className="flex gap-5">
                <ProfileImage image={author.image} size={20}/>
                <p>{author.name}</p> 
                <p>{createdDelta}</p>
                {updatedDelta && <p>{updatedDelta}</p>}
            </div>
            <p>{comment.text}</p>
            {depth < 2 && 
                <button>Reply</button>
            }
        </div>
    )

}

interface ICommentProps{
    author: UserWithComments
    comment: CommentWithChildren,
    depth: number
}

export default Comment;