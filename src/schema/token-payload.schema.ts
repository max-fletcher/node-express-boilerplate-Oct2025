export type AdminUserPayload = {
  id: string
  email: string
};

export type AppUserPayload = {
  id: string
  name: string | null
  email: string
  phoneNumber: string
};
