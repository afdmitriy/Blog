import { Request, Response } from 'express';

export type RequestWithParams<P> = Request<P, {}, {}, {}>;
export type RequestWithBody<B> = Request<{}, {}, B, {}>;
export type RequestWithParamAndBody<P, B> = Request<P, {}, B, {}>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type RequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>;

export type ParamType = {
   id: string;
};

export type Pagination<I> = {
   pagesCount: number;
   page: number;
   pageSize: number;
   totalCount: number;
   items: I[];
};
