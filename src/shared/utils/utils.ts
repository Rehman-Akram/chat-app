import * as bcrypt from 'bcrypt';
export class Utils {
  public static generateHash(str: string): string {
    return bcrypt.hashSync(str, parseInt(process.env.BCRYPT_WORK));
  }

  public static trimLowerString(str: string): string {
    return str.trim().toLowerCase();
  }

  public static generateOTP(otpExpiryTime: string): {
    otp: string;
    otpExpiry: Date;
  } {
    // Generate a random 4-digit number
    const otp = Math.floor(1000 + Math.random() * 9000);
    const currentTime = new Date();
    const otpExpiry = new Date(
      currentTime.getTime() + parseInt(otpExpiryTime) * 60000,
    );
    return { otp: otp.toString(), otpExpiry }; // Convert to string before returning
  }

  public static verifyPassword(
    userPassword: string,
    passwordInput: string,
  ): boolean {
    return bcrypt.compareSync(passwordInput, userPassword);
  }

  /**
   * Function to convert mongoose object to javascript object and replace _id with id at all levels
   *
   * @param obj
   * @returns
   */
  public static convertToPlainObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(this.convertToPlainObject);
    } else if (obj && typeof obj === 'object') {
      if (obj.toObject) {
        obj = obj.toObject();
      }
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key === '_id') {
            obj['id'] = this.convertToPlainObject(obj[key]);
            delete obj['_id'];
          } else {
            obj[key] = this.convertToPlainObject(obj[key]);
          }
        }
      }
    }
    return obj;
  }

  public static generatePassword(length: number): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const specialChars = '@$!%*?&';

    // Ensure the password includes at least one character from each required set
    let password = '';
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += digits[Math.floor(Math.random() * digits.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill the rest of the password with random characters from all sets
    const allChars = lowercase + uppercase + digits + specialChars;
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password to ensure the characters are in random order
    password = password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');

    return password;
  }
}
