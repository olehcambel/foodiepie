import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const IS_PUBLIC_METADATA_KEY = 'public';
export const Public = (isPublic = true): CustomDecorator =>
  SetMetadata(IS_PUBLIC_METADATA_KEY, isPublic);
