import { Buffer } from "buffer";

function jwtDecode<T>(token: string): T {
  const parts = token
    .split(".")
    .map((part) =>
      Buffer.from(
        part.replace(/-/g, "+").replace(/_/g, "/"),
        "base64"
      ).toString()
    );

  const payload = JSON.parse(parts[1]);
  return payload as T;
}

export { jwtDecode };
