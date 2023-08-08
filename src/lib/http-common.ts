import axios, { AxiosInstance } from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API

const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  },
}) as AxiosInstance

export { http }
