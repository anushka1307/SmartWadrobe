import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleLogin(onLogin: (idToken: string) => void) {
  // Log the redirect URI used by Expo (helps to verify it matches Google console config)
  const redirectUri = makeRedirectUri();
  console.log("Redirect URI used:", redirectUri);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "GOOGLE_CLIENT_ID",
    redirectUri,  // explicitly set it here
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      onLogin(id_token); // send to backend here
    }
  }, [response]);

  return { promptAsync, request };
}
