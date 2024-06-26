"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: "vue-advisor",
  private_key_id: "0d08d9e51490a992c5429f087fe924ad9b86ee0c",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDFF+rnfAXJAFFU\nT/A/7pLUjc0JaSmm9Xoql1IMVH4yE17+mwnKZGE6wycygUSbGRqAUPwgTNtUoNYi\ne5GkVXMNdIhZCVNch0VocIvY7EVQngY8HUWaNFjsL2eVNoXXWqCTVf4FyLKg/MRU\nrQVWSDdv3n4yiqOTa2Hq02ccwCSN7Hzfj2Kd46ifROZZO02I0JrEY/r2uF5DGPfV\nIS5aT8EhTJMzIKKhrKrv5nd4UNFv+2VqRAMbOENcM2tTxEBa2nTl2APjGU2f65Dl\nxU9ESLT1xYaHmq5FJlTLyZk/nDfh2Fn6nyeANOxyf0CpvjqFtv5wktCUsifF3wLk\nTFOJVYPxAgMBAAECggEACG4VFezZ9f6Rm/a11tQyW01L4GvLNGkSPj1d7OlVwvhN\nYzw4I1wfBQOJGwnIqI4esi+UkyCaboCZHB03LeVaQBB0jwNdOYtPIpASyTbU4aV6\nrIpPenCj/4kpB+qut5b4oIiobnCmxEg/cQQ8AtRgq6Qjd2+y3qi0hdXgNox428mX\nFxbG8MhPQhWMuK2vZF+vYM6nIdNMNQssrUk073IDTZqXGZVmXWZCiT/V0xd/EMgs\ni/W2xIcx6khYH0CtN3lQCKAsrerCp/ldF8XpAqLlVLEHzoq11r34dxlJb6wKSjXd\nBTJIVXKxYnUr0FUvbYU7nJ7vO22AdX8to0TxR/ClaQKBgQDlOyME8vSdtXsDinBh\nzaXNN11sEeKeJGogXn6gjzZKHVrCwxJFZNvJveFuGR2TMfCGaqaytKfjrFczM2IF\nSBJl8PnK39WEDZK76Ql8dKCg+utHbAgutw7jUdiMlb6G/sbjAcLjK+WC0mn2fFYc\nLN9S4Xks42TKoyCab66j3HnaSQKBgQDcHAcU+kkB0CegsHU6JwotIua2qyspJgi+\nd2M7nqalBZ78M5kPUeyAHUQaMa3EK5hufqMx/VYUDDakLg4wsaz9pPMb0GmreyAZ\nwVBi1DtBAeLMEFN7e+OqOsE5sPruLbPMsxUANn1XpJ8fXh4+6LaBqjJ1npTqy33Q\n/r18c6McaQKBgQCZchKpF3GDuJ4V6q/76EtaqfsRgo9uSPX5oQemtvciea/tu+MZ\nLMCrtT2YE5vmkoFtmSrpaWERWKYukfDFlE8sijjMAzXMZcGZpA9DjlaQLCce8kQv\n8T44EOuigALAHwBHqUAqDZJfFjb0VprV1XvQ4TnaQIWR18zVVHlVGxs+cQKBgQCD\n66x27zc4hfhqP7hS3TklKkja7KYWqHwPI+Dux7ybJU5PW+F9pB05/9BkXqgF7hcT\nCoVnHa4sn9FT/2Jz3tmOwAERB419wHLR3OIACbFl2eqDYbmXRf6CdWp/2Enc3Llp\nk1+f3AitsbXJCBDapYFVH5vUkPIx8zp6O2N4Jpp5GQKBgQC1HsqmsbqMoeb5enod\n2tUDslDiieVBiKB56fQqJSISPJKsLHR/EQ1C1/Y7bR/VdLE+LWNWa3j9jTBN6dcJ\nWm6F5oubjkXaAs5uKxnnxpPDqVyYMiv+zTWi1O5LTK3ooBt1IrMf3vrokrc4879M\nAR+E1I6ZQe/Z9JHOBM1F4tVWjQ==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-3ovg0@vue-advisor.iam.gserviceaccount.com",
  client_id: "113908836217950620785",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3ovg0%40vue-advisor.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
admin.firestore().settings({ merge: true, ignoreUndefinedProperties: true });

const auth = admin.auth();

exports.functions = functions;
exports.admin = admin;
exports.auth = auth;
