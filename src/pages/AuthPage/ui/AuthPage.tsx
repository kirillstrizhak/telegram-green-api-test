import { useState } from "react";
import styles from "./AuthPage.module.scss";
import InputBase from "../../../shared/ui/InputBase/InputBase";
import ButtonBase from "../../../shared/ui/ButtonBase/ButtonBase";
import {
  saveAuth,
  type AuthData,
} from "../../../features/auth/auth";
import { useNavigate } from "react-router";
import { validateCredentials } from "../../../features/api/validateCredentials";
import Preloader from "../../../shared/ui/Preloader/Preloader";

function AuthPage() {
  const navigate = useNavigate();

  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const authenticate = async () => {
    if (!idInstance || !apiTokenInstance) {
      setErrorMessage("Заполните все поля");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const authData: AuthData = {
        idInstance: idInstance,
        apiTokenInstance: apiTokenInstance,
      };

      const credentialsCheck = await validateCredentials(authData);

      if (!credentialsCheck.valid) {
        setErrorMessage(credentialsCheck.reason ? credentialsCheck.reason : "");
        return;
      }

      saveAuth(authData);

      setTimeout(() => navigate("/chats"), 500);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <main className={styles["login-wrapper"]}>
      <div className={styles["login-form"]}>
        {isLoading ? (
          <Preloader />
        ) : (
          <>
            <h2 className={styles["heading-base"]}>Вход</h2>
            <p className={styles["hint-base"]}>
              Введите idInstance и apiTokenInstance из Вашего личного кабинета{" "}
              <a href="https://console.green-api.com/" target="_blank">
                GREEN API
              </a>
            </p>
            <InputBase
              value={idInstance}
              placeholder={"Ваш idInstance"}
              onChange={(value) => setIdInstance(value)}
            />
            <InputBase
              value={apiTokenInstance}
              placeholder={"Ваш apiTokenInstance"}
              onChange={(value) => setApiTokenInstance(value)}
            />
            {errorMessage && (
              <p className={styles["error-message"]}>{errorMessage}</p>
            )}
            <ButtonBase
              onClick={() => authenticate()}
              addClass={styles["auth-button"]}
            >
              Войти
            </ButtonBase>
          </>
        )}
      </div>
    </main>
  );
}

export default AuthPage;
