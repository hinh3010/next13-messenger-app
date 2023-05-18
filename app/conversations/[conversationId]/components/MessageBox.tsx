'use client';

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { FullMessageType } from "@/app/types";

import Avatar from "@/app/components/Avatar";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
    message: FullMessageType;
    isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({
    message,
    isLast
}) => {
    const session = useSession();
    const [imageModalOpen, setImageModalOpen] = useState(false);


    const seenList = (message.seen || [])
        .filter((user) => user.email !== message?.sender?.email)
        .map((user) => user.name)
        .join(', ');

    const isOwn = session.data?.user?.email === message?.sender?.email

    const containerStyle = clsx('flex gap-3 p-4', isOwn && 'justify-end');
    const avatarStyle = clsx(isOwn && 'order-2');
    const bodyStyle = clsx('flex flex-col gap-2', isOwn && 'items-end');
    const messageStyle = clsx(
        'text-sm w-fit overflow-hidden',
        isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100',
        message.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'
    );

    return (
        <div className={containerStyle}>
            <div className={avatarStyle}>
                <Avatar user={message.sender} />
            </div>
            <div className={bodyStyle}>
                <div className="flex items-center gap-1">
                    <div className="text-sm text-gray-500">
                        {message.sender.name}
                    </div>
                    <div className="text-xs text-gray-400">
                        {format(new Date(message.createdAt), 'p')}
                    </div>
                </div>
                <div className={messageStyle}>
                    <ImageModal src={message.image} isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} />
                    {message.image ? (
                        <Image
                            alt="Image"
                            height="288"
                            width="288"
                            onClick={() => setImageModalOpen(true)}
                            src={message.image}
                            className="
                                object-cover 
                                cursor-pointer 
                                hover:scale-110 
                                transition 
                                translate
                            "
                        />
                    ) : (
                        <div>{message.body}</div>
                    )}
                </div>
                {isLast && isOwn && seenList.length > 0 && (
                    <div
                        className="
                            text-xs 
                            font-light 
                            text-gray-500
                        "
                    >
                        {`Seen by ${seenList}`}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MessageBox;
