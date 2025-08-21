import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private key = CryptoJS.enc.Hex.parse('BCC7E82813526999D862957B88219960CE248A4AA071A8B912FD6B700582D980');
  private iv = CryptoJS.enc.Hex.parse('948FE7816C8CCDFE0DBD86E6135050FF');

  constructor() { }

  // encrypt(unencrypted: string): string {
  //   try {
  //     const utf8Data = CryptoJS.enc.Utf8.parse(unencrypted);
  //     const encrypted = CryptoJS.AES.encrypt(utf8Data, this.key, {
  //       iv: this.iv,
  //       mode: CryptoJS.mode.CBC,        
  //       //padding: CryptoJS.pad.Pkcs7
  //     });
  //     return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  //   } catch (e) {
  //     console.error('Error during encryption:', e);
  //     return '';
  //   }
  // }

  // encrypt(unencrypted: string): string {
  //   try {
  //     const encrypted = CryptoJS.AES.encrypt(unencrypted, this.key, {
  //       iv: this.iv,
  //       mode: CryptoJS.mode.CBC,
  //       padding: CryptoJS.pad.Pkcs7
  //     });
  //     return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  //   } catch (e) {
  //     console.error('Error during encryption:', e);
  //     return '';
  //   }
  // }



  decrypt(encrypted: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(encrypted, this.key, {
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return CryptoJS.enc.Utf8.stringify(decrypted);
    } catch (e) {
      console.error('Error during decryption:', e);
      return '';
    }
  }

  private static readonly keyHex = 'BCC7E82813526999D862957B88219960CE248A4AA071A8B912FD6B700582D980';
  private static readonly ivHex = '948FE7816C8CCDFE0DBD86E6135050FF';


  private getKey(): CryptoJS.lib.WordArray {
    return CryptoJS.enc.Hex.parse(EncryptionService.keyHex);
  }

  private getIV(): CryptoJS.lib.WordArray {
    return CryptoJS.enc.Hex.parse(EncryptionService.ivHex);
  }

  encrypt(unencrypted: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(unencrypted, this.getKey(), {
        iv: this.getIV(),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

     // return encrypted.toString();
     const encodedString = btoa(encrypted.toString());
     return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    } catch (error) {
      console.error('Error during encryption:', error);
      return '';
    }
  }

 
}
