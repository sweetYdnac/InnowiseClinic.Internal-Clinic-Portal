import { WorkMode } from '../../../constants/WorkModes';

export interface ImageInputProps {
    imageUrl: string;
    setImageUrl: React.Dispatch<React.SetStateAction<string>>;
    workMode?: WorkMode;
}
