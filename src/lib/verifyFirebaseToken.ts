// takes the token and checks if it has been tampered with
import { jwtVerify, createRemoteJWKSet } from "jose";

const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const issuer = `https://securetoken.google.com/${firebaseProjectId}`;

// Firebase JWKS endpoint
const JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
  )
);

export async function verifyFirebaseToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer,
      audience: firebaseProjectId,
    });

    return payload;
  } catch (error: any) {
    console.error("Token verification failed", error);
    return null;
  }
}
