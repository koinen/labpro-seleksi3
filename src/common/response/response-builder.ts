export type PaginationMeta = {
    current_page: number;
    total_pages: number;
    total_items: number;
}

export enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface ApiResponse<T = any> {
    status: ResponseStatus,
    message: string,
    data?: T | null,
    pagination?: PaginationMeta
}

abstract class ResponseBuilder {
    protected response: ApiResponse;

    protected constructor(status: ResponseStatus, message: string) {
        this.response = {
            status,
            message,
        };
    }

    build(): ApiResponse {
        return this.response;
    }
}

export class SuccessResponseBuilder extends ResponseBuilder {
    constructor(message: string = 'Operation successful') {
        super(ResponseStatus.SUCCESS, message);
    }

    setData(data: any): this {
        this.response.data = data;
        return this;
    }

    setPagination( params: {
        current_page: number; 
        total_pages: number; 
        total_items: number;
    }): this {
        const { current_page, total_pages, total_items } = params;
        this.response.pagination = {
            current_page,
            total_pages,
            total_items
        };
        return this;
    }
}

export class ErrorResponseBuilder extends ResponseBuilder {
    constructor(message: string = 'An error occurred') {
        super(ResponseStatus.ERROR, message);
    }
}