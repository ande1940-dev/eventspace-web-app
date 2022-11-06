import Image from "next/image";

const ProfileImage = ({ image, size }: IProfileImageProps) => {
    if (image && image !== undefined) {
        return (
            <div>
                <Image
                    className="rounded-full"
                    src={image}
                    width={size}
                    height={size}
                    quality={90}
                    alt="Profile Image"
                />
            </div>
        )
    } else {
        return <h1>Blank User Image</h1>
    }
}

interface IProfileImageProps {
    image: string | null | undefined
    size: number
}
export default ProfileImage