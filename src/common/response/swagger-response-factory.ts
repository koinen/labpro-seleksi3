import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';
import type { PaginationMeta } from './response-builder';
import { ResponseStatus } from './response-builder';

export function createSwaggerResponse<T>(model: Type<T>): Type<any> {
  class SwaggerResponse {
    @ApiProperty({ enum: ResponseStatus })
    status: ResponseStatus;

    @ApiProperty({ type: String })
    message: string;

    @ApiProperty({
      type: () => model,
    })
    data: T | null;
  }

  // give the class a unique name like "UserSwaggerResponse"
  Object.defineProperty(SwaggerResponse, 'name', {
    value: `${model.name}SwaggerResponse`,
  });

  return SwaggerResponse;
}

export function createSwaggerResponseWithPagination<T>(model: Type<T>): Type<any> {
  class SwaggerResponseWithPagination {
    @ApiProperty({ enum: ResponseStatus })
    status: ResponseStatus;

    @ApiProperty({ type: String })
    message: string;

    @ApiProperty({
      type: () => model,
      isArray: true,
    })
    data: T[] | null;

    @ApiProperty({
      example: {
        current_page: 1,
        total_pages: 10,
        total_items: 100,
      },
      required: true,
    })
    pagination?: PaginationMeta;

  }

    // give the class a unique name like "UserSwaggerResponse"
    Object.defineProperty(SwaggerResponseWithPagination, 'name', {
      value: `${model.name}SwaggerResponseWithPagination`,
    });

  return SwaggerResponseWithPagination;
}