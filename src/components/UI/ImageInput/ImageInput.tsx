import { PhotoCamera } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { FunctionComponent, useCallback } from 'react';
import { ImageInputProps } from './ImageInput.interface';

export const ImageInput: FunctionComponent<ImageInputProps> = ({ imageUrl, setImageUrl, workMode = 'edit' }) => {
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
                    setImageUrl(imageDataUrl);
                };
            }
        },
        [setImageUrl]
    );

    return (
        <Box display={'flex'} flexDirection={'row'}>
            <img width='100' alt='profilePhoto' src={imageUrl} />

            {workMode === 'edit' && (
                <IconButton color='primary' aria-label='upload picture' component='label'>
                    <input hidden accept='image/*' type='file' onChange={onSubmitFile} />
                    <PhotoCamera />
                </IconButton>
            )}
        </Box>
    );
};
