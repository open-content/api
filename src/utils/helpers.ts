import {hash, compare, genSalt} from 'bcrypt';
import { v1 as uuidv1 } from 'uuid';

/**
 * generateSalt
 * 
 * @param factor number 
 */
export const generateSalt = (factor: number): Promise<string> => {
  return genSalt(factor);
}

/**
 * toHash
 * 
 * @param {*} pass 
 * 
 * password hashing
 */
export const toHash = async (pass: string): Promise<string> => {
  return hash(pass, 10);
};

/**
 * checkHash
 * 
 * @param {*} plain
 * @param {*} encrypted 
 * 
 * compare password hash with plain text
 */
export const checkHash = (plain: string, encrypted: string): Promise<boolean> => {
  return compare(plain, encrypted);
};

export const uuid = () => {
  return uuidv1();
};

export const nameFromSlug = (slug: string) => {
  return slug.indexOf('-') !== -1 ? slug.split('-').map((s: string) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`).join(' ') : `${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
}