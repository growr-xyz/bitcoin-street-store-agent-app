import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BSS_API,
  responseType: "json",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});
