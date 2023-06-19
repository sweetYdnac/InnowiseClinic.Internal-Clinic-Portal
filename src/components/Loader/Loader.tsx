import { StyledBackdrop, StyledLoader } from './Loader.styles';

export const Loader = () => {
    return (
        <StyledBackdrop open={true}>
            <StyledLoader />
        </StyledBackdrop>
    );
};
