import styles from "./InputBase.module.scss";

type InputBaseProps = {
  disabled?: boolean;
  addClass?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onKeyDown?: (value: any) => void;
};

const InputBase: React.FC<InputBaseProps> = ({
  disabled = false,
  addClass,
  value,
  placeholder,
  onChange,
  onKeyDown
}) => {
  const inputClass = `${styles["input-base"]} ${addClass ? addClass : ""} ${disabled ? "disabled" : ""}`;

  return (
    <input
      disabled={disabled}
      className={inputClass}
      type="text"
      placeholder={placeholder ? placeholder : ""}
      value={value}
      onKeyDown={onKeyDown ? (e) => onKeyDown(e) : undefined}
      onChange={(e) => onChange(e.target.value.trim())}
    />
  );
};

export default InputBase;
