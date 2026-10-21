import type {
  AdminUser,
  OperatorType,
  CreateOperatorInput,
  CreateClientAccountInput,
  UpdateOperatorInput,
  UpdateClientAccountInput
} from "@/types/user";
import { OPERATOR_OPTIONS } from "./account-display";

export type AccountKind = "operator" | "client";
export type AccountCommand =
  | { action: "create-operator"; data: CreateOperatorInput }
  | { action: "create-client"; data: CreateClientAccountInput }
  | { action: "update-operator"; id: string; data: UpdateOperatorInput }
  | {
    action: "update-client";
    id: string;
    data: UpdateClientAccountInput;
  };
export interface AccountFields {
  name: string;
  email: string;
  phone: string;
  password: string;
  operatorType: string;
}

export function initialAccountFields(account?: AdminUser): AccountFields {
  return {
    name: account?.profiles?.display_name ?? "",
    email: account?.email ?? "",
    phone: account?.profiles?.phone ?? "",
    password: "",
    operatorType: account?.profiles?.operator_type ?? ""
  };
}
export function buildAccountCommand(
  fields: AccountFields,
  kind: AccountKind,
  account?: AdminUser
): AccountCommand {
  const email = fields.email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Enter a valid email address.");
  if (!account && fields.password.length < 8)
    throw new Error("Password must contain at least 8 characters.");
  const isOperator = account
    ? account.user_roles.some(({ role }) => role === "operator")
    : kind === "operator";
  if (!isOperator) {
    const name = fields.name.trim();
    const phone = fields.phone.trim();

    if (!name) {
      throw new Error("Full name is required.");
    }

    if (phone && !/^[0-9+\s-]{8,15}$/.test(phone)) {
      throw new Error(
        "Phone must contain 8–15 digits, spaces, + or -.",
      );
    }

    if (!account) {
      return {
        action: "create-client",
        data: {
          name,
          email,
          password: fields.password,
          ...(phone ? { phone } : {}),
        },
      };
    }

    const data: UpdateClientAccountInput = {};

    if (name !== (account.profiles?.display_name ?? "")) {
      data.name = name;
    }

    if (email !== account.email) {
      data.email = email;
    }

    if (phone !== (account.profiles?.phone ?? "")) {
      data.phone = phone || null;
    }

    if (!Object.keys(data).length) {
      throw new Error("No changes to save.");
    }

    return {
      action: "update-client",
      id: account.id,
      data,
    };
  }
  const name = fields.name.trim();
  const phone = fields.phone.trim();
  if (!name) throw new Error("Full name is required.");
  const option = OPERATOR_OPTIONS.find(
    (item) => item.value === fields.operatorType
  );
  if (!option) throw new Error("Select a supported operator specialty.");
  const originalType = account?.profiles?.operator_type;
  if (option.legacy && originalType !== option.value)
    throw new Error(
      "Data Entry and Supervisor are managed by Admin in the current workflow."
    );
  if (phone && !/^[0-9+\s-]{8,15}$/.test(phone))
    throw new Error("Phone must contain 8–15 digits, spaces, + or -.");
  if (!account)
    return {
      action: "create-operator",
      data: {
        name,
        email,
        password: fields.password,
        operatorType: option.value,
        ...(phone ? { phone } : {})
      }
    };
  if (!phone && account.profiles?.phone)
    throw new Error(
      "Clearing an existing phone is not supported by the current API. Enter a valid phone."
    );
  const data: UpdateOperatorInput = {};
  if (name !== account.profiles?.display_name) data.name = name;
  if (email !== account.email) data.email = email;
  if (phone && phone !== account.profiles?.phone) data.phone = phone;
  if (option.value !== originalType)
    data.operatorType = option.value as OperatorType;
  if (!Object.keys(data).length) throw new Error("No changes to save.");
  return { action: "update-operator", id: account.id, data };
}
