import { ResultStatus } from '../enums/ResultToRouterStatus';

export type ResultStatusType<G> = {
   data: null | G;
   errorMessage?: string;
   status: ResultStatus;
};
