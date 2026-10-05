import styles from "./Preloader.module.scss";

const Preloader: React.FC = ({
}) => {
  return (
    <div className={styles["loader-wrapper"]}>
      <span className={styles["loader"]}></span>
    </div>
  );
};

export default Preloader;
