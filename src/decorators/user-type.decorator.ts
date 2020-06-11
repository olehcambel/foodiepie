import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const USER_TYPE_METADATA_KEY = 'userType';
// can be used as an array for several types
export const ApiUserType = (
  type: AppEntity.UserType,
): CustomDecorator<string> => SetMetadata(USER_TYPE_METADATA_KEY, type);
