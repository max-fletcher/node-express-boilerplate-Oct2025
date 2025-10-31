import { TAny } from "../types/types/common.type";

const allowedOrigins = [
  'https://admin-probashi-kollan.ontiktech.xyz',
  'https://probashi-kollan.ontiktech.xyz'
];

export const corsOptions = {
  origin: (origin: TAny, callback: TAny) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};
