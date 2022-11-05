import ProfileImage from '@/components/ProfileImage'
import { getServerAuthSession } from '@/server/common/get-server-auth-session'
import { trpc } from '@/utils/trpc'
import { UserWithComments, CommentWithChildren } from '@prisma/client'
import { GetServerSideProps, NextPage } from 'next'
import { SessionUser } from 'next-auth'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const CommentPage: NextPage<ICommentPageProps> = ({ eventId, commentId, sessionUser }) => {
    //Queries
    const authorsQuery = trpc.user.getAuthorsByEvent.useQuery({ eventId })
    
    // Mutation 
    const createComment = trpc.comment.createComment.useMutation()

    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>() 

    if (authorsQuery.isSuccess) {
        const authors = authorsQuery.data

        if (authors) {
            const comments = authors.map((commenter: UserWithComments) => {
                return commenter.comments.filter((comment: CommentWithChildren) => comment.eventId === eventId)
            }).flat()
            const renderComment = (comment: CommentWithChildren, depth: number, index: number) => {
                const author = authors.find((author: UserWithComments) => author.id === comment.authorId)
                const children: CommentWithChildren[] | undefined = comments.filter((child: CommentWithChildren) => child.parentId === comment.id)
                const createdDelta = getTimeDelta(comment.createdAt.getTime())
                const updatedDelta = comment.createdAt.getTime() === comment.updatedAt.getTime() ? null : getTimeDelta(comment.updatedAt.getTime())
                
                const onCreateComment: SubmitHandler<IFormInput> = (input) => {
                    createComment.mutate({eventId, authorId: sessionUser.id, parentId: comment.id, text: input.text})
                }
                return (
                    <div key={index}>
                        <div className="flex gap-5">
                            {author !== undefined &&
                                <div>
                                    <ProfileImage image={author.image} size={20}/>
                                    <p>{author.name}</p> 
                                </div> 
                            }
                            <p>{createdDelta}</p>
                            {updatedDelta && <p>{updatedDelta}</p>}
                        </div>
                        <p>{comment.text}</p>
                        {depth < 2 && 
                                <form onSubmit={handleSubmit(onCreateComment)}>
                                <textarea rows={5} cols={100} {...register("text")} placeholder="What are your thoughts?" style={{resize: "none"}}/>
                                <button type="submit">Submit</button>
                            </form>
                        }
                        {children !== undefined && 
                            children?.map((comment: CommentWithChildren, index: number) => 
                                renderComment(comment, depth + 1, index)
                            )
                        }
                    </div>
                )
                  
            }
            const parentComment = comments.find((comment: CommentWithChildren) => comment.id === commentId)

            return (
                <div>
                    {
                        renderComment(parentComment, 0, 0)
                    }   
                </div>
            )
        }

    } else if (authorsQuery.isLoading) {
        return <h1>Loading</h1>
    } else {
        return <h1>Error</h1>
    }
}

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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerAuthSession(context);
    const sessionUser = session?.user === undefined ? null : session.user
    const eventId = context.params?.eventId === undefined ? null : context.params.eventId
    const commentId = context.params?.commentId === undefined ? null : context.params.commentId
  
    if (commentId === null || eventId === null) {
        return {
            redirect: {
                permanent: false, 
                destination: "/dashboard"
            }
        }
    } 
    
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
            commentId,
            eventId,
            sessionUser,
        }
    } 
}
  
interface ICommentPageProps {
    eventId: string
    commentId: string 
    sessionUser: SessionUser
}

interface ICommentProps{
    author: UserWithComments
    comment: CommentWithChildren,
    depth: number
}

interface IFormInput {
    text: string
}

export default CommentPage