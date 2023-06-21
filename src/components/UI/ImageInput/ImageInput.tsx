import { PhotoCamera } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { FunctionComponent, useCallback } from 'react';
import { ImageInputProps } from './ImageInput.interface';
import { Container, Image } from './ImageInput.styles';

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
        <Container>
            <Image alt='profilePhoto' src={imageUrl} />

            {workMode === 'edit' && (
                <IconButton color='primary' aria-label='upload picture' component='label'>
                    <input hidden accept='image/*' type='file' onChange={onSubmitFile} />
                    <PhotoCamera />
                </IconButton>
            )}
        </Container>
    );
};
