import styles from "./ButtonBase.module.scss";

type ButtonBaseProps = {
  disabled?: boolean;
  children: React.ReactNode;
  addClass?: string;
  onClick: () => void;
};

const ButtonBase: React.FC<ButtonBaseProps> = ({
  disabled = false,
  children,
  addClass,
  onClick,
}) => {
  const buttonClass = `${styles["button-base"]} ${addClass ? addClass : ''} ${disabled ? 'disabled' : ''}`;

  return (
    <button disabled={disabled} className={buttonClass} onClick={() => onClick()}>
      {children}
    </button>
  );
};

export default ButtonBase;
