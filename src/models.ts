import { getModelForClass } from '@typegoose/typegoose';
import { injectProps } from './injector';
import * as types from '../generated/common.types.generated';

injectProps(types.PlainFine, [{ name: 'receiverName', type: 'string' }, { name: 'amount', type: 'integer' }, { name: 'description', type: 'string' }])
injectProps(types.PlainUser, [{ name: 'email', type: 'string' }, { name: 'username', type: 'string' }, { name: 'password', type: 'string' }])
injectProps(types.PlainGroup, [{ name: 'members', type: 'object' }, { name: 'groupName', type: 'string' }])

export const PlainFineModel = getModelForClass(types.PlainFine);
export const PlainUserModel = getModelForClass(types.PlainUser);
export const PlainGroupModel = getModelForClass(types.PlainGroup);