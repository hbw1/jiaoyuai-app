declare module 'express' {
  import { Request, Response, NextFunction, Router, Application } from 'express-serve-static-core';
  export { Request, Response, NextFunction, Router, Application };
  export default function(): Application;
}

declare module 'cors' {
  import { RequestHandler } from 'express';
  function cors(options?: any): RequestHandler;
  export default cors;
}

declare module 'helmet' {
  import { RequestHandler } from 'express';
  function helmet(options?: any): RequestHandler;
  export default helmet;
}

declare module 'morgan' {
  import { RequestHandler } from 'express';
  function morgan(format: string, options?: any): RequestHandler;
  export default morgan;
}

declare module 'multer' {
  import { RequestHandler } from 'express';
  
  interface Multer {
    (options?: MulterOptions): MulterInstance;
  }
  
  interface MulterOptions {
    dest?: string;
    storage?: any;
    fileFilter?: (req: any, file: any, callback: any) => void;
    limits?: {
      fileSize?: number;
      files?: number;
    };
  }
  
  interface MulterInstance {
    single(fieldName: string): RequestHandler;
    array(fieldName: string, maxCount?: number): RequestHandler;
    fields(fields: any[]): RequestHandler;
    none(): RequestHandler;
  }
  
  interface DiskStorage {
    destination: (req: any, file: any, cb: any) => void;
    filename: (req: any, file: any, cb: any) => void;
  }
  
  function diskStorage(options: DiskStorage): any;
  
  const multer: Multer;
  export default multer;
  export { diskStorage };
}

declare module 'jsonwebtoken' {
  interface SignOptions {
    expiresIn?: string | number;
    algorithm?: string;
  }
  
  interface VerifyOptions {
    complete?: boolean;
    algorithms?: string[];
  }
  
  interface JwtPayload {
    [key: string]: any;
    iat?: number;
    exp?: number;
  }
  
  export function sign(payload: string | object | Buffer, secret: string, options?: SignOptions): string;
  export function verify(token: string, secret: string, options?: VerifyOptions): string | JwtPayload;
  export function decode(token: string): JwtPayload | null;
}

declare module 'bcryptjs' {
  export function hash(data: string, saltOrRounds: number): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
  export function genSalt(rounds?: number): Promise<string>;
}

declare module 'typeorm' {
  export function Entity(name?: string): ClassDecorator;
  export function PrimaryGeneratedColumn(strategy?: 'uuid' | 'increment' | 'rowid'): PropertyDecorator;
  export function Column(options?: any): PropertyDecorator;
  export function CreateDateColumn(): PropertyDecorator;
  export function UpdateDateColumn(): PropertyDecorator;
  export function ManyToOne(typeFn: () => any, options?: any): PropertyDecorator;
  export function OneToMany(typeFn: () => any, inverseFn: any, options?: any): PropertyDecorator;
  export function JoinColumn(options?: any): PropertyDecorator;
  
  export class DataSource {
    constructor(options: any);
    initialize(): Promise<void>;
    getRepository<T>(entity: any): Repository<T>;
  }
  
  export class Repository<T> {
    findOne(options?: any): Promise<T | null>;
    find(options?: any): Promise<T[]>;
    save(entity: any): Promise<any>;
    remove(entity: any): Promise<any>;
    create(entity?: any): T;
    createQueryBuilder(alias: string): any;
  }
}

declare module 'dotenv' {
  export function config(options?: { path?: string }): void;
}

declare module 'uuid' {
  export function v4(): string;
}
