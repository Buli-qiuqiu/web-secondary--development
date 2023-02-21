const PUBLIC_KEY = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANNmSJW87EE2Z3KDW5Kod8cL + 7lUBgfKLm86CGfMQxvc8w + JnOE7GV72DVyg2kCMGho5g9AR64BmrGobbG4xMZECAwEAAQ ==";

export const Encrypt = (text) => {
   if (!text) {
      return;
   }
   var encrypt = new JSEncrypt();
   encrypt.setPublicKey("-----BEGIN PUBLIC KEY-----" + PUBLIC_KEY + "-----END PUBLIC KEY-----");

   var encrypted = encrypt.encrypt(text);

   return encrypted.toString();
};
