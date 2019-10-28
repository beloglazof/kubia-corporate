import { get, post } from "./config";

export const usersCheck = async phone => await get("users/check", { phone });

export const usersMe = async () => await get("users/me");

export const tokenObtain = async () => await post("token/obtain");

export const paymentsPay = async (
  params = { amount: "", account_id: "", user_id: "", idempotency: "" }
) => await post("payments/pay", params);

export const withdrawal = async (
  params = {
    account_id: 0,
    amount: 0,
    notes: "",
    withdrawal_type: 1,
    recepient: {
      swift: "",
      bank_code: "",
      bank_account_id: "",
      branch_code: "",
      bank_address: "",
      bank_name: ""
    },
    idempotency: ""
  }
) => await post("withdrawal", params);
