import Image from "next/image";

const ProfileImage = ({ image, size }: IProfileImageProps) => {
    if (image) {
        return (
            <div>
                <Image
                    className="rounded-full"
                    src={image}
                    width={size}
                    height={size}
                    quality={90}
                />
            </div>
        )
    } else {
        return <h1>Blank User Image</h1>
    }
}

interface IProfileImageProps {
    image: string | null
    size: number
}
export default ProfileImage