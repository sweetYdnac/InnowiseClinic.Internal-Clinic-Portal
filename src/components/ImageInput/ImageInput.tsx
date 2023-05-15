import { PhotoCamera } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { FunctionComponent, useCallback } from 'react';
import { Control, useController } from 'react-hook-form';
import { WorkMode } from '../../constants/WorkModes';

interface ImageInputProps {
    id: string;
    control: Control<any, any>;
    workMode?: WorkMode;
}

export const ImageInput: FunctionComponent<ImageInputProps> = ({ id, control, workMode = 'edit' }: ImageInputProps) => {
    const { field } = useController({
        name: id,
        control: control,
    });

    const onSubmitFile = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            const reader = new FileReader();
            if (file) {
                const blob = new Blob([file], {
                    type: file.type,
                });
                reader.readAsDataURL(blob);
                reader.onload = () => {
                    const imageDataUrl = reader.result as string;
                    field.onChange({
                        target: {
                            value: imageDataUrl,
                            name: id,
                        },
                        type: 'blur',
                    });
                };
            }
        },
        [field, id]
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <img width='100' alt='profilePhoto' src={field.value} />

            {workMode === 'edit' && (
                <IconButton color='primary' aria-label='upload picture' component='label'>
                    <input hidden accept='image/*' type='file' onChange={onSubmitFile} />
                    <PhotoCamera />
                </IconButton>
            )}
        </div>
    );
};
