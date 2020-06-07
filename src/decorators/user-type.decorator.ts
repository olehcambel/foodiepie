import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const USER_TYPE_METADATA_KEY = 'userType';
export const ApiUserType = (
  type: AppEntity.UserType,
): CustomDecorator<string> => SetMetadata(USER_TYPE_METADATA_KEY, type);
