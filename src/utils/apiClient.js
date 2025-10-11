/**
 * A helper function which acts as an apiClient making external api calls with available
 * authentication saved in localStorage on login. If authentication data is invalid/missing 
 * (401, 403), the user is redirected to login page.
 * 
 * External api request logic is centralized so that every API call uses the same 
 * security mechanism.
 */

export async function authFetch(url, options = {}, navigate) {

    const token = localStorage.getItem("token");
    const tokenType = localStorage.getItem("tokenType") || "Bearer";
  
    if (!token) {
      console.warn("No token found. Redirecting to login...");
      navigate("/login");
      return null;
    }
  
    const headers = {
      Authorization: `${tokenType} ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    };
  
    try {
      const response = await fetch(url, { ...options, headers });
  
      if (response.status === 401 || response.status === 403) {
        console.warn("Session expired. Redirecting to login...");
        localStorage.removeItem("token");
        localStorage.removeItem("participantId");
        localStorage.removeItem("tokenType");
        navigate("/login");
        return null;
      }
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  /**
 *  A helper function which acts as an apiClient making external api calls
 *  for file upload/download.
 */
export async function authFetchFile(url, options = {}, navigate) {
  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("tokenType") || "Bearer";

  if (!token) {
    console.warn("No token found. Redirecting to login...");
    navigate("/login");
    return null;
  }

  const headers = {
    Authorization: `${tokenType} ${token}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 || response.status === 403) {
      console.warn("Session expired. Redirecting to login...");
      localStorage.removeItem("token");
      localStorage.removeItem("participantId");
      localStorage.removeItem("tokenType");
      navigate("/login");
      return null;
    }

    if (!response.ok) {
      throw new Error(`File request failed: ${response.status}`);
    }

    return response;
  } catch (err) {
    console.error("File request error:", err);
    throw err;
  }
}