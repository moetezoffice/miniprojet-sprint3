import { Type } from './type.model';

export interface TypeWrapper {
  _embedded?: {
    types?: Type[];
  };
}
