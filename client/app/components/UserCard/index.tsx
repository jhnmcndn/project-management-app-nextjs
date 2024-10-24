import { User } from '@/types/types';
import Image from 'next/image';

type Props = {
  user: User;
};

const UserCard = ({ user }: Props) => {
  return (
    <div className='flex items-center rounded border p-4 shadow'>
      {user.profilePictureUrl && (
        <Image
          src={`https://pm-s3-images-mac.s3.ap-southeast-1.amazonaws.com/p1.jpeg`}
          alt='Profile Picture'
          width={32}
          height={32}
          className='w-full rounded'
        />
      )}
      <div>
        <h3>{user.username}</h3>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

export default UserCard;
