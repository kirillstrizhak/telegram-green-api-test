import { useState } from "react";
import styles from "./AuthPage.module.scss";
import InputBase from "../../../shared/ui/InputBase/InputBase";
import ButtonBase from "../../../shared/ui/ButtonBase/ButtonBase";

function AuthPage() {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const authenticate = () => {
    if (!idInstance || !apiTokenInstance) {
      setErrorMessage("Заполните все поля");
    }
  };

  return (
    <main className={styles["login-wrapper"]}>
      <div className={styles["login-form"]}>
        <h2 className={styles["heading-base"]}>Вход</h2>
        <p className={styles["hint-base"]}>
          Введите idInstance и apiTokenInstance из Вашего личного кабинета{" "}
          <a href="https://console.green-api.com/" target="_blank">GREEN API</a>
        </p>
        <InputBase value={idInstance} placeholder={"Ваш idInstance"} onChange={(value) => setIdInstance(value)} />
        <InputBase value={apiTokenInstance} placeholder={"Ваш apiTokenInstance"} onChange={(value) => setApiTokenInstance(value)} />
        <ButtonBase onClick={() => authenticate()} addClass={styles["auth-button"]}>Войти</ButtonBase>
      </div>
    </main>
  );
}

export default AuthPage;
