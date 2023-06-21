export interface ToggleSwitchProps {
    value: boolean;
    handleChange?: (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    disabled?: boolean;
}
