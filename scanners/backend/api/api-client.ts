import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3000",
});

// get indexer status
export async function getStatus() {
  const { data } = await client.get("/status");
  return data;
}

// get all transfers for an address
export async function getTransfers(address: string) {
  const { data } = await client.get(`/transfers/${address}`);
  return data;
}

// get total volume for an address
export async function getVolume(address: string) {
  const { data } = await client.get(`/volume/${address}`);
  return data;
}
