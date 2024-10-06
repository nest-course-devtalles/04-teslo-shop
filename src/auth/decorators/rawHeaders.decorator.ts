import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetRawHeaders = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    console.log({ data });
    const req = ctx.switchToHttp().getRequest();
    console.log({ req });
    return req.rawHeaders;
  },
);
