import axios from "axios";
import { toast } from "react-toastify";

export const API = axios.create({ baseURL: '/api' });

export const apiErrorHandler = (err: any) => {
  if (err?.response.data.msg) toast.error(err.response.data.msg);
  else toast.error('Something went wrong.');
}