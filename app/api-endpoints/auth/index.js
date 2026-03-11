import { AuthPasswordControllerApi, settings } from "@/app/api-neatpallet";

const apiAuthPassword = new AuthPasswordControllerApi(settings);

export const requestPasswordReset = async (email) => {
  const { data } = await apiAuthPassword.authPasswordControllerForgot({ email });
  return data;
};

export const resetPassword = async (token, newPassword) => {
  const { data } = await apiAuthPassword.authPasswordControllerReset({ token, newPassword });
  return data;
};
