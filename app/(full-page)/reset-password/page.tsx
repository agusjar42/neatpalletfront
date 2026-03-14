"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { useContext, useMemo, useState } from "react";
import { LayoutContext } from "../../../layout/context/layoutcontext";
import axios from "axios";
import { resetPassword } from "@/app/api-endpoints/auth";
import { useIntl } from "react-intl";

const ResetPasswordPage = () => {
  const router = useRouter();
  const intl = useIntl();
  const searchParams = useSearchParams();
  const token = (searchParams.get("token") || "").trim();

  const { layoutConfig } = useContext(LayoutContext);
  const dark = layoutConfig.colorScheme !== "light";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showRequestNewLink, setShowRequestNewLink] = useState(false);

  const passwordsMatch = useMemo(() => newPassword === confirmPassword, [newPassword, confirmPassword]);
  const canSubmit = token.length > 0 && newPassword.length > 0 && confirmPassword.length > 0 && passwordsMatch && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setErrorMessage(null);
    setShowRequestNewLink(false);
    setLoading(true);
    document.body.style.cursor = "wait";

    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
    } catch (error) {
      const httpStatus = axios.isAxiosError(error) ? error.response?.status : undefined;
      const isNetworkFailure = axios.isAxiosError(error) && !error.response;

      if (httpStatus === 400) {
        setShowRequestNewLink(true);
        setErrorMessage(intl.formatMessage({ id: "El enlace de restablecimiento no es válido o ha caducado. Solicita uno nuevo." }));
      } else if (isNetworkFailure) {
        setErrorMessage(intl.formatMessage({ id: "No se pudo restablecer la contraseña por un problema de red. Inténtalo de nuevo." }));
      } else {
        const serverReason =
          axios.isAxiosError(error) && error.response?.data?.error?.message
            ? error.response.data.error.message
            : intl.formatMessage({ id: "Error desconocido" });
        setErrorMessage(`${intl.formatMessage({ id: "No se pudo restablecer la contraseña. Motivo del servidor:" })} ${serverReason}`);
      }
    } finally {
      setLoading(false);
      document.body.style.cursor = "default";
    }
  };

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1600 800"
        className="fixed left-0 top-0 min-h-screen min-w-screen"
        preserveAspectRatio="none"
      >
        <rect fill={dark ? "var(--primary-900)" : "var(--primary-500)"} width="1600" height="800" />
        <path
          fill={dark ? "var(--primary-800)" : "var(--primary-400)"}
          d="M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z"
        />
        <path
          fill={dark ? "var(--primary-700)" : "var(--primary-300)"}
          d="M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z"
        />
        <path
          fill={dark ? "var(--primary-600)" : "var(--primary-200)"}
          d="M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z"
        />
        <path
          fill={dark ? "var(--primary-500)" : "var(--primary-100)"}
          d="M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z"
        />
      </svg>

      <div className="px-5 min-h-screen flex justify-content-center align-items-center">
        <div className="border-1 surface-border surface-card border-round py-7 px-4 md:px-7 z-1">
          {!token ? (
            <div className="flex flex-column gap-3" style={{ maxWidth: "30rem" }}>
              <div className="text-900 text-xl font-bold">{intl.formatMessage({ id: "Falta el token" })}</div>
              <span className="text-600 font-medium">
                {intl.formatMessage({ id: "Este enlace no es válido. Solicita un nuevo enlace de restablecimiento." })}
              </span>
              <Button label={intl.formatMessage({ id: "Ir a solicitar enlace" })} className="w-full" onClick={() => router.push("/forgot-password")} />
            </div>
          ) : success ? (
            <div className="flex flex-column gap-3" style={{ maxWidth: "30rem" }}>
              <div className="text-900 text-xl font-bold">{intl.formatMessage({ id: "Contraseña restablecida" })}</div>
              <span className="text-600 font-medium">{intl.formatMessage({ id: "Ya puedes iniciar sesión con tu nueva contraseña." })}</span>
              <Button label={intl.formatMessage({ id: "Ir al login" })} className="w-full" onClick={() => router.push("/auth/login")} />
            </div>
          ) : (
            <div className="flex flex-column">
              <div className="mb-4">
                <div className="text-900 text-xl font-bold mb-2">{intl.formatMessage({ id: "Restablecer contraseña" })}</div>
                <span className="text-600 font-medium">{intl.formatMessage({ id: "Introduce tu nueva contraseña." })}</span>
                <div className="text-600 text-sm mt-2">{intl.formatMessage({ id: "Sugerencia: usa al menos 8 caracteres." })}</div>
                {errorMessage && <p style={{ color: "red", maxWidth: "30rem" }}>{errorMessage}</p>}
                {showRequestNewLink && (
                  <Button
                    label={intl.formatMessage({ id: "Solicitar nuevo enlace" })}
                    outlined
                    className="mt-2"
                    onClick={() => router.push("/forgot-password")}
                    disabled={loading}
                  />
                )}
              </div>

              <span className="p-input-icon-left w-full mb-4">
                <i className="pi pi-lock z-2"></i>
                <Password
                  id="newPassword"
                  className="w-full"
                  type="text"
                  inputClassName="w-full md:w-25rem"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={intl.formatMessage({ id: "Nueva contraseña" })}
                  toggleMask
                  feedback={false}
                  inputStyle={{ paddingLeft: "2.5rem" }}
                  disabled={loading}
                />
              </span>

              <span className="p-input-icon-left w-full mb-2">
                <i className="pi pi-lock z-2"></i>
                <Password
                  id="confirmPassword"
                  className="w-full"
                  type="text"
                  inputClassName="w-full md:w-25rem"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={intl.formatMessage({ id: "Repite la contraseña" })}
                  toggleMask
                  feedback={false}
                  inputStyle={{ paddingLeft: "2.5rem" }}
                  disabled={loading}
                />
              </span>

              {!passwordsMatch && confirmPassword.length > 0 && (
                <p style={{ color: "red", maxWidth: "30rem" }}>{intl.formatMessage({ id: "Las contraseñas no coinciden." })}</p>
              )}

              <div className="flex gap-2 justify-content-between mt-2">
                <Button
                  label={intl.formatMessage({ id: "Cancelar" })}
                  outlined
                  className="w-6"
                  onClick={() => router.push("/auth/login")}
                  disabled={loading}
                />
                <Button
                  label={loading ? intl.formatMessage({ id: "Restableciendo..." }) : intl.formatMessage({ id: "Restablecer contraseña" })}
                  className="w-6"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
